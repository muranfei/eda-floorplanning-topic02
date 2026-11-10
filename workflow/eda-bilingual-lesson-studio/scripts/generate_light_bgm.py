import argparse
import math
import wave
from pathlib import Path

import numpy as np


parser = argparse.ArgumentParser(
    description="Generate an original light instrumental bed."
)
parser.add_argument("--output", required=True, help="Destination WAV path")
parser.add_argument("--duration", type=float, default=230.0)
parser.add_argument("--tempo", type=float, default=82.0)
args = parser.parse_args()

OUTPUT = Path(args.output)
SAMPLE_RATE = 48000
DURATION = args.duration
TEMPO = args.tempo
BEAT = 60.0 / TEMPO
BAR = 4.0 * BEAT


def midi_hz(note: int) -> float:
    return 440.0 * (2.0 ** ((note - 69) / 12.0))


def add_pluck(
    mix: np.ndarray,
    start: float,
    duration: float,
    midi: int,
    amplitude: float,
    pan: float,
) -> None:
    begin = int(start * SAMPLE_RATE)
    count = min(int(duration * SAMPLE_RATE), len(mix) - begin)
    if count <= 0:
        return
    t = np.arange(count, dtype=np.float32) / SAMPLE_RATE
    freq = midi_hz(midi)
    attack = np.clip(t / 0.015, 0.0, 1.0)
    decay = np.exp(-1.8 * t)
    envelope = attack * decay
    vibrato = 1.0 + 0.0015 * np.sin(2.0 * np.pi * 4.2 * t)
    phase = 2.0 * np.pi * freq * np.cumsum(vibrato) / SAMPLE_RATE
    tone = (
        np.sin(phase)
        + 0.20 * np.sin(2.0 * phase + 0.12)
        + 0.055 * np.sin(3.0 * phase + 0.31)
    ).astype(np.float32)
    tone *= amplitude * envelope
    left = math.sqrt((1.0 - pan) / 2.0)
    right = math.sqrt((1.0 + pan) / 2.0)
    mix[begin : begin + count, 0] += tone * left
    mix[begin : begin + count, 1] += tone * right


def add_pad(
    mix: np.ndarray,
    start: float,
    duration: float,
    midi: int,
    amplitude: float,
) -> None:
    begin = int(start * SAMPLE_RATE)
    count = min(int(duration * SAMPLE_RATE), len(mix) - begin)
    if count <= 0:
        return
    t = np.arange(count, dtype=np.float32) / SAMPLE_RATE
    attack = np.clip(t / 0.9, 0.0, 1.0)
    release = np.clip((duration - t) / 1.2, 0.0, 1.0)
    envelope = attack * release * (0.92 + 0.08 * np.sin(2 * np.pi * 0.13 * t))
    freq = midi_hz(midi)
    left_phase = 2 * np.pi * freq * 0.9985 * t + 0.05
    right_phase = 2 * np.pi * freq * 1.0015 * t
    left = (
        np.sin(left_phase)
        + 0.13 * np.sin(2 * left_phase + 0.25)
        + 0.035 * np.sin(3 * left_phase)
    )
    right = (
        np.sin(right_phase)
        + 0.13 * np.sin(2 * right_phase + 0.25)
        + 0.035 * np.sin(3 * right_phase)
    )
    gain = amplitude * envelope / 2.0
    mix[begin : begin + count, 0] += (left * gain).astype(np.float32)
    mix[begin : begin + count, 1] += (right * gain).astype(np.float32)


def add_bass(
    mix: np.ndarray,
    start: float,
    duration: float,
    midi: int,
    amplitude: float,
) -> None:
    begin = int(start * SAMPLE_RATE)
    count = min(int(duration * SAMPLE_RATE), len(mix) - begin)
    if count <= 0:
        return
    t = np.arange(count, dtype=np.float32) / SAMPLE_RATE
    attack = np.clip(t / 0.08, 0.0, 1.0)
    release = np.clip((duration - t) / 0.45, 0.0, 1.0)
    freq = midi_hz(midi)
    phase = 2 * np.pi * freq * t
    tone = (np.sin(phase) + 0.08 * np.sin(2 * phase)).astype(np.float32)
    tone *= amplitude * attack * release
    mix[begin : begin + count, 0] += tone
    mix[begin : begin + count, 1] += tone


def main() -> None:
    sample_count = int(DURATION * SAMPLE_RATE)
    mix = np.zeros((sample_count, 2), dtype=np.float32)
    progression = [
        ([48, 55, 62, 64], 36),
        ([48, 55, 62, 64], 36),
        ([47, 55, 59, 62], 35),
        ([47, 55, 59, 62], 35),
        ([45, 52, 55, 60], 33),
        ([45, 52, 55, 60], 33),
        ([41, 48, 52, 57], 29),
        ([41, 48, 52, 57], 29),
        ([48, 55, 62, 64, 67], 36),
        ([48, 55, 62, 64, 67], 36),
        ([40, 52, 59, 62, 64], 28),
        ([40, 52, 59, 62, 64], 28),
        ([41, 48, 57, 60, 64], 29),
        ([41, 48, 57, 60, 64], 29),
        ([43, 50, 55, 59, 64], 31),
        ([43, 50, 55, 59, 64], 31),
    ]
    chord_span = 2.0 * BAR
    loop_span = len(progression) * chord_span
    loop_index = 0
    while loop_index * loop_span < DURATION:
        loop_start = loop_index * loop_span
        for chord_index, (notes, bass_note) in enumerate(progression):
            chord_start = loop_start + chord_index * chord_span
            if chord_start >= DURATION:
                break
            for note_index, note in enumerate(notes):
                add_pad(
                    mix,
                    chord_start,
                    chord_span + 0.7,
                    note,
                    0.040 / max(1.0, len(notes) / 3.0),
                    )

                bar_in_chord = note_index % 2
                for beat_offset, velocity in ((0.25, 0.85), (2.35, 1.0)):
                    pluck_time = (
                        chord_start
                        + bar_in_chord * BAR
                        + beat_offset * BEAT
                    )
                    if pluck_time < DURATION:
                        add_pluck(
                            mix,
                            pluck_time,
                            1.4,
                            note + 12,
                            0.032 * velocity,
                            -0.22 + 0.12 * note_index,
                        )

            root = bass_note
            add_bass(mix, chord_start, BAR * 0.92, root, 0.050)
            add_bass(mix, chord_start + BAR, BAR * 0.92, root, 0.045)

            melody_notes = [notes[1] + 12, notes[2] + 12, notes[-1] + 12]
            for beat_index, note in enumerate(melody_notes):
                event = chord_start + (0.75 + beat_index * 1.25) * BEAT
                if event < DURATION:
                    add_pluck(
                        mix,
                        event,
                        2.0,
                        note,
                        0.022 + 0.003 * ((loop_index + chord_index) % 3),
                        0.18 if beat_index % 2 else -0.14,
                    )
        loop_index += 1

    fade_in_length = min(int(2.0 * SAMPLE_RATE), sample_count // 2)
    fade_out_length = min(int(5.0 * SAMPLE_RATE), sample_count // 2)
    fade_in = np.linspace(0.0, 1.0, fade_in_length, dtype=np.float32)
    fade_out = np.linspace(1.0, 0.0, fade_out_length, dtype=np.float32)
    mix[: len(fade_in)] *= fade_in[:, None]
    mix[-len(fade_out) :] *= fade_out[:, None]

    peak = float(np.max(np.abs(mix)))
    if peak > 0:
        mix *= 0.55 / peak
    pcm = np.clip(mix * 32767.0, -32768, 32767).astype("<i2")
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(OUTPUT), "wb") as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(SAMPLE_RATE)
        wav.writeframes(pcm.tobytes())
    print(OUTPUT)
    print(f"peak_before_normalize={peak:.6f}")


if __name__ == "__main__":
    main()
