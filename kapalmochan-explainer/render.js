// usage: node render.js stills 1,5.5,20   |   node render.js frames <startFrame> <endFrame>
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const FPS = 30;
(async () => {
  const [mode, a, b] = process.argv.slice(2); const SD = 'out/stills/' + (b || 'x');
  const br = await chromium.launch(); const scale = mode === 'stills' ? 0.5 : 1;
  const pg = await br.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: scale });
  pg.on('pageerror', e => { console.error('PAGE ERROR', e.message); });
  await pg.goto('file://' + path.join(__dirname, 'index.html'));
  await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(400);
  if (mode === 'stills') { fs.mkdirSync(SD, { recursive: true }); for (const t of a.split(',')) { await pg.evaluate(t => seek(t), +t); await pg.screenshot({ path: `${SD}/t${(+t).toFixed(2).padStart(6, '0')}.jpg`, type: 'jpeg', quality: 80 }); } }
  else { fs.mkdirSync('out/frames', { recursive: true }); for (let f = +a; f < +b; f++) { await pg.evaluate(t => seek(t), f / FPS); await pg.screenshot({ path: `out/frames/f${String(f).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 96 }); } }
  await br.close();
})();
