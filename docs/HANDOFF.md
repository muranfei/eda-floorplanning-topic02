# Floorplanning Topic 02 - Dual-Voice Audio Repair Handoff

## Reusable workflow

- Skill: `C:\Users\17946\.codex\skills\eda-bilingual-lesson-studio`
- Invoke with: `$eda-bilingual-lesson-studio`
- Covers: bilingual script and timing, dual-voice synthesis, original light music, deterministic 16:9 video, subtitles, interactive bilingual web lesson, exercises, downloadable PPT, QA, and handoff
- Includes: reusable web template, lesson config schema, handoff template, environment checker, spectral analyzer, A/V sync checker, light-music generator, and project scaffolder
- Validation: skill structure passed `quick_validate.py`; Node scripts parsed successfully; Python scripts compiled and executed; project scaffolding and short music generation were tested

## 双语学习网页

- 入口：`C:\Users\17946\Documents\Codex\2026-11-10\4-17-502-1-10-https\outputs\topic02_web\index.html`
- 使用说明：`C:\Users\17946\Documents\Codex\2026-11-10\4-17-502-1-10-https\outputs\topic02_web\README.md`
- 可下载双语 PPT：`C:\Users\17946\Documents\Codex\2026-11-10\4-17-502-1-10-https\outputs\topic02_web\downloads\floorplanning_topic02_bilingual_lesson_deck_v3.pptx`
- PPT 为 8 页可编辑中英双语讲义，大小 241,206 bytes，SHA-256：`6a13328cddde1de2785cb0db9ca22d3a4f2af56f452ae81e829002313040be48`
- 包含英文版与中文版两段带背景音视频，可在同一播放器中切换
- 支持 EN/中文整页切换、0.75x-2x 循环播放速度按钮、章节跳转、双语概念卡片和 5 道即时判分习题
- 视频区下方提供 PPT 下载区，标明 8 页、中英双语、可编辑
- HTTP 与直接打开本地 `index.html` 两种方式均已测试；两段视频均可读取，控制台无报错

## 轻音乐背景音增强版

两段成片使用同一段原创轻音乐床，不使用第三方版权音乐。音乐为 82 BPM，柔和拨弦、暖垫和低音铺底，无鼓点，长 230.10 秒，包含片头与片尾淡入淡出。

- 英文版：`C:\Users\17946\Documents\Codex\2026-11-10\4-17-502-1-10-https\outputs\floorplanning_topic02_final_dual_voice_v2_bgm_v2.mp4`
- 英文版大小：30,658,546 bytes
- 英文版 SHA-256：`F36FDC1BA218E3B5E49D0D406AB5975D3BB39294907252AB632C47F0600604AB`
- 中文版：`C:\Users\17946\Documents\Codex\2026-11-10\4-17-502-1-10-https\outputs\floorplanning_topic02_chinese_dual_voice_bgm_v2.mp4`
- 中文版大小：30,625,557 bytes
- 中文版 SHA-256：`E34B4709B1A950F5F6D7A662CC7C771A6F16DA914FD6E2BBA84FD090C2E37424`
- 背景音乐独立响度：-26.5 LUFS
- 背景音乐真峰值：-14.0 dBFS
- 旁白出现时使用 2.5:1 侧链闪避，attack 35 ms，release 650 ms
- 英文版最终响度：-14.80 LUFS，真峰值 -2.45 dBFS
- 中文版最终响度：-14.76 LUFS，真峰值 -2.52 dBFS
- 两段成片均无 6 kHz 以上持续窄峰
- 两段成片视频码流 SHA-256 均为 `234e1ad4ef649008a4ec87d2bd8dc446d1f86fb891e880576dcab349496bdf7f`，画面保持逐码流一致
- 轻音乐生成脚本：`C:\Users\17946\Documents\Codex\2026-11-10\4-17-502-1-10-https\work\generate_light_bgm.py`
- 混音脚本：`C:\Users\17946\Documents\Codex\2026-11-10\4-17-502-1-10-https\work\add_light_bgm_to_dual_versions.py`

## 中文双声线版本

- 成片：`C:\Users\17946\Documents\Codex\2026-11-10\4-17-502-1-10-https\outputs\floorplanning_topic02_chinese_dual_voice.mp4`
- 文件大小：30,080,537 bytes
- SHA-256：`626831B38FFC6C681DA77B26739D22EB484232AE0BBEF9FCE03F11FBDF0D01CB`
- 主叙述：`zh-CN-XiaoxiaoNeural`，活泼女声
- ChipBot：`zh-CN-YunxiaNeural`，童声男声
- 中文文案：58 条现有中文字幕归并为 18 场旁白，内容与分镜一致
- 时长：230.10 秒
- 综合响度：-14.1 LUFS
- 真峰值：-1.5 dBFS
- 6 kHz 以上持续窄峰：0
- A/V 时钟差：约 20 ms
- 18 场旁白入场延迟：0.08-0.12 秒，中位数 0.10 秒
- 18 场语速调整倍率：0.98-1.26，未发生超范围截句
- 中文版视频码流 SHA-256：`234e1ad4ef649008a4ec87d2bd8dc446d1f86fb891e880576dcab349496bdf7f`
- 中文版与原动画视频码流 SHA-256 完全一致，画面内容未被重新编码或修改
- 生成脚本：`C:\Users\17946\Documents\Codex\2026-11-10\4-17-502-1-10-https\work\generate_chinese_dual_voice_final.py`

## Final delivery

- Final video: `C:\Users\17946\Documents\Codex\2026-11-10\4-17-502-1-10-https\outputs\floorplanning_topic02_final_dual_voice_v2.mp4`
- File size: 30,294,277 bytes
- SHA-256: `E54313BEE9473F6CC3D27DA6E2C4D434DFCDA38C263B4C28B0CAB934C967D2FF`
- Video: H.264, 1920x1080, 30 fps, 6903 frames
- Audio: AAC-LC, 48 kHz, stereo
- Duration: 230.10 seconds (3:50.10)
- The previous delivery `floorplanning_topic02_final_dual_voice.mp4` was retained and was not overwritten.

## Diagnosis

Audio was decoded to mono float PCM at 48 kHz and analyzed with 8192-point Hann-windowed FFTs at 0.5-second hops. Frequency resolution was 5.859375 Hz. A sustained narrow peak was defined as a bin above 6 kHz that had at least -100 dBFS mean level, at least 10 dB local spectral prominence, and appeared in at least 80% of analyzed windows.

Old final results:

- Sustained narrow peaks above 6 kHz: 0 by the criterion above.
- Strongest average high-frequency bin: 7078.125 Hz, -66.80 dBFS.
- That bin appeared above -70 dBFS in 23.61% of windows between 2.5 and 228.5 seconds, so it is intermittent speech sibilance rather than a stationary tone.
- The 12-16 kHz band had no line spectrum. Its strongest average bin was 12955.078 Hz at -114.11 dBFS.
- A fixed 12 kHz line was therefore not present in the delivered audio. The concrete defect was in the per-scene processing chain, not in the raw TTS files.

Raw versus processed comparison showed the old processing chain was suppressing 6-12 kHz much more than a 12 kHz notch should:

| File/stage | 6-8 kHz mean | 8-10 kHz mean | 10-12 kHz mean | Sustained peaks above 6 kHz |
|---|---:|---:|---:|---:|
| Raw `scene-01.mp3` | -68.71 dBFS | -69.27 dBFS | -81.21 dBFS | 0 |
| Old processed `scene-01.wav` | -79.23 dBFS | -83.85 dBFS | -102.34 dBFS | 0 |
| New processed `scene-01.wav` | -71.37 dBFS | -72.79 dBFS | -86.32 dBFS | 0 |

The old chain applied `equalizer=f=12000:t=q:w=25:g=-80` after the 24 kHz to 48 kHz conversion. This extreme high-Q attenuation was the only processing defect consistently tied to the abnormal high-frequency behavior. It was removed rather than replaced with another narrow notch.

## Changes

Modified `C:\Users\17946\Documents\Codex\2026-11-10\4-17-502-1-10-https\work\generate_dual_voice_final.py`:

- Removed both -80 dB, Q=25, 12 kHz equalizer filters.
- Added a smooth 10.5 kHz second-order low-pass after 48 kHz conversion.
- Added a controlled SWR resampling configuration with a larger filter and higher phase precision.
- Changed per-scene processed output to `work\topic2-video-v3\dual-voice-v2`.
- Changed the final target to `floorplanning_topic02_final_dual_voice_v2.mp4`.
- Reused all existing raw Ava/Emma TTS files without contacting the TTS service.
- Added an import guard so audio processing can run when `edge_tts` is unavailable and all raw TTS files already exist.

Modified `C:\Users\17946\Documents\Codex\2026-11-10\4-17-502-1-10-https\work\generate_topic2_tts_v2.py` only to add the same guarded optional import.

Added verification tools:

- `C:\Users\17946\Documents\Codex\2026-11-10\4-17-502-1-10-https\work\analyze_audio_spectrum.mjs`
- `C:\Users\17946\Documents\Codex\2026-11-10\4-17-502-1-10-https\work\verify_topic2_av_sync.mjs`

## Automated acceptance

- Duration: 230.10 seconds; target is 230 +/- 10 seconds.
- Integrated loudness: -14.1 LUFS.
- True peak: -1.5 dBFS.
- Loudness range: 2.0 LU.
- Sustained narrow peaks above 6 kHz in the final file: 0.
- 12-16 kHz final average: -126.14 dBFS; strongest bin 12785.156 Hz at -119.18 dBFS.
- Video duration: 230.10 seconds.
- Decoded audio duration: 230.08 seconds.
- A/V stream-clock difference: approximately 20 ms.
- All 18 soundtrack onsets follow their scene cuts by 0.02-0.08 seconds; median 0.06 seconds.
- Visual contact sheet checked once at 20 s, 115 s, and 210 s: animation, ChipBot, grids, and bilingual subtitles are intact.

## Key commands

Rebuild processed voices and mux the new final video:

```powershell
& 'C:\Users\17946\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' 'C:\Users\17946\Documents\Codex\2026-11-10\4-17-502-1-10-https\work\generate_dual_voice_final.py'
```

Run spectral acceptance:

```powershell
node 'C:\Users\17946\Documents\Codex\2026-11-10\4-17-502-1-10-https\work\analyze_audio_spectrum.mjs' --summary 'C:\Users\17946\Documents\Codex\2026-11-10\4-17-502-1-10-https\outputs\floorplanning_topic02_final_dual_voice_v2.mp4'
```

Measure EBU R128 loudness:

```powershell
& 'C:\Users\17946\Documents\Codex\2026-11-10\4-17-502-1-10-https\work\video-tools\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v9.0.2.exe' -hide_banner -i 'C:\Users\17946\Documents\Codex\2026-11-10\4-17-502-1-10-https\outputs\floorplanning_topic02_final_dual_voice_v2.mp4' -af 'ebur128=peak=true' -f null NUL
```

Check A/V clock and scene onsets:

```powershell
node 'C:\Users\17946\Documents\Codex\2026-11-10\4-17-502-1-10-https\work\verify_topic2_av_sync.mjs'
```

## Remaining notes

- The current runtime does not include the `edge_tts` Python package. This does not affect rebuilding because all raw Ava/Emma files are present. Regenerating raw TTS would require installing that package and network access.
- AAC reports an actual average bitrate of 181 kb/s despite the 192 kb/s encoder target; this is normal content-dependent encoder output.
- Automated checks show no stationary narrow high-frequency tone. A final headphone listening pass is still advisable for human preference, since perceptual tolerance for natural 6-10 kHz speech sibilance cannot be established from FFT data alone.
