# Lessons from shipping a jam game (`lessons-from-shipping.md`)

Each rule below came from a real failure. Run them as checks at steps 6 to 8; read the section that matches the work in
hand, not the whole file.

## Reading Map

- [Screens the bot skips](#screens-the-bot-skips)
- [Composed pictures: generator and preview](#composed-pictures-generator-and-preview)
- [Figures and icons at low resolution](#figures-and-icons-at-low-resolution)
- [HUD discipline](#hud-discipline)
- [World readability](#world-readability)
- [Pause and voice](#pause-and-voice)
- [Mechanics and depth](#mechanics-and-depth)
- [Parallel workers on one codebase](#parallel-workers-on-one-codebase)
- [Text, splash art and rebuilds](#text-splash-art-and-rebuilds)

## Screens the bot skips

- A screen the playtest bot never reaches is never seen: start menu, pause, settings, death or game over, endings.
  Give each its own capture mode (a flag or console command that jumps straight to it) and read its frames before the
  owner opens the build.
- A capture taken while the game is paused must end on real time, not on a world timer: world timers do not fire while
  paused, and a capture that waited on one hung for an hour.

## Composed pictures: generator and preview

Staged visuals designed blind fail round after round (a death tableau and a logo took four rounds). For any composed
picture (cutscene tableau, logo, HUD icon, title art):

1. Calibrate first: check that the engine honours the per-item size and colour the generator assumes. In one case the
   material ignored per-instance size and everything drew three times too large.
2. Author the picture as data in a small generator that also renders a preview with the game's real camera, field of
   view, resolution and mark or sprite size.
3. Look at the preview and iterate there, not in the engine.
4. Export the data table to the engine, then compare one captured game frame against the preview.

## Figures and icons at low resolution

- Silhouette first: a closed outer contour, 2 to 4 interior lines, figures kept apart on screen. A fresh viewer must
  name each part from one still.
- An icon must read at the size it ships: test it at that size beside real text. If people cannot name it, replace it
  with a simpler shape. When the look is a taste call, put 3 or 4 options on a sheet at real size and let the owner pick.

## HUD discipline

- No exposition text on screen; the story is told in play.
- Controls appear only where they are used or in the first lesson, never as a legend on the menu or default HUD.
- An element shows only while it matters (for example a rhythm lane only above a stress threshold).
- Icons are 1.2 to 1.3 times the height of the text beside them, on one row, centred on the same line.
- A plate or backing is centred on the letters (ascender to baseline) with equal padding on all sides.
- No two HUD blocks overlap.
- Verify with a script on captured frames (bounding boxes, paddings, centre lines), not by eye: eyes miss a 3 px drift.

## World readability

- After any change to point or sprite size or brightness, check a frame for blow-out (pure white), colour fringing,
  minimum glyph size and mean brightness.
- Change one variable at a time and re-measure. A fix for "too bright" that dimmed and shrank everything caused eye strain.

## Pause and voice

- Pause freezes everything: enemies, timers, effects, voice, music and SFX; only the pause menu runs. Test it by
  capturing two frames and the audio level 2 s apart while paused; both must match.
- One voice at a time: route every spoken line through one channel with a queue and priorities. A critical line
  interrupts, an ambient line is dropped when busy, a stale queued line is dropped. Location-triggered lines are the
  usual cause of overlap.

## Mechanics and depth

- A mechanic the owner cannot explain after playing gets cut or replaced, not explained with more text.
- Variation per death or run (a different threat rule each time, reusing the same assets) adds depth cheaply in a jam.

## Parallel workers on one codebase

- Give each worker a disjoint file set, and gate edits on "no compile or capture running".
- Before adding a symbol, grep for name clashes with shared headers; compile after merging each batch.
- Syntax-check generated source: float literals carry a decimal point, no duplicate enum entries, property names are
  verified against the engine's API before use.

## Text, splash art and rebuilds

- Player-facing text uses plain ASCII punctuation: no middle dots, bullets, em dashes, arrows or decorative separators
  (fonts lack the glyphs and they render as boxes). Rewrite the line in plain words.
- Brand or splash art drawn additively needs a black background. Check the imported image's pixel statistics (share of
  dark against bright pixels): a transparent source turned into a white box.
- Tell the owner before closing their running game to rebuild, batch fixes into one rebuild, and reopen it afterwards
  without being asked.
