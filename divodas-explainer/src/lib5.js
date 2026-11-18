// ---------- helpers carried over from episode 5 ----------
const between = (t, a, b) => t >= a && t <= b;
const shakeXY = (t, A) => [A * Math.sin(t * 83) * Math.cos(t * 31), A * Math.cos(t * 67) * Math.sin(t * 41)];
const showFor = (t, a, b, inner) => { const p = prog(t, a, a + .4), q = 1 - prog(t, b - .3, b); return p > 0 && q > 0 ? G('', inner(p), `opacity="${R(q)}"`) : ''; };
const popRibbon = (t, a, b, x, y, s, size = 76, w = 520) => showFor(t, a, b, p => G(at(x, y), G(`scale(${R(backOut(clamp(p * 1.4)))})`, ribbonLabel(s, size, w))));
const titleAt = (t, a, x, y, s, size, b = 1e9) => showFor(t, a, b, p => G(at(x, y), bigTitle(s, size, p)));
function jyoti(t, x, yTop, yBot, w, a) {
  if (a <= 0) return '';
  let s = `<rect x="${R(x - w * 1.3)}" y="${yTop}" width="${R(w * 2.6)}" height="${yBot - yTop}" fill="#fff3a0" opacity="${R(.45 * a)}" filter="url(#blur40)"/><rect x="${R(x - w / 2)}" y="${yTop}" width="${w}" height="${yBot - yTop}" fill="#fff6c8" opacity="${R(.85 * a)}" filter="url(#blur8)"/><rect x="${R(x - w * .16)}" y="${yTop}" width="${R(w * .32)}" height="${yBot - yTop}" fill="#fffdf0" opacity="${R(a)}"/>`;
  for (let i = 0; i < 12; i++) { const ph = (t * .5 + i / 12) % 1, y = lerp(yBot, yTop, ph); s += `<circle cx="${R(x + (rnd(i) - .5) * w * 1.6 + 10 * Math.sin(ph * 8 + i))}" cy="${R(y)}" r="${R(4 + rnd(i + 3) * 6)}" fill="#fff8d8" opacity="${R(a * Math.sin(ph * Math.PI))}"/>`; }
  return s;
}
function ghatSet(t, dusk = 0) {
  let w = skyGrad('skGh', mix('#ff8a2a', '#3a2a7a', dusk), mix('#ffe7a8', '#ff9a4a', dusk)) + sunRays(960, 330, t, .14 * (1 - dusk)) + `<circle cx="960" cy="330" r="200" fill="#fff6cf" stroke="#ffcf6a" stroke-width="12" opacity="${R(1 - dusk)}"/>`;
  w += kashi(t, 520, { noUmb: 1 });
  for (let i = 0; i < 6; i++) w += `<rect x="-400" y="${616 + i * 44}" width="2720" height="44" fill="${i % 2 ? '#f3c98c' : '#ffe3b0'}" stroke="${OUT}" stroke-width="4"/>`;
  w += river(t, 880, 500);
  return w;
}

// ---------- episode 6: new characters and props ----------
// King Ripunjaya / Divodas
function king(o = {}) {
  const { t = 0, look = [0, 0], smile = .3, open = 0, tilt = 0, armL = [16, 8], armR = [16, 8], handL, handR, held = '', brow = 0, crown = 1 } = o;
  const skin = '#e9b07a', lid = Math.max(o.lid || 0, blink(t, 6));
  const aL = arm(-1, armL, skin, { hand: handL, band: '#ffc21a', wrist: '#ffc21a' }), aR = arm(1, armR, skin, { hand: handR, band: '#ffc21a', wrist: '#ffc21a' });
  const cape = `<path d="M-80,-470 Q-130,-300 -120,-40 L120,-40 Q130,-300 80,-470Z" fill="#6a0f1a" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/>`;
  let body = dhoti('#2a5bd7', '#ffc21a', skin) + torso(skin) + `<path d="M-74,-452 Q-78,-480 -48,-480 L48,-480 Q78,-480 74,-452 L58,-300 L-58,-300Z" fill="#8f1420" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/>`;
  body += `<path d="M-58,-470 L50,-306" stroke="#ffc21a" stroke-width="16"/><path d="M-58,-470 L50,-306" stroke="${OUT}" stroke-width="2" opacity=".4"/>`;
  for (let i = 0; i <= 10; i++) { const u = i / 10, x = lerp(-40, 40, u), y = -476 + 50 * (1 - Math.pow(2 * u - 1, 2)); body += `<circle cx="${R(x)}" cy="${R(y)}" r="6.5" fill="#fff8ec" stroke="${OUT}" stroke-width="2.5"/>`; }
  body += `<circle cx="0" cy="-420" r="10" fill="#3aa845" stroke="${OUT}" stroke-width="3"/>`;
  let head = headBase(skin) + `<path d="M-52,-6 C-56,-60 56,-60 52,-6 C42,-36 -42,-36 -52,-6Z" fill="#1c1420" stroke="${OUT}" stroke-width="4"/>`;
  head += eyes({ lid, look }) + brows(brow, '#1c1420', 6) + nose() + mouth({ smile, open, y: 36, w: 11 });
  head += `<path d="M0,22 C-10,15 -30,16 -44,28 C-38,22 -26,20 -18,24 C-10,28 -4,28 0,26 C4,28 10,28 18,24 C26,20 38,22 44,28 C30,16 10,15 0,22Z" fill="#1c1420"/>`;
  head += `<path d="M-14,-28 L14,-28" stroke="#c8281e" stroke-width="5" stroke-linecap="round"/><circle cx="-56" cy="24" r="9" fill="#ffc21a" stroke="${OUT}" stroke-width="3.5"/><circle cx="56" cy="24" r="9" fill="#ffc21a" stroke="${OUT}" stroke-width="3.5"/>`;
  if (crown > 0) head += G('', `<path d="M-50,-36 L-50,-104 L-28,-84 L-14,-128 L0,-96 L14,-128 L28,-84 L50,-104 L50,-36Z" fill="#ffc21a" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><rect x="-54" y="-50" width="108" height="18" rx="6" fill="#e9a21c" stroke="${OUT}" stroke-width="4"/><circle cx="0" cy="-70" r="10" fill="#c8281e" stroke="${OUT}" stroke-width="3"/><circle cx="-30" cy="-62" r="6" fill="#3aa845" stroke="${OUT}" stroke-width="2.5"/><circle cx="30" cy="-62" r="6" fill="#3aa845" stroke="${OUT}" stroke-width="2.5"/>`, `opacity="${R(crown)}"`);
  else head += `<path d="M-40,-46 Q0,-74 40,-46" stroke="#1c1420" stroke-width="16" fill="none" stroke-linecap="round"/>`;
  return cape + body + aL.svg + aR.svg + held + G(`translate(0,-545) rotate(${tilt},0,55)`, head);
}
const crownIcon = () => `<path d="M-50,30 L-50,-38 L-28,-18 L-14,-62 L0,-30 L14,-62 L28,-18 L50,-38 L50,30Z" fill="#ffc21a" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><rect x="-54" y="16" width="108" height="18" rx="6" fill="#e9a21c" stroke="${OUT}" stroke-width="4"/><circle cx="0" cy="-4" r="10" fill="#c8281e" stroke="${OUT}" stroke-width="3"/>`;
function throne() { // origin bottom centre
  return `<rect x="-200" y="-40" width="400" height="40" rx="8" fill="#c4541f" stroke="${OUT}" stroke-width="5"/><path d="M-170,-40 L-170,-560 Q0,-700 170,-560 L170,-40Z" fill="#ffc21a" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/><path d="M-130,-60 L-130,-520 Q0,-630 130,-520 L130,-60Z" fill="#c8281e" stroke="${OUT}" stroke-width="5"/><circle cx="0" cy="-560" r="22" fill="#3aa845" stroke="${OUT}" stroke-width="4"/><rect x="-190" y="-260" width="380" height="60" rx="14" fill="#e9a21c" stroke="${OUT}" stroke-width="5"/>`;
}
const chhatra = () => `<path d="M0,0 L0,-120" stroke="${OUT}" stroke-width="10"/><path d="M-130,-120 Q0,-220 130,-120Z" fill="#fff6dc" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/><path d="M-130,-120 Q-110,-100 -86,-120 Q-62,-100 -40,-120 Q-18,-100 0,-120 Q18,-100 40,-120 Q62,-100 86,-120 Q110,-100 130,-120" fill="#ffc21a" stroke="${OUT}" stroke-width="4"/>`;
// Ganesha (disguise adds an astrologer's shawl and a scroll)
function ganesha(o = {}) {
  const { t = 0, look = [0, 0], armL = [40, 60], armR = [44, -40], held = '', disguise = 0, smile = .6, open = 0 } = o;
  const skin = '#f6a96a', lid = Math.max(o.lid || 0, blink(t, 7));
  let s = `<ellipse cx="-52" cy="-14" rx="40" ry="16" fill="${skin}" stroke="${OUT}" stroke-width="5"/><ellipse cx="52" cy="-14" rx="40" ry="16" fill="${skin}" stroke="${OUT}" stroke-width="5"/>`;
  s += `<path d="M-120,-250 L120,-250 L110,-40 Q56,-24 0,-40 Q-56,-24 -110,-40Z" fill="#ffd21f" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><path d="M-112,-70 Q-56,-50 0,-70 Q56,-50 112,-70" stroke="#c8281e" stroke-width="12" fill="none"/>`;
  s += `<path d="M-76,-462 Q-90,-480 -56,-484 L56,-484 Q90,-480 76,-462Z" fill="${skin}" stroke="${OUT}" stroke-width="5"/>`;
  s += `<ellipse cx="0" cy="-340" rx="128" ry="134" fill="${skin}" stroke="${OUT}" stroke-width="5"/><circle cx="0" cy="-300" r="7" fill="${OUT}" opacity=".5"/><path d="M-120,-268 Q0,-232 120,-268" stroke="#3f9b46" stroke-width="14" fill="none"/><circle cx="118" cy="-266" r="12" fill="#3f9b46" stroke="${OUT}" stroke-width="3"/>`;
  s += `<path d="M-60,-470 Q0,-430 60,-470" stroke="#ffc21a" stroke-width="10" fill="none"/>`;
  if (disguise > 0) s += G('', `<path d="M-96,-480 Q-150,-380 -128,-250 L-60,-250 Q-80,-380 -40,-470Z M96,-480 Q150,-380 128,-250 L60,-250 Q80,-380 40,-470Z" fill="#ff8a1e" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><path d="M-120,-300 L-66,-300 M120,-300 L66,-300" stroke="#ffc21a" stroke-width="8"/>`, `opacity="${R(disguise)}"`);
  const aL = arm(-1, armL, skin, { band: '#ffc21a', wrist: '#ffc21a' }), aR = arm(1, armR, skin, { hand: 'palm', band: '#ffc21a', wrist: '#ffc21a' });
  s += aL.svg + aR.svg + held;
  // elephant head
  let h = `<ellipse cx="-96" cy="0" rx="74" ry="86" fill="${skin}" stroke="${OUT}" stroke-width="5"/><ellipse cx="-92" cy="4" rx="50" ry="62" fill="#ff9a8a"/><ellipse cx="96" cy="0" rx="74" ry="86" fill="${skin}" stroke="${OUT}" stroke-width="5"/><ellipse cx="92" cy="4" rx="50" ry="62" fill="#ff9a8a"/>`;
  h += `<ellipse cx="0" cy="-6" rx="72" ry="78" fill="${skin}" stroke="${OUT}" stroke-width="5"/>`;
  h += `<path d="M-50,-58 L-50,-120 L-26,-100 L0,-150 L26,-100 L50,-120 L50,-58Z" fill="#ffc21a" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><rect x="-56" y="-70" width="112" height="18" rx="6" fill="#e9a21c" stroke="${OUT}" stroke-width="4"/><circle cx="0" cy="-92" r="9" fill="#c8281e" stroke="${OUT}" stroke-width="3"/>`;
  h += `<path d="M-22,-44 L22,-44 M-24,-36 L24,-36" stroke="#fff" stroke-width="4" stroke-linecap="round"/><circle cx="0" cy="-40" r="5" fill="#c8281e"/>`;
  h += eyes({ lid, look, ex: 30, ey: -8, rx: 10, ry: 8, irisR: 5 });
  const sw = 8 * Math.sin(t * 1.8);
  h += limb([[0, 14], [-4, 70], [12 + sw * .3, 118], [42 + sw, 128], [58 + sw, 112]], 34, skin);
  h += `<path d="M24,30 Q40,56 30,74" stroke="${OUT}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M24,30 Q40,56 30,74" stroke="#fff8ec" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M-24,30 Q-30,40 -28,46" stroke="${OUT}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M-24,30 Q-30,40 -28,46" stroke="#fff8ec" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  h += `<path d="M-24,${R(50 - smile * 4)} Q-16,${R(56 + smile * 6 + open * 10)} -8,${R(50 - smile * 2)}" stroke="${OUT}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  return s + G('translate(0,-560)', h);
}
const scroll = () => `<rect x="-14" y="-90" width="28" height="180" rx="10" fill="#c4541f" stroke="${OUT}" stroke-width="4"/><path d="M-6,-80 L-6,80 L110,70 L110,-70Z" fill="#fff3d4" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/><circle cx="40" cy="-30" r="8" fill="#e9a21c"/><circle cx="76" cy="10" r="6" fill="#2a5bd7"/><path d="M20,30 L90,30 M20,50 L80,50 M30,-10 L70,-10" stroke="${OUT}" stroke-width="3" opacity=".5"/>`;
const modak = () => `<path d="M-22,10 Q-26,-20 0,-34 Q26,-20 22,10Z" fill="#fff6dc" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/><path d="M-10,8 Q-8,-14 0,-30 M10,8 Q8,-14 0,-30" stroke="${OUT}" stroke-width="2.5" fill="none" opacity=".5"/>`;
// yogini: small flying figure, origin at the waist
function yogini(t, i) {
  const C = ['#e8402e', '#2a5bd7', '#3aa845', '#ff8a1e', '#a83ac8', '#ffc21a'][i % 6], fl = 10 * Math.sin(t * 6 + i);
  return `<circle r="46" fill="#fff3a0" opacity=".35" filter="url(#blur8)"/><path d="M-24,0 Q-40,40 ${R(-60 + fl)},70 L${R(40 + fl)},70 Q28,30 24,0Z" fill="${C}" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/><path d="M-20,-6 L20,-6 L16,-40 L-16,-40Z" fill="#f4c08e" stroke="${OUT}" stroke-width="4"/><path d="M-14,-34 Q-46,-60 -40,-92 M14,-34 Q46,-60 40,-92" stroke="${OUT}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M-14,-34 Q-46,-60 -40,-92 M14,-34 Q46,-60 40,-92" stroke="#f4c08e" stroke-width="6" fill="none" stroke-linecap="round"/><circle cy="-62" r="20" fill="#f4c08e" stroke="${OUT}" stroke-width="4"/><circle cy="-84" r="11" fill="#1c1420"/><path d="M-20,-66 Q0,-90 20,-66 Q0,-76 -20,-66Z" fill="#1c1420"/><circle cx="-7" cy="-60" r="2.4" fill="${OUT}"/><circle cx="7" cy="-60" r="2.4" fill="${OUT}"/><circle cy="-70" r="2.5" fill="#e0161a"/>`;
}
// Surya: radiant face
function surya(t, k = 1) {
  let r = ''; for (let i = 0; i < 16; i++) r += `<path d="M-16,-96 L0,${i % 2 ? -150 : -176} L16,-96Z" transform="rotate(${R(i * 22.5 + t * 12)})" fill="${i % 2 ? '#ff8a1e' : '#ffc21a'}" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/>`;
  return G(`scale(${k})`, `<circle r="190" fill="#fff3a0" opacity=".45" filter="url(#blur20)"/>` + r + `<circle r="100" fill="#ffd23c" stroke="${OUT}" stroke-width="6"/><circle r="84" fill="#ffe27a"/><path d="M-36,-4 Q-26,6 -16,-4 M16,-4 Q26,6 36,-4" stroke="${OUT}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-22,34 Q0,52 22,34" stroke="${OUT}" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="-40" cy="20" r="10" fill="#ff8a5a" opacity=".6"/><circle cx="40" cy="20" r="10" fill="#ff8a5a" opacity=".6"/><path d="M-30,-60 L-26,-84 L-12,-70 L0,-96 L12,-70 L26,-84 L30,-60Z" fill="#ffc21a" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/><circle cy="-30" r="5" fill="#c8281e"/>`);
}
// divine vimana: origin bottom centre, ~560 wide
function vimana(t) {
  let s = cloudPad(300) + `<rect x="-240" y="-60" width="480" height="50" rx="10" fill="#ffc21a" stroke="${OUT}" stroke-width="6"/>`;
  for (let i = 0; i < 6; i++) s += `<circle cx="${-200 + i * 80}" cy="-35" r="9" fill="${i % 2 ? '#c8281e' : '#3aa845'}" stroke="${OUT}" stroke-width="3"/>`;
  for (const x of [-210, 210]) s += `<rect x="${x - 14}" y="-420" width="28" height="360" fill="#ffc21a" stroke="${OUT}" stroke-width="5"/>`;
  s += `<rect x="-260" y="-450" width="520" height="40" rx="10" fill="#c8281e" stroke="${OUT}" stroke-width="6"/><path d="M-230,-450 C-220,-560 -110,-640 0,-680 C110,-640 220,-560 230,-450Z" fill="#ffc21a" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/><path d="M-170,-510 Q0,-480 170,-510 M-100,-590 Q0,-570 100,-590" stroke="${OUT}" stroke-width="4" fill="none" opacity=".5"/><circle cy="-694" r="16" fill="#ffc21a" stroke="${OUT}" stroke-width="5"/>`;
  for (const sd of [-1, 1]) s += `<path d="M${sd * 240},-430 L${R(sd * (300 + 10 * Math.sin(t * 5)))},-400 L${sd * 240},-380Z" fill="#ff7a12" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/>`;
  for (let i = 0; i < 7; i++) { const x = -180 + i * 60; s += `<path d="M${x},-410 L${x},-376" stroke="${OUT}" stroke-width="3"/><circle cx="${x}" cy="-370" r="8" fill="#ffc21a" stroke="${OUT}" stroke-width="3"/>`; }
  return s;
}
function mountainPeak(x, y, w, h, snow = 1) { // a single tall mountain (Mandarachal)
  return `<path d="M${x - w},${y} L${x - w * .2},${y - h * .9} L${x},${y - h} L${x + w * .25},${y - h * .86} L${x + w},${y}Z" fill="#8a6ab8" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/><path d="M${x},${y - h} L${x + w * .25},${y - h * .86} L${x + w},${y} L${x + w * .1},${y}Z" fill="#6a4a98" opacity=".7"/>` + (snow ? `<path d="M${x - w * .32},${y - h * .72} L${x - w * .2},${y - h * .9} L${x},${y - h} L${x + w * .25},${y - h * .86} L${x + w * .36},${y - h * .7} L${x + w * .2},${y - h * .76} L${x + w * .06},${y - h * .68} L${x - w * .1},${y - h * .78}Z" fill="#fff" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/>` : '');
}
const flowerRain = (t, a) => { let s = ''; for (let i = 0; i < 40; i++) { const ph = (t * (.25 + rnd(i) * .2) + rnd(i + 3)) % 1, x = rnd(i + 7) * 2100 - 100 + 40 * Math.sin(ph * 8 + i), y = -60 + ph * 1200; s += G(at(x, y, .7 + rnd(i + 2) * .5, ph * 360 + i * 40), `<path d="M0,0 C-8,-10 -6,-22 0,-26 C6,-22 8,-10 0,0Z" fill="${['#ff7a12', '#ffc21a', '#e8402e', '#ff9ab0'][i % 4]}" stroke="${OUT}" stroke-width="2"/>`, `opacity="${R(a)}"`); } return s; };

// ---------- papercut look: every cut-out layer casts a soft shadow on the layer behind it ----------
(function () {
  const big = ['shiva', 'parvati', 'vishnu', 'brahma', 'bhairava', 'rishi', 'king', 'ganesha', 'devotee', 'throne', 'vimana', 'gate', 'temple', 'akshayaPatra', 'house', 'tree', 'boat'];
  const small = ['cloudRow', 'cloudPad', 'spire', 'block', 'peaks', 'shivling', 'kund', 'mountainPeak', 'yogini', 'diya', 'scroll', 'crownIcon', 'chhatra'];
  for (const [names, f] of [[big, 'pc'], [small, 'pcs']]) for (const n of names) {
    const fn = window[n]; if (typeof fn !== 'function') continue;
    window[n] = function () { return `<g filter="url(#${f})">${fn.apply(this, arguments)}</g>`; };
  }
})();
