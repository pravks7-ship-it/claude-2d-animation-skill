# Vishwanath explainer (episode 5 — flat 2D, code-drawn)

136.9 s, 1920×1080, 30 fps, synced to `audio/narration.wav`. Same pipeline as the earlier episodes:
`src/lib.js` … `src/lib4.js` (shared characters and props), `src/scenes.js` (timeline, captions, India map with the 12 jyotirlingas).
`node_modules` is a symlink to `../bhairav-explainer` (run `npm install` there).

    node render.js frames 0 4107                 # frames -> out/frames
    python3 audio/make_audio.py                  # music + sfx + narration -> audio/mix.wav
    ffmpeg -framerate 30 -i out/frames/f%05d.jpg -i audio/mix.wav -t 136.9 \
      -c:v libx264 -crf 21 -pix_fmt yuv420p -c:a aac -b:a 224k out/vishwanath-explainer.mp4
