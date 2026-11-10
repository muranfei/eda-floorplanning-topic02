# EDA Floorplanning Topic 02: Fixed-Outline Constraints

A bilingual teaching package for fixed-outline floorplanning. The project combines
animated English and Chinese videos, bilingual subtitles, an interactive web
lesson, five exercises, downloadable presentation slides, and a reusable lesson
production workflow.

## Topic

**Fixed-outline constraints in chip floorplanning**

A legal floorplan must satisfy two rules:

1. Every module remains inside the fixed chip outline.
2. No pair of modules has a positive-area interior overlap.

## Open the lesson

- Interactive web lesson: [`index.html`](index.html)
- English narrated video: [`videos/lesson-en.mp4`](videos/lesson-en.mp4)
- Chinese narrated video: [`videos/lesson-zh.mp4`](videos/lesson-zh.mp4)
- Bilingual PowerPoint: [`downloads/floorplanning_topic02_bilingual_lesson_deck.pptx`](downloads/floorplanning_topic02_bilingual_lesson_deck.pptx)
- Bilingual subtitles: [`downloads/floorplanning_topic02_bilingual.srt`](downloads/floorplanning_topic02_bilingual.srt)
- Final video script: [`docs/video-script.md`](docs/video-script.md)
- Production and validation notes: [`docs/HANDOFF.md`](docs/HANDOFF.md)

The website works when opened directly from `index.html` or served from the
repository root. It includes:

- English/Chinese page switching
- English/Chinese video switching
- playback speed from 0.75x to 2x
- chapter navigation
- concept cards and a glossary
- five automatically scored exercises with explanations
- MP4 and PPT downloads

## Production workflow

The reusable workflow lives in [`workflow/eda-bilingual-lesson-studio`](workflow/eda-bilingual-lesson-studio).
It documents the bilingual scripting, dual-voice narration, original background
music, deterministic animation, website, exercise, presentation, and QA steps.

## Media notes

The lesson covers the fixed-outline topic from the EDA Algorithms Platform:
<https://yongfu-li.github.io/eda-learning/courses/learn_floorplanning/index.html>.

The ChipBot mascot and life-example icons reference Twemoji artwork under
CC BY 4.0. See [`NOTICE.md`](NOTICE.md) for attribution and media scope.

## License

Source code and original workflow materials use the MIT License. Video and media
assets include educational derivations and third-party attribution described in
`NOTICE.md`.
