# Kashi explainer (episode 3 — flat 2D, code-drawn)

119.8 s, 1920×1080, 30 fps, synced to `audio/narration.wav`. Same pipeline as the earlier episodes:
`src/lib.js` (characters), `src/lib2.js` (episode 2 props), `src/lib3.js` (Parvati, Kashi on the trishul, kund, pyres, deluge),
`src/scenes.js` (timeline + captions). `node_modules` is a symlink to `../bhairav-explainer` (run `npm install` there).

    node render.js frames 0 3594                 # frames -> out/frames
    python3 audio/make_audio.py                  # music + sfx + narration -> audio/mix.wav
    ffmpeg -framerate 30 -i out/frames/f%05d.jpg -i audio/mix.wav -t 119.8 \
      -c:v libx264 -crf 21 -pix_fmt yuv420p -c:a aac -b:a 224k out/kashi-explainer.mp4
