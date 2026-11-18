// Episode 7, painted edition — built on the six supplied paintings with camera moves and living overlays.
// Timings come from the pauses in audio/narration.wav
const CAPS = [
  [0.25, 6.72, 'पिछली कथा में आपने देखा था कि राजा दिवोदास के वैराग्य के बाद महादेव अपनी काशी लौटे,'],
  [7.40, 10.01, 'और गणेश जी वहीं ढुंढिराज बनकर बस गए।'],
  [11.10, 14.77, 'पर सवाल यह था कि काशी में गंगा उत्तर की ओर क्यों बहती हैं?'],
  [15.45, 19.77, 'बहुत पहले राजा भगीरथ ने घोर तप करके गंगा को धरती पर उतारा।'],
  [20.53, 25.45, 'गंगा का वेग इतना प्रचंड था कि महादेव ने उन्हें अपनी जटाओं में बाँध लिया,'],
  [26.14, 28.09, 'और फिर धीरे से धरती पर छोड़ा।'],
  [28.80, 32.53, 'आगे-आगे भगीरथ का रथ चला, और पीछे-पीछे गंगा,'],
  [33.09, 35.17, 'पूर्व की ओर, सागर की दिशा में।'],
  [35.86, 41.05, 'पर जब गंगा काशी पहुँचीं, तो उन्होंने देखा कि यही तो महादेव की अपनी नगरी है,'],
  [41.67, 44.35, 'वही महादेव जिनकी जटाओं से वे निकली थीं।'],
  [45.30, 50.11, 'मान्यता है कि उसी क्षण गंगा ने अपनी दिशा मोड़ ली, और उत्तर की ओर बह चलीं,'],
  [50.64, 53.52, 'कैलाश की ओर, अपने स्वामी को प्रणाम करने।'],
  [54.46, 57.20, 'इसीलिए काशी में गंगा उत्तरवाहिनी कहलाती हैं,'],
  [57.50, 60.75, 'और यहाँ उनके स्नान का पुण्य कई गुना माना जाता है।'],
  [61.33, 67.62, 'ध्यान से देखिए, काशी के घाटों पर गंगा एक अर्धचंद्र जैसा मोड़ लेती हैं,'],
  [68.50, 72.19, 'ठीक वैसा ही चंद्रमा, जो महादेव के मस्तक पर सजा है।'],
  [73.33, 78.27, 'इस मोड़ के एक छोर पर असी नदी मिलती है, और दूसरे छोर पर वरुणा,'],
  [79.25, 83.19, 'और इन्हीं दोनों के बीच बसी नगरी कहलाई वाराणसी।'],
  [84.52, 88.89, 'पर इसी काशी में एक संत को स्वयं हनुमान जी ने दर्शन दिए थे।'],
  [89.85, 92.68, 'कौन थे वे, और कैसे हुआ वह चमत्कार?'],
  [93.46, 94.98, 'जानिए अगले भाग में।'],
  [96.05, 97.47, 'हर हर महादेव!'],
];
const DURATION = 98.9;

// a painting seen through a moving camera; overlays are in painting coordinates (1920x1080) so they move with it
function photo(name, cx, cy, z, over = '') {
  z = Math.max(1, z); const hw = 960 / z, hh = 540 / z;
  cx = clamp(cx, hw, 1920 - hw); cy = clamp(cy, hh, 1080 - hh);
  return cam(cx, cy, z, `<use href="#art_${name}"/>` + over);
}
const view = (t, keys) => kf(t, keys);
function twinkles(t, x0, y0, x1, y1, n, seed = 0, col = '#fffbe0') {
  let s = '';
  for (let i = 0; i < n; i++) { const x = x0 + rnd(seed + i) * (x1 - x0), y = y0 + rnd(seed + i + 50) * (y1 - y0), a = Math.max(0, Math.sin(t * (1.5 + rnd(seed + i + 9) * 2) + i * 1.7)), k = .5 + rnd(seed + i + 3) * .8; if (a < .15) continue; s += `<ellipse cx="${R(x)}" cy="${R(y)}" rx="${R(9 * k * a)}" ry="${R(2.4 * k)}" fill="${col}" opacity="${R(a * .9)}"/>`; }
  return s;
}
function glows(t, pts, r = 34, col = '#ffd27a') { return pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${R(r * (.85 + .15 * Math.sin(t * 9 + i * 2.3) + .05 * Math.sin(t * 23 + i)))}" fill="${col}" opacity=".45" filter="url(#blur8)"/>`).join(''); }
function mist(t, y, a = .25, col = '#fff6e8') { let s = ''; for (let i = 0; i < 5; i++) { const x = ((i * 520 + t * (14 + i * 4)) % 2800) - 400; s += `<ellipse cx="${R(x)}" cy="${R(y + 30 * Math.sin(t * .3 + i))}" rx="${R(380 + 80 * rnd(i))}" ry="${R(70 + 30 * rnd(i + 2))}" fill="${col}" opacity="${R(a)}" filter="url(#blur40)"/>`; } return s; }
function spray(t, x0, x1, y0, y1, n = 50) { let s = ''; for (let i = 0; i < n; i++) { const ph = (t * (.7 + rnd(i) * .6) + rnd(i + 7)) % 1, x = x0 + rnd(i + 3) * (x1 - x0) + 40 * Math.sin(ph * 5 + i), y = y0 + ph * (y1 - y0); s += `<circle cx="${R(x)}" cy="${R(y)}" r="${R(2 + rnd(i + 5) * 4)}" fill="#f2fbff" opacity="${R(.85 * Math.sin(ph * Math.PI))}"/>`; } return s; }
function dust(t, x0, x1, y, n = 14) { let s = ''; for (let i = 0; i < n; i++) { const ph = (t * 1.2 + i / n) % 1; s += `<circle cx="${R(x0 + (x1 - x0) * rnd(i) - ph * 260)}" cy="${R(y - ph * 60 + 20 * rnd(i + 4))}" r="${R(16 + 40 * ph)}" fill="#f0dcb4" opacity="${R(.4 * (1 - ph))}" filter="url(#blur8)"/>`; } return s; }
function rays(t, x, y, a) { let s = ''; for (let i = 0; i < 7; i++) s += `<path d="M0,0 L-60,1400 L60,1400Z" transform="rotate(${R(-40 + i * 13 + 2 * Math.sin(t * .4 + i))})" fill="#fff6d0"/>`; return G(`translate(${x},${y})`, s, `opacity="${R(a)}" filter="url(#blur20)"`); }
function burst(t, t0, x, y, n = 36, col = '#f2fbff') { const d = t - t0; if (d < 0 || d > 1.4) return ''; let s = ''; for (let i = 0; i < n; i++) { const a = rnd(i + 11) * Math.PI * 2, v = 240 + rnd(i + 12) * 420; s += `<circle cx="${R(x + Math.cos(a) * v * d)}" cy="${R(y + Math.sin(a) * v * d * .7 + 500 * d * d)}" r="${R(3 + rnd(i + 13) * 7)}" fill="${col}" opacity="${R(1 - d / 1.4)}"/>`; } return s + `<circle cx="${x}" cy="${y}" r="${R(60 + 400 * d)}" fill="none" stroke="#ffffff" stroke-width="${R(16 * (1 - d / 1.4))}" opacity="${R(.6 * (1 - d / 1.4))}"/>`; }
function windLines(t, a = 1) { let s = ''; for (let i = 0; i < 16; i++) { const ph = (t * (1.4 + rnd(i) * .8) + rnd(i + 2)) % 1, x = 2100 - ph * 2500, y = 100 + rnd(i + 5) * 880; s += `<path d="M${R(x)},${R(y)} h${R(120 + 160 * rnd(i + 7))}" stroke="#ffffff" stroke-width="${R(2 + 3 * rnd(i + 9))}" stroke-linecap="round" opacity="${R(.5 * a * Math.sin(ph * Math.PI))}"/>`; } return s; }
function ripples(t, pts) { let s = ''; pts.forEach(([x, y], k) => { for (let i = 0; i < 3; i++) { const ph = (t * .45 + i / 3 + k * .21) % 1; s += `<ellipse cx="${x}" cy="${y}" rx="${R(30 + ph * 150)}" ry="${R(8 + ph * 36)}" fill="none" stroke="#fffbe0" stroke-width="${R(4 * (1 - ph))}" opacity="${R(.8 * (1 - ph))}"/>`; } }); return s; }
function haloRings(t, x, y, a) { if (a <= 0) return ''; let s = ''; for (let i = 0; i < 3; i++) { const ph = (t * .5 + i / 3) % 1; s += `<circle cx="${x}" cy="${y}" r="${R(120 + ph * 260)}" fill="none" stroke="#fff3c0" stroke-width="${R(10 * (1 - ph))}" opacity="${R(a * (1 - ph))}"/>`; } return s; }
const lightLeak = t => `<ellipse cx="${R(300 + 1400 * (.5 + .5 * Math.sin(t * .07)))}" cy="${R(200 + 120 * Math.sin(t * .11))}" rx="700" ry="420" fill="#ffb46a" opacity="${R(.10 + .05 * Math.sin(t * .23))}" filter="url(#blur40)"/>`;
const screenFx = (t, dark = 0) => `<rect width="1920" height="1080" fill="#1a0610" opacity="${R(dark)}"/>` + vignette(.32);

// A — recap: Kashi at dusk, the trishul and moon shimmering in the river
function a1(t) {
  const [cx, cy, z] = view(t, [[0, [700, 520, 1.22]], [10.6, [1180, 600, 1.3]]]);
  const over = twinkles(t, 620, 640, 1920, 1080, 70, 1) + glows(t, [[730, 975], [820, 915], [800, 800], [1355, 735]]) + `<ellipse cx="1360" cy="760" rx="${R(90 + 14 * Math.sin(t * 2))}" ry="160" fill="#fff3c0" opacity=".18" filter="url(#blur20)"/>` + mist(t, 560, .14) + rays(t, 1435, 320, .15);
  const rp = backOut(prog(t, .3, .8)) * (1 - prog(t, 6.2, 6.7));
  const ribbon = rp > 0 ? G(at(60, 70, 1), G(`scale(${R(rp)})`, `<path d="M0,0 L470,0 L440,46 L470,92 L0,92Z" fill="#8f1420" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/>` + txt(215, 64, 'पिछली कथा में…', 52, '#ffe9b0', { sw: 0 }))) : '';
  return photo('trishul', cx, cy, z, over) + flowerRain(t, .85 * (1 - prog(t, 8.5, 10.6))) + screenFx(t) + ribbon;
}
// B — the question over the crescent city
function a2(t) {
  const [cx, cy, z] = view(t, [[10.6, [960, 560, 1.14]], [15.1, [960, 540, 1.0]]]);
  const ap = ease(prog(t, 12.0, 12.8));
  const arrow = G(at(1720, lerp(700, 560, ap)), `<path d="M0,-170 L56,-90 L20,-90 L20,110 L-20,110 L-20,-90 L-56,-90Z" fill="#ffc21a" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/>`, `opacity="${R(ap)}" filter="url(#pcs)"`);
  return photo('aerial', cx, cy, z, twinkles(t, 900, 600, 1500, 900, 40, 2) + mist(t, 260, .12)) + screenFx(t) + arrow + G(at(1810, 150), compass(1)) + titleAt(t, 11.6, 860, 150, 'गंगा उत्तर की ओर क्यों?', 104);
}
// C — Bhagiratha prays; the Ganga crashes into Mahadev's matted hair
function a3(t) {
  const [cx, cy, z] = view(t, [[15.1, [420, 650, 1.6]], [19.9, [470, 630, 1.55]], [21.4, [800, 360, 1.35]], [24.0, [880, 380, 1.3]], [25.6, [1200, 520, 1.28]], [28.5, [1170, 520, 1.2]]]);
  const sh = between(t, 20.8, 22.6) ? 5 * Math.sin(t * 70) : 0;
  const over = spray(t, 640, 1080, 120, 900, 70) + mist(t, 820, .2, '#ffffff') + burst(t, 20.9, 900, 380, 44) + burst(t, 21.6, 1020, 470, 30) + `<ellipse cx="830" cy="${R(400 + 40 * Math.sin(t * 3))}" rx="200" ry="420" fill="#e6f8ff" opacity="${R(.12 + .08 * Math.sin(t * 5))}" filter="url(#blur40)"/>`;
  return photo('jata', cx + sh, cy, z, over) + screenFx(t) + popRibbon(t, 15.8, 19.8, 1340, 150, 'राजा भगीरथ', 72, 400) + titleAt(t, 22.4, 600, 150, 'जटाओं में गंगा', 116);
}
// D — the chariot races east; the Ganga follows
function a4(t) {
  const [cx, cy, z] = view(t, [[28.5, [640, 520, 1.38]], [35.5, [1340, 430, 1.3]]]);
  const bob = 3 * Math.sin(t * 14);
  const over = twinkles(t, 40, 380, 760, 820, 50, 4, '#ffffff') + spray(t, 80, 700, 480, 760, 30) + dust(t, 1450, 1920, 1030) + rays(t, 1640, 160, .16);
  return photo('chariot', cx, cy + bob, z, over) + windLines(t, .9) + screenFx(t) + popRibbon(t, 33.0, 35.4, 1480, 150, 'पूर्व → सागर', 70, 400);
}
// E — Kashi, Mahadev's own city; then the river turns north toward Kailash
function a5(t) {
  const [cx, cy, z] = view(t, [[35.5, [560, 640, 1.32]], [40.8, [900, 380, 1.36]], [44.8, [960, 330, 1.42]], [49.6, [1460, 440, 1.3]], [54.0, [1600, 330, 1.38]]]);
  const face = prog(t, 38.0, 39.5) * (1 - prog(t, 45.0, 46.5));
  const over = twinkles(t, 760, 560, 1920, 1080, 80, 5) + `<path d="M1180,1000 C1350,880 1300,700 1500,600 S1660,460 1700,420" stroke="#fff3c0" stroke-width="${R(18 + 8 * Math.sin(t * 3))}" fill="none" opacity="${R(.45 * prog(t, 45.2, 47.0))}" filter="url(#blur8)" stroke-linecap="round"/>` + `<circle cx="950" cy="230" r="${R(200 + 20 * Math.sin(t * 2))}" fill="#fff6d8" opacity="${R(.28 * face)}" filter="url(#blur40)"/>` + mist(t, 470, .12) + haloRings(t, 950, 230, face * .8);
  let ov = titleAt(t, 36.2, 960, 150, 'काशी', 170, 41.4) + popRibbon(t, 41.7, 44.8, 960, 160, 'महादेव की नगरी', 70, 480);
  ov += titleAt(t, 46.2, 760, 150, 'उत्तर की ओर ↑', 116, 50.4) + popRibbon(t, 50.6, 53.9, 760, 150, 'कैलाश की ओर', 72, 440);
  if (t > 45.2) ov += G(at(1810, 150), compass(prog(t, 45.2, 45.8)));
  return photo('shiva', cx, cy, z, over) + screenFx(t) + ov;
}
// F — the bathers of the north-flowing Ganga (Hanuman kept out of frame for the later reveal)
function a6(t) {
  const [cx, cy, z] = view(t, [[54.0, [760, 770, 1.72]], [61.0, [880, 760, 1.66]]]);
  const over = twinkles(t, 560, 640, 1920, 1080, 70, 6) + glows(t, [[905, 965], [1440, 720], [1350, 790], [1500, 900], [1310, 840]]) + spray(t, 1175, 1215, 640, 860, 16) + ripples(t, [[1190, 880], [1000, 920], [1380, 820]]);
  return photo('hanuman', cx, cy, z, over) + screenFx(t) + titleAt(t, 54.6, 960, 150, 'उत्तरवाहिनी गंगा', 124) + popRibbon(t, 57.6, 60.9, 960, 320, 'पुण्य कई गुना', 70, 420);
}
// G — the crescent bend (like the moon on Mahadev's head); Assi and Varuna; Varanasi
function a7(t) {
  const [cx, cy, z] = view(t, [[61.0, [960, 540, 1.0]], [66.0, [980, 620, 1.16]], [72.4, [990, 620, 1.2]], [73.3, [960, 540, 1.0]], [83.6, [960, 540, 1.03]]]);
  const cr = ease(prog(t, 64.0, 66.2)) * (1 - .6 * prog(t, 72.4, 73.4));
  const arc = 'M200,640 C560,1000 1480,1030 1880,420';
  let over = twinkles(t, 300, 640, 1900, 1050, 90, 7) + mist(t, 220, .1);
  over += `<path d="${arc}" stroke="#fff3b0" stroke-width="${R(30 + 20 * cr)}" fill="none" opacity="${R(.55 * cr)}" filter="url(#blur8)" stroke-linecap="round" pathLength="1" stroke-dasharray="${R(cr * 1.02)} 2"/>`;
  const as = ease(prog(t, 73.6, 74.6)), va = ease(prog(t, 76.6, 77.6));
  if (as > 0) over += `<circle cx="210" cy="640" r="${R(60 + 10 * Math.sin(t * 4))}" fill="#fff3a0" opacity="${R(.45 * as)}" filter="url(#blur8)"/>` + G(at(300, 560, R(backOut(as))), `<rect x="-90" y="-40" width="180" height="76" rx="14" fill="#fff6dc" stroke="${OUT}" stroke-width="6"/>` + txt(0, 20, 'असी', 50, '#2a5bd7', { sw: 0 }));
  if (va > 0) over += `<circle cx="1870" cy="420" r="${R(60 + 10 * Math.sin(t * 4))}" fill="#fff3a0" opacity="${R(.45 * va)}" filter="url(#blur8)"/>` + G(at(1720, 330, R(backOut(va))), `<rect x="-110" y="-40" width="220" height="76" rx="14" fill="#fff6dc" stroke="${OUT}" stroke-width="6"/>` + txt(0, 20, 'वरुणा', 50, '#2a5bd7', { sw: 0 }));
  const mo = ease(prog(t, 66.4, 67.6)) * (1 - prog(t, 72.4, 73.2));
  if (mo > 0) over += G(at(1040, lerp(980, 800, mo), 1.7), `<circle r="150" fill="#fff6c8" opacity="${R(.35 * mo)}" filter="url(#blur20)"/><path d="M-20,-110 A110,110 0 1,0 -20,110 A84,92 0 1,1 -20,-110Z" fill="#fffbe8" opacity="${R(.9 * mo)}" transform="rotate(-30)"/>`);
  let ov = popRibbon(t, 63.5, 67.8, 960, 150, 'अर्धचंद्र जैसा मोड़', 66, 520);
  const mp = prog(t, 68.5, 69.6) * (1 - prog(t, 72.4, 72.9));
  if (mp > 0) ov += medallion(330, 330, 200, G('scale(.95) translate(-880,-190)', `<use href="#art_shiva"/>`) + `<circle cx="-84" cy="-77" r="${R(46 + 8 * Math.sin(t * 4))}" fill="#fff6c8" opacity=".35" filter="url(#blur8)"/>`, '', mp, 'मस्तक पर चंद्र');
  ov += titleAt(t, 79.6, 960, 150, 'वरुणा + असी', 96, 81.6) + titleAt(t, 81.6, 960, 150, 'वाराणसी', 170);
  return photo('aerial', cx, cy, z, over) + screenFx(t) + ov;
}
// H — teaser: pull back from the bathers to reveal Hanuman in the evening sky
function a8(t) {
  const [cx, cy, z] = view(t, [[83.6, [880, 760, 1.66]], [85.6, [880, 720, 1.5]], [87.2, [960, 540, 1.04]], [93.0, [960, 540, 1.0]]]);
  const hp = ease(prog(t, 85.8, 87.2));
  const over = twinkles(t, 560, 640, 1920, 1080, 70, 8) + glows(t, [[905, 965], [1440, 720], [1350, 790], [1500, 900]]) + `<circle cx="1470" cy="230" r="${R(260 + 30 * Math.sin(t * 2))}" fill="#ffe6a8" opacity="${R(.3 * hp)}" filter="url(#blur40)"/>` + rays(t, 1470, 120, .14 * hp) + G('', embers(t, 1470, 500, 30, '#ffd27a'), `opacity="${R(hp)}"`);
  let ov = titleAt(t, 87.2, 560, 150, 'संत और हनुमान?', 112);
  [[620, 360, -12, 89.9], [820, 300, 10, 90.3]].forEach(([x, y, r, t0], i) => { const p = backOut(prog(t, t0, t0 + .35)); if (p > 0) ov += G(at(x, y + 8 * Math.sin(t * 4 + i), R(p), r), txt(0, 0, '?', 170, '#fff3c0', { stroke: '#8f1420', sw: 24 })); });
  return photo('hanuman', cx, cy, z, over) + screenFx(t) + ov;
}
// I — end card over Mahadev's sky
function a9(t) {
  const hp = prog(t, 96.0, 96.45);
  let w = photo('shiva', 960, 540, lerp(1.0, 1.06, prog(t, 93.0, DURATION)), twinkles(t, 760, 560, 1920, 1080, 60, 9)) + screenFx(t, .35);
  const p1 = backOut(prog(t, 93.4, 93.85)) * (1 - prog(t, 95.6, 95.9));
  if (p1 > 0) w += G(at(960, 300, R(p1)), txt(0, 0, 'जानिए अगले भाग में…', 110, '#fff3c0', { sw: 20 }));
  if (hp > 0) w += G(at(960, 360, R(lerp(2.4, 1, easeOut(hp)) * (1 + .02 * Math.sin(t * 5)))), txt(0, 60, 'हर हर महादेव!', 210, '#ffd23c', { sw: 34 }) + txt(0, 60, 'हर हर महादेव!', 210, '#ffd23c', { stroke: '#c8281e', sw: 9 }), `opacity="${R(clamp(hp * 2.5))}"`);
  const fade = prog(t, DURATION - .6, DURATION);
  return w + (fade > 0 ? `<rect width="1920" height="1080" fill="#1a0406" opacity="${R(fade)}"/>` : '');
}

const SCENES = [[0, a1], [10.6, a2], [15.1, a3], [28.5, a4], [35.5, a5], [54.0, a6], [61.0, a7], [83.6, a8], [93.0, a9]];
function renderFrame(t) {
  let i = SCENES.length - 1;
  while (i > 0 && t < SCENES[i][0]) i--;
  let out = DEFS + SCENES[i][1](t);
  const X = .35;
  if (i < SCENES.length - 1 && t > SCENES[i + 1][0] - X) out += `<g opacity="${R(ease(prog(t, SCENES[i + 1][0] - X, SCENES[i + 1][0] + X)))}">${SCENES[i + 1][1](t)}</g>`;
  else if (i > 0 && t < SCENES[i][0] + X) out = DEFS + SCENES[i - 1][1](t) + `<g opacity="${R(ease(prog(t, SCENES[i][0] - X, SCENES[i][0] + X)))}">${SCENES[i][1](t)}</g>`;
  out += lightLeak(t);
  const cut = SCENES.reduce((m, [s0]) => Math.min(m, Math.abs(t - s0)), 9);
  if (cut < .45 && t > 1) out += `<rect width="1920" height="1080" fill="#fff0c8" opacity="${R(.28 * (1 - cut / .45))}"/>`;
  if (t < .5) out += `<rect width="1920" height="1080" fill="#1a0406" opacity="${R(1 - prog(t, 0, .5))}"/>`;
  return out;
}
function captionAt(t) {
  for (let i = 0; i < CAPS.length; i++) { const [a, b, s] = CAPS[i]; const end = Math.min(b + .3, i + 1 < CAPS.length ? CAPS[i + 1][0] - .04 : 1e9); if (t >= a - .06 && t <= end) return s; }
  return '';
}
window.seek = t => {
  document.getElementById('stage').innerHTML = renderFrame(t);
  const c = document.getElementById('cap'), s = captionAt(t);
  c.style.display = s ? 'block' : 'none'; c.firstElementChild.textContent = s;
};
