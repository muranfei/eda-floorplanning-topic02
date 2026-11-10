---
name: eda-bilingual-lesson-studio
description: Create or extend bilingual EDA teaching packages with scripted dual-voice videos, animated 16:9 scenes, bilingual subtitles, background music, interactive websites, quizzes, and downloadable presentations. Use for multi-artifact lessons; not for a single isolated image or a standalone slide edit.
---

# EDA Bilingual Lesson Studio

Produce a coherent lesson package rather than disconnected assets. Keep one
canonical lesson outline that drives the narration, visuals, subtitles,
website, exercises, and presentation.

## Start with the lesson contract

Infer reasonable defaults from an existing lesson or prior artifacts. Ask only
when a missing choice would materially change the output.

Establish:

- topic, audience, learning goal, and source material
- English and Chinese titles
- target duration, scene count, and output language variants
- narrator and mascot voices
- animation and visual style
- requested deliverables: video, subtitles, web lesson, exercises, PPT, handoff
- whether previous deliverables must remain unchanged

Default package:

- 1920 x 1080, 30 fps, 16:9 video
- one English and one Chinese narration version
- burned-in bilingual subtitles
- neutral main narrator plus a short-phrase mascot voice
- original light instrumental bed with sidechain ducking
- static bilingual web lesson with video switching and playback speed
- 5 interactive exercises with explanations
- editable bilingual PowerPoint summary
- `HANDOFF.md` and validation data

Use a versioned output filename. Never overwrite a prior final video, site, or
deck unless the user explicitly requests replacement.

## Read supporting guidance when needed

- For the full production sequence, read
  [references/production-pipeline.md](references/production-pipeline.md).
- For colors, typography, motion, diagrams, and slide/website composition,
  read [references/visual-system.md](references/visual-system.md).
- For quantitative checks, browser tests, PPT validation, and handoff, read
  [references/qa-and-delivery.md](references/qa-and-delivery.md).
- For a structured project brief, copy and adapt
  [assets/lesson-config.example.json](assets/lesson-config.example.json).
- For a working web starting point, copy
  [assets/web-template](assets/web-template) and replace all topic-specific
  copy, video paths, chapter marks, quiz data, and presentation links.
- For the final handoff structure, adapt
  [assets/handoff-template.md](assets/handoff-template.md).

## Reusable scripts

Use project-relative copies when a project may move. Set environment variables
when the host tools are not on `PATH`.

- `scripts/check_environment.py`: report available FFmpeg, Node, Python,
  `edge_tts`, Artifact Tool packages, and presentation finalizer tools.
- `scripts/analyze_audio_spectrum.mjs`: detect sustained narrow high-frequency
  peaks and print band summaries. Set `FFMPEG` if needed.
- `scripts/verify_av_sync.mjs`: measure stream duration drift and per-scene
  soundtrack onset using a timing JSON file. Set `FFMPEG` if needed.
- `scripts/generate_light_bgm.py`: generate an original, calm instrumental bed
  without external licensing dependencies.
- `scripts/scaffold_lesson.py`: create a package skeleton and copy the web
  template into a new project.

Run new or changed scripts once before relying on them.

## Workflow

### 1. Lock the learning narrative

Write the English script and Chinese localization scene by scene. Keep
factual examples, dimensions, coordinates, and rule names identical across
both languages. Make the mascot speak short functional phrases, not additional
lesson content.

Record each scene's:

- scene number and title
- English and Chinese subtitle lines
- main narration
- visual action
- target start and audio duration

Use the existing lesson script or source material as the factual authority.
Cite external sources in `HANDOFF.md` and presentation speaker notes.

### 2. Build the audio before final animation muxing

Synthesize narration one scene at a time. Preserve raw TTS files, process each
scene to its target duration, and store voice processing intermediates
separately from final output.

Use these defaults unless the lesson asks for another voice:

- English narrator: `en-US-AvaMultilingualNeural`
- English mascot: `en-US-EmmaMultilingualNeural`
- Chinese narrator: `zh-CN-XiaoxiaoNeural`
- Chinese mascot: `zh-CN-YunxiaNeural`

Do not put extreme high-Q notches in the audio chain. Prefer a gentle high-pass,
controlled resampling, a smooth high-frequency rolloff, and conservative
compression. Run the spectrum checker after muxing.

Generate an original light music bed and keep it subdued. A practical target is
about -26 to -30 LUFS for the isolated bed before ducking, with final program
loudness around -14 LUFS. Use sidechain compression so narration remains
dominant. If a listener cannot hear the bed, raise 3-6 dB and produce new video
filenames to avoid browser cache.

### 3. Animate from a deterministic timeline

Drive every visual from one global timeline. Build continuous transitions,
scene-local motion, and state changes from timestamps. Do not imitate slideshow
fade-ins.

Keep:

- the outline grid and coordinates stable unless the lesson changes them
- module positions readable long enough to inspect
- subtitle safe areas clear
- motion purposeful and tied to narration

Render silent video separately from the audio and mux at the end. This makes
voice revisions independent of visual revisions.

### 4. Package the bilingual web lesson

Use the web template as a starting point, then replace:

- title, summary, concept cards, glossary, and quiz data
- English and Chinese video sources
- chapter timestamps
- downloadable video and PPT paths

The language switch must change the page copy and active video. The speed
control must apply to both video elements and survive language switching.
Exercises should provide immediate feedback, explanations, scoring, and reset.

The page must work when opened directly from `index.html` and when served over
local HTTP.

### 5. Build the downloadable presentation

When PowerPoint is requested, follow the available presentation skill and its
validation workflow. Use the same visual language as the site and video.

A good default is an 8-slide bilingual deck:

1. cover
2. real-life analogy
3. core rules
4. first worked example
5. comparison or common confusion
6. valid solution
7. procedure and traps
8. recap and next step

Keep diagrams as native editable slide objects. Use an existing video frame or
lesson illustration on the cover rather than programmatic decorative artwork.

### 6. Validate and deliver

Treat visual and audio validation as evidence, not ceremony:

- decode the full final video
- measure duration, loudness, true peak, and A/V drift
- scan for sustained high-frequency peaks
- inspect all PPT slides
- test both website languages, video switching, speed control, quiz scoring,
  downloads, and console errors
- confirm unchanged video streams remain bit-identical when only adding audio

Record exact commands, output paths, hashes, assumptions, and limitations in
`HANDOFF.md`.

## Design invariants

- Use one visual system across video, web, and PPT.
- Keep bilingual copy parallel in meaning and factual detail.
- Keep the mascot helpful and concise.
- Use real geometry and explicit numbers.
- Prefer direct titles and plain instructional language.
- Make interactions functional without a backend.
- Preserve existing final artifacts when creating revised versions.
- Keep expensive media checks numeric. Use a single contact sheet for visual
  scan and inspect dense deliverable slides individually.
