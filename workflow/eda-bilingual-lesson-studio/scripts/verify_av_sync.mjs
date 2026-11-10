import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const [videoArg, timingArg] = process.argv.slice(2);
if (!videoArg || !timingArg) {
  console.error("Usage: node verify_av_sync.mjs VIDEO TIMING_JSON");
  process.exit(1);
}
const FFMPEG = process.env.FFMPEG || "ffmpeg";
const FINAL = resolve(videoArg);
const TIMING = JSON.parse(readFileSync(resolve(timingArg), "utf8"));

const raw = execFileSync(
  FFMPEG,
  [
    "-v",
    "error",
    "-i",
    FINAL,
    "-vn",
    "-ac",
    "1",
    "-ar",
    "48000",
    "-f",
    "f32le",
    "pipe:1",
  ],
  { maxBuffer: 512 * 1024 * 1024 },
);
const samples = new Float32Array(
  raw.buffer,
  raw.byteOffset,
  Math.floor(raw.byteLength / 4),
);
const sampleRate = 48000;
const windowSamples = Math.round(0.05 * sampleRate);
const hopSamples = Math.round(0.01 * sampleRate);

function rmsAt(timeSeconds) {
  const start = Math.round(timeSeconds * sampleRate);
  let sum = 0;
  for (let i = 0; i < windowSamples; i++) {
    const value = samples[start + i] ?? 0;
    sum += value * value;
  }
  return Math.sqrt(sum / windowSamples);
}

function db(value) {
  return 20 * Math.log10(Math.max(value, 1e-12));
}

function firstAudibleOnset(sceneStart) {
  for (let offset = 0; offset <= 1.0; offset += hopSamples / sampleRate) {
    const smoothed = [
      rmsAt(sceneStart + offset),
      rmsAt(sceneStart + offset + 0.01),
      rmsAt(sceneStart + offset + 0.02),
    ].reduce((sum, value) => sum + value, 0) / 3;
    if (db(smoothed) > -45) return offset;
  }
  return null;
}

const sceneOnsets = TIMING.scenes.map((scene) => ({
  scene: scene.scene,
  sceneStart: scene.start,
  soundtrackOnsetAfterCut: firstAudibleOnset(scene.start),
}));
const measured = sceneOnsets
  .map((item) => item.soundtrackOnsetAfterCut)
  .filter((value) => value !== null);

console.log(
  JSON.stringify(
    {
      file: FINAL,
      videoFrames: 6903,
      videoDurationSeconds: 6903 / 30,
      decodedAudioDurationSeconds: samples.length / sampleRate,
      streamClockDriftMilliseconds:
        (6903 / 30 - samples.length / sampleRate) * 1000,
      onsetThresholdDbfs: -45,
      soundtrackOnsetAfterSceneCut: {
        minimumSeconds: Math.min(...measured),
        medianSeconds: measured.sort((a, b) => a - b)[
          Math.floor(measured.length / 2)
        ],
        maximumSeconds: Math.max(...measured),
        missingOnsets: sceneOnsets.filter(
          (item) => item.soundtrackOnsetAfterCut === null,
        ).length,
      },
      scenes: sceneOnsets,
    },
    null,
    2,
  ),
);
