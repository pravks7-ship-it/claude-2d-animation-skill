// Episode 5 — why Mahadev resides in Kashi as Vishwanath, the jyotirlinga.
// Timings come from the pauses in audio/narration.wav
const CAPS = [
  [0.31, 6.38, 'पिछली कथा में आपने देखा था कि भोजन को माया कहने पर माता पार्वती अंतर्धान हो गईं,'],
  [6.62, 13.19, 'संसार में अकाल पड़ा, और काशी में माँ अन्नपूर्णा ने स्वयं महादेव का भिक्षा-पात्र भरा।'],
  [13.89, 19.78, 'पर सवाल यह था कि महादेव काशी में विश्वनाथ बनकर ज्योतिर्लिंग रूप में क्यों विराजे?'],
  [20.40, 26.90, 'याद कीजिए, कथा की शुरुआत में ब्रह्मा और विष्णु के सामने एक अनंत अग्नि-स्तंभ प्रकट हुआ था,'],
  [27.15, 29.37, 'जिसका न आदि था, न अंत।'],
  [29.84, 32.16, 'वही प्रकाश-स्तंभ ज्योतिर्लिंग कहलाया।'],
  [32.73, 39.41, 'कहते हैं, उसी अनंत ज्योति का एक अंश धरती पर जहाँ-जहाँ प्रकट हुआ, वहाँ-वहाँ ज्योतिर्लिंग बने,'],
  [39.79, 41.62, 'और ऐसे बारह ज्योतिर्लिंग हैं।'],
  [42.27, 46.01, 'विवाह के बाद महादेव और माता पार्वती कैलाश पर रहते थे।'],
  [46.58, 51.36, 'एक दिन माता ने कहा, “प्रभु, कैलाश मेरे पिता हिमालय का घर है।'],
  [51.80, 54.17, 'मैं चाहती हूँ कि हमारा अपना एक घर हो।”'],
  [54.83, 58.78, 'महादेव मुस्कुराए और उन्होंने पूरी धरती पर दृष्टि डाली।'],
  [59.39, 62.70, 'उनकी नज़र जाकर ठहरी गंगा के तट पर,'],
  [63.22, 67.44, 'उसी नगरी पर जो उनके त्रिशूल पर टिकी थी, काशी।'],
  [68.67, 71.71, 'महादेव माता पार्वती को लेकर काशी आए'],
  [72.16, 77.54, 'और बोले, “देवी, आज से यही हमारा घर है। मैं इस नगरी को कभी नहीं छोड़ूँगा।”'],
  [78.43, 83.42, 'और उसी क्षण धरती को चीरते हुए वही अनंत ज्योति प्रकट हुई,'],
  [84.16, 86.30, 'और महादेव स्वयं उसमें समा गए।'],
  [87.23, 92.55, 'उस ज्योतिर्लिंग को नाम मिला विश्वेश्वर, यानी पूरे विश्व के स्वामी,'],
  [93.19, 95.87, 'जिन्हें आज हम काशी विश्वनाथ कहते हैं।'],
  [96.81, 101.97, 'मान्यता है कि बारह ज्योतिर्लिंगों में विश्वनाथ का स्थान सबसे विशेष है,'],
  [102.64, 106.51, 'क्योंकि यहाँ महादेव अतिथि नहीं, गृहस्थ बनकर रहते हैं।'],
  [107.23, 109.34, 'माँ अन्नपूर्णा रसोई सँभालती हैं,'],
  [109.82, 112.24, 'काल भैरव द्वार पर पहरा देते हैं,'],
  [112.72, 116.77, 'और स्वयं विश्वनाथ हर आने वाले भक्त का स्वागत करते हैं।'],
  [117.55, 121.01, 'इसीलिए कहा जाता है, काशी में कण-कण शंकर है।'],
  [121.95, 127.22, 'पर एक समय ऐसा भी आया, जब इसी काशी को महादेव को छोड़कर जाना पड़ा।'],
  [127.97, 130.56, 'किसने रोका उन्हें, और वे लौटे कैसे?'],
  [131.18, 133.30, 'जानिए अगले भाग में।'],
  [134.24, 135.74, 'हर हर महादेव!'],
];
const DURATION = 136.9;
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
const INDIA = [[330, 0], [420, 40], [400, 120], [470, 190], [560, 230], [650, 300], [800, 330], [880, 320], [960, 300], [1000, 360], [960, 420], [900, 400], [880, 460], [830, 450], [820, 520], [760, 560], [700, 640], [620, 720], [560, 800], [520, 900], [470, 1000], [430, 1080], [380, 1000], [340, 900], [300, 780], [270, 660], [240, 560], [180, 500], [90, 470], [130, 420], [200, 390], [210, 330], [250, 260], [280, 180], [300, 80]];
const JL = [[440, 190], [150, 520], [480, 1010], [300, 470], [760, 420], [270, 630], [100, 490], [480, 800], [310, 505], [260, 590], [305, 600], [600, 380]]; // Kashi last
function indiaMap(t, lit, kashi = 0) { // origin top-left of a 1000x1080 box
  let s = `<path d="M${INDIA.map(p => p.join(',')).join('L')}Z" fill="#ffd27a" stroke="${OUT}" stroke-width="10" stroke-linejoin="round"/><path d="M${INDIA.map(p => p.join(',')).join('L')}Z" fill="none" stroke="#e9a21c" stroke-width="5" stroke-linejoin="round" transform="translate(500,540) scale(.96) translate(-500,-540)"/>`;
  s += `<path d="M470,190 Q520,280 600,380 T820,500" stroke="#3a8fd8" stroke-width="12" fill="none" stroke-linecap="round"/>`;
  JL.forEach(([x, y], i) => {
    const p = clamp(lit - i); if (p <= 0) return;
    const isK = i === JL.length - 1, k = isK ? 1 + 1.2 * kashi : 1;
    if (p < 1) s += `<path d="M${x - 10},${R(y - 900 * (1 - p))} L${x + 10},${R(y - 900 * (1 - p))} L${x + 4},${y} L${x - 4},${y}Z" fill="#fff6c8" opacity="${R(1 - p * .6)}"/><rect x="${x - 6}" y="${R(y - 900)}" width="12" height="900" fill="#fff6c8" opacity="${R(.5 * (1 - p))}" filter="url(#blur8)"/>`;
    s += `<circle cx="${x}" cy="${y}" r="${R(34 * k * backOut(clamp(p * 1.5)))}" fill="#fff3a0" opacity=".6" filter="url(#blur8)"/><circle cx="${x}" cy="${y}" r="${R(12 * k)}" fill="#fffdf0" stroke="${OUT}" stroke-width="4"/>`;
  });
  if (kashi > 0) { const [x, y] = JL[JL.length - 1]; s += `<circle cx="${x}" cy="${y}" r="${R(50 + 40 * (.5 + .5 * Math.sin(t * 4)))}" fill="none" stroke="#fff3a0" stroke-width="8" opacity="${R(kashi)}"/>` + G(at(x + 150, y - 70, R(backOut(clamp(kashi * 1.4)))), `<rect x="-100" y="-44" width="200" height="80" rx="16" fill="#fff6dc" stroke="${OUT}" stroke-width="6"/>` + txt(0, 20, 'काशी', 56, '#8f1420', { sw: 0 })); }
  return s;
}
function crackGlow(t, x, y, p) { let s = ''; for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI + Math.PI, L = (120 + rnd(i) * 260) * p, mx = x + Math.cos(a) * L * .5 + 20 * (rnd(i + 3) - .5), my = y + Math.sin(a) * L * .12 + 18; s += `<path d="M${x},${y} L${R(mx)},${R(my)} L${R(x + Math.cos(a) * L)},${R(y + Math.abs(Math.sin(a)) * L * .2 + 10)}" stroke="#fff3a0" stroke-width="${R(10 * p)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; } return `<g filter="url(#blur8)" opacity=".8">${s}</g>` + s; }
const kingSil = () => { const C = '#2a1208'; return `<path d="M-70,0 L-58,-270 Q0,-300 58,-270 L70,0Z" fill="${C}"/><circle cx="0" cy="-330" r="44" fill="${C}"/><path d="M-42,-368 L-38,-420 L-18,-392 L0,-436 L18,-392 L38,-420 L42,-368Z" fill="${C}"/><path d="M50,-250 L120,-300 L130,-380" stroke="${C}" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="132" cy="-392" r="22" fill="${C}"/><path d="M-50,-250 L-92,-150" stroke="${C}" stroke-width="28" stroke-linecap="round"/><path d="M-92,-150 L-100,-10" stroke="${C}" stroke-width="10"/>`; };
const mapPlace = (t, lit, kashi = 0) => G('translate(360,40) scale(.92)', indiaMap(t, lit, kashi));

// F1a — recap: Parvati vanishes from Kailash
function f1a(t) {
  const V0 = 2.6, gone = ease(prog(t, V0, V0 + 1.2));
  let w = bg(t, 2, { cx: 960, cy: 300, rays: .14 }) + peaks(980) + clouds(t, 2, 1010);
  w += G(at(700, 1040, 1.0), shiva({ t, noTrishul: true, armL: [16, 8], armR: [16, 8], smile: t > V0 ? -.2 : .3, brow: t > V0 ? -.6 : 0, look: [5, 0], open: between(t, V0 + .4, 5) ? .35 : 0 }));
  if (gone < 1) w += G(`translate(1220,1040) scale(${R(1 + .3 * gone)},${R(1 - .4 * gone)})`, parvati({ t, smile: -.15, brow: .45, look: [-3, 1], armL: [30, -120] }), `opacity="${R(1 - gone)}"`);
  if (between(t, V0 - .2, V0 + 2.2)) { const u = prog(t, V0 - .2, V0 + 2.2); for (let i = 0; i < 26; i++) { const a = i * 2.39 + u * 6, r = 40 + u * 360 * (.4 + .6 * rnd(i)); w += `<circle cx="${R(1220 + Math.cos(a) * r)}" cy="${R(740 + Math.sin(a) * r * .9 - u * 200)}" r="${R(5 + 8 * rnd(i + 3))}" fill="#fff3a0" opacity="${R(Math.sin(u * Math.PI))}"/>`; } }
  const rp = backOut(prog(t, .3, .8)) * (1 - prog(t, 5.8, 6.3));
  const ribbon = rp > 0 ? G(at(60, 70, 1), G(`scale(${R(rp)})`, `<path d="M0,0 L470,0 L440,46 L470,92 L0,92Z" fill="#8f1420" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/>` + txt(215, 64, 'पिछली कथा में…', 52, '#ffe9b0', { sw: 0 }))) : '';
  return cam(960, 560, 1.0, w) + vignette(.22) + ribbon;
}
// F1b — recap: famine, then Annapurna fills the bowl
function f1b(t) {
  const scoops = [9.6, 10.6, 11.6], fill = scoops.reduce((a, s) => a + ease(prog(t, s + .5, s + .75)) / 3, 0);
  let w = hall(t) + halo(t, 1360, 520, 170);
  const armR = [82, 22], h = armHand(1, armR);
  w += G(at(600, 1010, 1.0), shiva({ t, noTrishul: true, armR, armL: [16, 10], smile: lerp(-.3, .7, prog(t, 10, 11)), look: [5, 0], held: G(at(h[0], h[1] - 14), bowlFull(fill, t)) }));
  let armL = [70, 30]; scoops.forEach(s => { if (between(t, s - .3, s + .5)) armL = kf(t, [[s - .3, [70, 30]], [s, [30, -20]], [s + .5, [80, 40]]]); });
  w += G(at(1360, 1060, 1.0), parvati({ t, smile: .85, look: [-5, 0], armL, armR: [30, -120], held: ladleHeld(armL, 20) })) + G(at(1360, 1070, .9), akshayaPatra(t, .8));
  const bw = [600 + h[0], 1010 + h[1] - 30];
  scoops.forEach(s => { const u = prog(t, s, s + .6); if (u > 0 && u < 1) { const x = lerp(1300, bw[0], u), y = lerp(860, bw[1], u) - 200 * Math.sin(u * Math.PI); w += G(at(x, y, .9), riceHeap(.8, 30)); } });
  return cam(960, 540, lerp(1.0, 1.05, prog(t, 6.5, 13.6)), w) + vignette(.22) + popRibbon(t, 7.0, 9.4, 960, 150, 'माँ अन्नपूर्णा', 80, 440);
}
// F2 — why the jyotirlinga?
function f2(t) {
  const z = lerp(1.0, 1.08, prog(t, 13.6, 20.2)), jy = ease(prog(t, 15.2, 16.4));
  let w = kashiScene(t, { sunY: 420, top: '#f06a1e', bot: '#ffe09a', id: 'skQ' });
  w += jyoti(t, 960, -400, 160, 150, jy);
  return cam(960, 520, z, w) + vignette(.3) + titleAt(t, 17.6, 960, 190, 'ज्योतिर्लिंग क्यों?', 140);
}
// F3 — callback: the endless pillar of fire
function f3(t) {
  const [cx, cy, z] = kf(t, [[20.2, [960, 560, 1.0]], [26.8, [960, 520, 1.05]], [27.4, [960, 60, 1.0]], [28.5, [960, 60, 1.0]], [29.0, [960, 1300, 1.0]], [29.8, [960, 1340, 1.0]]]);
  let w = bg(t, 0) + pillar(t, 960, 330) + embers(t, 960, 520) + clouds(t, 0, 930);
  w += G(at(470, 935, .8), brahma({ t, look: [4, -4], brow: -.2, open: .25, sideLid: 0 })) + G(at(1450, 930, .8), vishnu({ t, pray: false, look: [-4, -4], open: .25, brow: -.2 }));
  w += clouds(t + 40, 0, 1010) + `<clipPath id="pc"><rect x="-400" y="1000" width="2720" height="1200"/></clipPath><g clip-path="url(#pc)">` + pillar(t + 3, 960, 330) + `</g>`;
  let ov = popRibbon(t, 20.5, 23.6, 960, 160, 'कथा की शुरुआत में…', 70, 600);
  ov += titleAt(t, 27.2, 960, 170, 'न आदि ↑', 150, 28.75) + titleAt(t, 28.8, 960, 180, 'न अंत ↓', 150, 29.95);
  return cam(cx, cy, z, w) + vignette(.3) + ov;
}
// F4a — the pillar of fire becomes the pillar of light
function f4a(t) {
  const m = ease(prog(t, 29.9, 31.0));
  let w = bg(t, lerp(0, 2, m), { rays: .2 }) + G('', pillar(t, 960, 330), `opacity="${R(1 - m)}"`) + jyoti(t, 960, -400, 1300, 200, m) + clouds(t, 2, 1000);
  return cam(960, 540, lerp(1.0, 1.06, prog(t, 29.6, 32.5)), w) + vignette(.25) + titleAt(t, 31.0, 960, 190, 'ज्योतिर्लिंग', 170);
}
// F4b — wherever a fragment of that light touched the earth: the twelve jyotirlingas
const LAND = [[150, 830], [330, 800], [480, 840], [620, 790], [770, 830], [900, 760], [1040, 800], [1180, 735], [1330, 790], [1480, 750], [1620, 820], [1780, 800]];
const ORDER = [5, 0, 9, 3, 7, 1, 10, 4, 8, 2, 11, 6]; // fragment i lands at LAND[ORDER[i]]
function panorama(t) {
  let s = `<path d="M-400,700 Q0,620 400,690 T1200,640 T2320,690 L2320,1400 L-400,1400Z" fill="#8a5aa8" opacity=".55"/>`;
  s += `<path d="M1000,740 L1180,520 L1260,600 L1380,470 L1520,640 L1600,560 L1760,760Z" fill="#dfe9f7" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><path d="M1145,563 L1180,520 L1215,563 L1195,553 L1180,572 L1165,553Z M1340,520 L1380,470 L1420,520 L1400,510 L1380,532 L1360,510Z" fill="#fff" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round"/>`;
  s += `<path d="M-400,760 Q200,720 700,770 T1500,750 T2320,770 L2320,1400 L-400,1400Z" fill="#7fbf5a" stroke="${OUT}" stroke-width="5"/>`;
  s += `<path d="M-400,760 L260,760 Q300,900 180,1400 L-400,1400Z" fill="#3a7fd0" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><path d="M1960,770 Q1880,900 1960,1400 L2320,1400 L2320,770Z" fill="#3a7fd0" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/>`;
  for (let i = 0; i < 6; i++) s += `<path d="M${R(-300 + i * 90 + 12 * Math.sin(t * 2 + i))},${820 + (i % 3) * 50} q20,-12 40,0 t40,0" stroke="#e6f2ff" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  s += `<path d="M640,770 C700,860 560,940 720,1040 S900,1200 820,1400" stroke="${OUT}" stroke-width="60" fill="none"/><path d="M640,770 C700,860 560,940 720,1040 S900,1200 820,1400" stroke="#5fb0d8" stroke-width="46" fill="none"/>`;
  for (let i = 0; i < 16; i++) { const x = 300 + rnd(i) * 1600; if (Math.abs(x - 700) < 90) continue; s += G(at(x, 880 + rnd(i + 3) * 260, .3 + rnd(i + 6) * .18), tree()); }
  return s;
}
function f4b(t) {
  const T0 = 34.2, step = 5.2 / 12, src = [960, 210];
  const fade = 1 - ease(prog(t, 39.5, 40.2));
  let w = skyGrad('skL', '#1d3a8a', '#ff9a4a') + `<circle cx="960" cy="200" r="260" fill="#fff3a0" opacity="${R(.25 * fade)}" filter="url(#blur40)"/>`;
  for (let i = 0; i < 50; i++) w += `<circle cx="${R(rnd(i) * 1920)}" cy="${R(rnd(i + 9) * 420)}" r="${R(1.5 + rnd(i + 3) * 3)}" fill="#fff8d8" opacity="${R(.25 + .4 * Math.abs(Math.sin(t * 1.2 + i)))}"/>`;
  w += jyoti(t, 960, -500, 230, 130, fade) + panorama(t);
  let n = 0;
  for (let i = 0; i < 12; i++) {
    const land = T0 + (i + .5) * step, dep = land - .55, [lx, ly] = LAND[ORDER[i]];
    const u = prog(t, dep, land);
    if (u > 0 && u < 1) { const x = lerp(src[0], lx, u), y = lerp(src[1], ly - 30, u) - 160 * Math.sin(u * Math.PI); for (let k = 1; k < 6; k++) { const v = clamp(u - k * .05); w += `<circle cx="${R(lerp(src[0], lx, v))}" cy="${R(lerp(src[1], ly - 30, v) - 160 * Math.sin(v * Math.PI))}" r="${R(11 - k * 1.6)}" fill="#fff3a0" opacity="${R(.7 - k * .12)}"/>`; } w += `<circle cx="${R(x)}" cy="${R(y)}" r="30" fill="#fff6c8" opacity=".85" filter="url(#blur8)"/><circle cx="${R(x)}" cy="${R(y)}" r="11" fill="#fffdf0"/>`; }
    if (t >= land) {
      n++; const d = t - land, p = backOut(clamp(d * 2.5));
      if (d < .7) w += `<circle cx="${lx}" cy="${ly - 20}" r="${R(30 + d * 160)}" fill="none" stroke="#fff6c8" stroke-width="${R(8 * (1 - d / .7))}" opacity="${R(1 - d / .7)}"/>`;
      w += `<rect x="${lx - 6}" y="${ly - 260}" width="12" height="240" fill="#fff6c8" opacity="${R(.35 + .15 * Math.sin(t * 3 + i))}" filter="url(#blur8)"/><circle cx="${lx}" cy="${ly - 34}" r="44" fill="#fff3a0" opacity=".5" filter="url(#blur8)"/>` + G(at(lx, ly, R(.36 * p)), shivling());
    }
  }
  let ov = n > 0 && t < 39.9 ? G(at(1730, 160), `<circle r="90" fill="#fff6dc" stroke="${OUT}" stroke-width="8"/>` + txt(0, 30, String(n), 96, '#8f1420', { sw: 0 })) : '';
  ov += titleAt(t, 39.8, 960, 200, '१२ ज्योतिर्लिंग', 150);
  return cam(960, 540, lerp(1.0, 1.04, prog(t, 32.5, 42.0)), w) + vignette(.28) + ov;
}
// F5 — Kailash: "I want a home of our own"
function f5(t) {
  const sp = between(t, 48.25, 51.36) || between(t, 51.8, 54.17);
  let w = bg(t, 2, { cx: 960, cy: 300, rays: .14 }) + peaks(980) + clouds(t, 2, 1010);
  w += G(at(760, 1040, 1.0), shiva({ t, smile: .5, tSide: -1, armL: [50, -45], armR: [16, 8], look: [4, 0] }));
  w += G(at(1160, 1040, 1.0), parvati({ t, smile: .5, look: [-4, 0], open: sp ? talk(t) * .8 : 0, armL: sp ? [60, 30 + 6 * Math.sin(t * 3)] : [30, -120], handL: sp ? 'palm' : undefined }));
  const hb = backOut(prog(t, 51.9, 52.4)) * (1 - prog(t, 54.2, 54.5));
  if (hb > 0) w += `<circle cx="1230" cy="380" r="12" fill="#fff6dc" stroke="${OUT}" stroke-width="5"/><circle cx="1290" cy="330" r="20" fill="#fff6dc" stroke="${OUT}" stroke-width="5"/>` + G(at(1420, 220, R(hb)), `<circle r="150" fill="#fff6dc" stroke="${OUT}" stroke-width="7"/>` + G('translate(0,90) scale(.48)', house('#ffe1a6', 0)) + G('translate(0,94) scale(.5)', diya(t, 1)) + `<path d="M-60,-118 C-60,-150 -20,-150 0,-122 C20,-150 60,-150 60,-118 C60,-90 20,-70 0,-50 C-20,-70 -60,-90 -60,-118Z" fill="#e8402e" stroke="${OUT}" stroke-width="4" transform="scale(.6) translate(0,-30)"/>`);
  return cam(960, 560, lerp(1.0, 1.06, prog(t, 42.0, 54.5)), w) + vignette(.22) + popRibbon(t, 49.2, 51.5, 520, 200, 'पिता हिमालय का घर', 62, 520);
}
// F6a — Mahadev smiles and looks across the earth
function f6a(t) {
  const g = ease(prog(t, 56.4, 57.2));
  let w = bg(t, 2, { cx: 960, cy: 300, rays: .14 }) + peaks(980) + clouds(t, 2, 1010);
  w += G(at(960, 1040, 1.0), shiva({ t, smile: .7, tSide: -1, armL: [50, -45], armR: [16, 8], look: [0, 4], lid: g > 0 ? .3 : 0 }));
  if (g > 0) { const sw = Math.sin((t - 56.4) * 1.4) * 40; for (const sd of [-1, 1]) w += `<path d="M${960 + sd * 20},497 L${R(960 + sw * 8 + sd * 160 - 220)},1400 L${R(960 + sw * 8 + sd * 160 + 220)},1400Z" fill="#fff3a0" opacity="${R(.25 * g)}"/>`; w += `<circle cx="940" cy="497" r="16" fill="#fff3a0" opacity="${R(g)}" filter="url(#blur8)"/><circle cx="980" cy="497" r="16" fill="#fff3a0" opacity="${R(g)}" filter="url(#blur8)"/>`; }
  return cam(960, 520, lerp(1.25, 1.45, prog(t, 54.5, 59.2)), w) + vignette(.22) + popRibbon(t, 57.0, 59.1, 960, 140, 'दिव्य दृष्टि', 74, 380);
}
// F6b — his gaze follows the Ganga and rests on Kashi, the city on his trishul
function f6b(t) {
  const [cx, cy, z] = kf(t, [[59.2, [700, 500, 1.0]], [62.6, [1000, 520, 1.0]], [64.4, [1240, 500, 1.25]], [67.9, [1260, 480, 1.4]]]);
  const tri = ease(prog(t, 63.3, 64.4)) * (1 - .4 * prog(t, 66.4, 67.6));
  let w = skyGrad('skG', '#ff9a3c', '#ffe7a8') + sunRays(1260, 220, t, .12) + `<path d="M-400,420 Q300,360 800,410 T1700,390 T2320,420 L2320,1400 L-400,1400Z" fill="#9fd07a" stroke="${OUT}" stroke-width="5"/>`;
  for (let i = 0; i < 14; i++) w += G(at(-200 + rnd(i) * 2300, 470 + rnd(i + 5) * 600, .35 + rnd(i + 2) * .2), tree());
  w += `<path d="M-300,500 C200,560 300,760 700,740 C1000,720 1050,560 1260,600 C1500,640 1600,900 2300,980" stroke="${OUT}" stroke-width="96" fill="none" stroke-linecap="round"/><path d="M-300,500 C200,560 300,760 700,740 C1000,720 1050,560 1260,600 C1500,640 1600,900 2300,980" stroke="#5fb0d8" stroke-width="80" fill="none" stroke-linecap="round"/>`;
  for (let i = 0; i < 10; i++) { const u = ((t * .05 + i / 10) % 1); w += `<circle cx="${R(-300 + u * 2600)}" cy="${R(520 + 300 * Math.sin(u * 4))}" r="4" fill="#e6fbff" opacity=".6"/>`; }
  w += `<circle cx="1260" cy="520" r="${R(160 + 60 * tri)}" fill="#fff3a0" opacity="${R(.35 + .3 * tri)}" filter="url(#blur40)"/>`;
  if (tri > 0) w += G(at(1260, 640, .55), trishul(900), `opacity="${R(.55 * tri)}"`);
  w += G('translate(1260,560) scale(.24) translate(-960,-96)', kashi(t, 0, { noUmb: 1 }));
  w += `<path d="M${R(cx - 900)},${R(cy - 600)} L${R(cx + 900)},${R(cy - 600)}" stroke="none"/>`;
  return cam(cx, cy, z, w) + vignette(.25) + popRibbon(t, 59.6, 62.8, 960, 150, 'गंगा का तट', 74, 400) + titleAt(t, 66.8, 960, 190, 'काशी', 200);
}
// shared ghat set for the arrival
function ghatSet(t, dusk = 0) {
  let w = skyGrad('skGh', mix('#ff8a2a', '#3a2a7a', dusk), mix('#ffe7a8', '#ff9a4a', dusk)) + sunRays(960, 330, t, .14 * (1 - dusk)) + `<circle cx="960" cy="330" r="200" fill="#fff6cf" stroke="#ffcf6a" stroke-width="12" opacity="${R(1 - dusk)}"/>`;
  w += kashi(t, 520, { noUmb: 1 });
  for (let i = 0; i < 6; i++) w += `<rect x="-400" y="${616 + i * 44}" width="2720" height="44" fill="${i % 2 ? '#f3c98c' : '#ffe3b0'}" stroke="${OUT}" stroke-width="4"/>`;
  w += river(t, 880, 500);
  return w;
}
// F7 — they arrive in Kashi: "from today, this is our home"
function f7(t) {
  const mv = prog(t, 68.5, 71.7), e = 1 - Math.pow(1 - mv, 1.6), wk = mv < 1 ? (t - 68.5) * 7 : undefined, sp = between(t, 72.16, 77.54);
  let w = ghatSet(t);
  w += G(at(lerp(-260, 1160, e), 900 - (wk !== undefined ? Math.abs(Math.sin(wk + 1)) * 6 : 0), .95), parvati({ t, smile: .8, look: [-3, -1], armL: [30, -120] }));
  w += G(at(lerp(-560, 760, e), 900 - (wk !== undefined ? Math.abs(Math.sin(wk)) * 9 : 0), .95), shiva({ t, walk: wk, smile: .7, tSide: -1, armL: [50, -45], armR: sp ? [lerp(60, 110, .5 + .5 * Math.sin((t - 72.2) * 1.2)), 10] : [16, 8], handR: sp ? 'palm' : undefined, look: [4, 0], open: sp ? talk(t) * .8 : 0 }));
  return cam(960, 560, lerp(1.0, 1.05, prog(t, 67.9, 78.2)), w) + vignette(.22) + popRibbon(t, 73.3, 78.0, 960, 150, 'आज से यही हमारा घर', 70, 640);
}
// F8 — the earth splits; the endless light rises; Mahadev merges into it
function f8(t) {
  const C0 = 78.5, J0 = 79.8, crk = ease(prog(t, C0, J0)), jy = ease(prog(t, J0, J0 + .8)), enter = prog(t, 84.2, 86.0);
  const [sx, sy] = shakeXY(t, between(t, C0, J0 + 1.2) ? 9 * (1 - prog(t, J0 + .4, J0 + 1.2)) : 0);
  let w = ghatSet(t, .55) + `<rect x="-400" y="-300" width="2720" height="1800" fill="#0b1a4a" opacity=".25"/>`;
  w += crackGlow(t, 960, 900, crk) + jyoti(t, 960, -500, 905, lerp(60, 220, jy), jy);
  if (jy > 0) w += sunRays(960, 600, t, .2 * jy, '#fff6c8');
  w += G(at(1420, 900, .95), parvati({ t, smile: lerp(.2, .7, prog(t, 85, 86.5)), look: [-5, -2], brow: -.3, armL: [30, -120], armR: [30, -120], lid: 0 }));
  const shx = lerp(520, 960, ease(enter)), wk = between(t, 84.2, 85.6) ? (t - 84.2) * 6 : undefined;
  w += G(`translate(${R(shx)},900) scale(${R(.95 * (1 + .15 * enter))})`, shiva({ t, walk: wk, smile: .8, tSide: -1, armL: [50, -45], armR: enter > 0 ? [lerp(16, 150, ease(enter)), 10] : [16, 8], look: [5, -2], lid: enter > .5 ? .8 : 0 }), `opacity="${R(1 - prog(t, 85.3, 86.3))}"`);
  if (between(t, 85.3, 87.0)) { const u = prog(t, 85.3, 87.0); w += `<circle cx="960" cy="600" r="${R(200 + 600 * u)}" fill="#fffdf0" opacity="${R(.7 * Math.sin(u * Math.PI))}" filter="url(#blur40)"/>`; }
  return cam(960 + sx, 560 + sy, lerp(1.0, 1.06, prog(t, 78.2, 87.0)), w) + vignette(.3);
}
// F9a — Vishweshwar, lord of the universe
function f9a(t) {
  let w = skyGrad('skJ', '#140824', '#3a1a4a') + `<rect x="-400" y="860" width="2720" height="600" fill="#2a1830" stroke="${OUT}" stroke-width="5"/>`;
  w += jyoti(t, 960, -400, 760, 150, 1) + sunRays(960, 640, t, .18, '#ffd27a') + `<circle cx="960" cy="660" r="300" fill="#ffd27a" opacity=".38" filter="url(#blur40)"/>`;
  w += G(at(960, 920, 1.7), shivling());
  for (let i = 0; i < 6; i++) w += G(at(820 + i * 56, 925 - (i % 2) * 6, .9, -20 + i * 8), `<path d="M0,0 C-20,-20 -16,-46 0,-60 C16,-46 20,-20 0,0Z" fill="#4e9a3a" stroke="${OUT}" stroke-width="3"/>`);
  w += G(at(560, 940), diya(t, 1, 1.3)) + G(at(1360, 940), diya(t, 4, 1.3));
  return cam(960, 560, lerp(1.0, 1.08, prog(t, 87.0, 92.9)), w) + vignette(.4) + titleAt(t, 89.3, 960, 170, 'विश्वेश्वर', 180) + popRibbon(t, 90.8, 92.9, 960, 360, 'पूरे विश्व के स्वामी', 66, 560);
}
// F9b — today's Kashi Vishwanath
function f9b(t) {
  let w = skyGrad('skV', '#ff8a2a', '#ffe7a8') + sunRays(960, 300, t, .18) + `<circle cx="960" cy="330" r="380" fill="#fff6cf" opacity=".7" filter="url(#blur40)"/>`;
  w += `<rect x="-400" y="860" width="2720" height="600" fill="#f2b05c" stroke="${OUT}" stroke-width="5"/>`;
  w += block(300, 860, 280, 300, '#f6c98a') + block(1620, 860, 300, 320, '#ffe1a6') + spire(960, 860, 380, 760, '#ffc21a', t) + spire(620, 860, 160, 330, '#e2562a', t) + spire(1300, 860, 160, 330, '#e2562a', t);
  for (let i = 0; i < 6; i++) w += G(at(140 + i * 330, 930, .9), diya(t, i));
  return cam(960, 540, lerp(1.0, 1.06, prog(t, 92.9, 96.5)), w) + vignette(.25) + titleAt(t, 94.2, 960, 170, 'काशी विश्वनाथ', 150);
}
// F10a — the garland of twelve (in the order of the Dvadasha Jyotirlinga Stotram); Vishwanath shines brightest
const JNAMES = ['सोमनाथ', 'मल्लिकार्जुन', 'महाकालेश्वर', 'ओंकारेश्वर', 'वैद्यनाथ', 'भीमाशंकर', 'रामेश्वरम', 'नागेश्वर', 'विश्वनाथ', 'त्र्यंबकेश्वर', 'केदारनाथ', 'घृष्णेश्वर'];
function f10a(t) {
  const CX = 960, CY = 560, RR = 310, hi = ease(prog(t, 97.6, 98.6)), app = prog(t, 96.4, 97.4);
  let w = skyGrad('skMala', '#0d1a4a', '#2a4fb0');
  for (let i = 0; i < 60; i++) w += `<circle cx="${R(rnd(i) * 1920)}" cy="${R(rnd(i + 9) * 1080)}" r="${R(1.5 + rnd(i + 3) * 3)}" fill="#fff8d8" opacity="${R(.25 + .4 * Math.abs(Math.sin(t * 1.2 + i)))}"/>`;
  w += `<circle cx="${CX}" cy="${CY}" r="${RR}" fill="none" stroke="#ffc21a" stroke-width="6" stroke-dasharray="4 18" stroke-linecap="round" opacity=".7"/>`;
  const orb = t * .9; w += `<circle cx="${R(CX + Math.cos(orb) * RR)}" cy="${R(CY + Math.sin(orb) * RR)}" r="16" fill="#fff6c8" opacity=".8" filter="url(#blur8)"/>`;
  JNAMES.forEach((nm, i) => {
    const a = -Math.PI / 2 + (i - 8) * Math.PI / 6, x = CX + Math.cos(a) * RR, y = CY + Math.sin(a) * RR, isK = i === 8;
    const p = backOut(clamp(app * 12 - ((i - 8 + 12) % 12) * .6)); if (p <= 0) return;
    const k = isK ? 1 + 1.1 * hi : 1, dim = isK ? 1 : 1 - .45 * hi;
    let node = `<circle r="${R(58 * k)}" fill="${isK ? mix('#fff3a0', '#ffc21a', hi) : '#fff3a0'}" opacity="${R(.45 + .2 * hi * (isK ? 1 : 0))}" filter="url(#blur8)"/><circle r="${R(46 * k)}" fill="${isK ? mix('#3a2a6a', '#8f1420', hi) : '#3a2a6a'}" stroke="#ffc21a" stroke-width="${R(5 * k)}"/>` + G(`translate(0,${R(30 * k)}) scale(${R(.26 * k)})`, shivling());
    if (isK && hi > 0) node = `<circle r="${R(110 + 14 * Math.sin(t * 4))}" fill="#fff3a0" opacity="${R(.45 * hi)}" filter="url(#blur20)"/>` + node;
    const ly = Math.abs(y - CY) <= 10 ? 0 : -(66 * k), lx = Math.abs(y - CY) <= 10 ? (x < CX ? -150 : 150) : 0;
    const lab = G(`translate(${lx},${ly})`, txt(0, 12, nm, isK ? R(34 + 14 * hi) : 32, isK ? '#ffe9b0' : '#fff6dc', { stroke: OUT, sw: 8 }));
    w += G(at(x, y, R(p)), node + lab, `opacity="${R(dim)}"`);
  });
  w += txt(CX, CY - 10, 'द्वादश', 64, '#ffd23c', { sw: 12 }) + txt(CX, CY + 66, 'ज्योतिर्लिंग', 64, '#ffd23c', { sw: 12 });
  return cam(960, 540, lerp(1.0, 1.04, prog(t, 96.5, 102.4)), w) + vignette(.3) + popRibbon(t, 99.2, 102.2, 1600, 250, 'सबसे विशेष', 70, 360);
}
// F10b — not a guest, but a householder
function f10b(t) {
  let w = skyGrad('skHo', '#ff9a3c', '#ffe7a8') + sunRays(1500, 260, t, .12) + `<rect x="-400" y="900" width="2720" height="600" fill="#e9a85c" stroke="${OUT}" stroke-width="5"/>`;
  w += G(at(960, 900, 1.25), house('#ffe1a6', 0)) + G(at(960, 905, 1.1), diya(t, 2)) + G(at(300, 900, .9), tree()) + G(at(1650, 900, .9), tree());
  w += G(at(620, 1040, .9), shiva({ t, smile: .8, noTrishul: true, armL: [16, 8], armR: [16, 8], look: [4, 0] })) + G(at(1300, 1040, .9), parvati({ t, smile: .85, look: [-4, 0], armL: [30, -120] }));
  const guest = G('translate(0,60) scale(.32)', house('#f6c98a', 0)) + G('translate(-50,90) scale(.28)', devotee('#c8281e', '#1c1420', '#d99a66', t * 6, 0)) + G('translate(70,40) scale(.24)', `<rect x="-60" y="-80" width="120" height="80" rx="10" fill="#8a4a1c" stroke="${OUT}" stroke-width="8"/>`);
  const home = G('translate(0,70) scale(.36)', house('#ffe1a6', 0)) + G('translate(0,76) scale(.5)', diya(t, 3)) + `<circle cx="0" cy="10" r="80" fill="#fff3a0" opacity=".35" filter="url(#blur8)"/>`;
  return cam(960, 560, 1.0, w) + vignette(.22) + medallion(330, 170, 110, `<rect x="-140" y="-140" width="280" height="280" fill="#cfe0ff"/>` + guest, 'x', prog(t, 102.7, 104.1), 'अतिथि') + medallion(1590, 170, 110, `<rect x="-140" y="-140" width="280" height="280" fill="#ffe9b0"/>` + home, 'ok', prog(t, 104.9, 106.3), 'गृहस्थ');
}
// F11 — the household of Kashi: Annapurna's kitchen, Bhairava at the gate, Vishwanath welcoming
function f11(t) {
  let w = skyGrad('skTr', '#7a1418', '#3a0a10');
  const P = [[107.2, 'रसोई — अन्नपूर्णा'], [109.8, 'द्वार — काल भैरव'], [112.7, 'स्वागत — विश्वनाथ']];
  P.forEach(([t0, lab], k) => {
    const p = ease(prog(t, t0, t0 + .6)); if (p <= 0) return;
    const x0 = 30 + k * 630, inner = k === 0
      ? `<rect width="600" height="1000" fill="#ffd9a0"/>` + halo(t, 300, 360, 110) + G('translate(300,820) scale(.62)', parvati({ t, smile: .85, armL: [150, 30], armR: [40, 70], held: ladleHeld([150, 30], 180) })) + G('translate(300,830) scale(.62)', akshayaPatra(t, .8))
      : k === 1
        ? skyGrad('skP2', '#ffb03c', '#fff3c0') + G('translate(300,880) scale(.62)', gate({ t })) + `<rect y="880" width="600" height="200" fill="#ffc86a"/>` + G('translate(300,900) scale(.62)', bhairava({ t, smile: .4, armL: [58, -52], held: G(at(armHand(-1, [58, -52])[0], armHand(-1, [58, -52])[1] + 190, 1), danda()) })) + G('translate(470,900) scale(.55)', dog(t))
        : `<rect width="600" height="1000" fill="#2a1838"/>` + jyoti(t, 300, -100, 600, 90, 1) + G('translate(300,700) scale(1.1)', shivling()) + [0, 1, 2].map(i => G(`translate(${140 + i * 160},${960 - (i % 2) * 30}) scale(.55)`, devotee(['#c8281e', '#3f9b46', '#ffd21f'][i], '#1c1420', '#d99a66', t * 6 + i, 1))).join('');
    w += G(`translate(${x0},${R(40 + 900 * (1 - p))})`, `<clipPath id="tp${k}"><rect width="600" height="1000" rx="24"/></clipPath><g clip-path="url(#tp${k})">${inner}</g><rect width="600" height="1000" rx="24" fill="none" stroke="#ffc21a" stroke-width="10"/>` + G('translate(300,70)', `<rect x="-230" y="-46" width="460" height="84" rx="16" fill="#fff6dc" stroke="${OUT}" stroke-width="6"/>` + txt(0, 20, lab, 48, '#8f1420', { sw: 0 })));
  });
  return w + vignette(.25);
}
// F12 — every particle of Kashi is Shankar
function f12(t) {
  let w = kashiScene(t, { sunY: 420, top: '#f06a1e', bot: '#ffe09a', tri: .6, id: 'skKK' });
  for (let i = 0; i < 26; i++) { const t0 = 117.5 + rnd(i) * 2.4, p = backOut(prog(t, t0, t0 + .4)); if (p > 0) { const x = 60 + rnd(i + 4) * 1800, y = 300 + rnd(i + 8) * 760; w += `<circle cx="${R(x)}" cy="${R(y - 30)}" r="40" fill="#fff3a0" opacity=".5" filter="url(#blur8)"/>` + G(at(x, y, R(.32 * p)), shivling()); } }
  return cam(960, 520, lerp(1.0, 1.06, prog(t, 117.3, 121.7)), w) + vignette(.25) + titleAt(t, 118.9, 960, 190, 'कण-कण शंकर', 170);
}
// F13 — cliffhanger: Mahadev leaves Kashi; who stopped him?
function f13(t) {
  const z = lerp(1.0, 1.08, prog(t, 121.7, 131.0)), wk = (t - 121.7) * 5;
  let w = skyGrad('skC', '#3a2a7a', '#ff9a4a') + `<circle cx="1500" cy="200" r="80" fill="#fff3c0" opacity=".9"/>`;
  w += G('translate(-700,0)', kashi(t, 620, { noUmb: 1 }), 'opacity=".75"') + `<rect x="-400" y="716" width="2720" height="700" fill="#c4743a" stroke="${OUT}" stroke-width="5"/>`;
  w += `<path d="M300,716 L1900,1000 L1900,1300 L100,1300Z" fill="#d9894a" opacity=".6"/>`;
  const sx = lerp(620, 1060, prog(t, 122.0, 127.0));
  w += G(at(sx, 1010 - Math.abs(Math.sin(wk)) * 8, 1.0), shiva({ t, walk: t < 127 ? wk : undefined, smile: -.4, brow: -.6, tSide: 1, armR: [50, -45], armL: [20 + 14 * Math.sin(wk), 14], look: [-5, 0], tilt: -4 }));
  const ks = ease(prog(t, 127.9, 128.6));
  if (ks > 0) w += `<ellipse cx="1560" cy="640" rx="${R(200 * ks)}" ry="${R(280 * ks)}" fill="#fff3a0" opacity="${R(.45 * ks)}" filter="url(#blur40)"/>` + G(at(1560, 1000, 1.2), kingSil(), `opacity="${R(ks)}"`);
  let ov = titleAt(t, 123.9, 960, 170, 'महादेव ने छोड़ी काशी?', 120, 127.8) + titleAt(t, 128.0, 960, 170, 'किसने रोका?', 150);
  [[1300, 380, -12, 129.5], [1820, 340, 12, 129.8]].forEach(([x, y, r, t0], i) => { const p = backOut(prog(t, t0, t0 + .35)); if (p > 0) ov += G(at(x, y + 8 * Math.sin(t * 4 + i), R(p), r), txt(0, 0, '?', 180, '#fff3c0', { stroke: '#8f1420', sw: 26 })); });
  return cam(1000, 560, z, w) + vignette(.35) + ov;
}
// F14 — end card
function f14(t) {
  const hp = prog(t, 134.2, 134.65), z = lerp(1, 1.06, prog(t, 131.0, DURATION));
  let w = bg(t, lerp(1, .35, ease(hp)), { rays: .2 + .15 * hp });
  w += `<circle cx="960" cy="560" r="${R(330 + 120 * hp)}" fill="#ffe27a" opacity="${R(.5 + .3 * hp)}" filter="url(#blur40)"/>`;
  w += G(at(960, 1330, 1 + .02 * Math.sin(t * 2)), trishul(690));
  for (let i = 0; i < 7; i++) w += G(at(600 + i * 120, 1090, 1.5 + .5 * rnd(i)), flame(t, i + 30));
  w += embers(t, 960, 900, 40);
  const p1 = backOut(prog(t, 131.3, 131.75)) * (1 - prog(t, 133.6, 133.9));
  if (p1 > 0) w += G(at(960, 270, R(p1)), txt(0, 0, 'जानिए अगले भाग में…', 110, '#fff3c0', { sw: 20 }));
  if (hp > 0) {
    let burst = ''; for (let i = 0; i < 18; i++) burst += `<path d="M0,-${R(300 + 500 * hp)} L-14,-${R(380 + 620 * hp)} L14,-${R(380 + 620 * hp)}Z" transform="rotate(${i * 20})" fill="#fff6c8"/>`;
    w += G('translate(960,330)', burst, `opacity="${R((1 - hp) * .9)}"`);
    w += G(at(960, 330, R(lerp(2.4, 1, easeOut(hp)) * (1 + .02 * Math.sin(t * 5)))), txt(0, 60, 'हर हर महादेव!', 210, '#ffd23c', { sw: 34 }) + txt(0, 60, 'हर हर महादेव!', 210, '#ffd23c', { stroke: '#c8281e', sw: 9 }), `opacity="${R(clamp(hp * 2.5))}"`);
  }
  const fade = prog(t, DURATION - .6, DURATION);
  return cam(960, 540, z, w) + vignette(.45) + (fade > 0 ? `<rect width="1920" height="1080" fill="#1a0406" opacity="${R(fade)}"/>` : '');
}

const SCENES = [
  [0, f1a, 'fade'], [6.5, f1b, 'fade'], [13.6, f2, 'fade'], [20.2, f3, 'fade'], [29.6, f4a, 'flash'], [32.5, f4b, 'fade'], [42.0, f5, 'fade'],
  [54.5, f6a, 'fade'], [59.2, f6b, 'fade'], [67.9, f7, 'fade'], [78.2, f8, 'fade'], [87.0, f9a, 'flash'], [92.9, f9b, 'fade'], [96.5, f10a, 'fade'],
  [102.4, f10b, 'fade'], [107.0, f11, 'fade'], [117.3, f12, 'fade'], [121.7, f13, 'fade'], [131.0, f14, 'fade'],
];
function renderFrame(t) {
  let i = SCENES.length - 1;
  while (i > 0 && t < SCENES[i][0]) i--;
  let out = DEFS + SCENES[i][1](t);
  const X = .22;
  if (i < SCENES.length - 1 && SCENES[i + 1][2] === 'fade' && t > SCENES[i + 1][0] - X)
    out += `<g opacity="${R(ease(prog(t, SCENES[i + 1][0] - X, SCENES[i + 1][0] + X)))}">${SCENES[i + 1][1](t)}</g>`;
  else if (i > 0 && SCENES[i][2] === 'fade' && t < SCENES[i][0] + X)
    out = DEFS + SCENES[i - 1][1](t) + `<g opacity="${R(ease(prog(t, SCENES[i][0] - X, SCENES[i][0] + X)))}">${SCENES[i][1](t)}</g>`;
  if (i > 0 && SCENES[i][2] === 'flash' && t < SCENES[i][0] + .3) out += `<rect width="1920" height="1080" fill="#fff6d8" opacity="${R(1 - prog(t, SCENES[i][0], SCENES[i][0] + .3))}"/>`;
  if (t < .4) out += `<rect width="1920" height="1080" fill="#1a0406" opacity="${R(1 - prog(t, 0, .4))}"/>`;
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
