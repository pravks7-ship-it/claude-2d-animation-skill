// ---------- episode 3 additions ----------
const skyGrad = (id, top, bot) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs><rect x="-1500" y="-1200" width="4920" height="3500" fill="url(#${id})"/>`;
const sunRays = (x, y, t, op = .14, col = '#fff6c8') => { let r = ''; for (let i = 0; i < 14; i++) r += `<path d="M0,0 L-170,-2600 L170,-2600Z" transform="rotate(${R(i * (360 / 14))})" fill="${col}"/>`; return G(`translate(${x},${y}) rotate(${R(t * 4)})`, r, `opacity="${op}"`); };
const earMani = x => `<circle cx="${x}" cy="22" r="8" fill="none" stroke="#e9b21c" stroke-width="5"/><circle cx="${x}" cy="32" r="5" fill="#e0161a" stroke="${OUT}" stroke-width="2"/>`;
const maniJewel = () => `<circle r="22" fill="none" stroke="${OUT}" stroke-width="13"/><circle r="22" fill="none" stroke="#ffc21a" stroke-width="7"/><path d="M0,20 L13,34 L0,52 L-13,34Z" fill="#e0161a" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/><path d="M-4,30 L0,26 L4,30" stroke="#fff" stroke-width="2.5" fill="none"/>`;
function shivaEar(X, Y, S, sway = 0, tilt = 0) { // world position of Shiva's right earring
  const r = tilt * Math.PI / 180, lx = 56 * Math.cos(r) + 23 * Math.sin(r), ly = 56 * Math.sin(r) - 23 * Math.cos(r) + 55 - 545, q = sway * Math.PI / 180;
  return [X + S * (lx * Math.cos(q) - ly * Math.sin(q)), Y + S * (lx * Math.sin(q) + ly * Math.cos(q))];
}

// ---------- PARVATI ----------
function parvati(o = {}) {
  const { t = 0, look = [0, 0], smile = .55, open = 0, tilt = 0, armL = [16, 8], armR = [16, 8], handL, handR, held = '', brow = 0 } = o;
  const skin = '#f4c08e', lid = Math.max(o.lid || 0, blink(t, 4.4));
  const back = `<path d="M-60,-596 C-122,-560 -114,-420 -102,-330 Q0,-300 102,-330 C114,-420 122,-560 60,-596Z" fill="#1c1420" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/>`;
  const aL = arm(-1, armL, skin, { hand: handL, w: 26, band: '#ffc21a', wrist: '#c8281e' }), aR = arm(1, armR, skin, { hand: handR, w: 26, band: '#ffc21a', wrist: '#c8281e' });
  let body = dhoti('#d42a2a', '#ffc21a', skin) + torso(skin);
  body += `<path d="M-74,-452 Q-78,-480 -48,-480 L48,-480 Q78,-480 74,-452 L68,-404 Q0,-388 -68,-404Z" fill="#2a5bd7" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/>`;
  body += `<path d="M14,-486 Q62,-492 76,-452 L-6,-296 L-58,-296Z" fill="#e8402e" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><path d="M70,-452 L-8,-302" stroke="#ffc21a" stroke-width="8"/><path d="M40,-470 L-30,-330 M54,-440 L-14,-320" stroke="${OUT}" stroke-width="2.5" opacity=".3"/>`;
  for (let i = 0; i <= 10; i++) { const u = i / 10, x = lerp(-40, 40, u), y = -478 + 46 * (1 - Math.pow(2 * u - 1, 2)); body += `<circle cx="${R(x)}" cy="${R(y)}" r="6" fill="#ffc21a" stroke="${OUT}" stroke-width="2.5"/>`; }
  body += `<path d="M0,-430 L10,-414 L0,-398 L-10,-414Z" fill="#e0161a" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>`;
  let head = headBase(skin);
  head += `<circle cx="-30" cy="16" r="10" fill="#ff8a7a" opacity=".45"/><circle cx="30" cy="16" r="10" fill="#ff8a7a" opacity=".45"/>`;
  head += `<path d="M-52,-4 C-60,-80 60,-80 52,-4 C46,-44 14,-56 0,-50 C-14,-56 -46,-44 -52,-4Z" fill="#1c1420" stroke="${OUT}" stroke-width="4.5" stroke-linejoin="round"/><path d="M0,-62 L0,-48" stroke="#e0161a" stroke-width="5" stroke-linecap="round"/>`;
  head += `<path d="M-38,-58 L-34,-96 L-17,-76 L0,-112 L17,-76 L34,-96 L38,-58 Q0,-66 -38,-58Z" fill="#ffc21a" stroke="${OUT}" stroke-width="4.5" stroke-linejoin="round"/><circle cx="0" cy="-78" r="7" fill="#c8281e" stroke="${OUT}" stroke-width="2.5"/>`;
  head += `<path d="M0,-50 L0,-40" stroke="#ffc21a" stroke-width="3"/><circle cx="0" cy="-36" r="5" fill="#ffc21a" stroke="${OUT}" stroke-width="2"/><circle cx="0" cy="-21" r="5.5" fill="#e0161a"/>`;
  head += eyes({ lid, look, rx: 12, ry: 9 }) + brows(brow, '#1c1420', 4.5);
  if (lid < .8) for (const sd of [-1, 1]) head += `<path d="M${sd * 31},-3 l${sd * 8},-7" stroke="${OUT}" stroke-width="3.5" stroke-linecap="round"/>`;
  head += nose() + `<circle cx="9" cy="18" r="7" fill="none" stroke="#ffc21a" stroke-width="3"/>` + mouth({ smile, open, w: 11, y: 33 });
  for (const sd of [-1, 1]) head += `<circle cx="${sd * 54}" cy="22" r="4" fill="#ffc21a"/><path d="M${sd * 54 - 11},44 Q${sd * 54},18 ${sd * 54 + 11},44Z" fill="#ffc21a" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>`;
  return back + body + aL.svg + aR.svg + held + G(`translate(0,-545) rotate(${tilt},0,55)`, head);
}

// ---------- props ----------
function damaru(t) {
  const sw = Math.sin(t * 14);
  return `<path d="M-26,-34 L26,-34 L5,0 L26,34 L-26,34 L-5,0Z" fill="#c4541f" stroke="${OUT}" stroke-width="4.5" stroke-linejoin="round"/><path d="M-26,-34 L26,-34 M-26,34 L26,34" stroke="#ffc21a" stroke-width="7"/>` +
    [-1, 1].map(sd => `<path d="M${sd * 4},0 Q${R(sd * 26)},${R(10 * sw)} ${R(sd * 44)},${R(-18 * sw * sd)}" stroke="${OUT}" stroke-width="3" fill="none"/><circle cx="${R(sd * 44)}" cy="${R(-18 * sw * sd)}" r="7" fill="${OUT}"/>`).join('');
}
const bowl = () => `<path d="M-42,-6 Q-42,34 0,36 Q42,34 42,-6Z" fill="#8a5a2c" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="0" cy="-6" rx="42" ry="11" fill="#4a2a14" stroke="${OUT}" stroke-width="4.5"/><path d="M-30,14 Q0,24 30,14" stroke="#c48a4c" stroke-width="4" fill="none"/>`;
function floatingKashi(t, glow = 0) { // origin = top surface centre; rock spans x ±520, bottom ~ y 250
  let s = `<path d="M-540,0 Q-520,120 -330,190 Q-160,270 0,262 Q160,270 330,190 Q520,120 540,0Z" fill="#c4541f" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/>`;
  s += `<path d="M-480,40 Q0,90 480,40 M-380,110 Q0,170 380,110 M-240,170 Q0,220 240,170" stroke="${OUT}" stroke-width="4" fill="none" opacity=".35"/><path d="M-300,190 L-286,236 L-262,200 M200,210 L214,250 L234,214" stroke="${OUT}" stroke-width="4" fill="#a8401a" stroke-linejoin="round"/>`;
  s += `<clipPath id="fkc"><rect x="-540" y="-600" width="1080" height="600"/></clipPath><g clip-path="url(#fkc)">` + G('scale(.45) translate(-960,-96)', kashi(t, 0, { noUmb: 1 })) + `</g>`;
  if (glow > 0) s = `<ellipse cx="0" cy="-80" rx="640" ry="380" fill="#fff3a0" opacity="${R(.55 * glow)}" filter="url(#blur40)"/>` + s;
  return s;
}
function kashiOnTrishul(t, k = 2.2, len = 1100, glow = 0) { // origin = city surface centre; trishul tips pierce the rock underside
  const tri = G(`translate(0,${R(240 + (len + 120) * k)}) scale(${k})`, trishul(len));
  const g = glow > 0 ? `<rect x="-90" y="200" width="180" height="${R(len * k)}" fill="#fff3a0" opacity="${R(.5 * glow)}" filter="url(#blur20)"/>` : '';
  return g + tri + floatingKashi(t, glow);
}
function kundPit(t, dig = 1, fill = 1, glow = 0, rims = 1) { // origin = centre; ~660 wide
  if (dig <= 0) return '';
  let s = '';
  if (rims > 0) { let r = ''; for (let i = 0; i < 3; i++) r += `<ellipse cy="${i * 5}" rx="${330 - i * 26}" ry="${104 - i * 8}" fill="${i % 2 ? '#f3c98c' : '#ffe3b0'}" stroke="${OUT}" stroke-width="5"/>`; s += G('', r, `opacity="${R(rims)}"`); }
  s += `<ellipse cy="14" rx="${R(250 * dig)}" ry="${R(76 * dig)}" fill="#6b3a1c" stroke="${OUT}" stroke-width="5"/>`;
  if (fill > 0) {
    const f = .35 + .65 * fill, wc = mix('#3a9db5', '#fff3a0', glow);
    s += `<ellipse cy="${R(14 + 10 * (1 - fill))}" rx="${R(250 * dig * f)}" ry="${R(76 * dig * f)}" fill="${wc}" stroke="#2a6f8a" stroke-width="4"/>`;
    s += `<path d="M${R(-120 * f)},${R(4 + 10 * (1 - fill))} q30,-8 60,0 M${R(40 * f)},${R(26 + 10 * (1 - fill))} q30,-8 60,0" stroke="#e6fbff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".7"/>`;
  }
  return s;
}
function houseClosed(col) {
  return house(col, 0) + `<path d="M-50,0 L-50,-148 Q0,-198 50,-148 L50,0Z" fill="#a8622a" stroke="${OUT}" stroke-width="5"/><path d="M0,-186 L0,0 M-50,-60 L50,-60 M-50,-120 L50,-120" stroke="${OUT}" stroke-width="3.5" opacity=".5"/><circle cx="-14" cy="-84" r="7" fill="none" stroke="#ffc21a" stroke-width="4"/><circle cx="14" cy="-84" r="7" fill="none" stroke="#ffc21a" stroke-width="4"/>`;
}
function ladySil() {
  const C = '#2a1208';
  return `<path d="M-74,0 L-54,-262 Q0,-300 54,-262 L74,0Z" fill="${C}"/><circle cx="0" cy="-332" r="46" fill="${C}"/><circle cx="-36" cy="-362" r="24" fill="${C}"/><path d="M40,-250 L112,-196" stroke="${C}" stroke-width="30" stroke-linecap="round"/><path d="M112,-196 L150,-340" stroke="${C}" stroke-width="12" stroke-linecap="round"/><ellipse cx="156" cy="-352" rx="28" ry="14" fill="${C}"/><path d="M-40,-250 L-96,-170 L-70,-150" stroke="${C}" stroke-width="30" stroke-linecap="round" stroke-linejoin="round" fill="none"/><ellipse cx="-92" cy="-150" rx="50" ry="16" fill="${C}"/>`;
}
function pyre(t, seed = 0, k = 1) {
  let s = '';
  for (let i = 0; i < 4; i++) s += `<rect x="-96" y="${-22 * (i + 1)}" width="192" height="21" rx="9" fill="${i % 2 ? '#8a4a1c' : '#6b3a1c'}" stroke="${OUT}" stroke-width="4"/><circle cx="${i % 2 ? -96 : 96}" cy="${-22 * i - 11}" r="9" fill="#c48a4c" stroke="${OUT}" stroke-width="3"/>`;
  s += `<ellipse cy="-92" rx="110" ry="40" fill="#ffb21c" opacity=".5" filter="url(#blur20)"/>` + G('translate(0,-84) scale(1.35)', flame(t, seed)) + G('translate(-46,-84) scale(.8)', flame(t, seed + 3)) + G('translate(46,-84) scale(.85)', flame(t, seed + 5));
  for (let i = 0; i < 6; i++) { const ph = (t * .16 + i / 6 + rnd(seed + i) * .1) % 1; s += `<circle cx="${R(Math.sin(ph * 5 + seed) * 40 + ph * 120)}" cy="${R(-200 - ph * 520)}" r="${R(30 + ph * 90)}" fill="#8d7f90" opacity="${R(.38 * (1 - ph))}" filter="url(#blur8)"/>`; }
  return G(`scale(${k})`, s);
}
const diya = (t, seed = 0, k = 1) => G(`scale(${k})`, `<path d="M-30,0 Q0,22 30,0 Q22,-12 0,-12 Q-22,-12 -30,0Z" fill="#c4541f" stroke="${OUT}" stroke-width="4.5" stroke-linejoin="round"/><circle cy="-30" r="26" fill="#ffd84a" opacity=".45" filter="url(#blur8)"/>` + G('translate(0,-10) scale(.24)', flame(t, seed)));
const leafDiya = (t, seed = 0) => `<path d="M-34,0 Q0,18 34,0 Q0,-8 -34,0Z" fill="#4e9a3a" stroke="${OUT}" stroke-width="3.5"/><circle cy="-16" r="18" fill="#ffd84a" opacity=".5" filter="url(#blur8)"/>` + G('translate(0,-4) scale(.16)', flame(t, seed));
const cot = () => {
  let s = `<path d="M-250,-30 L-250,46 M250,-30 L250,46" stroke="${OUT}" stroke-width="20" stroke-linecap="round"/><path d="M-250,-30 L-250,46 M250,-30 L250,46" stroke="#a8622a" stroke-width="11" stroke-linecap="round"/><rect x="-270" y="-70" width="540" height="42" rx="12" fill="#8a4a1c" stroke="${OUT}" stroke-width="5"/>`;
  for (let i = 0; i < 12; i++) s += `<path d="M${-250 + i * 44},-66 l22,34" stroke="#e9b21c" stroke-width="3" opacity=".7"/>`;
  return s;
};
function oldManLying(t, o = {}) { // origin = cot top centre
  let s = `<ellipse cx="-196" cy="-86" rx="70" ry="28" fill="#fff8ec" stroke="${OUT}" stroke-width="4.5"/>`;
  s += `<path d="M-136,-70 Q-140,-150 -80,-152 L226,-148 Q262,-146 262,-108 L262,-70Z" fill="#fff3da" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><path d="M-40,-150 Q-30,-110 -44,-72 M80,-148 Q90,-110 76,-72 M180,-148 Q190,-110 178,-72" stroke="${OUT}" stroke-width="3" opacity=".3" fill="none"/>`;
  s += `<path d="M-116,-150 Q-20,-150 40,-120 L40,-104 Q-20,-128 -116,-124Z" fill="#ff8a1e" stroke="${OUT}" stroke-width="4"/>`;
  s += G('translate(-196,-112) rotate(-90) scale(.62)', brahmaHead({ skin: '#d99a66', lid: o.lid === undefined ? .95 : o.lid, noCrown: true, shortBeard: true, smile: o.smile || .2 }));
  return s;
}
function chainRing(t, p, r = 80) { // p: 0 intact … 1 shattered
  let s = '';
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6, d = r + p * (220 + 120 * rnd(i)), x = Math.cos(a) * d, y = Math.sin(a) * d + p * p * 200;
    s += G(at(x, y, 1, R(a * 180 / Math.PI + 90 + p * 300 * (rnd(i + 4) - .5))), `<ellipse rx="13" ry="22" fill="none" stroke="${OUT}" stroke-width="11"/><ellipse rx="13" ry="22" fill="none" stroke="#9aa3b5" stroke-width="5"/>`, `opacity="${R(1 - p)}"`);
  }
  return s;
}
function kashiScene(t, o = {}) { // skyline across the Ganga
  const { y0 = 640, sunY = 430, top = '#ff8a2a', bot = '#ffe7a8', tri = 0, id = 'skK' } = o;
  let w = skyGrad(id, top, bot) + sunRays(960, sunY, t, .16);
  w += `<circle cx="960" cy="${R(sunY)}" r="250" fill="#fff6cf" stroke="#ffcf6a" stroke-width="12"/>`;
  if (tri > 0) w += G(at(960, y0 + 40, 1.02), trishul(560), `opacity="${R(tri * .5)}" filter="url(#blur8)"`) + G(at(960, y0 + 40, 1.02), trishul(560), `opacity="${R(tri * .28)}"`);
  w += kashi(t, y0) + river(t, y0 + 96);
  w += G(at(380 + 40 * Math.sin(t * .3), y0 + 210, .9), boat(t, 1)) + G(at(1500 - 30 * Math.sin(t * .25), y0 + 290, 1.1), boat(t, 2));
  return w;
}
function rain(t, n = 70, a = .5) {
  let s = '';
  for (let i = 0; i < n; i++) { const ph = (t * (1.6 + rnd(i) * .8) + rnd(i + 3)) % 1, x = -300 + rnd(i + 7) * 2600 - ph * 300, y = -300 + ph * 1700; s += `<path d="M${R(x)},${R(y)} l-26,70" stroke="#cfe0ff" stroke-width="4" stroke-linecap="round" opacity="${R(a * (.4 + .6 * rnd(i + 2)))}"/>`; }
  return s;
}
function waves(t, y, c1 = '#1d4fa8', c2 = '#2f6fd0', c3 = '#9cc8ff') {
  let s = '';
  [[c1, 0, 70, .9], [c2, 60, 52, 1.3], [c3, 130, 36, 1.8]].forEach(([c, dy, amp, sp], j) => {
    let d = `M-500,${y + dy + 1200}L-500,${y + dy}`;
    for (let x = -500; x <= 2420; x += 40) d += `L${x},${R(y + dy + amp * .5 * Math.sin(x * .006 + t * sp + j * 2) + amp * .3 * Math.sin(x * .017 - t * sp * 1.7))}`;
    d += `L2420,${y + dy + 1200}Z`;
    s += `<path d="${d}" fill="${c}" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/>`;
    if (j < 2) for (let k = 0; k < 7; k++) { const x = -200 + ((k * 380 + t * 120 * sp) % 2600); s += `<path d="M${R(x)},${R(y + dy + amp * .5 * Math.sin(x * .006 + t * sp + j * 2) + 6)} q20,-26 46,-6 q-14,2 -18,14" fill="#e6f2ff" stroke="${OUT}" stroke-width="3.5"/>`; }
  });
  return s;
}
function bolt(x, y, dx = 1, sc = 1) {
  const d = `M${x},${y} l${dx * 60 * sc},${90 * sc} l${-dx * 30 * sc},${10 * sc} l${dx * 70 * sc},${110 * sc} l${-dx * 26 * sc},${8 * sc} l${dx * 50 * sc},${100 * sc}`;
  return `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="22" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff3a0" stroke-width="11" stroke-linejoin="round" stroke-linecap="round"/>`;
}
function stormClouds(t, y, col = '#26306a', col2 = '#3a4690') { return G(`translate(0,${2 * y}) scale(1,-1)`, cloudRow(y, 120, col, t * 30, -1200, 3200) + cloudRow(y + 80, 90, col2, -t * 40 + 50, -1200, 3200)); }
