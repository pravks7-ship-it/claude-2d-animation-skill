// Episode 4 — Annapurna: why Mahadev begged for food, and at whose door his hunger ended.
// Timings come from the pauses in audio/narration.wav
const CAPS = [
  [0.30, 4.85, 'पिछली कथा में आपने देखा था कि काशी त्रिशूल की नोक पर बसी है,'],
  [5.49, 7.82, 'मणिकर्णिका में महादेव की मणि गिरी,'],
  [8.33, 11.49, 'और विष्णु जी के वर से काशी मोक्ष की नगरी बन गई।'],
  [12.39, 16.29, 'पर सवाल यह था कि जिस नगरी में मुक्ति इतनी सहज है,'],
  [16.79, 19.28, 'वहाँ स्वयं महादेव को भिक्षा क्यों माँगनी पड़ी?'],
  [20.11, 23.96, 'एक बार कैलाश पर शिव जी और माता पार्वती के बीच बात छिड़ी।'],
  [24.72, 28.36, 'महादेव बोले, “देवी, यह सारा संसार माया है।'],
  [28.82, 32.39, 'यह शरीर भी माया है, और भोजन भी केवल माया है।”'],
  [33.17, 34.44, 'माता पार्वती चुप हो गईं।'],
  [35.07, 40.28, 'उन्होंने सोचा, अगर अन्न माया है, तो देखती हूँ, संसार उसके बिना कैसे चलता है।'],
  [41.11, 42.53, 'और वे अंतर्धान हो गईं।'],
  [43.34, 46.57, 'उनके जाते ही धरती से अन्न गायब हो गया।'],
  [47.25, 49.70, 'खेत सूख गए, चूल्हे ठंडे पड़ गए,'],
  [50.03, 51.97, 'और तीनों लोकों में भूख फैल गई।'],
  [52.63, 57.05, 'देवता, ऋषि, मनुष्य, सब अन्न के एक-एक दाने को तरसने लगे।'],
  [57.72, 60.36, 'और भूख ने स्वयं महादेव को भी नहीं छोड़ा।'],
  [60.95, 63.65, 'तब शिव जी भिक्षा का पात्र लेकर निकल पड़े,'],
  [64.45, 67.72, 'पर जिस द्वार पर जाते, वहाँ से खाली हाथ लौटते।'],
  [68.57, 74.39, 'फिर उन्हें पता चला कि पूरे संसार में केवल एक जगह रसोई जल रही है, काशी में।'],
  [75.26, 78.29, 'वहाँ माता पार्वती अन्नपूर्णा बनकर बैठी थीं,'],
  [79.12, 83.27, 'हाथ में सोने की करछी, और सामने अन्न का अक्षय पात्र।'],
  [83.99, 88.05, 'महादेव उनके द्वार पर पहुँचे, पात्र आगे बढ़ाया और बोले,'],
  [88.35, 89.51, '“भिक्षां देहि।”'],
  [90.39, 93.94, 'माता मुस्कुराईं और अपने हाथों से उनका पात्र भर दिया।'],
  [94.65, 98.79, 'महादेव ने भोजन ग्रहण किया और कहा, “देवी, आज समझ आया,'],
  [99.37, 104.19, 'अन्न माया नहीं है। अन्न ही जीवन है, अन्न ही ब्रह्म है।”'],
  [105.06, 108.12, 'तभी से काशी में माँ अन्नपूर्णा का वास है,'],
  [108.72, 111.63, 'और कहते हैं, काशी में कोई भूखा नहीं सोता।'],
  [112.36, 115.44, 'विश्वनाथ मंदिर के पास माँ अन्नपूर्णा का मंदिर है,'],
  [115.91, 121.16, 'और मान्यता है कि दीपावली के समय वहाँ माँ की सोने की प्रतिमा के दर्शन होते हैं।'],
  [121.86, 126.56, 'पर महादेव काशी में विश्वनाथ बनकर ज्योतिर्लिंग रूप में क्यों विराजे?'],
  [127.34, 128.92, 'जानिए अगले भाग में।'],
  [129.64, 130.93, 'हर हर महादेव!'],
];
const DURATION = 132.0;
const between = (t, a, b) => t >= a && t <= b;
const showFor = (t, a, b, inner) => { const p = prog(t, a, a + .4), q = 1 - prog(t, b - .3, b); return p > 0 && q > 0 ? G('', inner(p), `opacity="${R(q)}"`) : ''; };
const popRibbon = (t, a, b, x, y, s, size = 76, w = 520) => showFor(t, a, b, p => G(at(x, y), G(`scale(${R(backOut(clamp(p * 1.4)))})`, ribbonLabel(s, size, w))));

// D1a — recap: Kashi on the trishul
function d1a(t) {
  let w = bg(t, 2, { cx: 960, cy: 380, rays: .2 });
  for (let i = 0; i < 4; i++) w += G(at(-200 + i * 760 + 60 * Math.sin(t * .3 + i), 180 + 70 * (i % 2), 1.4), cloudPad(160), 'opacity=".75"');
  w += G(at(960, 430, 1), kashiOnTrishul(t, 1.0, 1300, .6 + .3 * Math.sin(t * 2))) + clouds(t, 2, 1290) + clouds(t + 30, 2, 1420);
  const rp = backOut(prog(t, .3, .8)) * (1 - prog(t, 4.7, 5.2));
  const ribbon = rp > 0 ? G(at(60, 70, 1), G(`scale(${R(rp)})`, `<path d="M0,0 L470,0 L440,46 L470,92 L0,92Z" fill="#8f1420" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/>` + txt(215, 64, 'पिछली कथा में…', 52, '#ffe9b0', { sw: 0 }))) : '';
  return cam(960, 600, lerp(.84, .9, prog(t, 0, 5.2)), w) + vignette(.25) + ribbon;
}
// D1b — recap: the mani falls into the kund
function d1b(t) {
  const E0 = 5.5, E1 = 6.6, dt = t - E1;
  let w = bg(t, 2, { cx: 960, cy: 200, rays: .16 }) + `<rect x="-400" y="700" width="2720" height="800" fill="#e9a85c" stroke="${OUT}" stroke-width="5"/>`;
  w += G(at(250, 720, 1.2), tree()) + G(at(1700, 720, 1.3), tree());
  w += G(at(960, 820, 1.3), kundPit(t, 1, 1, t > E1 ? .8 * Math.exp(-dt * .5) : 0));
  if (between(t, E0, E1)) { const u = prog(t, E0, E1); w += `<circle cx="960" cy="${R(lerp(-60, 800, u * u))}" r="50" fill="#fff3a0" opacity=".7" filter="url(#blur8)"/>` + G(at(960, lerp(-60, 800, u * u), 1.4, u * 540), maniJewel()); }
  if (dt > 0) for (let i = 0; i < 4; i++) { const ph = (dt * .7 + i * .25) % 1; w += `<ellipse cx="960" cy="830" rx="${R(40 + ph * 300)}" ry="${R(12 + ph * 90)}" fill="none" stroke="#fff" stroke-width="${R(8 * (1 - ph))}" opacity="${R(1 - ph)}"/>`; }
  const tp = prog(t, 6.7, 7.1);
  return cam(960, 600, 1.0, w) + vignette(.22) + (tp > 0 ? G(at(960, 200), bigTitle('मणिकर्णिका', 170, tp)) : '');
}
// D1c — the city of moksha (and the question)
function d1c(t) {
  const z = lerp(1.0, 1.08, prog(t, 8.1, 16.6));
  let w = kashiScene(t, { sunY: 420, top: '#ff8a2a', bot: '#ffe7a8', tri: .8 + .2 * Math.sin(t * 2), id: 'skM' });
  for (let i = 0; i < 14; i++) { const ph = (t * .22 + i / 14) % 1, x = 120 + rnd(i) * 1680 + 20 * Math.sin(ph * 6 + i), y = 600 - ph * 560; w += `<circle cx="${R(x)}" cy="${R(y)}" r="24" fill="#fff3a0" opacity="${R(.45 * Math.sin(ph * Math.PI))}" filter="url(#blur8)"/><circle cx="${R(x)}" cy="${R(y)}" r="9" fill="#fffdf0" opacity="${R(Math.sin(ph * Math.PI))}"/>`; }
  const ov = showFor(t, 9.3, 12.2, p => G(at(960, 180), bigTitle('मोक्ष की नगरी', 130, p)));
  return cam(960, 520, z, w) + vignette(.25) + ov;
}
// D2 — yet Mahadev begged?
function d2(t) {
  const W = 230 * (t - 16.6), wk = (t - 16.6) * 6.5;
  let w = skyGrad('skS', '#ff8a3c', '#ffe1a0') + sunRays(1500, 260, t, .12) + `<circle cx="1500" cy="260" r="110" fill="#fff3c0" stroke="#ffb03c" stroke-width="10"/>`;
  const cols = ['#ffe1a6', '#f6b98a', '#ffd27a', '#f2a66a'];
  for (let i = -1; i < 12; i++) { const sx = i * 440 + 300 - W; if (sx < -500 || sx > 2500) continue; w += G(at(sx, 900), i % 5 === 3 ? tree() : houseClosed(cols[((i % 4) + 4) % 4])); }
  w += `<rect x="-400" y="900" width="2720" height="500" fill="#e9a85c" stroke="${OUT}" stroke-width="5"/>`;
  const armR = [52, 60], h = armHand(1, armR);
  w += G(at(960, 1010 - Math.abs(Math.sin(wk)) * 9, 1.12), shiva({ t, walk: wk, noTrishul: true, armR, armL: [20 + 16 * Math.sin(wk), 14], smile: -.35, brow: -.6, look: [2, 2], tilt: 3, held: G(at(h[0], h[1] - 14), bowl()) }));
  const tp = prog(t, 17.3, 17.7);
  return cam(960, 560, 1.0, w) + vignette(.25) + (tp > 0 ? G(at(960, 180), bigTitle('महादेव और भिक्षा?', 130, tp)) : '');
}

// D3 — on Kailash: "all is maya"; Parvati falls silent, resolves, and vanishes
function kailash(t) {
  const [cx, cy, z] = kf(t, [[19.9, [960, 560, 1.0]], [24.2, [960, 560, 1.03]], [33.0, [960, 560, 1.03]], [34.2, [1180, 520, 1.4]], [40.6, [1180, 520, 1.45]], [41.4, [960, 560, 1.0]], [43.0, [960, 560, 1.02]]]);
  const V0 = 41.15, gone = ease(prog(t, V0, V0 + 1.0));
  const sSpeak = between(t, 24.72, 28.36) || between(t, 28.82, 32.39);
  let w = bg(t, 2, { cx: 960, cy: 300, rays: .14 }) + peaks(980) + clouds(t, 2, 1010);
  const shiftedLook = between(t, V0, 43) ? [5, 0] : [4, 0];
  w += G(at(700, 1040, 1.0), shiva({ t, smile: between(t, V0, 43) ? -.2 : .4, open: sSpeak ? talk(t) * .8 : (between(t, V0 + .3, 42.6) ? .4 : 0), noTrishul: true, armL: [16, 8], armR: sSpeak ? [72, 30 + 6 * Math.sin(t * 3)] : [16, 8], handR: sSpeak ? 'palm' : undefined, look: shiftedLook, brow: between(t, V0, 43) ? -.6 : 0 }));
  const pv = t < V0 ? 1 : 1 - gone;
  if (pv > 0) w += G(`translate(1220,1040) scale(${R(1 + .3 * gone)},${R(1 - .4 * gone)})`, parvati({ t, smile: t < 33 ? .5 : -.15, brow: t < 33 ? 0 : .45, look: t < 33 ? [-4, 0] : (between(t, 35, 40.4) ? [0, -3] : [-3, 1]), lid: between(t, 33.2, 34.5) ? .5 : 0, armL: t > 35 && t < 40.5 ? [40, -150] : [30, -120], armR: [16, 8] }), `opacity="${R(pv)}"`);
  if (t > V0 - .2 && t < V0 + 2.2) { const u = prog(t, V0 - .2, V0 + 2.2); for (let i = 0; i < 26; i++) { const a = i * 2.39 + u * 6, r = 40 + u * 360 * (.4 + .6 * rnd(i)); w += `<circle cx="${R(1220 + Math.cos(a) * r)}" cy="${R(740 + Math.sin(a) * r * .9 - u * 200)}" r="${R(5 + 8 * rnd(i + 3))}" fill="#fff3a0" opacity="${R(Math.sin(u * Math.PI))}"/>`; } w += `<circle cx="1220" cy="740" r="${R(120 + 260 * u)}" fill="#fff6c8" opacity="${R(.6 * Math.sin(u * Math.PI))}" filter="url(#blur40)"/>`; }
  // what Shiva calls maya
  const items = [[560, 140, globeIcon(), 26.6, 'संसार = माया'], [960, 140, bodyIcon(), 28.9, 'शरीर = माया'], [1360, 140, G('scale(.95)', thali()), 30.5, 'भोजन = माया']];
  let med = '';
  items.forEach(([x, y, icon, t0, lab]) => { const p = prog(t, t0, t0 + 1.4) * (1 - prog(t, 32.7, 33.2)); if (p > 0) med += medallion(x, y, 100, `<rect x="-120" y="-120" width="240" height="240" fill="#f3e6ff"/>` + G(`scale(.78) translate(${R(3 * Math.sin(t * 5))},0)`, icon, `opacity="${R(.65 + .35 * Math.sin(t * 4))}"`) + mayaWave(t, 120), '', p, lab); });
  // Parvati's thought: "without grain?"
  const tb = backOut(prog(t, 35.4, 35.9)) * (1 - prog(t, 40.3, 40.7));
  if (tb > 0) w += `<circle cx="1110" cy="400" r="12" fill="#fff6dc" stroke="${OUT}" stroke-width="5"/><circle cx="1060" cy="350" r="20" fill="#fff6dc" stroke="${OUT}" stroke-width="5"/>` + G(at(960, 250, R(tb)), `<circle r="150" fill="#fff6dc" stroke="${OUT}" stroke-width="7"/>` + G('translate(0,10) scale(.8)', thali()) + `<path d="M-100,-90 L100,110" stroke="${OUT}" stroke-width="26" stroke-linecap="round" opacity=".9"/><path d="M-100,-90 L100,110" stroke="#e02414" stroke-width="15" stroke-linecap="round"/>` + txt(80, -80, '?', 110, '#8f1420', { stroke: '#fff', sw: 14 }));
  return cam(cx, cy, z, w) + vignette(.22) + med;
}

// D5a — grain vanishes: fields wither, the stoves go cold
function d5a(t) {
  const lift = prog(t, 43.4, 46.4), dry = ease(prog(t, 46.6, 48.0)), crk = ease(prog(t, 47.2, 48.4)), fire = 1 - ease(prog(t, 48.5, 49.3));
  const z = lerp(1.0, 1.05, prog(t, 43.0, 49.9));
  let w = skyGrad('skF', mix('#ff9a3c', '#c9773a', dry), mix('#ffe7a8', '#e8c48a', dry)) + `<circle cx="1500" cy="250" r="${R(110 + 20 * dry)}" fill="${mix('#fff3c0', '#ffd27a', dry)}" stroke="#ffb03c" stroke-width="10"/>`;
  w += `<path d="M-400,640 Q300,560 760,620 T1600,600 T2320,640 L2320,760 L-400,760Z" fill="${mix('#e88a3c', '#b8723a', dry)}" stroke="${OUT}" stroke-width="5"/>`;
  w += `<rect x="-400" y="740" width="2720" height="700" fill="${mix('#e9a85c', '#c79060', dry)}" stroke="${OUT}" stroke-width="5"/>` + cracks(crk, 2400, 760);
  for (let r = 0; r < 3; r++) for (let i = 0; i < 30; i++) w += G(at(-80 + i * 72 + r * 30, 820 + r * 70, .9 + r * .15), wheat(t, dry, i + r * 7));
  for (let i = 0; i < 40; i++) { const st = 43.4 + rnd(i) * 2.4, u = prog(t, st, st + 1.4); if (u > 0 && u < 1) w += `<ellipse cx="${R(-60 + rnd(i + 2) * 2000 + 30 * Math.sin(u * 6 + i))}" cy="${R(700 - u * 420)}" rx="7" ry="11" fill="#f2b51c" stroke="${OUT}" stroke-width="2" opacity="${R(1 - u)}"/>`; }
  if (lift > 0 && lift < 1) w += sparkles(t, 960, 450, 800, 10, '#fff3c0');
  w += G(at(1560, 1000, 1.25), chulha(t, fire));
  return cam(960, 600, z, w) + vignette(.3 + .15 * dry);
}
// D5b — hunger in all three worlds
function d5b(t) {
  let w = '';
  const labs = ['स्वर्ग', 'पृथ्वी', 'पाताल'];
  for (let k = 0; k < 3; k++) {
    const wp = ease(prog(t, 50.0 + k * .5, 50.9 + k * .5));
    w += G(`translate(0,${k * 360})`, `<clipPath id="lp${k}"><rect width="1920" height="360"/></clipPath><g clip-path="url(#lp${k})">` + lokaPanel(k, t) + `<rect width="${R(1920 * wp)}" height="360" fill="#4a3a30" opacity=".55"/></g><rect width="1920" height="360" fill="none" stroke="${OUT}" stroke-width="8"/>`);
    w += G(at(140, k * 360 + 70), `<rect x="-110" y="-44" width="220" height="80" rx="16" fill="#fff6dc" stroke="${OUT}" stroke-width="6"/>` + txt(0, 20, labs[k], 52, '#8f1420', { sw: 0 }));
  }
  return w + vignette(.25);
}
// D5c — gods, sages, people: all longing for a grain
function d5c(t) {
  const z = lerp(1.0, 1.05, prog(t, 52.4, 57.5));
  let w = skyGrad('skH', '#c9773a', '#e8c48a') + `<circle cx="1550" cy="220" r="120" fill="#ffd27a" stroke="#ffb03c" stroke-width="10"/>`;
  w += `<rect x="-400" y="760" width="2720" height="700" fill="#c79060" stroke="${OUT}" stroke-width="5"/>` + cracks(1, 2400, 780);
  const figs = [[420, 'देवता', { skin: '#f2c58e', hair: '#2b1a14', crown: 1, seed: 1 }, 52.7], [960, 'ऋषि', { skin: '#c98a58', hair: '#6b6b6b', seed: 2 }, 53.5], [1500, 'मनुष्य', { skin: '#d99a66', hair: '#1c1420', seed: 3 }, 54.2]];
  figs.forEach(([x, lab, o, t0]) => {
    w += G(at(x, 960, 1.0), seatedWithBowl(t, { ...o, look: [0, 4] }));
    const p = backOut(prog(t, t0, t0 + .4)); if (p > 0) w += G(at(x, 360, R(p)), `<rect x="-120" y="-46" width="240" height="84" rx="16" fill="#fff6dc" stroke="${OUT}" stroke-width="6"/>` + txt(0, 20, lab, 54, '#8f1420', { sw: 0 }));
  });
  const gp = prog(t, 55.2, 57.4); if (gp > 0 && gp < 1) w += G(at(960, lerp(160, 260, gp), 1.6, gp * 60), `<ellipse rx="9" ry="14" fill="#f2b51c" stroke="${OUT}" stroke-width="3"/>`) + `<circle cx="960" cy="${R(lerp(160, 260, gp))}" r="40" fill="#fff3a0" opacity=".5" filter="url(#blur8)"/>`;
  return cam(960, 560, z, w) + vignette(.35);
}
// D5d — hunger reaches Mahadev himself
function d5d(t) {
  const z = lerp(1.15, 1.25, prog(t, 57.5, 60.6));
  let w = bg(t, 2, { cx: 960, cy: 300, rays: .1 }) + `<rect x="-1500" y="-1200" width="4920" height="3500" fill="#5a3a30" opacity=".25"/>` + peaks(980) + clouds(t, 2, 1010);
  w += G(at(960, 1040, 1.0), shiva({ t, smile: -.4, brow: -.7, armR: [-15, -75], tSide: -1, armL: [50, -45], look: [0, 3], tilt: -4 }));
  w += hungerLines(t, 960, 640);
  return cam(960, 560, z, w) + vignette(.35);
}
// D6 — door to door, empty-handed
function d6(t) {
  const W = 230 * (t - 60.6), wk = (t - 60.6) * 6.5;
  let w = skyGrad('skS2', '#e07a3a', '#ffd9a0') + sunRays(1500, 260, t, .1) + `<circle cx="1500" cy="260" r="110" fill="#fff3c0" stroke="#ffb03c" stroke-width="10"/>`;
  w += G(`translate(${R(-((W * .25) % 960))},0)`, `<path d="M-200,820 L60,580 L300,720 L560,540 L760,820 L1020,580 L1260,720 L1520,540 L1720,820 L1980,580 L2220,720 L2480,540 L2900,820Z" fill="#c9773a" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/>`);
  const cols = ['#ffe1a6', '#f6b98a', '#ffd27a', '#f2a66a'];
  for (let i = -1; i < 20; i++) { const sx = i * 440 + 300 - W; if (sx < -500 || sx > 2500) continue; w += G(at(sx, 900), houseClosed(cols[((i % 4) + 4) % 4])); if (t > 64.4 && sx > 700 && sx < 1250) w += G(at(sx, 560, 1), txt(0, 0, '✕', 110, '#e02414', { stroke: '#fff6dc', sw: 14 }), `opacity="${R(clamp((1250 - sx) / 200) * clamp((sx - 700) / 200))}"`); }
  w += `<rect x="-400" y="900" width="2720" height="500" fill="#d9984c" stroke="${OUT}" stroke-width="5"/>`;
  const armR = [52, 60], h = armHand(1, armR);
  w += G(at(960, 1010 - Math.abs(Math.sin(wk)) * 9, 1.12), shiva({ t, walk: wk, noTrishul: true, armR, armL: [20 + 16 * Math.sin(wk), 14], smile: -.4, brow: -.7, look: [3, 1], tilt: 3, held: G(at(h[0], h[1] - 14), bowl()) }));
  const ov = popRibbon(t, 66.0, 68.4, 960, 160, 'खाली हाथ', 80, 380);
  return cam(960, 560, 1.0, w) + vignette(.3) + ov;
}
// D7 — a dark world; one kitchen still burning — in Kashi
function d7(t) {
  const [cx, cy, z] = kf(t, [[68.4, [960, 560, 1.0]], [71.6, [960, 600, 1.15]], [74.4, [960, 720, 2.2]], [75.0, [960, 730, 2.3]]]);
  let w = skyGrad('skW', '#070d2a', '#1d3a8a');
  for (let i = 0; i < 70; i++) w += `<circle cx="${R(-200 + rnd(i) * 2320)}" cy="${R(-100 + rnd(i + 9) * 700)}" r="${R(1.5 + rnd(i + 3) * 3)}" fill="#fff8d8" opacity="${R(.3 + .5 * Math.abs(Math.sin(t * 1.2 + i)))}"/>`;
  w += `<ellipse cx="960" cy="2600" rx="2600" ry="1900" fill="#2a2a4a" stroke="${OUT}" stroke-width="6"/>`;
  for (let i = 0; i < 9; i++) { const x = 120 + i * 210, k = .18 + rnd(i) * .06; if (Math.abs(x - 960) < 140) continue; w += G(at(x, 760 + 20 * rnd(i + 4), k), houseClosed('#4a4a66'), 'opacity=".8"'); }
  const lit = ease(prog(t, 70.2, 71.2));
  w += `<circle cx="960" cy="700" r="${R(80 + 200 * lit)}" fill="#ffb21c" opacity="${R(.25 + .4 * lit)}" filter="url(#blur40)"/>`;
  w += G('translate(960,760) scale(.22) translate(-960,-96)', kashi(t, 0, { noUmb: 1 }));
  for (let i = 0; i < 3; i++) { const ph = (t * .5 + i / 3) % 1; w += `<path d="M${R(985 + i * 6)},${R(690 - ph * 120)} q12,-18 0,-36 q-12,-18 0,-36" stroke="#d8d0e0" stroke-width="5" fill="none" stroke-linecap="round" opacity="${R(.6 * (1 - ph))}"/>`; }
  let ov = popRibbon(t, 71.0, 73.8, 960, 170, 'बस एक रसोई जल रही है', 70, 700);
  const tp = prog(t, 73.9, 74.3); if (tp > 0) ov += G(at(960, 200), bigTitle('काशी', 200, tp));
  return cam(cx, cy, z, w) + vignette(.4) + ov;
}
// Annapurna's hall (shared)
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
// D8 — Parvati as Annapurna
function d8(t) {
  const z = lerp(1.0, 1.08, prog(t, 75.0, 83.8));
  let w = hall(t) + halo(t, 960, 470, 230);
  const armL = [150, 30];
  w += G(at(960, 1060, 1.1), parvati({ t, smile: .7, look: [0, 1], armL, armR: [40, 70], held: ladleHeld(armL, 180) }));
  w += G(at(960, 1070, 1.15), akshayaPatra(t, 1));
  if (between(t, 79.1, 81.3)) w += sparkles(t, 960 + armHand(-1, armL)[0] * 1.1, 1060 + (armHand(-1, armL)[1] - 80) * 1.1, 90, 8);
  if (between(t, 80.9, 83.6)) w += sparkles(t, 960, 830, 240, 12);
  let ov = '';
  const tp = prog(t, 76.6, 77.0); if (tp > 0) ov += G(at(960, 150), bigTitle('माँ अन्नपूर्णा', 140, tp));
  ov += popRibbon(t, 81.0, 83.8, 1500, 560, 'अक्षय पात्र', 70, 340);
  ov += popRibbon(t, 79.2, 81.0, 420, 340, 'सोने की करछी', 66, 420);
  return cam(960, 560, z, w) + vignette(.22) + ov;
}
// D9 — "Bhiksham dehi": Annapurna fills Mahadev's bowl
function d9(t) {
  const [cx, cy, z] = kf(t, [[83.8, [960, 560, 1.0]], [87.6, [960, 560, 1.0]], [88.6, [860, 480, 1.25]], [90.0, [860, 480, 1.25]], [90.8, [960, 540, 1.05]], [94.4, [960, 540, 1.08]]]);
  const scoops = [91.0, 91.9, 92.8], fill = scoops.reduce((a, s) => a + ease(prog(t, s + .5, s + .75)) / 3, 0);
  let w = hall(t) + halo(t, 1360, 520, 170);
  const mv = prog(t, 84.0, 85.8), sx = lerp(-200, 600, 1 - Math.pow(1 - mv, 1.6)), wk = mv < 1 ? (t - 84) * 7 : undefined;
  const ext = ease(prog(t, 86.2, 87.4)), armR = [lerp(52, 82, ext), lerp(60, 22, ext)], h = armHand(1, armR);
  w += G(at(sx, 1010 - (wk !== undefined ? Math.abs(Math.sin(wk)) * 9 : 0), 1.0), shiva({ t, walk: wk, noTrishul: true, armR, armL: wk !== undefined ? [20 + 16 * Math.sin(wk), 14] : [16, 10], smile: lerp(-.3, .7, prog(t, 90.4, 91.2)), brow: lerp(-.5, 0, prog(t, 90.4, 91.2)), look: [5, 0], open: between(t, 88.35, 89.51) ? talk(t) : 0, held: G(at(h[0], h[1] - 14), bowlFull(fill, t)) }));
  let armL = [70, 30];
  scoops.forEach(s => { if (between(t, s - .3, s + .5)) armL = kf(t, [[s - .3, [70, 30]], [s, [30, -20]], [s + .5, [80, 40]]]); });
  w += G(at(1360, 1060, 1.0), parvati({ t, smile: lerp(.5, .9, prog(t, 90.3, 90.8)), look: [-5, 0], armL, armR: [30, -120], held: ladleHeld(armL, 20) }));
  w += G(at(1360, 1070, .9), akshayaPatra(t, .8));
  const bw = [sx + h[0], 1010 + h[1] - 30];
  scoops.forEach(s => { const u = prog(t, s, s + .6); if (u > 0 && u < 1) { const x = lerp(1300, bw[0], u), y = lerp(860, bw[1], u) - 200 * Math.sin(u * Math.PI); w += `<circle cx="${R(x)}" cy="${R(y)}" r="40" fill="#fff3a0" opacity=".5" filter="url(#blur8)"/>` + G(at(x, y, .9), riceHeap(.8, 30)); } });
  const bp = backOut(prog(t, 88.3, 88.6)) * (1 - prog(t, 89.8, 90.1));
  if (bp > 0) w += G(at(sx + 230, 330, R(bp)), `<path d="M-190,-70 Q-190,-100 -160,-100 L160,-100 Q190,-100 190,-70 L190,40 Q190,70 160,70 L-60,70 L-110,124 L-100,70 L-160,70 Q-190,70 -190,40Z" fill="#fff6dc" stroke="${OUT}" stroke-width="7" stroke-linejoin="round"/>` + txt(0, 4, 'भिक्षां देहि', 70, '#8f1420', { sw: 0 }));
  return cam(cx, cy, z, w) + vignette(.22);
}
// D10 — "Grain is not maya; grain is life, grain is Brahman"
function d10(t) {
  const z = lerp(1.0, 1.05, prog(t, 94.4, 104.9)), eat = between(t, 94.6, 98.6);
  let w = hall(t) + halo(t, 960, 470, 200);
  const armR = [40, 70], h = armHand(1, armR);
  w += G(at(720, 1030, 1.0), shiva({ t, noTrishul: true, armR, armL: between(t, 99.3, 104.3) ? [70, 30 + 5 * Math.sin(t * 3)] : [16, 10], handL: between(t, 99.3, 104.3) ? 'palm' : undefined, smile: .9, lid: eat ? .85 : 0, look: [4, 0], open: between(t, 97.8, 98.8) || between(t, 99.37, 104.19) ? talk(t) * .8 : (eat ? .2 + .2 * Math.abs(Math.sin(t * 6)) : 0), held: G(at(h[0], h[1] - 14), bowlFull(lerp(1, .55, prog(t, 94.6, 98.6)), t)) }));
  const armL = [70, 30];
  w += G(at(1220, 1040, 1.0), parvati({ t, smile: .9, look: [-4, 0], armL, armR: [30, -120], held: ladleHeld(armL, 20) }));
  const ws = [[99.4, 'अन्न माया नहीं'], [101.1, 'अन्न ही जीवन'], [103.0, 'अन्न ही ब्रह्म']];
  let ov = '';
  ws.forEach(([t0, s], i) => { const p = backOut(prog(t, t0, t0 + .4)); if (p > 0) ov += G(at(340 + i * 620, 170, R(p)), ribbonLabel(s, 66, 420)); });
  if (t > 103.0) ov += G('', sparkles(t, 960, 300, 700, 14), `opacity="${R(prog(t, 103, 103.6))}"`);
  return cam(960, 560, z, w) + vignette(.22) + ov;
}
// D11 — in Kashi, nobody sleeps hungry
function d11(t) {
  const z = lerp(1.0, 1.06, prog(t, 104.9, 112.2));
  let w = skyGrad('skK4', '#ff9a34', '#fff0c0') + sunRays(960, 300, t, .14) + G('', kashi(t, 560, { noUmb: 1 }), 'opacity=".8"');
  w += `<rect x="-400" y="656" width="2720" height="800" fill="#f2b05c" stroke="${OUT}" stroke-width="5"/>`;
  w += `<circle cx="960" cy="330" r="200" fill="#fff6c8" opacity=".7" filter="url(#blur40)"/>` + G(at(960, 600, .5), parvati({ t, smile: .9, armL: [150, 30], armR: [40, 70], held: ladleHeld([150, 30], 180) }), 'opacity=".95"');
  const people = [[260, '#c98a58', '#6b6b6b'], [700, '#d99a66', '#1c1420'], [1220, '#e0a878', '#4a2a18'], [1660, '#c98a58', '#1c1420']];
  people.forEach(([x, skin, hair], i) => {
    const bite = .5 + .5 * Math.sin(t * 3 + i * 1.7);
    w += G(at(x, 1000, .78), rishi({ t, skin, hair, seed: i + 5, armL: [24, -140], armR: [lerp(30, 20, bite), lerp(-100, -170, bite)], open: .2 * bite }));
    w += G(at(x, 1040, .9), leafPlate(lerp(1, .6, prog(t, 105, 112))));
  });
  const ov = popRibbon(t, 108.8, 112.0, 960, 120, 'कोई भूखा नहीं सोता', 70, 640);
  return cam(960, 600, z, w) + vignette(.22) + ov;
}
// D12 — the temples today; the golden Annapurna at Diwali
function d12(t) {
  const [cx, cy, z] = kf(t, [[112.2, [960, 540, 1.0]], [115.6, [960, 540, 1.03]], [118.0, [960, 520, 1.08]], [121.7, [960, 520, 1.12]]]);
  const dusk = ease(prog(t, 115.5, 117.0)), lit = ease(prog(t, 115.9, 117.6));
  let w = skyGrad('skT4', mix('#ff8a2a', '#1e3a8a', dusk), mix('#ffe7a8', '#ff9a4a', dusk));
  w += `<rect x="-400" y="860" width="2720" height="600" fill="${mix('#f2b05c', '#b8723a', dusk)}" stroke="${OUT}" stroke-width="5"/>`;
  w += spire(620, 860, 300, 620, '#ffc21a', t) + spire(1320, 860, 260, 500, '#e2562a', t) + block(140, 860, 220, 260, '#f6c98a') + block(1780, 860, 230, 280, '#ffe1a6') + block(970, 860, 160, 200, '#f2a66a');
  for (let i = 0; i < 14; i++) { const x = 80 + i * 136, p = clamp((lit * 16) - i * .9); if (p > 0) w += G(at(x, 940 + (i % 2) * 40, .9 * backOut(clamp(p))), diya(t, i)); }
  w += `<rect x="-400" y="-300" width="2720" height="1800" fill="#0b1a4a" opacity="${R(.2 * dusk)}"/>`;
  const ip = prog(t, 117.8, 118.6);
  if (ip > 0) {
    const s = backOut(clamp(ip * 1.2));
    let inset = `<path d="M-250,320 L-250,-120 Q0,-380 250,-120 L250,320Z" fill="#5a1d0c" stroke="${OUT}" stroke-width="10"/>` + `<circle cx="0" cy="0" r="230" fill="#ffd27a" opacity=".55" filter="url(#blur40)"/>`;
    inset += G('translate(0,300) scale(.5)', G('', parvati({ t, smile: .7, armL: [150, 30], armR: [40, 70], held: ladleHeld([150, 30], 180), lid: 0 }) + G('translate(0,10)', akshayaPatra(t, 0)), 'filter="url(#goldf)"'));
    inset += sparkles(t, 0, 40, 220, 10);
    for (let i = 0; i <= 14; i++) { const u = i / 14, a = Math.PI * u, x = -230 * Math.cos(a), y = -120 - 230 * Math.sin(a) * (.55 + .45 * Math.sin(a)); inset += `<circle cx="${R(x)}" cy="${R(y + 10)}" r="13" fill="${i % 2 ? '#ffc21a' : '#ff5a1c'}" stroke="${OUT}" stroke-width="3"/>`; }
    inset += `<path d="M-250,320 L-250,-120 Q0,-380 250,-120 L250,320Z" fill="none" stroke="#ffc21a" stroke-width="10"/>`;
    w += G(`translate(960,560) scale(${R(s)})`, inset);
  }
  let ov = GOLD_DEF;
  ov += popRibbon(t, 112.6, 117.6, 620, 140, 'काशी विश्वनाथ', 64, 420) + popRibbon(t, 113.6, 117.6, 1320, 300, 'माँ अन्नपूर्णा मंदिर', 60, 480);
  ov += popRibbon(t, 119.0, 121.9, 960, 130, 'स्वर्ण अन्नपूर्णा दर्शन', 66, 620);
  return GOLD_DEF + cam(cx, cy, z, w) + vignette(.3) + ov;
}
// D13 — teaser: Vishwanath, the jyotirlinga
function d13(t) {
  const z = lerp(1.0, 1.1, prog(t, 121.7, 127.0)), jy = ease(prog(t, 122.0, 123.2));
  let w = skyGrad('skJ', '#140824', '#3a1a4a');
  w += `<rect x="-400" y="860" width="2720" height="600" fill="#2a1830" stroke="${OUT}" stroke-width="5"/>`;
  w += `<rect x="${R(960 - 70 - 40 * jy)}" y="-300" width="${R(140 + 80 * jy)}" height="1200" fill="#fff6c8" opacity="${R(.75 * jy)}" filter="url(#blur20)"/><rect x="935" y="-300" width="50" height="1200" fill="#fffdf0" opacity="${R(.9 * jy)}"/>`;
  w += sunRays(960, 640, t, .18 * jy, '#ffd27a') + `<circle cx="960" cy="660" r="${R(180 + 160 * jy)}" fill="#ffd27a" opacity="${R(.4 * jy)}" filter="url(#blur40)"/>`;
  w += G(at(960, 920, 1.7), shivling());
  for (let i = 0; i < 6; i++) w += G(at(820 + i * 56, 925 - (i % 2) * 6, .9, -20 + i * 8), `<path d="M0,0 C-20,-20 -16,-46 0,-60 C16,-46 20,-20 0,0Z" fill="#4e9a3a" stroke="${OUT}" stroke-width="3"/>`);
  w += G(at(560, 940), diya(t, 1, 1.3)) + G(at(1360, 940), diya(t, 4, 1.3));
  let ov = '';
  const tp = prog(t, 123.3, 123.7); if (tp > 0) ov += G(at(960, 170), bigTitle('विश्वनाथ ज्योतिर्लिंग', 120, tp));
  [[400, 400, -12, 124.6], [1520, 380, 12, 124.9]].forEach(([x, y, r, t0], i) => { const p = backOut(prog(t, t0, t0 + .35)); if (p > 0) ov += G(at(x, y + 8 * Math.sin(t * 4 + i), R(p), r), txt(0, 0, '?', 200, '#fff3c0', { stroke: '#8f1420', sw: 28 })); });
  return cam(960, 560, z, w) + vignette(.4) + ov;
}
// D14 — end card
function d14(t) {
  const hp = prog(t, 129.6, 130.05), z = lerp(1, 1.06, prog(t, 127.0, DURATION));
  let w = bg(t, lerp(1, .35, ease(hp)), { rays: .2 + .15 * hp });
  w += `<circle cx="960" cy="560" r="${R(330 + 120 * hp)}" fill="#ffe27a" opacity="${R(.5 + .3 * hp)}" filter="url(#blur40)"/>`;
  w += G(at(960, 1330, 1 + .02 * Math.sin(t * 2)), trishul(690));
  for (let i = 0; i < 7; i++) w += G(at(600 + i * 120, 1090, 1.5 + .5 * rnd(i)), flame(t, i + 30));
  w += embers(t, 960, 900, 40);
  const p1 = backOut(prog(t, 127.3, 127.75)) * (1 - prog(t, 129.2, 129.5));
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
  [0, d1a, 'fade'], [5.2, d1b, 'fade'], [8.1, d1c, 'fade'], [16.6, d2, 'fade'], [19.9, kailash, 'fade'], [43.0, d5a, 'fade'], [49.9, d5b, 'fade'], [52.4, d5c, 'fade'],
  [57.5, d5d, 'fade'], [60.6, d6, 'fade'], [68.4, d7, 'fade'], [75.0, d8, 'flash'], [83.8, d9, 'fade'], [94.4, d10, 'fade'], [104.9, d11, 'fade'], [112.2, d12, 'fade'],
  [121.7, d13, 'fade'], [127.0, d14, 'fade'],
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
