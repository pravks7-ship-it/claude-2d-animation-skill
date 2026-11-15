// ---------- episode 2 additions ----------
// Bhairava carrying the kapala (skull) on his raised hand
const K_ARM = [82, 48];
function bhK(o = {}) {
  const armR = o.armR || K_ARM, h = armHand(1, armR);
  const sk = o.noSkull ? '' : G(at(h[0] + 6, h[1] - 6, 1.25, 12 + (o.skRot || 0)), skull(o.glow || 0));
  return bhairava({ ...o, armR, held: sk + (o.held || '') });
}
const kHand = (x, y, s, armR = K_ARM) => { const h = armHand(1, armR); return [x + h[0] * s, y + h[1] * s]; };

// the sin of brahma-hatya as a dark shadow
function shadowFig(t, o = {}) {
  const { fear = 0, reach = 0, alpha = .93 } = o, C = '#170b20';
  const L = [], Rr = [];
  for (let y = 0; y >= -470; y -= 36) {
    const k = -y / 470, w = 165 - 45 * k;
    L.push([R(-w + 16 * Math.sin(y * .03 + t * 3.1) * (1 - k * .5)), y]);
    Rr.unshift([R(w + 16 * Math.sin(y * .03 + t * 2.7 + 2) * (1 - k * .5)), y]);
  }
  let bot = ''; for (let i = 0; i <= 8; i++) bot += `L${R(165 - i * 41.25)},${R(i % 2 ? 50 + 18 * Math.sin(t * 4 + i) : 0)}`;
  const body = `M${L.join('L')} C-120,-520 -70,-520 -62,-560 C-112,-640 -72,-724 0,-724 C72,-724 112,-640 62,-560 C70,-520 120,-520 ${Rr[0].join(',')} L${Rr.slice(1).join('L')} ${bot}Z`;
  let s = `<path d="${body}" fill="#4a1466" opacity=".55" filter="url(#blur20)" transform="scale(1.07)"/><path d="${body}" fill="${C}"/>`;
  s += `<path d="M-44,-700 C-70,-760 -110,-770 -120,-800 C-76,-800 -30,-770 -22,-716Z M44,-700 C70,-760 110,-770 120,-800 C76,-800 30,-770 22,-716Z" fill="${C}"/>`;
  for (const sd of [-1, 1]) {
    const hx = sd * lerp(215, 250, reach), hy = lerp(-250, -540, reach) + 10 * Math.sin(t * 3 + sd), ex = sd * lerp(190, 230, reach), ey = lerp(-360, -400, reach);
    s += `<path d="M${sd * 105},-440 Q${R(ex)},${R(ey)} ${R(hx)},${R(hy)}" fill="none" stroke="${C}" stroke-width="46" stroke-linecap="round"/>`;
    for (let i = -1; i <= 1; i++) s += `<path d="M${R(hx)},${R(hy)} l${R(sd * 26 + i * 16)},${R(reach > .5 ? -46 : 46)}" stroke="${C}" stroke-width="13" stroke-linecap="round"/>`;
  }
  const er = lerp(11, 19, fear), ec = mix('#ff3b1f', '#fff3c0', fear);
  for (const sd of [-1, 1]) s += `<ellipse cx="${sd * 32}" cy="-632" rx="${R(lerp(22, 16, fear))}" ry="${R(er)}" transform="rotate(${R(sd * 20 * (1 - fear))},${sd * 32},-632)" fill="#ff3b1f" opacity=".6" filter="url(#blur8)"/><ellipse cx="${sd * 32}" cy="-632" rx="${R(lerp(20, 14, fear))}" ry="${R(er * .8)}" transform="rotate(${R(sd * 20 * (1 - fear))},${sd * 32},-632)" fill="${ec}"/>` + (fear > .5 ? `<circle cx="${sd * 32}" cy="-632" r="5" fill="${C}"/>` : '');
  s += fear > .5 ? `<ellipse cx="0" cy="-578" rx="16" ry="${R(14 + 4 * Math.sin(t * 20))}" fill="#ff3b1f"/>` : `<path d="M-34,-588 l12,10 l11,-10 l11,10 l11,-10 l11,10 l12,-10" fill="none" stroke="#ff3b1f" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>`;
  return `<g opacity="${alpha}">${s}</g>`;
}

// ---------- architecture ----------
function spire(x, y, w, h, col, t = 0, flag = '#ff7a12') {
  return G(at(x, y), `<rect x="${-w / 2}" y="${R(-h * .36)}" width="${w}" height="${R(h * .36)}" fill="#fff0d0" stroke="${OUT}" stroke-width="5"/><path d="M${-w * .16},0 L${-w * .16},${R(-h * .2)} Q0,${R(-h * .3)} ${w * .16},${R(-h * .2)} L${w * .16},0Z" fill="#5a1d0c" stroke="${OUT}" stroke-width="4"/><rect x="${R(-w * .56)}" y="${R(-h * .4)}" width="${R(w * 1.12)}" height="${R(h * .05)}" fill="#ffc21a" stroke="${OUT}" stroke-width="4.5"/><path d="M${R(-w * .44)},${R(-h * .4)} C${R(-w * .42)},${R(-h * .74)} ${R(-w * .2)},${R(-h * .92)} 0,${-h} C${R(w * .2)},${R(-h * .92)} ${R(w * .42)},${R(-h * .74)} ${R(w * .44)},${R(-h * .4)}Z" fill="${col}" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><path d="M${R(-w * .36)},${R(-h * .56)} Q0,${R(-h * .5)} ${R(w * .36)},${R(-h * .56)} M${R(-w * .26)},${R(-h * .74)} Q0,${R(-h * .69)} ${R(w * .26)},${R(-h * .74)}" stroke="${OUT}" stroke-width="3" fill="none" opacity=".5"/><circle cx="0" cy="${R(-h - 10)}" r="${R(w * .07 + 3)}" fill="#ffc21a" stroke="${OUT}" stroke-width="4"/><path d="M0,${R(-h - 18)} L0,${R(-h - 70)}" stroke="${OUT}" stroke-width="4.5"/><path d="M0,${R(-h - 70)} L${R(34 + 4 * Math.sin(t * 5 + x))},${R(-h - 60)} L0,${R(-h - 48)}Z" fill="${flag}" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round"/>`);
}
function block(x, y, w, h, col) {
  let s = `<rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="${col}" stroke="${OUT}" stroke-width="5"/><rect x="${-w / 2 - 8}" y="${-h - 16}" width="${w + 16}" height="18" fill="${mix(col, '#ffffff', .35)}" stroke="${OUT}" stroke-width="4.5"/>`;
  const n = Math.max(1, Math.floor(w / 60));
  for (let r = 0; r < Math.floor(h / 95); r++) for (let i = 0; i < n; i++) { const wx = -w / 2 + (i + .5) * w / n, wy = -h + 34 + r * 90; s += `<path d="M${R(wx - 11)},${wy + 40} L${R(wx - 11)},${wy + 12} Q${R(wx)},${wy - 6} ${R(wx + 11)},${wy + 12} L${R(wx + 11)},${wy + 40}Z" fill="#7a2a0c" stroke="${OUT}" stroke-width="3.5"/>`; }
  return G(at(x, y), s);
}
const CITY = [['b', -120, 170, 200, '#f6c98a'], ['s', 40, 130, 330, '#e2562a'], ['b', 190, 150, 150, '#ffe1a6'], ['s', 330, 110, 250, '#f09a2e'], ['b', 470, 180, 230, '#f2a66a'], ['s', 640, 150, 400, '#d8401e'], ['b', 800, 150, 170, '#ffe9bd'], ['s', 960, 190, 500, '#ffc21a'], ['b', 1130, 160, 210, '#f6c98a'], ['s', 1280, 130, 340, '#e2562a'], ['b', 1420, 170, 160, '#ffe1a6'], ['s', 1570, 120, 280, '#f09a2e'], ['b', 1710, 180, 240, '#f2a66a'], ['s', 1880, 140, 370, '#d8401e'], ['b', 2040, 170, 180, '#ffe9bd']];
function kashi(t, y0, o = {}) { // skyline + ghats; water starts at y0+96
  let s = '';
  CITY.forEach(([k, x, w, h, c]) => { s += k === 's' ? spire(x, y0, w, h, c, t) : block(x, y0, w, h, c); });
  for (let i = 0; i < 4; i++) s += `<rect x="-400" y="${y0 + i * 24}" width="2720" height="24" fill="${i % 2 ? '#f3c98c' : '#ffe3b0'}" stroke="${OUT}" stroke-width="3.5"/>`;
  if (!o.noUmb) for (let i = 0; i < 7; i++) { const x = 110 + i * 290 + 60 * rnd(i); s += G(at(x, y0 + 60), `<path d="M0,0 L0,-62" stroke="${OUT}" stroke-width="5"/><path d="M-46,-56 Q0,-104 46,-56Z" fill="${['#ff7a12', '#c8281e', '#ffc21a'][i % 3]}" stroke="${OUT}" stroke-width="4.5" stroke-linejoin="round"/>`); }
  return s;
}
function river(t, y, h = 600, c1 = '#ffb65c', c2 = '#2f93ad') {
  let s = `<defs><linearGradient id="rv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect x="-400" y="${y}" width="2720" height="${h}" fill="url(#rv)" stroke="${OUT}" stroke-width="5"/>`;
  for (let i = 0; i < 18; i++) { const x = -100 + rnd(i) * 2100 + 40 * Math.sin(t * .8 + i), yy = y + 26 + rnd(i + 20) * (h * .55); s += `<path d="M${R(x)},${R(yy)} h${R(60 + rnd(i + 4) * 110)}" stroke="#fff6dc" stroke-width="6" stroke-linecap="round" opacity=".55"/>`; }
  return s;
}
const boat = (t, i = 0) => G(`rotate(${R(2 * Math.sin(t * 1.6 + i))})`, `<path d="M-120,0 Q-90,44 -50,46 L60,46 Q104,40 130,-6 Q0,14 -120,0Z" fill="#8a4a1c" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><path d="M-10,6 L-10,-70" stroke="${OUT}" stroke-width="5"/><circle cx="-10" cy="-84" r="15" fill="#d99a66" stroke="${OUT}" stroke-width="4"/><path d="M-30,6 Q-30,-64 -10,-66 Q10,-64 10,6Z" fill="#ff8a1e" stroke="${OUT}" stroke-width="4"/><path d="M30,-50 L96,40" stroke="${OUT}" stroke-width="6" stroke-linecap="round"/>`);
function gate(o = {}) { // origin bottom centre, ~700 wide, ~720 tall
  const st = o.stone || '#ee8a3c', inside = o.inside || '#ffe9a0';
  let s = `<rect x="-310" y="-600" width="620" height="600" fill="${st}" stroke="${OUT}" stroke-width="6"/><path d="M-190,0 L-190,-380 Q0,-580 190,-380 L190,0Z" fill="${inside}" stroke="${OUT}" stroke-width="6"/>`;
  s += `<path d="M-310,-180 L-190,-180 M190,-180 L310,-180 M-310,-400 L-190,-400 M190,-400 L310,-400" stroke="${OUT}" stroke-width="4" opacity=".5"/><rect x="-330" y="-40" width="160" height="40" fill="#c4541f" stroke="${OUT}" stroke-width="5"/><rect x="170" y="-40" width="160" height="40" fill="#c4541f" stroke="${OUT}" stroke-width="5"/>`;
  for (let i = 0; i <= 14; i++) { const u = i / 14, a = Math.PI * u, x = -170 * Math.cos(a), y = -380 - 150 * Math.sin(a) * (.55 + .45 * Math.sin(a)); s += `<circle cx="${R(x)}" cy="${R(y + 22)}" r="12" fill="${i % 2 ? '#ffc21a' : '#ff5a1c'}" stroke="${OUT}" stroke-width="3"/>`; }
  s += `<rect x="-345" y="-660" width="690" height="64" rx="6" fill="#a3161f" stroke="${OUT}" stroke-width="6"/>`;
  if (o.sign !== false) s += txt(0, -608, 'काशी', 56, '#ffe9b0', { sw: 0 });
  s += spire(-250, -660, 110, 190, '#e2562a', o.t || 0) + spire(250, -660, 110, 190, '#e2562a', o.t || 0);
  if (!o.noTop) s += spire(0, -660, 150, 260, '#ffc21a', o.t || 0);
  return s;
}
function house(col, door = 1) {
  let s = `<rect x="-150" y="-290" width="300" height="290" fill="${col}" stroke="${OUT}" stroke-width="5"/><rect x="-166" y="-318" width="332" height="30" fill="${mix(col, '#7a2a0c', .35)}" stroke="${OUT}" stroke-width="5"/><path d="M-54,0 L-54,-150 Q0,-204 54,-150 L54,0Z" fill="#4a1d0c" stroke="${OUT}" stroke-width="5"/>`;
  s += `<path d="M78,-150 L78,-200 Q104,-228 130,-200 L130,-150Z" fill="#7a2a0c" stroke="${OUT}" stroke-width="4"/><path d="M-130,-150 L-130,-200 Q-104,-228 -78,-200 L-78,-150Z" fill="#7a2a0c" stroke="${OUT}" stroke-width="4"/>`;
  if (door) s += `<path d="M-30,0 Q-32,-80 0,-84 Q32,-80 30,0Z" fill="${door === 1 ? '#3f9b46' : '#c8281e'}" stroke="${OUT}" stroke-width="4"/><circle cx="0" cy="-108" r="24" fill="#d99a66" stroke="${OUT}" stroke-width="4"/><path d="M-24,-112 Q0,-146 24,-112 Q0,-126 -24,-112Z" fill="#1c1420"/><circle cx="-8" cy="-106" r="2.6" fill="${OUT}"/><circle cx="8" cy="-106" r="2.6" fill="${OUT}"/><path d="M-7,-96 Q0,-90 7,-96" stroke="${OUT}" stroke-width="2.5" fill="none"/><circle cx="34" cy="-50" r="11" fill="#d99a66" stroke="${OUT}" stroke-width="3.5"/><path d="M30,-60 Q50,-74 62,-56 Q48,-44 32,-48Z" fill="#e9b21c" stroke="${OUT}" stroke-width="3.5"/>`;
  return s;
}
const tree = () => `<path d="M-14,0 L-10,-150 L10,-150 L14,0Z" fill="#8a4a1c" stroke="${OUT}" stroke-width="5"/><circle cx="-50" cy="-190" r="62" fill="#5fae45" stroke="${OUT}" stroke-width="5"/><circle cx="50" cy="-196" r="66" fill="#5fae45" stroke="${OUT}" stroke-width="5"/><circle cx="0" cy="-260" r="76" fill="#6fbd52" stroke="${OUT}" stroke-width="5"/><circle cx="0" cy="-200" r="56" fill="#6fbd52"/>`;
function peaks(y = 900) {
  const pk = (x, w, h, dome) => `<path d="M${x - w},${y} L${x - (dome ? w * .3 : 0)},${y - h} ${dome ? `Q${x},${y - h * 1.1} ${x + w * .3},${y - h}` : ''} L${x + w},${y}Z" fill="#dfe9f7" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><path d="M${x + (dome ? w * .1 : 0)},${y - h * (dome ? 1.03 : 1)} L${x + w},${y} L${x + w * .25},${y} Z" fill="#b4c8e6" opacity=".8"/><path d="M${x - w * .42},${y - h * .58} l${w * .14},${h * .1} l${w * .12},${-h * .08} l${w * .14},${h * .12} l${w * .14},${-h * .1} l${w * .16},${h * .1} l${w * .12},${-h * .06} L${x + (dome ? w * .3 : 0)},${y - h} ${dome ? `Q${x},${y - h * 1.1} ${x - w * .3},${y - h}` : ''}Z" fill="#ffffff" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/>`;
  return pk(180, 420, 470) + pk(1820, 460, 520) + pk(1320, 380, 400) + pk(700, 520, 660, true);
}
const dog = (t = 0) => `<path d="M40,-40 Q${R(96 + 8 * Math.sin(t * 9))},-60 ${R(84 + 10 * Math.sin(t * 9))},-118" fill="none" stroke="${OUT}" stroke-width="24" stroke-linecap="round"/><path d="M40,-40 Q${R(96 + 8 * Math.sin(t * 9))},-60 ${R(84 + 10 * Math.sin(t * 9))},-118" fill="none" stroke="#2a2030" stroke-width="15" stroke-linecap="round"/><path d="M-52,0 C-66,-70 -46,-150 -4,-152 C40,-150 60,-90 56,0Z" fill="#2a2030" stroke="${OUT}" stroke-width="5"/><ellipse cx="-34" cy="-6" rx="26" ry="12" fill="#2a2030" stroke="${OUT}" stroke-width="4.5"/><ellipse cx="22" cy="-6" rx="26" ry="12" fill="#2a2030" stroke="${OUT}" stroke-width="4.5"/><path d="M-58,-206 L-70,-262 L-30,-232Z M22,-206 L36,-262 L-4,-232Z" fill="#2a2030" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="-18" cy="-190" rx="52" ry="46" fill="#2a2030" stroke="${OUT}" stroke-width="5"/><ellipse cx="-22" cy="-170" rx="26" ry="20" fill="#5a4a5e" stroke="${OUT}" stroke-width="4"/><ellipse cx="-22" cy="-180" rx="8" ry="6" fill="${OUT}"/><circle cx="-40" cy="-204" r="7" fill="#fff"/><circle cx="2" cy="-204" r="7" fill="#fff"/><circle cx="-40" cy="-203" r="3.5" fill="${OUT}"/><circle cx="2" cy="-203" r="3.5" fill="${OUT}"/><path d="M-22,-160 q0,12 -8,14" stroke="#e0407a" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M-56,-146 Q-16,-126 26,-150" stroke="#c8281e" stroke-width="11" fill="none" stroke-linecap="round"/><circle cx="-14" cy="-132" r="8" fill="#ffc21a" stroke="${OUT}" stroke-width="3"/>`;
function devotee(col, hair, skin, wk = 0, up = 0) { // seen from behind
  const b = Math.abs(Math.sin(wk)) * 8;
  let s = `<path d="M-48,${-250 - b} Q-54,${-296 - b} -24,${-300 - b} L24,${-300 - b} Q54,${-296 - b} 48,${-250 - b} L60,0 L-60,0Z" fill="${col}" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><path d="M-50,-60 L50,-60" stroke="${mix(col, '#ffffff', .5)}" stroke-width="10"/>`;
  s += up ? limb([[-44, -280 - b], [-52, -380 - b], [-8, -452 - b]], 22, skin) + limb([[44, -280 - b], [52, -380 - b], [8, -452 - b]], 22, skin) : limb([[-46, -280 - b], [-56, -200 - b], [-20, -230 - b]], 22, skin) + limb([[46, -280 - b], [56, -200 - b], [20, -230 - b]], 22, skin);
  s += `<circle cx="0" cy="${-346 - b}" r="42" fill="${hair}" stroke="${OUT}" stroke-width="5"/><circle cx="0" cy="${-384 - b}" r="18" fill="${hair}" stroke="${OUT}" stroke-width="4.5"/>`;
  return s;
}
const danda = () => `<path d="M0,0 L0,-470" stroke="${OUT}" stroke-width="19" stroke-linecap="round"/><path d="M0,0 L0,-470" stroke="#8a4a1c" stroke-width="10" stroke-linecap="round"/><path d="M0,-90 L0,-110 M0,-300 L0,-320" stroke="#ffc21a" stroke-width="12"/><circle cx="0" cy="-486" r="20" fill="#ffc21a" stroke="${OUT}" stroke-width="5"/>`;
const lotus = () => { let s = ''; for (let i = 0; i < 5; i++) s += `<path d="M0,0 C-16,-16 -12,-40 0,-54 C12,-40 16,-16 0,0Z" transform="rotate(${-64 + i * 32})" fill="${i % 2 ? '#ff8fb0' : '#ffb3c8'}" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round"/>`; return `<ellipse cx="0" cy="4" rx="46" ry="12" fill="#4e9a3a" stroke="${OUT}" stroke-width="3.5"/>` + s; };
const ribbonLabel = (s, size = 84, w = 760) => `<path d="M${-w / 2},-70 L${w / 2},-70 Q${w / 2 + 26},-70 ${w / 2 + 26},-44 L${w / 2 + 26},44 Q${w / 2 + 26},70 ${w / 2},70 L30,70 L0,106 L-30,70 L${-w / 2},70 Q${-w / 2 - 26},70 ${-w / 2 - 26},44 L${-w / 2 - 26},-44 Q${-w / 2 - 26},-70 ${-w / 2},-70Z" fill="#fff6dc" stroke="${OUT}" stroke-width="7" stroke-linejoin="round"/>` + txt(0, size * .34, s, size, '#8f1420', { sw: 0 });
const bigTitle = (s, size, p) => G(`scale(${R(lerp(2.4, 1, easeOut(clamp(p))))})`, txt(0, 0, s, size, '#ffd23c', { sw: size * .14 }) + txt(0, 0, s, size, '#ffd23c', { stroke: '#c8281e', sw: size * .036 }), `opacity="${R(clamp(p * 2.5))}"`);
function sparkles(t, x, y, r, n = 10, col = '#fff3a0') {
  let s = '';
  for (let i = 0; i < n; i++) { const a = i * 2.4 + t * .6, rr = r * (.4 + .6 * rnd(i)), k = .5 + .5 * Math.sin(t * 6 + i * 1.7); s += G(at(x + Math.cos(a) * rr, y + Math.sin(a) * rr, R(.4 + k * .8)), `<path d="M0,-18 L5,-5 L18,0 L5,5 L0,18 L-5,5 L-18,0 L-5,-5Z" fill="${col}"/>`, `opacity="${R(k)}"`); }
  return s;
}
