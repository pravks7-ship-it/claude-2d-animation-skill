# Kapalmochan explainer (episode 2 — flat 2D, code-drawn)

114.6 s, 1920×1080, 30 fps, synced to `audio/narration.wav`. Same pipeline as `../bhairav-explainer`
(`src/lib.js` is the shared character library, `src/lib2.js` adds the shadow, Kashi skyline, gate, kund etc.).
`node_modules` is a symlink to the first episode's folder (run `npm install` there).

    node render.js frames 0 3438                 # frames -> out/frames
    python3 audio/make_audio.py                  # music + sfx + narration -> audio/mix.wav
    ffmpeg -framerate 30 -i out/frames/f%05d.jpg -i audio/mix.wav -t 114.6 \
      -c:v libx264 -crf 21 -pix_fmt yuv420p -c:a aac -b:a 224k out/kapalmochan-explainer.mp4
