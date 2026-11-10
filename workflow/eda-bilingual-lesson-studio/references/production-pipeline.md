# Production Pipeline

Use this as the end-to-end sequence for a complete lesson package.

## Workspace contract

A practical layout:

```text
project/
  outputs/
    lesson_english_v1.mp4
    lesson_chinese_v1.mp4
    lesson_bilingual.srt
    HANDOFF.md
    topic_web/
      index.html
      styles.css
      app.js
      assets/
      downloads/
  work/
    lesson_script.json
    timing.json
    voice/
    frames/
    video-build/
    analysis/
```

Keep raw assets, processed assets, drafts, and final deliverables separate.

## 1. Source and script

1. Open the authoritative course or source page.
2. Extract the learning claims and concrete examples.
3. Write scene narration with one main idea per scene.
4. Localize the Chinese script against the final English meaning.
5. Generate bilingual subtitle cues.
6. Record scene durations and a global timeline in JSON.

For multi-voice lessons, keep mascot interjections separate from the main
narrator and place them in gaps or at deliberate response beats.

## 2. Voice generation

Synthesize raw narration with `edge_tts` or another neural TTS service.
Generate only missing raw files and retry transient failures with bounded
attempts.

Preserve:

- raw model output
- processed per-scene WAV
- voice name, rate, and pitch
- target duration and tempo ratio

For each scene:

1. measure raw duration
2. calculate tempo to fit the target window
3. reject a scene that needs extreme compression
4. normalize and process the voice
5. trim/pad to the exact target duration

Avoid final-program `loudnorm` until all voices are mixed. Measure the final
mux and adjust the mix master if needed.

## 3. Music

Prefer original generated music unless the user supplies licensed music.

For a calm instructional bed:

- slow-to-moderate tempo
- major or modal harmony
- soft plucks, pads, and a restrained bass
- no dense percussion
- fade in and out
- no narrow synthetic tones above 6 kHz

Use `scripts/generate_light_bgm.py` as a starting point. Mix with a sidechain
compressor keyed by narration. Produce new filenames whenever the bed level
changes enough that a browser may retain the old media.

## 4. Video

Render clean silent video from a single deterministic source. Use timestamps,
not generated image sequences without a timing contract.

Check:

- 1920 x 1080 or requested dimensions
- 30 fps or requested frame rate
- consistent typography and subtitle safe areas
- no visually abrupt slide fades
- no stale frame when switching scenes

Mux with `-c:v copy` when only audio changes. Compare the original and final
video stream hashes before claiming the visuals are unchanged.

## 5. Subtitles

Use one subtitle event for the English line and one for the Chinese line, or a
single two-line block if the player supports it consistently.

Keep:

- readable line length
- clear sentence boundaries
- no overlap with key labels
- numbers, symbols, and coordinates identical to the narration

## 6. Website

Start from `assets/web-template`.

Required behavior:

- language selection updates all visible copy
- language selection updates the active video
- one speed button cycles a documented set such as 0.75x to 2x
- playback speed applies to both videos
- chapter buttons seek the active video
- concept section contains the actual lesson rules
- exercises score and explain answers
- MP4 and PPT downloads use local relative paths

Do not require a backend. Use semantic HTML, keyboard-operable buttons, and
responsive layouts.

## 7. PPT

Use the presentation skill available in the environment. Build native text,
diagrams, and images. Keep the deck editable.

Create the deck after the lesson outline is stable so slide titles and examples
match the video and website exactly.

## 8. Package and handoff

Deliver one package containing:

- final video variants
- subtitle files
- web entry point
- PPT downloads
- source scripts or builder files
- `HANDOFF.md`

Use versioned filenames for revisions.
