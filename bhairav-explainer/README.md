# Bhairav explainer (flat 2D, code-drawn)

85.5 s, 1920×1080, 30 fps explainer synced to `audio/narration.mp3`.
Every frame is an SVG drawn by `src/lib.js` (characters, props) and `src/scenes.js` (timeline, captions), as a pure function of time.

    npm install
    node render.js stills 5,30,60 check        # preview frames -> out/stills/check
    node render.js frames 0 2565               # all frames -> out/frames (split the range to parallelise)
    ffmpeg -framerate 30 -i out/frames/f%05d.jpg -i audio/narration.mp3 -af apad -t 85.5 \
      -c:v libx264 -crf 21 -pix_fmt yuv420p -c:a aac out/bhairav-explainer.mp4

## Soundtrack

`python3 audio/make_audio.py` synthesises the background music (tanpura drone, bansuri phrases, war drums, conch and bells)
and the sound effects with numpy, ducks them under the narration and writes `audio/mix.wav`. Mux it with:

    ffmpeg -i out/video.mp4 -i audio/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 224k out/bhairav-explainer.mp4

Levels are the `MUSIC_GAIN` / `SFX_GAIN` constants near the bottom of the script.
