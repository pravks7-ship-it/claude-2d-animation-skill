# Vishwanath explainer — Ghibli-inspired nostalgic version (episode 5)

Same story, timing, captions and soundtrack as `../vishwanath-explainer`, with a painterly restyle:
- `src/ghibli.js` replaces the flat backgrounds: painted skies with shaded cumulus clouds, soft mountains, lush trees, glinting river.
- `grade.sh` holds the ffmpeg film finish applied at encode time: soft bloom, warm gentle grade, watercolour-paper texture (`make_paper.js` → `out/paper.png`), grain and vignette.

    node make_paper.js
    node render.js frames 0 4107
    . ./grade.sh && ffmpeg -framerate 30 -i out/frames/f%05d.jpg -loop 1 -i out/paper.png -i audio/mix.wav \
      -filter_complex "$GRADE" -map "[v]" -map 2:a -t 136.9 -c:v libx264 -crf 21 -pix_fmt yuv420p -c:a aac -b:a 224k out/vishwanath-ghibli.mp4
