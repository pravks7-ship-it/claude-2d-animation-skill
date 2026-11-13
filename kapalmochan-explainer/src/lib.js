// ---------- helpers ----------
const OUT = '#3a1608';
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, u) => a + (b - a) * u;
const ease = u => (u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
const easeOut = u => 1 - Math.pow(1 - u, 3);
const backOut = u => { const c = 1.9; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
const prog = (t, a, b) => clamp((t - a) / (b - a));
const R = n => Math.round(n * 10) / 10;
const rnd = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
function mix(c1, c2, u) {
  u = clamp(u);
  const p = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const a = p(c1), b = p(c2);
  return '#' + a.map((v, i) => Math.round(lerp(v, b[i], u)).toString(16).padStart(2, '0')).join('');
}
function kf(t, keys) { // keys: [[time,[vals]],...]
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [ta, va] = keys[i], [tb, vb] = keys[i + 1];
    if (t <= tb) { const u = ease((t - ta) / (tb - ta)); return va.map((v, j) => lerp(v, vb[j], u)); }
  }
  return keys[keys.length - 1][1];
}
const G = (tr, inner, extra = '') => `<g transform="${tr}" ${extra}>${inner}</g>`;
const at = (x, y, s = 1, r = 0) => `translate(${R(x)},${R(y)}) rotate(${R(r)}) scale(${s})`;
const cam = (cx, cy, s, inner) => `<g transform="translate(960,540) scale(${s}) translate(${R(-cx)},${R(-cy)})">${inner}</g>`;
const blink = (t, seed = 0) => { const p = (t + seed * 1.7) % 3.6; return p < .14 ? Math.sin(p / .14 * Math.PI) : 0; };
const talk = t => clamp(.18 + .55 * Math.abs(Math.sin(t * 13)) * (.55 + .45 * Math.sin(t * 5.3 + 1)));
const txt = (x, y, s, size, fill, o = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${o.anchor || 'middle'}" font-family="'Baloo 2'" font-weight="800" font-size="${size}" fill="${fill}" stroke="${o.stroke || OUT}" stroke-width="${o.sw === undefined ? size * .14 : o.sw}" paint-order="stroke fill" stroke-linejoin="round">${s}</text>`;

function limb(pts, w, color, out = OUT) {
  const d = 'M' + pts.map(p => R(p[0]) + ',' + R(p[1])).join('L');
  return `<path d="${d}" fill="none" stroke="${out}" stroke-width="${w + 9}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
// arm: a1 = shoulder angle from straight-down (deg, + = outward), a2 = extra elbow bend
function arm(side, pose, color, o = {}) {
  const [a1, a2] = pose, w = o.w || 30, L1 = 92, L2 = 88, sx = side * 70, sy = -455, out = o.out || OUT;
  const r1 = a1 * Math.PI / 180, r2 = (a1 + a2) * Math.PI / 180;
  const ex = sx + side * Math.sin(r1) * L1, ey = sy + Math.cos(r1) * L1;
  const dx = side * Math.sin(r2), dy = Math.cos(r2);
  const hx = ex + dx * L2, hy = ey + dy * L2;
  const deg = Math.atan2(dy, dx) * 180 / Math.PI - 90; // rotation for objects pointing "along forearm" (default down)
  let s = limb([[sx, sy], [ex, ey], [hx, hy]], w, color, out);
  if (o.band) s += `<circle cx="${R(lerp(sx, ex, .55))}" cy="${R(lerp(sy, ey, .55))}" r="${w / 2 + 3}" fill="none" stroke="${o.band}" stroke-width="7"/>`;
  let hand = '';
  if (o.hand === 'palm') hand = G(at(hx, hy, 1, deg), `<path d="M-17,-6 L-17,30 Q-17,44 0,46 Q17,44 17,30 L17,-6Z" fill="${color}" stroke="${out}" stroke-width="4.5" stroke-linejoin="round"/><path d="M-6,22 L-6,42 M5,22 L5,43" stroke="${out}" stroke-width="3" opacity=".6"/><circle cx="${-side * 20}" cy="8" r="8" fill="${color}" stroke="${out}" stroke-width="4"/>`);
  else if (o.hand === 'point') hand = G(at(hx, hy, 1, deg), limb([[0, 0], [0, 40]], 11, color, out) + `<circle r="18" fill="${color}" stroke="${out}" stroke-width="4.5"/>`);
  else if (o.hand !== 'none') hand = `<circle cx="${R(hx)}" cy="${R(hy)}" r="18" fill="${color}" stroke="${out}" stroke-width="4.5"/>`;
  if (o.wrist) hand = `<circle cx="${R(hx - dx * 22)}" cy="${R(hy - dy * 22)}" r="${w / 2 + 2}" fill="none" stroke="${o.wrist}" stroke-width="7"/>` + hand;
  return { svg: s + hand, hx, hy, ex, ey, deg };
}

// ---------- face parts (origin = head centre) ----------
function eyes(o) {
  const { lid = 0, look = [0, 0], iris = '#2a1208', white = '#fff', ex = 20, ey = -2, rx = 12, ry = 8.5, irisR = 6, out = OUT } = o;
  let s = '';
  for (const sd of [-1, 1]) {
    if (o.only && o.only !== sd) continue;
    const x = sd * ex, h = ry * (1 - lid);
    if (lid > .82) { s += `<path d="M${x - rx},${ey} Q${x},${ey + 7} ${x + rx},${ey}" fill="none" stroke="${out}" stroke-width="4.5" stroke-linecap="round"/>`; continue; }
    s += `<ellipse cx="${x}" cy="${ey}" rx="${rx}" ry="${R(h)}" fill="${white}" stroke="${out}" stroke-width="3.5"/>`;
    const r = Math.min(h - .3, irisR), ix = x + look[0], iy = ey + look[1] * (h / ry);
    s += `<circle cx="${R(ix)}" cy="${R(iy)}" r="${R(r)}" fill="${iris}"/><circle cx="${R(ix + 2)}" cy="${R(iy - 2)}" r="${R(r * .3)}" fill="#fff"/>`;
    s += `<path d="M${x - rx - 1},${ey} Q${x},${R(ey - h * 1.7)} ${x + rx + 1},${ey}" fill="none" stroke="${out}" stroke-width="5" stroke-linecap="round"/>`;
  }
  return s;
}
function brows(b = 0, color = OUT, w = 6, y = -20, only = 0) {
  let s = '';
  for (const sd of [-1, 1]) { if (only && only !== sd) continue; s += `<path d="M${sd * 8},${R(y + b * 8)} Q${sd * 21},${R(y - 5 + b * 1)} ${sd * 34},${R(y - b * 5)}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`; }
  return s;
}
function mouth(o) {
  const { smile = 0, open = 0, y = 32, w = 13, out = OUT } = o;
  if (open > .08) return `<path d="M${-w},${y} Q0,${R(y - 4)} ${w},${y} Q0,${R(y + open * 30 + smile * 4)} ${-w},${y}Z" fill="#7a1410" stroke="${out}" stroke-width="3.5" stroke-linejoin="round"/>`;
  return `<path d="M${-w},${R(y - smile * 3)} Q0,${R(y + smile * 9)} ${w},${R(y - smile * 3)}" fill="none" stroke="${out}" stroke-width="4" stroke-linecap="round"/>`;
}
const nose = (out = OUT) => `<path d="M-1,5 q-8,12 3,15" fill="none" stroke="${out}" stroke-width="3.5" stroke-linecap="round"/>`;
const headBase = (skin, out = OUT, rx = 50, ry = 58) => `<ellipse cx="-50" cy="4" rx="9" ry="14" fill="${skin}" stroke="${out}" stroke-width="4"/><ellipse cx="50" cy="4" rx="9" ry="14" fill="${skin}" stroke="${out}" stroke-width="4"/><ellipse rx="${rx}" ry="${ry}" fill="${skin}" stroke="${out}" stroke-width="5"/>`;

// ---------- body parts (origin = feet centre, figure ~600 tall) ----------
const torso = (skin, out = OUT) => `<path d="M-18,-510 L-18,-470 L18,-470 L18,-510Z" fill="${skin}" stroke="${out}" stroke-width="5"/><path d="M-74,-452 Q-78,-480 -48,-480 L48,-480 Q78,-480 74,-452 L54,-292 L-54,-292 Z" fill="${skin}" stroke="${out}" stroke-width="5" stroke-linejoin="round"/>`;
const feet = (skin, out = OUT) => `<ellipse cx="-36" cy="-14" rx="30" ry="15" fill="${skin}" stroke="${out}" stroke-width="5"/><ellipse cx="36" cy="-14" rx="30" ry="15" fill="${skin}" stroke="${out}" stroke-width="5"/>`;
function dhoti(color, border, skin) {
  return feet(skin) + `<path d="M-56,-300 L56,-300 L76,-44 Q38,-24 0,-44 Q-38,-24 -76,-44 Z" fill="${color}" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><path d="M0,-296 L0,-48 M-22,-290 L-34,-60 M22,-290 L34,-60" stroke="${OUT}" stroke-width="3" opacity=".35" fill="none"/><path d="M-72,-70 Q-38,-50 0,-70 Q38,-50 72,-70" stroke="${border}" stroke-width="12" fill="none"/><rect x="-60" y="-314" width="120" height="24" rx="9" fill="${border}" stroke="${OUT}" stroke-width="5"/>`;
}
function seatLegs(color, border, skin) {
  return `<path d="M-170,-40 Q-170,-90 -60,-92 L60,-92 Q170,-90 170,-40 Q170,0 0,0 Q-170,0 -170,-40Z" fill="${color}" stroke="${OUT}" stroke-width="5"/><path d="M-120,-30 Q0,-70 120,-30" stroke="${OUT}" stroke-width="4" fill="none" opacity=".5"/><ellipse cx="-40" cy="-20" rx="30" ry="13" fill="${skin}" stroke="${OUT}" stroke-width="4"/><ellipse cx="40" cy="-20" rx="30" ry="13" fill="${skin}" stroke="${OUT}" stroke-width="4"/><rect x="-60" y="-104" width="120" height="22" rx="9" fill="${border}" stroke="${OUT}" stroke-width="5"/>`;
}
function shortWrap(color, skin, out, stripes, wk) {
  const a = wk === undefined ? 0 : Math.sin(wk), lL = Math.max(0, a) * 30, lR = Math.max(0, -a) * 30;
  const ft = (x, l) => `<ellipse cx="${x}" cy="${R(-14 - l)}" rx="30" ry="15" fill="${skin}" stroke="${out}" stroke-width="5"/>`;
  let s = limb([[-30, -300], [-32, -30 - lL]], 42, skin, out) + limb([[30, -300], [32, -30 - lR]], 42, skin, out) + ft(-36, lL) + ft(36, lR);
  s += `<path d="M-60,-306 L60,-306 L70,-176 L34,-150 L0,-180 L-34,-150 L-70,-176Z" fill="${color}" stroke="${out}" stroke-width="5" stroke-linejoin="round"/>`;
  if (stripes) for (let i = 0; i < 7; i++) { const x = -48 + i * 16, y = -280 + (i % 2) * 40; s += `<path d="M${x},${y} q6,14 -2,30" stroke="${stripes}" stroke-width="7" stroke-linecap="round" fill="none"/>`; }
  s += `<rect x="-62" y="-318" width="124" height="22" rx="9" fill="#e9b21c" stroke="${out}" stroke-width="5"/>`;
  return s;
}
function trishul(len = 660) {
  return `<path d="M0,0 L0,${-len}" stroke="${OUT}" stroke-width="17" stroke-linecap="round"/><path d="M0,0 L0,${-len}" stroke="#e9b21c" stroke-width="8" stroke-linecap="round"/>` +
    G(`translate(0,${-len})`, `<path d="M0,-120 L16,-60 L8,-20 L-8,-20 L-16,-60Z" fill="#f4f1e6" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><path d="M-10,-14 C-60,-10 -62,-70 -44,-108 C-40,-70 -34,-48 -8,-40Z M10,-14 C60,-10 62,-70 44,-108 C40,-70 34,-48 8,-40Z" fill="#f4f1e6" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><rect x="-22" y="-22" width="44" height="14" rx="6" fill="#e9b21c" stroke="${OUT}" stroke-width="4"/>`) +
    G(`translate(0,${-len + 40})`, `<path d="M-26,0 L26,0 L8,22 L26,44 L-26,44 L-8,22Z" fill="#c8281e" stroke="${OUT}" stroke-width="4.5" stroke-linejoin="round"/><path d="M26,10 q16,10 10,26" stroke="${OUT}" stroke-width="3" fill="none"/><circle cx="36" cy="38" r="5" fill="#e9b21c" stroke="${OUT}" stroke-width="2.5"/>`);
}

// ---------- SHIVA ----------
function shiva(o = {}) {
  const { t = 0, rage = 0, look = [0, 0], smile = 0, open = 0, tilt = 0, armL = [12, 6], armR = [50, -45], handL, handR, tSide = 1, noTrishul } = o;
  const skin = '#bfe1f5', lid = Math.max(o.lid || 0, blink(t, 1) * (1 - rage));
  const brow = o.brow === undefined ? rage * 1.1 : o.brow;
  let back = `<path d="M-60,-590 C-118,-550 -100,-450 -122,-388 C-96,-394 -82,-420 -74,-452 L74,-452 C82,-420 96,-394 122,-388 C100,-450 118,-550 60,-590 Z" fill="#2b1a14" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/>`;
  const aL = arm(-1, armL, skin, { hand: handL, band: '#7a3b12', wrist: '#7a3b12' }), aR = arm(1, armR, skin, { hand: handR, band: '#7a3b12', wrist: '#7a3b12' });
  const th = tSide > 0 ? aR : aL;
  const tri = noTrishul ? '' : G(`translate(${R(th.hx)},-12)`, trishul(690));
  let chest = `<path d="M-18,-494 L18,-494 L18,-478 Q0,-470 -18,-478Z" fill="#4f86d4" opacity=".9"/>`;
  for (let i = 0; i <= 12; i++) { const u = i / 12, x = lerp(-42, 42, u), y = -474 + 78 * (1 - Math.pow(2 * u - 1, 2)); chest += `<circle cx="${R(x)}" cy="${R(y)}" r="6.5" fill="#8a4a1c" stroke="${OUT}" stroke-width="2.5"/>`; }
  chest += limb([[-34, -482], [0, -462], [34, -482], [50, -500], [46, -522]], 12, '#6f9a3c') + `<ellipse cx="46" cy="-528" rx="11" ry="9" fill="#6f9a3c" stroke="${OUT}" stroke-width="4"/><circle cx="43" cy="-530" r="2" fill="${OUT}"/><circle cx="50" cy="-530" r="2" fill="${OUT}"/>`;
  const ir = mix('#2a1208', '#ff1500', rage), wh = mix('#ffffff', '#ffc9b0', rage);
  let head = '';
  if (rage > .05) head += `<circle cx="-20" cy="-2" r="26" fill="#ff2200" opacity="${R(rage * .55)}" filter="url(#blur8)"/><circle cx="20" cy="-2" r="26" fill="#ff2200" opacity="${R(rage * .55)}" filter="url(#blur8)"/>`;
  head = headBase(skin) + head;
  head += `<path d="M-52,-6 C-58,-78 58,-78 52,-6 C42,-58 -42,-58 -52,-6Z" fill="#2b1a14" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/>`;
  head += `<ellipse cx="0" cy="-84" rx="32" ry="28" fill="#2b1a14" stroke="${OUT}" stroke-width="5"/><path d="M-28,-66 Q0,-56 28,-66" stroke="#8a4a1c" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  head += G('translate(40,-96) rotate(25)', `<path d="M0,-20 A20,20 0 1,0 0,20 A14,16 0 1,1 0,-20Z" fill="#fff8d8" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/>`);
  head += `<path d="M-26,-39 L26,-39 M-28,-32 L28,-32 M-26,-25 L26,-25" stroke="#fff" stroke-width="3.6" stroke-linecap="round" opacity=".95"/>`;
  const te = rage;
  head += te > .15 ? `<ellipse cx="0" cy="-32" rx="${R(3 + 4 * te)}" ry="11" fill="#fff3c0" stroke="${OUT}" stroke-width="3.5"/><ellipse cx="0" cy="-32" rx="${R(1 + 2.5 * te)}" ry="7" fill="#ff1500"/>` : `<path d="M0,-42 L0,-22" stroke="${OUT}" stroke-width="4.5" stroke-linecap="round"/><ellipse cx="0" cy="-32" rx="3.5" ry="10" fill="#c8281e" stroke="${OUT}" stroke-width="2.5"/>`;
  head += eyes({ lid, look, iris: ir, white: wh }) + brows(brow) + nose() + mouth({ smile: smile - rage * .9, open });
  head += `<circle cx="-56" cy="22" r="8" fill="none" stroke="#e9b21c" stroke-width="5"/><circle cx="56" cy="22" r="8" fill="none" stroke="#e9b21c" stroke-width="5"/>`;
  return back + (tSide > 0 ? tri : '') + (tSide < 0 ? tri : '') + shortWrap('#f5a623', skin, OUT, '#3a1608', o.walk) + torso(skin) + chest + aL.svg + aR.svg + G(`translate(0,-545) rotate(${tilt},0,55)`, head);
}

// ---------- VISHNU ----------
function chakra(t) {
  let s = `<circle r="34" fill="#ffd23c" stroke="${OUT}" stroke-width="5"/><circle r="20" fill="#ff9d2e" stroke="${OUT}" stroke-width="4"/>`;
  for (let i = 0; i < 8; i++) s += `<path d="M0,-34 L7,-46 L0,-40 L-7,-46Z" transform="rotate(${i * 45})" fill="#ffd23c" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/><path d="M0,-7 L0,-20" transform="rotate(${i * 45})" stroke="${OUT}" stroke-width="3"/>`;
  return G(`rotate(${R(t * 140)})`, s) + `<circle r="7" fill="#c8281e" stroke="${OUT}" stroke-width="3"/>`;
}
const shankh = () => `<path d="M0,-44 C30,-36 34,6 12,30 C6,42 -2,50 -6,58 C-10,40 -30,26 -28,-4 C-27,-28 -14,-42 0,-44Z" fill="#fff8ea" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><path d="M-16,-22 Q4,-14 20,-22 M-22,0 Q2,10 24,-2 M-14,22 Q0,28 14,20" stroke="${OUT}" stroke-width="3" fill="none" opacity=".6"/>`;
function vishnu(o = {}) {
  const { t = 0, look = [0, 0], brow = 0, smile = 0, open = 0, tilt = 0, pray = true, bow = 0 } = o;
  const skin = '#4f8be0', lid = Math.max(o.lid || 0, blink(t, 2));
  const bL = arm(-1, [118, 62], skin, { band: '#ffd23c', wrist: '#ffd23c' }), bR = arm(1, [118, 62], skin, { band: '#ffd23c', wrist: '#ffd23c' });
  let back = `<path d="M-58,-585 C-100,-560 -100,-470 -92,-440 L92,-440 C100,-470 100,-560 58,-585Z" fill="#1c1420" stroke="${OUT}" stroke-width="5"/>` + bL.svg + bR.svg + G(at(bL.hx, bL.hy - 44), chakra(t)) + G(at(bR.hx + 4, bR.hy - 40, .95), shankh());
  const pa = pray ? [22, -146] : [10, 6];
  const aL = arm(-1, o.armL || pa, skin, { band: '#ffd23c', wrist: '#ffd23c', hand: pray ? 'none' : undefined }), aR = arm(1, o.armR || pa, skin, { band: '#ffd23c', wrist: '#ffd23c', hand: pray ? 'none' : undefined });
  let chest = `<path d="M-54,-474 Q-78,-330 0,-306 Q78,-330 54,-474" fill="none" stroke="${OUT}" stroke-width="20" stroke-linecap="round"/><path d="M-54,-474 Q-78,-330 0,-306 Q78,-330 54,-474" fill="none" stroke="#3f9b46" stroke-width="12" stroke-linecap="round"/>`;
  for (let i = 0; i <= 10; i++) { const u = i / 10, a = Math.PI * u; chest += `<circle cx="${R(-66 * Math.cos(a))}" cy="${R(-474 + 166 * Math.sin(a) * (0.9 + .1 * Math.sin(a)))}" r="6" fill="${i % 2 ? '#ffd23c' : '#ff5a3c'}" stroke="${OUT}" stroke-width="2"/>`; }
  chest += `<path d="M-30,-478 Q0,-446 30,-478" fill="none" stroke="${OUT}" stroke-width="13"/><path d="M-30,-478 Q0,-446 30,-478" fill="none" stroke="#ffd23c" stroke-width="7"/><circle cx="0" cy="-458" r="8" fill="#c8281e" stroke="${OUT}" stroke-width="3"/>`;
  const hands = pray ? G(at(0, (aL.hy + aR.hy) / 2 + 4), `<path d="M-15,16 L-12,-26 Q0,-48 12,-26 L15,16 Q0,24 -15,16Z" fill="${skin}" stroke="${OUT}" stroke-width="4.5" stroke-linejoin="round"/><path d="M0,-38 L0,18" stroke="${OUT}" stroke-width="3"/>`) : '';
  let head = headBase(skin);
  head += `<path d="M-52,-10 C-54,-52 54,-52 52,-10 C40,-40 -40,-40 -52,-10Z" fill="#1c1420" stroke="${OUT}" stroke-width="4"/>`;
  head += `<path d="M-50,-40 C-56,-110 -24,-158 0,-176 C24,-158 56,-110 50,-40Z" fill="#ffc21a" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><path d="M-46,-78 Q0,-64 46,-78 M-36,-116 Q0,-104 36,-116" stroke="${OUT}" stroke-width="3.5" fill="none"/><ellipse cx="0" cy="-92" rx="10" ry="13" fill="#c8281e" stroke="${OUT}" stroke-width="3.5"/><circle cx="0" cy="-184" r="10" fill="#ffd23c" stroke="${OUT}" stroke-width="4"/><rect x="-56" y="-52" width="112" height="18" rx="8" fill="#ffd23c" stroke="${OUT}" stroke-width="4.5"/>`;
  head += `<path d="M-7,-30 L-7,-18 Q0,-10 7,-18 L7,-30" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M0,-30 L0,-17" stroke="#c8281e" stroke-width="3.5" stroke-linecap="round"/>`;
  head += eyes({ lid, look }) + brows(brow, '#1c1420') + nose() + mouth({ smile, open });
  head += `<circle cx="-57" cy="24" r="10" fill="#ffd23c" stroke="${OUT}" stroke-width="4"/><circle cx="57" cy="24" r="10" fill="#ffd23c" stroke="${OUT}" stroke-width="4"/>`;
  return back + dhoti('#ffd21f', '#c8281e', skin) + torso(skin) + chest + aL.svg + aR.svg + hands + G(`translate(0,${-545 + bow * 14}) rotate(${tilt},0,55)`, head);
}

// ---------- BRAHMA ----------
function brahmaHead(o) { // front head
  const { skin, lid = 0, look = [0, 0], brow = 0, smile = 0, open = 0, shortBeard, noCrown } = o;
  const tip = shortBeard ? 84 : 118;
  let s = headBase(skin);
  s += eyes({ lid, look }) + brows(brow, '#fff', 7) + brows(brow, OUT, 2.5) + nose();
  s += `<path d="M-51,-2 C-54,${tip * .55} -24,${tip * .86} 0,${tip} C24,${tip * .86} 54,${tip * .55} 51,-2 C40,46 22,50 0,46 C-22,50 -40,46 -51,-2Z" fill="#fff8ec" stroke="${OUT}" stroke-width="4.5" stroke-linejoin="round"/>`;
  s += mouth({ smile, open, y: 31, w: 10 });
  s += `<path d="M0,22 C-8,18 -22,22 -27,32 C-16,31 -6,30 0,26 C6,30 16,31 27,32 C22,22 8,18 0,22Z" fill="#fff8ec" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round"/>`;
  s += `<path d="M-52,-8 C-56,-66 56,-66 52,-8 C42,-46 -42,-46 -52,-8Z" fill="#fff8ec" stroke="${OUT}" stroke-width="4.5" stroke-linejoin="round"/>`;
  s += `<circle cx="0" cy="-26" r="5" fill="#c8281e"/>`;
  if (!noCrown) s += `<path d="M-54,-42 L-54,-70 L-34,-58 L-18,-92 L0,-64 L18,-92 L34,-58 L54,-70 L54,-42Z" fill="#ffc21a" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><circle cx="0" cy="-52" r="6" fill="#c8281e" stroke="${OUT}" stroke-width="2.5"/>`;
  return s;
}
function brahmaSide(skin, sd, lid, brow) {
  let s = `<ellipse rx="46" ry="56" fill="${skin}" stroke="${OUT}" stroke-width="5"/><path d="M${sd * 44},-4 l${sd * 14},16 l${-sd * 12},6Z" fill="${skin}" stroke="${OUT}" stroke-width="4.5" stroke-linejoin="round"/>`;
  s += G(`translate(${sd * 4},0)`, eyes({ lid, only: sd, ex: 22, rx: 10, look: [sd * 2, 0] }) + brows(brow, '#fff', 6, -20, sd));
  s += `<path d="M${-sd * 30},0 C${-sd * 30},70 0,96 ${sd * 14},104 C${sd * 34},84 ${sd * 48},50 ${sd * 46},14 C${sd * 30},44 0,40 ${-sd * 30},0Z" fill="#fff8ec" stroke="${OUT}" stroke-width="4.5" stroke-linejoin="round"/>`;
  s += `<path d="M${sd * 20},32 l${sd * 14},0" stroke="${OUT}" stroke-width="3.5" stroke-linecap="round"/>`;
  s += `<path d="M-48,-40 L-48,-66 L-24,-54 L0,-84 L24,-54 L48,-66 L48,-40Z" fill="#ffc21a" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/>`;
  return s;
}
function brahma(o = {}) {
  const { t = 0, look = [0, 0], brow = 0, smile = 0, open = 0, tilt = 0, fifth = 1, fifthOpen = 0, sit, armL = [14, 8], armR = [14, 8], handL, handR, sideLid = 0, held = '' } = o;
  const skin = '#f6cfa3', lid = Math.max(o.lid || 0, blink(t, 3));
  const bL = arm(-1, [112, 66], skin, { wrist: '#ffd23c' }), bR = arm(1, [112, 66], skin, { wrist: '#ffd23c' });
  let back = bL.svg + bR.svg + G(at(bL.hx, bL.hy - 34, 1, -8), `<rect x="-26" y="-22" width="52" height="44" rx="5" fill="#a85a1e" stroke="${OUT}" stroke-width="4.5"/><path d="M-16,-8 L16,-8 M-16,4 L16,4" stroke="#ffd23c" stroke-width="3"/>`) + G(at(bR.hx, bR.hy - 30), `<path d="M-18,0 Q-22,-26 0,-28 Q22,-26 18,0 Q20,18 0,20 Q-20,18 -18,0Z" fill="#e9b21c" stroke="${OUT}" stroke-width="4.5"/><rect x="-9" y="-40" width="18" height="12" rx="3" fill="#e9b21c" stroke="${OUT}" stroke-width="4"/><path d="M-9,-40 Q0,-60 9,-40" fill="none" stroke="${OUT}" stroke-width="4"/>`);
  const aL = arm(-1, armL, skin, { hand: handL, wrist: '#ffd23c' }), aR = arm(1, armR, skin, { hand: handR, wrist: '#ffd23c' });
  let chest = `<path d="M-70,-470 Q-20,-380 50,-300" fill="none" stroke="${OUT}" stroke-width="9"/><path d="M-70,-470 Q-20,-380 50,-300" fill="none" stroke="#fff8ec" stroke-width="4.5"/>`;
  chest += `<path d="M48,-480 Q84,-470 76,-440 L20,-296 L54,-292 Z" fill="#fff0cf" stroke="${OUT}" stroke-width="4.5" stroke-linejoin="round"/>`;
  let heads = '';
  heads += G('translate(-60,6) scale(.9)', brahmaSide(skin, -1, Math.max(lid, sideLid), brow)) + G('translate(60,6) scale(.9)', brahmaSide(skin, 1, Math.max(lid, sideLid), brow));
  if (fifth > 0) heads += G(`translate(0,-142) scale(.8)`, brahmaHead({ skin, lid: Math.max(o.fifthLid || 0, blink(t, 5)), look, brow: o.fifthBrow || 0, open: fifthOpen, shortBeard: true }), `opacity="${fifth}"`);
  heads += brahmaHead({ skin, lid, look, brow, smile, open });
  const up = torso(skin) + chest + aL.svg + aR.svg + held + G(`translate(0,-545) rotate(${tilt},0,55)`, heads);
  return sit ? G('translate(0,252)', back) + seatLegs('#c8281e', '#ffd23c', skin) + G('translate(0,252)', up) : back + dhoti('#c8281e', '#ffd23c', skin) + up;
}

// ---------- BHAIRAVA ----------
const BO = '#100d1c';
function skull(glow = 0) {
  return (glow ? `<circle r="52" fill="#fff3a0" opacity="${R(glow * .7)}" filter="url(#blur8)"/>` : '') + `<path d="M-30,-6 C-30,-44 30,-44 30,-6 C30,10 22,16 20,20 L20,34 L-20,34 L-20,20 C-22,16 -30,10 -30,-6Z" fill="#fbf4e2" stroke="${BO}" stroke-width="4.5" stroke-linejoin="round"/><ellipse cx="-12" cy="-4" rx="8" ry="9" fill="${BO}"/><ellipse cx="12" cy="-4" rx="8" ry="9" fill="${BO}"/><path d="M0,8 l-4,9 l8,0Z" fill="${BO}"/><path d="M-10,22 L-10,34 M0,22 L0,34 M10,22 L10,34" stroke="${BO}" stroke-width="3"/>`;
}
function bhairava(o = {}) {
  const { t = 0, look = [0, 0], open = 0, tilt = 0, armL = [16, 10], armR = [16, 10], sword = 0, skullOn = 0, brow = 1, held = '' } = o;
  const skin = '#3c3b78', lid = o.lid || 0;
  const aL = arm(-1, armL, skin, { out: BO, band: '#e9b21c', wrist: '#e9b21c' }), aR = arm(1, armR, skin, { out: BO, band: '#e9b21c', wrist: '#e9b21c' });
  const sa = sword > 0 ? aR : aL;
  const sw = sword ? G(at(sa.hx, sa.hy, 1, sa.deg), `<path d="M-13,26 L-15,190 L0,236 L15,190 L13,26Z" fill="#eef1f4" stroke="${BO}" stroke-width="5" stroke-linejoin="round"/><path d="M0,34 L0,214" stroke="${BO}" stroke-width="2.5" opacity=".4"/><rect x="-30" y="14" width="60" height="14" rx="6" fill="#e9b21c" stroke="${BO}" stroke-width="4.5"/><rect x="-8" y="-26" width="16" height="42" rx="6" fill="#8a4a1c" stroke="${BO}" stroke-width="4.5"/>`) : '';
  let hair = '', pts = [], pts2 = [];
  for (let i = 0; i <= 14; i++) {
    const a = (-112 + i * 16) * Math.PI / 180, tipR = i % 2 ? 122 + 16 * Math.sin(t * 9 + i * 2.1) : 62;
    pts.push([R(Math.sin(a) * tipR), R(-Math.cos(a) * tipR - 6)]);
    const r2 = i % 2 ? 92 + 12 * Math.sin(t * 11 + i * 1.3) : 54; pts2.push([R(Math.sin(a) * r2), R(-Math.cos(a) * r2 - 6)]);
  }
  hair = `<path d="M${pts.join('L')}Z" fill="#ff5a00" stroke="${BO}" stroke-width="5" stroke-linejoin="round"/><path d="M${pts2.join('L')}Z" fill="#ffb21c"/>`;
  let chest = '';
  for (let i = 0; i <= 8; i++) { const u = i / 8, x = lerp(-56, 56, u), y = -470 + 120 * (1 - Math.pow(2 * u - 1, 2)); chest += `<circle cx="${R(x)}" cy="${R(y)}" r="11" fill="#fbf4e2" stroke="${BO}" stroke-width="3"/><circle cx="${R(x - 3.5)}" cy="${R(y - 1)}" r="2.2" fill="${BO}"/><circle cx="${R(x + 3.5)}" cy="${R(y - 1)}" r="2.2" fill="${BO}"/>`; }
  let head = hair + headBase(skin, BO, 54, 60);
  head += eyes({ lid, look, iris: '#e0160a', rx: 15, ry: 13, irisR: 6.5, ex: 22, ey: -4, out: BO }) + brows(brow, '#ff7a1a', 9, -26);
  head += `<ellipse cx="0" cy="-36" rx="5" ry="9" fill="#ffd23c" stroke="${BO}" stroke-width="3"/><circle cx="0" cy="-36" r="3" fill="#e0160a"/>`;
  head += nose(BO);
  const my = 34;
  if (open > .08) head += `<path d="M-20,${my} Q0,${my - 6} 20,${my} Q${R(22 + open * 4)},${R(my + open * 34)} 0,${R(my + open * 40)} Q${R(-22 - open * 4)},${R(my + open * 34)} -20,${my}Z" fill="#8f1420" stroke="${BO}" stroke-width="4" stroke-linejoin="round"/>`;
  else head += `<path d="M-18,${R(my + 2 - (o.smile || 0) * 6)} Q0,${R(my - 6 + (o.smile || 0) * 20)} 18,${R(my + 2 - (o.smile || 0) * 6)}" fill="none" stroke="${BO}" stroke-width="4.5" stroke-linecap="round"/>`;
  head += `<path d="M-15,${my} l4,13 l5,-12Z M15,${my} l-4,13 l-5,-12Z" fill="#fff" stroke="${BO}" stroke-width="2.5" stroke-linejoin="round"/>`;
  head += `<path d="M0,22 C-10,16 -28,20 -38,34 C-24,30 -10,30 0,27 C10,30 24,30 38,34 C28,20 10,16 0,22Z" fill="${BO}"/>`;
  head += `<circle cx="-60" cy="24" r="9" fill="none" stroke="#e9b21c" stroke-width="5"/><circle cx="60" cy="24" r="9" fill="none" stroke="#e9b21c" stroke-width="5"/>`;
  const sk = skullOn ? G(at(aL.hx, aL.hy - 4, 1.05, -8), skull(skullOn)) : '';
  return (sword ? '' : '') + shortWrap('#a3161f', skin, BO, '#5e0b12', o.walk) + torso(skin, BO) + chest + sw + aL.svg + aR.svg + sk + held + G(`translate(0,-545) rotate(${tilt},0,55)`, head);
}
const armHand = (side, pose) => { const a = arm(side, pose, '#000'); return [a.hx, a.hy]; };

// ---------- rishi (seated) ----------
function rishi(o = {}) {
  const skin = o.skin || '#d99a66', t = o.t || 0;
  const aL = arm(-1, o.armL || [24, -140], skin, {}), aR = arm(1, o.armR || [24, -140], skin, {});
  let head = headBase(skin) + eyes({ lid: Math.max(.85 * (o.closed ? 1 : 0), blink(t, o.seed || 4)), look: o.look || [0, 0] }) + brows(0) + nose() +
    `<path d="M-51,0 C-52,60 -20,86 0,96 C20,86 52,60 51,0 C40,44 -40,44 -51,0Z" fill="${o.hair || '#4a2a18'}" stroke="${OUT}" stroke-width="4.5" stroke-linejoin="round"/>` + mouth({ open: o.open || 0, y: 30, w: 9 }) +
    `<path d="M-52,-8 C-56,-70 56,-70 52,-8 C42,-50 -42,-50 -52,-8Z" fill="${o.hair || '#4a2a18'}" stroke="${OUT}" stroke-width="4.5"/><ellipse cx="0" cy="-80" rx="26" ry="24" fill="${o.hair || '#4a2a18'}" stroke="${OUT}" stroke-width="4.5"/><path d="M-12,-34 L12,-34 M-13,-28 L13,-28" stroke="#fff" stroke-width="3" opacity=".9"/>`;
  const up = torso(skin) + `<path d="M-74,-452 Q-78,-480 -48,-480 L-10,-480 L54,-292 L-54,-292Z" fill="#ff8a1e" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/>` + aL.svg + aR.svg + G('translate(0,-545)', head);
  return seatLegs('#ff8a1e', '#c8281e', skin) + G('translate(0,252)', up);
}

// ---------- props ----------
function flame(t, seed = 0, colors = ['#ff4a00', '#ffa41c', '#ffe66b']) {
  let s = '';
  [1, .66, .36].forEach((k, i) => {
    const w = 10 * Math.sin(t * 9 + seed * 3 + i * 1.7), w2 = 8 * Math.sin(t * 13 + seed + i);
    s += G(`scale(${k})`, `<path d="M0,0 C-52,-6 -58,-62 -24,-96 C-26,-74 -14,-64 -6,-70 C-14,-104 ${R(-6 + w)},-128 ${R(4 + w)},-150 C${R(8 + w2)},-116 34,-104 26,-80 C36,-84 40,-96 38,-108 C62,-70 54,-6 0,0Z" fill="${colors[i]}" ${i === 0 ? 'stroke="#b82a00" stroke-width="5" stroke-linejoin="round"' : ''}/>`);
  });
  return s;
}
function pillar(t, x, w, o = {}) {
  const cols = ['#ff4a00', '#ff8a12', '#ffc93c', '#fff6c8'], ws = [1, .74, .46, .2];
  let s = `<rect x="${x - w * 1.3}" y="-700" width="${w * 2.6}" height="2500" fill="#ffe27a" opacity=".5" filter="url(#blur40)"/>`;
  ws.forEach((k, i) => {
    const L = [], Rr = [];
    for (let y = -700; y <= 1800; y += 28) {
      const wob = (ph) => (18 - i * 3) * Math.sin(y * .018 - t * (4.5 + i) + ph + i) + (9 - i * 2) * Math.sin(y * .047 + t * (7 + i * 2) + ph * 2);
      L.push([R(x - w * k / 2 + wob(0)), y]); Rr.unshift([R(x + w * k / 2 + wob(2.2)), y]);
    }
    s += `<path d="M${L.concat(Rr).join('L')}Z" fill="${cols[i]}" ${i === 0 ? 'stroke="#c22e00" stroke-width="5"' : ''}/>`;
  });
  for (let i = 0; i < 16; i++) {
    const ph = (t * (.28 + rnd(i) * .2) + rnd(i + 9)) % 1, y = 1250 - ph * 1500, sd = i % 2 ? 1 : -1, k = .5 + rnd(i + 3) * .7;
    s += G(at(x + sd * (w / 2 + 6 + 14 * Math.sin(ph * 9 + i)), y, k, sd * 12), flame(t, i, ['#ff5a00', '#ff9a12', '#ffd84a']));
  }
  return s;
}
function embers(t, cx, spread, n = 36, color = '#ffd84a') {
  let s = '';
  for (let i = 0; i < n; i++) {
    const ph = (t * (.12 + rnd(i) * .16) + rnd(i + 5)) % 1, x = cx + (rnd(i + 11) - .5) * spread * 2 + 30 * Math.sin(t * 2 + i), y = 1100 - ph * 1200;
    s += `<circle cx="${R(x)}" cy="${R(y)}" r="${R(3 + rnd(i + 2) * 5)}" fill="${color}" opacity="${R(Math.sin(ph * Math.PI) * .9)}"/>`;
  }
  return s;
}
function cloudRow(y, r, color, off, x0 = -1100, x1 = 3100) {
  let d = `M${x0},${y}`, n = Math.ceil((x1 - x0) / (r * 1.6));
  for (let i = 0; i < n; i++) { const rr = r * (.8 + .4 * rnd(i + r)); d += `a${R(rr)},${R(rr)} 0 0 1 ${R(r * 1.6)},0`; }
  return G(`translate(${R(off % (r * 1.6))},0)`, `<path d="${d} L${x1 + 200},${y + 900} L${x0},${y + 900}Z" fill="${color}" stroke="${OUT}" stroke-width="4.5" stroke-linejoin="round"/>`);
}
const MOODS = [
  { c: '#ffe07a', m: '#ff9d2e', e: '#d9480f', cl: ['#ffe9bd', '#ffcf86', '#ffb35c'], ray: '#fff6c8' },
  { c: '#ff7a1a', m: '#b81c10', e: '#3d0512', cl: ['#d9482a', '#a8281c', '#701418'], ray: '#ffb03c' },
  { c: '#fff6cf', m: '#ffc956', e: '#ee861c', cl: ['#fff6df', '#ffe5aa', '#ffcd74'], ray: '#ffffff' },
];
function moodAt(m) {
  const i = Math.min(1, Math.floor(m)), u = clamp(m - i), a = MOODS[i], b = MOODS[i + 1];
  return { c: mix(a.c, b.c, u), m: mix(a.m, b.m, u), e: mix(a.e, b.e, u), cl: a.cl.map((c, j) => mix(c, b.cl[j], u)), ray: mix(a.ray, b.ray, u) };
}
function bg(t, m, o = {}) {
  const M = typeof m === 'number' ? moodAt(m) : m, cx = o.cx === undefined ? 960 : o.cx, cy = o.cy === undefined ? 520 : o.cy;
  let s = `<defs><radialGradient id="bgG" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="1500"><stop offset="0" stop-color="${M.c}"/><stop offset=".42" stop-color="${M.m}"/><stop offset="1" stop-color="${M.e}"/></radialGradient></defs><rect x="-1500" y="-1200" width="4920" height="3500" fill="url(#bgG)"/>`;
  let rays = '';
  for (let i = 0; i < 14; i++) rays += `<path d="M0,0 L-190,-2600 L190,-2600Z" transform="rotate(${R(i * (360 / 14))})" fill="${M.ray}"/>`;
  s += G(`translate(${cx},${cy}) rotate(${R(t * 4)})`, rays, `opacity="${o.rays === undefined ? .13 : o.rays}"`);
  for (let i = 0; i < 46; i++) { const x = -400 + rnd(i) * 2720, y = -200 + rnd(i + 50) * 900; s += `<circle cx="${R(x)}" cy="${R(y)}" r="${R(2 + rnd(i + 7) * 3)}" fill="#fff8d8" opacity="${R(.25 + .35 * Math.abs(Math.sin(t * 1.5 + i)))}"/>`; }
  return s;
}
function clouds(t, m, y = 900) {
  const M = typeof m === 'number' ? moodAt(m) : m;
  return cloudRow(y - 70, 95, M.cl[2], t * 8) + cloudRow(y - 10, 80, M.cl[1], -t * 13 + 60) + cloudRow(y + 60, 110, M.cl[0], t * 20 + 30);
}
function ketaki(t, o = {}) {
  const { open = 0, lid = 0 } = o;
  let s = limb([[0, 20], [10, 400], [-10, 900]], 16, '#4e9a3a');
  s += `<path d="M6,300 C80,250 150,270 190,210 C150,330 80,350 8,330Z M0,420 C-80,380 -150,400 -200,330 C-160,460 -80,470 0,450Z" fill="#5fae45" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/>`;
  for (let i = 0; i < 9; i++) { const a = -120 + i * 30 + 3 * Math.sin(t * 2.2 + i); s += `<path d="M0,0 C-30,-46 -22,-128 0,-176 C22,-128 30,-46 0,0Z" transform="rotate(${R(a)})" fill="${i % 2 ? '#fff9e3' : '#fff1c4'}" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/>`; }
  s += `<circle r="50" fill="#ffd23c" stroke="${OUT}" stroke-width="5"/>`;
  s += G('scale(.82)', eyes({ lid: Math.max(lid, blink(t, 6)), ex: 18, ey: -8, look: o.look || [0, 0] }) + brows(o.brow || 0, OUT, 5, -26) + mouth({ open, y: 18, w: 12, smile: .6 })) + `<circle cx="-30" cy="10" r="7" fill="#ff9d5c" opacity=".7"/><circle cx="30" cy="10" r="7" fill="#ff9d5c" opacity=".7"/>`;
  return s;
}
function temple(o = {}) {
  const { wall = '#fff3da', spire = '#d8401e', gold = '#ffc21a', out = OUT, flag = '#ff7a12', t = 0 } = o;
  return `<rect x="-120" y="-30" width="240" height="30" fill="${wall}" stroke="${out}" stroke-width="5"/><rect x="-100" y="-150" width="200" height="120" fill="${wall}" stroke="${out}" stroke-width="5"/><path d="M-28,-30 L-28,-92 Q0,-124 28,-92 L28,-30Z" fill="#5a1d0c" stroke="${out}" stroke-width="5"/><rect x="-82" y="-136" width="18" height="106" fill="${o.pillar || '#5fa8d8'}" stroke="${out}" stroke-width="4"/><rect x="64" y="-136" width="18" height="106" fill="${o.pillar || '#5fa8d8'}" stroke="${out}" stroke-width="4"/><rect x="-112" y="-166" width="224" height="20" rx="4" fill="${gold}" stroke="${out}" stroke-width="5"/><path d="M-84,-166 C-80,-270 -40,-350 0,-390 C40,-350 80,-270 84,-166Z" fill="${spire}" stroke="${out}" stroke-width="5" stroke-linejoin="round"/><path d="M-70,-220 Q0,-200 70,-220 M-52,-280 Q0,-262 52,-280 M-30,-336 Q0,-324 30,-336" stroke="${out}" stroke-width="3.5" fill="none" opacity=".55"/><circle cx="0" cy="-402" r="15" fill="${gold}" stroke="${out}" stroke-width="5"/><path d="M0,-417 L0,-480" stroke="${out}" stroke-width="5"/><path d="M0,-480 L${R(46 + 5 * Math.sin(t * 5))},${R(-468 + 4 * Math.sin(t * 6))} L0,-452Z" fill="${flag}" stroke="${out}" stroke-width="4" stroke-linejoin="round"/>`;
}
const kund = () => `<path d="M-150,0 L150,0 L130,-40 L-130,-40Z M-126,-40 L126,-40 L108,-78 L-108,-78Z M-104,-78 L104,-78 L88,-112 L-88,-112Z" fill="#c4541f" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><path d="M-110,-20 L110,-20 M-90,-59 L90,-59 M-72,-95 L72,-95" stroke="#ffd23c" stroke-width="5" stroke-dasharray="14 12"/>`;
const shivling = () => `<path d="M-80,0 L80,0 L70,-30 L-70,-30Z" fill="#6d6875" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><path d="M-100,-30 Q-100,-56 -60,-56 L96,-56 L120,-44 L96,-30Z" fill="#8d8896" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><path d="M-44,-52 L-44,-130 Q-44,-176 0,-176 Q44,-176 44,-130 L44,-52Z" fill="#3b3742" stroke="${OUT}" stroke-width="5"/><path d="M-26,-128 L26,-128 M-28,-116 L28,-116 M-26,-104 L26,-104" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cx="0" cy="-116" r="6" fill="#c8281e"/>`;
function miniKetaki() { let s = ''; for (let i = 0; i < 7; i++) s += `<path d="M0,0 C-12,-18 -9,-48 0,-66 C9,-48 12,-18 0,0Z" transform="rotate(${-105 + i * 35})" fill="#fff9e3" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round"/>`; return s + `<circle r="14" fill="#ffd23c" stroke="${OUT}" stroke-width="3.5"/>`; }
function medallion(x, y, r, inner, mark, p, label) {
  if (p <= 0) return '';
  const s = backOut(clamp(p * 2.2));
  let m = '';
  const mp = clamp((p - .45) * 3);
  if (mark === 'x' && mp > 0) m = G(`scale(${R(backOut(mp))})`, `<path d="M-${r * .62},-${r * .62} L${r * .62},${r * .62} M${r * .62},-${r * .62} L-${r * .62},${r * .62}" stroke="${OUT}" stroke-width="40" stroke-linecap="round"/><path d="M-${r * .62},-${r * .62} L${r * .62},${r * .62} M${r * .62},-${r * .62} L-${r * .62},${r * .62}" stroke="#e02414" stroke-width="26" stroke-linecap="round"/>`, 'opacity=".93"');
  if (mark === 'ok' && mp > 0) m = G(`translate(${r * .62},${r * .62}) scale(${R(backOut(mp))})`, `<circle r="52" fill="#3aa845" stroke="${OUT}" stroke-width="6"/><path d="M-24,2 L-6,20 L26,-18" fill="none" stroke="#fff" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>`);
  const lab = label ? G(`translate(0,${r + 78})`, txt(0, 0, label, 50, '#fff8e0', { sw: 11 }), `opacity="${R(clamp((p - .3) * 4))}"`) : '';
  return G(at(x, y, R(s)), `<circle r="${r}" fill="#fff3d4" stroke="${OUT}" stroke-width="16"/><circle r="${r}" fill="none" stroke="#e9a21c" stroke-width="8"/><clipPath id="mc${x}"><circle r="${r - 6}"/></clipPath><g clip-path="url(#mc${x})">${inner}</g>${m}`) + G(at(x, y), lab);
}
const DEFS = `<defs><filter id="blur8" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="8"/></filter><filter id="blur20" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="20"/></filter><filter id="blur40" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="40"/></filter></defs>`;
const vignette = (a = .35) => `<defs><radialGradient id="vg" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#2a0508" stop-opacity="0"/><stop offset="1" stop-color="#2a0508" stop-opacity="${a}"/></radialGradient></defs><rect width="1920" height="1080" fill="url(#vg)"/>`;
