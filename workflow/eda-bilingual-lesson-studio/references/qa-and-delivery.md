# QA and Delivery

## Video and audio

Run all checks on the final encoded file, not only on intermediates.

Minimum:

- duration within the requested tolerance
- expected resolution, frame rate, audio sample rate, and channel count
- integrated loudness near -14 LUFS unless the brief says otherwise
- true peak at or below -1.5 dBFS when practical
- no sustained narrow peaks above 6 kHz
- no clipped samples or decode errors
- audio start and scene onsets match the timeline

Useful commands:

```powershell
ffmpeg -i final.mp4 -af "ebur128=peak=true" -f null NUL
ffmpeg -i final.mp4 -vn -ac 1 -ar 48000 -f f32le pipe:1
```

Use `scripts/analyze_audio_spectrum.mjs` for the spectral summary and
`scripts/verify_av_sync.mjs` for timing checks.

When adding or replacing audio only:

```powershell
ffmpeg -i source.mp4 -i mixed.wav -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 192k final.mp4
```

Compare video stream hashes to prove that visuals did not change.

## Website

Test both direct file opening and a local HTTP server.

Automate:

- both language buttons
- visible English and Chinese copy
- both video sources and ready state
- language-driven video switching
- playback speed changes
- chapter seeking
- quiz selection, feedback, score, and reset
- PPT and MP4 download URLs
- console errors and failed responses

Use a desktop and a mobile viewport. Capture one contact/full-page screenshot
for visual flow, then inspect only dense areas that need detail.

## Presentation

Use the presentation skill's finalizer and render every slide. Check:

- title wrapping
- bilingual line overlap
- clipped labels
- diagram arithmetic
- image proportions
- editable text and diagrams
- download link in the website

## Handoff

Use `assets/handoff-template.md`.

Include:

- final file paths
- versions intentionally retained
- source citations
- voice and music settings
- loudness, peak, duration, and sync results
- website features and local-open instructions
- PPT page count and download path
- assumptions and known limitations
- validation command snippets

Keep validation reports outside the final public output folder unless the user
asks for them.
