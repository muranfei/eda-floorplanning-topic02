import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const FFMPEG = process.env.FFMPEG || "ffmpeg";
const SAMPLE_RATE = 48000;
const FFT_SIZE = 8192;
const HOP_SECONDS = 0.5;

function decodeMono(path) {
  return execFileSync(
    FFMPEG,
    [
      "-v",
      "error",
      "-i",
      path,
      "-vn",
      "-ac",
      "1",
      "-ar",
      String(SAMPLE_RATE),
      "-f",
      "f32le",
      "pipe:1",
    ],
    { maxBuffer: 512 * 1024 * 1024 },
  );
}

function fft(real, imag) {
  const n = real.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [real[i], real[j]] = [real[j], real[i]];
      [imag[i], imag[j]] = [imag[j], imag[i]];
    }
  }
  for (let length = 2; length <= n; length <<= 1) {
    const angle = (-2 * Math.PI) / length;
    const wReal = Math.cos(angle);
    const wImag = Math.sin(angle);
    for (let start = 0; start < n; start += length) {
      let curReal = 1;
      let curImag = 0;
      for (let j = 0; j < length / 2; j++) {
        const even = start + j;
        const odd = even + length / 2;
        const oddReal = real[odd] * curReal - imag[odd] * curImag;
        const oddImag = real[odd] * curImag + imag[odd] * curReal;
        real[odd] = real[even] - oddReal;
        imag[odd] = imag[even] - oddImag;
        real[even] += oddReal;
        imag[even] += oddImag;
        const nextReal = curReal * wReal - curImag * wImag;
        curImag = curReal * wImag + curImag * wReal;
        curReal = nextReal;
      }
    }
  }
}

const window = new Float64Array(FFT_SIZE);
for (let i = 0; i < FFT_SIZE; i++) {
  window[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (FFT_SIZE - 1));
}
let windowSum = 0;
for (const value of window) windowSum += value;

function db(value) {
  return 20 * Math.log10(Math.max(value, 1e-12));
}

function percentile(values, fraction) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(fraction * sorted.length))];
}

function median(values) {
  return percentile(values, 0.5);
}

function analyze(path) {
  if (!existsSync(path)) throw new Error(`Missing input: ${path}`);
  const raw = decodeMono(path);
  const samples = new Float32Array(
    raw.buffer,
    raw.byteOffset,
    Math.floor(raw.byteLength / 4),
  );
  const hop = Math.round(HOP_SECONDS * SAMPLE_RATE);
  const binCount = FFT_SIZE / 2 + 1;
  const binHz = SAMPLE_RATE / FFT_SIZE;
  const frames = [];

  for (let start = 0; start + FFT_SIZE <= samples.length; start += hop) {
    const real = new Float64Array(FFT_SIZE);
    const imag = new Float64Array(FFT_SIZE);
    let energy = 0;
    for (let i = 0; i < FFT_SIZE; i++) {
      const value = samples[start + i];
      energy += value * value;
      real[i] = value * window[i];
    }
    if (Math.sqrt(energy / FFT_SIZE) < 1e-5) continue;
    fft(real, imag);
    const amplitudes = new Float32Array(binCount);
    for (let bin = 0; bin < binCount; bin++) {
      amplitudes[bin] = (2 * Math.hypot(real[bin], imag[bin])) / windowSum;
    }
    frames.push({ time: start / SAMPLE_RATE, amplitudes });
  }

  const average = new Float64Array(binCount);
  const occurrence = new Uint16Array(binCount);
  for (const frame of frames) {
    for (let bin = 1; bin < binCount; bin++) {
      const level = frame.amplitudes[bin];
      average[bin] += level;
      if (db(level) > -70) occurrence[bin]++;
    }
  }
  for (let bin = 1; bin < binCount; bin++) {
    average[bin] /= frames.length;
  }

  const candidates = [];
  const highBinStart = Math.ceil(6000 / binHz);
  for (let bin = highBinStart; bin < binCount - 4; bin++) {
    const local = [];
    for (let delta = -16; delta <= 16; delta++) {
      if (Math.abs(delta) >= 4) local.push(average[bin + delta]);
    }
    const localMedian = median(local);
    const meanDb = db(average[bin]);
    const prominence = meanDb - db(localMedian);
    const times = frames
      .filter((frame) => db(frame.amplitudes[bin]) > -70)
      .map((frame) => frame.time);
    candidates.push({
      hz: bin * binHz,
      dbfs: meanDb,
      prominenceDb: prominence,
      occurrence: times.length / frames.length,
      firstTime: times.length ? times[0] : null,
      lastTime: times.length ? times.at(-1) : null,
    });
  }
  candidates.sort(
    (a, b) =>
      b.prominenceDb * Math.sqrt(b.occurrence) -
      a.prominenceDb * Math.sqrt(a.occurrence),
  );

  const persistent = [];
  for (let bin = highBinStart; bin < binCount - 4; bin++) {
    const localLevels = [];
    const prominences = [];
    for (const frame of frames) {
      const local = [];
      for (let delta = -16; delta <= 16; delta++) {
        if (Math.abs(delta) >= 4) local.push(frame.amplitudes[bin + delta]);
      }
      localLevels.push(db(frame.amplitudes[bin]));
      prominences.push(db(frame.amplitudes[bin]) - db(median(local)));
    }
    persistent.push({
      hz: bin * binHz,
      medianDbfs: median(localLevels),
      p10Dbfs: percentile(localLevels, 0.1),
      p90Dbfs: percentile(localLevels, 0.9),
      medianProminenceDb: median(prominences),
      prominencePositiveFraction:
        prominences.filter((value) => value > 12).length / frames.length,
      aboveMinus80Fraction:
        localLevels.filter((value) => value > -80).length / frames.length,
    });
  }
  persistent.sort(
    (a, b) =>
      b.medianProminenceDb * b.prominencePositiveFraction -
      a.medianProminenceDb * a.prominencePositiveFraction,
  );
  const persistentReported = [];
  const persistentUsed = [];
  for (const candidate of persistent) {
    if (persistentUsed.some((hz) => Math.abs(hz - candidate.hz) < 50)) continue;
    persistentReported.push(candidate);
    persistentUsed.push(candidate.hz);
    if (persistentReported.length === 10) break;
  }

  const upperBins = [];
  for (let bin = highBinStart; bin < binCount; bin++) upperBins.push(average[bin]);
  const upperMedianDb = db(median(upperBins));
  const maxBin = upperBins.indexOf(Math.max(...upperBins)) + highBinStart;
  const sustainedPeakCount = candidates.filter(
    (candidate) =>
      candidate.occurrence >= 0.8 &&
      candidate.prominenceDb >= 10 &&
      candidate.dbfs > -100,
  ).length;
  const reported = [];
  const used = [];
  for (const candidate of candidates) {
    if (used.some((hz) => Math.abs(hz - candidate.hz) < 50)) continue;
    reported.push(candidate);
    used.push(candidate.hz);
    if (reported.length === 10) break;
  }

  const bandSummary = [
    [6000, 8000],
    [8000, 10000],
    [10000, 12000],
    [12000, 16000],
    [16000, 24000],
  ].map(([lowHz, highHz]) => {
    const lowBin = Math.ceil(lowHz / binHz);
    const highBin = Math.min(binCount - 1, Math.floor(highHz / binHz));
    let maxLocalBin = lowBin;
    for (let bin = lowBin; bin <= highBin; bin++) {
      if (average[bin] > average[maxLocalBin]) maxLocalBin = bin;
    }
    const localAverage =
      Array.from(average.slice(lowBin, highBin + 1)).reduce(
        (sum, value) => sum + value,
        0,
      ) /
      (highBin - lowBin + 1);
    return {
      band: `${lowHz}-${highHz}Hz`,
      meanLevelDbfs: db(localAverage),
      strongestHz: maxLocalBin * binHz,
      strongestMeanDbfs: db(average[maxLocalBin]),
    };
  });

  return {
    path,
    durationSeconds: samples.length / SAMPLE_RATE,
    analyzedWindows: frames.length,
    resolutionHz: binHz,
    upperMedianLevelDbfs: upperMedianDb,
    strongestUpperBin: {
      hz: maxBin * binHz,
      meanDbfs: db(average[maxBin]),
      peakProminenceDb: db(average[maxBin]) - upperMedianDb,
    },
    sustainedPeakCountAbove6kHz: sustainedPeakCount,
    bandSummary,
    topSustainedNarrowPeaksAbove6kHz: reported,
    topTemporallyPersistentNarrowPeaksAbove6kHz: persistentReported,
  };
}

const summaryOnly = process.argv.includes("--summary");
const inputs = process.argv.slice(2).filter((argument) => argument !== "--summary");
if (inputs.length === 0) {
  console.error("Usage: node analyze_audio_spectrum.mjs AUDIO [AUDIO ...]");
  process.exit(1);
}
for (const input of inputs) {
  const result = analyze(resolve(input));
  if (summaryOnly) {
    console.log(
      JSON.stringify(
        {
          path: result.path,
          durationSeconds: result.durationSeconds,
          resolutionHz: result.resolutionHz,
          sustainedPeakCountAbove6kHz: result.sustainedPeakCountAbove6kHz,
          strongestUpperBin: result.strongestUpperBin,
          highestPersistentCandidates:
            result.topTemporallyPersistentNarrowPeaksAbove6kHz.slice(0, 3),
          bandSummary: result.bandSummary,
        },
        null,
        2,
      ),
    );
  } else {
    console.log(JSON.stringify(result, null, 2));
  }
}
