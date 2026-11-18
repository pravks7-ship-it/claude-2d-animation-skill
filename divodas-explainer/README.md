# Divodas explainer (episode 6 — papercut 2D style)

138.7 s, 1920×1080, 30 fps, synced to `audio/narration.wav`.
`src/lib5.js` adds King Divodas, Ganesha, the yoginis, Surya and the vimana, and turns on the papercut look: each cut-out layer
(characters, clouds, buildings, mountains, props) casts a soft drop shadow (`#pc`/`#pcs` filters in `src/lib.js`).
`grade.sh` adds a paper-grain texture (`make_paper.js` → `out/paper.png`), fine grain and a soft vignette at encode time.

    node make_paper.js
    node render.js frames 0 4161
    python3 audio/make_audio.py
    . ./grade.sh && ffmpeg -framerate 30 -i out/frames/f%05d.jpg -loop 1 -i out/paper.png -i audio/mix.wav \
      -filter_complex "$GRADE" -map "[v]" -map 2:a -t 138.7 -c:v libx264 -crf 21 -pix_fmt yuv420p -c:a aac -b:a 224k out/divodas-explainer.mp4
