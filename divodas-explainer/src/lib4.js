// ---------- episode 4 additions ----------
const GOLD_DEF = `<defs><filter id="goldf"><feColorMatrix type="matrix" values="0.24 0.48 0.08 0 0.36  0.18 0.36 0.06 0 0.22  0.04 0.08 0.02 0 0.02  0 0 0 1 0"/></filter></defs>`;
// ladle: grip at origin, handle up, cup at the bottom
const ladle = () => `<path d="M0,-120 L0,62" stroke="${OUT}" stroke-width="15" stroke-linecap="round"/><path d="M0,-120 L0,62" stroke="#ffc21a" stroke-width="8" stroke-linecap="round"/><circle cy="-124" r="10" fill="#ffc21a" stroke="${OUT}" stroke-width="4"/><path d="M-34,64 Q-34,104 0,106 Q34,104 34,64Z" fill="#ffc21a" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><path d="M-22,74 Q0,82 22,74" stroke="#fff3c0" stroke-width="4" fill="none"/>`;
function riceHeap(f = 1, w = 38) { // a heap on a bowl rim at y 0
  if (f <= 0) return '';
  let s = `<path d="M${-w},-4 Q0,${R(-4 - 56 * f)} ${w},-4Z" fill="#fffaf0" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/>`;
  for (let i = 0; i < 9; i++) { const x = (rnd(i) - .5) * w * 1.4, y = -8 - rnd(i + 4) * 34 * f; s += `<ellipse cx="${R(x)}" cy="${R(y)}" rx="4" ry="2.2" fill="#f0e2c0"/>`; }
  return s;
}
const bowlFull = (f, t) => bowl() + riceHeap(f) + (f > .3 ? [0, 1].map(i => { const ph = (t * .7 + i * .5) % 1; return `<path d="M${-10 + i * 18},${R(-30 - 50 * f - ph * 60)} q10,-14 0,-28" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity="${R(.6 * (1 - ph))}"/>`; }).join('') : '');
function akshayaPatra(t, glow = 1) { // origin = bottom centre; ~440 wide
  let s = glow > 0 ? `<ellipse cy="-200" rx="320" ry="240" fill="#fff3a0" opacity="${R(.45 * glow)}" filter="url(#blur40)"/>` : '';
  s += `<ellipse cy="-6" rx="170" ry="22" fill="#7a3a12" opacity=".4"/><path d="M-200,-150 Q-230,-20 -120,-4 L120,-4 Q230,-20 200,-150Z" fill="#e9a21c" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/>`;
  s += `<path d="M-206,-120 Q0,-90 206,-120" stroke="#c46a12" stroke-width="12" fill="none"/><path d="M-170,-60 Q0,-40 170,-60" stroke="#fff3c0" stroke-width="6" fill="none" opacity=".6"/>`;
  s += `<rect x="-216" y="-178" width="432" height="34" rx="14" fill="#ffc21a" stroke="${OUT}" stroke-width="6"/>`;
  s += G('translate(0,-176)', `<path d="M-196,0 Q-120,-150 0,-160 Q120,-150 196,0Z" fill="#fffaf0" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/>` + Array.from({ length: 16 }, (_, i) => `<ellipse cx="${R((rnd(i) - .5) * 300)}" cy="${R(-20 - rnd(i + 3) * 110)}" rx="6" ry="3" fill="#efdcb4"/>`).join('') + `<circle cx="-70" cy="-40" r="18" fill="#ffb21c" stroke="${OUT}" stroke-width="3.5"/><circle cx="60" cy="-60" r="14" fill="#7cc04a" stroke="${OUT}" stroke-width="3.5"/><circle cx="10" cy="-110" r="13" fill="#e8402e" stroke="${OUT}" stroke-width="3.5"/>`);
  for (let i = 0; i < 3; i++) { const ph = (t * .5 + i / 3) % 1; s += `<path d="M${-60 + i * 60},${R(-330 - ph * 120)} q22,-30 0,-60 q-22,-30 0,-60" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" opacity="${R(.55 * Math.sin(ph * Math.PI))}"/>`; }
  return s;
}
function thali() {
  let s = `<circle r="120" fill="#ffd27a" stroke="${OUT}" stroke-width="6"/><circle r="100" fill="none" stroke="#e9a21c" stroke-width="5"/>`;
  s += G('translate(-6,10)', riceHeap(1, 46).replace(/-4/g, '-4'));
  [[-62, -40, '#ffb21c'], [56, -46, '#7cc04a'], [62, 34, '#e8402e'], [-56, 46, '#c46a12']].forEach(([x, y, c]) => { s += `<circle cx="${x}" cy="${y}" r="26" fill="#e9a21c" stroke="${OUT}" stroke-width="4"/><circle cx="${x}" cy="${y}" r="18" fill="${c}"/>`; });
  return s;
}
const globeIcon = () => `<circle r="120" fill="#3a8fd8" stroke="${OUT}" stroke-width="6"/><path d="M-80,-60 Q-40,-90 -10,-60 Q10,-20 -30,0 Q-70,10 -90,-20Z M20,10 Q70,-10 90,30 Q70,80 30,70 Q0,50 20,10Z M-40,50 Q-10,40 0,70 Q-20,96 -50,80Z" fill="#6fbd52" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/><path d="M-120,0 Q0,40 120,0 M0,-120 Q40,0 0,120" stroke="#fff" stroke-width="3" fill="none" opacity=".4"/>`;
const bodyIcon = () => `<circle cy="-70" r="34" fill="#f6cfa3" stroke="${OUT}" stroke-width="5"/><path d="M-50,90 L-44,-6 Q-40,-30 0,-30 Q40,-30 44,-6 L50,90Z" fill="#f6cfa3" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><path d="M-44,-4 L-80,60 M44,-4 L80,60" stroke="${OUT}" stroke-width="22" stroke-linecap="round"/><path d="M-44,-4 L-80,60 M44,-4 L80,60" stroke="#f6cfa3" stroke-width="13" stroke-linecap="round"/>`;
const mayaWave = (t, r = 120) => { let s = ''; for (let i = 0; i < 3; i++) { const ph = (t * .6 + i / 3) % 1; s += `<circle r="${R(r * (.4 + ph * .8))}" fill="none" stroke="#c9a6ff" stroke-width="${R(8 * (1 - ph))}" opacity="${R(.8 * (1 - ph))}"/>`; } return s; };
function wheat(t, dry = 0, seed = 0) { // one stalk, origin at the ground
  const sway = 6 * Math.sin(t * 1.6 + seed) * (1 - dry), droop = 70 * dry, c = mix('#f2b51c', '#8a6a3a', dry), st = mix('#c99a2a', '#7a5a32', dry);
  const tipx = 22 * dry, tipy = -170 + 50 * dry;
  let s = `<path d="M0,0 Q${R(sway)},-90 ${R(tipx + sway)},${R(tipy)}" stroke="${st}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  s += G(at(tipx + sway, tipy, 1, sway * 2 + droop), [0, 1, 2, 3, 4].map(i => `<ellipse cx="${i % 2 ? 7 : -7}" cy="${-12 - i * 12}" rx="7" ry="11" fill="${c}" stroke="${OUT}" stroke-width="2.5"/>`).join('') + `<path d="M0,-60 L0,-90" stroke="${st}" stroke-width="3"/>`);
  return s;
}
function chulha(t, fire = 1) {
  let s = `<path d="M-90,0 L-90,-80 Q-90,-100 -66,-100 L-34,-100 L-34,-62 Q0,-40 34,-62 L34,-100 L66,-100 Q90,-100 90,-80 L90,0Z" fill="#c4743a" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><path d="M-34,0 L-34,-50 Q0,-74 34,-50 L34,0Z" fill="#3a1a0c" stroke="${OUT}" stroke-width="4"/>`;
  if (fire > 0) s += G(`translate(0,-4) scale(${R(.36 * fire)})`, flame(t, 2));
  else for (let i = 0; i < 2; i++) { const ph = (t * .4 + i * .5) % 1; s += `<path d="M${-6 + i * 10},${R(-40 - ph * 120)} q14,-20 0,-40 q-14,-20 0,-40" stroke="#9a8f9c" stroke-width="6" fill="none" stroke-linecap="round" opacity="${R(.6 * (1 - ph))}"/>`; }
  s += `<path d="M-74,-100 Q-80,-170 0,-174 Q80,-170 74,-100Z" fill="#8a8a96" stroke="${OUT}" stroke-width="5"/><ellipse cx="0" cy="-172" rx="64" ry="12" fill="#5a5a66" stroke="${OUT}" stroke-width="4"/>`;
  return s;
}
const leafPlate = (food = 1) => `<path d="M-120,0 Q-60,-36 120,-14 Q60,28 -120,0Z" fill="#4e9a3a" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/><path d="M-110,0 Q0,-14 112,-14" stroke="#9ad06a" stroke-width="3" fill="none"/>` + (food > 0 ? G('translate(-10,-10)', riceHeap(food, 34)) + `<circle cx="50" cy="-12" r="12" fill="#ffb21c" stroke="${OUT}" stroke-width="3"/><circle cx="-60" cy="-8" r="10" fill="#7cc04a" stroke="${OUT}" stroke-width="3"/>` : '');
function cracks(a = 1, w = 2400, y = 0) { let s = ''; for (let i = 0; i < 26; i++) { const x = -300 + rnd(i) * w, yy = y + 20 + rnd(i + 7) * 200; s += `<path d="M${R(x)},${R(yy)} l${R(20 + rnd(i + 1) * 30)},${R(10 + rnd(i + 2) * 14)} l${R(-10 + rnd(i + 3) * 30)},${R(14 + rnd(i + 5) * 12)} m${R(-30)},${R(-14)} l-26,8" stroke="#5a3a1c" stroke-width="4" fill="none" stroke-linecap="round" opacity="${R(a * .8)}"/>`; } return s; }
function seatedWithBowl(t, o = {}) { // rishi-style seated figure holding an empty or full bowl in front
  const pose = [22, -132], hL = armHand(-1, pose), hR = armHand(1, pose), bx = (hL[0] + hR[0]) / 2, by = (hL[1] + hR[1]) / 2 + 252;
  let s = rishi({ t, skin: o.skin, hair: o.hair, seed: o.seed, armL: pose, armR: pose, look: o.look || [0, 3], open: o.open || 0, closed: o.closed });
  s += G(at(bx, by + 10, 1.2), o.food ? bowlFull(o.food, t) : bowl());
  if (o.crown) s += G('translate(0,-293)', `<path d="M-40,-50 L-36,-88 L-18,-68 L0,-102 L18,-68 L36,-88 L40,-50Z" fill="#ffc21a" stroke="${OUT}" stroke-width="4.5" stroke-linejoin="round"/>`);
  return s;
}
function lokaPanel(kind, t) { // one 1920x360 band
  if (kind === 0) return `<rect width="1920" height="360" fill="#ffe7a8"/>` + sunRays(960, 180, t, .15) + G('translate(0,-560)', cloudRow(800, 70, '#fff6e6', t * 10, -200, 2200)) + G('translate(960,330) scale(.5)', temple({ t, spire: '#ffc21a' })) + G('translate(400,340) scale(.5)', cloudPad(240)) + G('translate(1500,320) scale(.5)', cloudPad(260));
  if (kind === 1) { let s = `<rect width="1920" height="360" fill="#ffd27a"/><rect y="230" width="1920" height="130" fill="#e9a85c"/>`; for (let i = 0; i < 26; i++) s += G(`translate(${60 + i * 72},300) scale(.7)`, wheat(t, 0, i)); s += G('translate(300,240) scale(.42)', house('#ffe1a6', 0)) + G('translate(1600,240) scale(.42)', house('#f6b98a', 0)); return s; }
  let s = `<rect width="1920" height="360" fill="#1d3a8a"/>`;
  for (let i = 0; i < 18; i++) s += `<circle cx="${R(rnd(i) * 1920)}" cy="${R(rnd(i + 5) * 340)}" r="${R(5 + rnd(i + 2) * 8)}" fill="${['#ff5a8a', '#4ae0c0', '#ffd23c'][i % 3]}" stroke="${OUT}" stroke-width="2.5"/>`;
  s += `<path d="M300,300 C420,180 600,330 760,220 C900,120 1080,300 1240,200 C1380,110 1520,260 1640,180" stroke="${OUT}" stroke-width="44" fill="none" stroke-linecap="round"/><path d="M300,300 C420,180 600,330 760,220 C900,120 1080,300 1240,200 C1380,110 1520,260 1640,180" stroke="#3f9b46" stroke-width="32" fill="none" stroke-linecap="round"/><circle cx="1650" cy="174" r="30" fill="#3f9b46" stroke="${OUT}" stroke-width="5"/><circle cx="1660" cy="166" r="5" fill="${OUT}"/>`;
  return s;
}
const hungerLines = (t, x, y) => [0, 1, 2].map(i => `<path d="M${x - 40 + i * 40},${R(y + 6 * Math.sin(t * 10 + i))} q10,-10 20,0 t20,0" stroke="#fff3c0" stroke-width="6" fill="none" stroke-linecap="round" opacity="${R(.5 + .5 * Math.sin(t * 8 + i))}"/>`).join('');
function cloudPad(w = 300) { return `<path d="M${-w},0 a${w * .26},${w * .26} 0 0 1 ${w * .42},${-w * .18} a${w * .32},${w * .32} 0 0 1 ${w * .58},${-w * .1} a${w * .3},${w * .3} 0 0 1 ${w * .5},${w * .08} a${w * .26},${w * .26} 0 0 1 ${w * .5},${w * .2} Z" fill="#fff6e6" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><path d="M${-w * .8},-4 Q0,${w * .08} ${w * .8},-4" stroke="#ffd98a" stroke-width="10" fill="none" opacity=".7"/>`; }
function hall(t) {
  let w = skyGrad('skAn', '#ff9a3c', '#ffe9b0');
  w += `<rect x="-400" y="80" width="2720" height="60" fill="#a3161f" stroke="${OUT}" stroke-width="5"/>`;
  for (let k = 0; k < 5; k++) for (let i = 0; i <= 12; i++) { const u = i / 12, x = -40 + k * 420 + u * 420, y = 146 + 70 * Math.sin(u * Math.PI); w += `<circle cx="${R(x)}" cy="${R(y)}" r="14" fill="${i % 2 ? '#ffc21a' : '#ff7a12'}" stroke="${OUT}" stroke-width="3.5"/>`; }
  for (const x of [170, 1750]) w += `<rect x="${x - 40}" y="130" width="80" height="840" fill="#c8281e" stroke="${OUT}" stroke-width="5"/><rect x="${x - 60}" y="910" width="120" height="60" fill="#ffc21a" stroke="${OUT}" stroke-width="5"/><rect x="${x - 60}" y="130" width="120" height="44" fill="#ffc21a" stroke="${OUT}" stroke-width="5"/>`;
  w += `<rect x="-400" y="960" width="2720" height="500" fill="#d9692a" stroke="${OUT}" stroke-width="5"/><path d="M-400,1010 L2320,1010" stroke="${OUT}" stroke-width="3" opacity=".3"/>`;
  return w;
}
function halo(t, x, y, r) {
  let s = `<circle cx="${x}" cy="${y}" r="${R(r * 1.25)}" fill="#fff3a0" opacity=".5" filter="url(#blur40)"/>`;
  let p = ''; for (let i = 0; i < 16; i++) p += `<path d="M0,${-r} C${-r * .18},${-r * 1.28} ${-r * .1},${-r * 1.5} 0,${-r * 1.62} C${r * .1},${-r * 1.5} ${r * .18},${-r * 1.28} 0,${-r}Z" transform="rotate(${i * 22.5 + t * 4})" fill="#ffd23c" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/>`;
  return s + G(`translate(${x},${y})`, p) + `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffe27a" stroke="${OUT}" stroke-width="6"/><circle cx="${x}" cy="${y}" r="${R(r * .82)}" fill="none" stroke="#e9a21c" stroke-width="6"/>`;
}
const ladleHeld = (pose, rot = 0) => { const h = armHand(-1, pose); return G(at(h[0], h[1], 1, rot), ladle()); };
