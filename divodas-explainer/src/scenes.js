// Episode 6 — King Divodas: why Mahadev had to leave Kashi, and how he returned.
// Timings come from the pauses in audio/narration.wav
const CAPS = [
  [0.28, 6.35, 'पिछली कथा में आपने देखा था कि माता पार्वती के कहने पर महादेव ने काशी को अपना घर बनाया,'],
  [6.96, 9.77, 'और वहाँ विश्वेश्वर ज्योतिर्लिंग बनकर विराजे।'],
  [10.59, 15.60, 'पर सवाल यह था कि एक समय महादेव को इसी काशी को छोड़कर क्यों जाना पड़ा?'],
  [16.60, 21.80, 'बहुत पहले धरती पर भयंकर अकाल पड़ा, और चारों ओर अराजकता फैल गई।'],
  [22.66, 27.98, 'तब ब्रह्मा जी ने एक धर्मात्मा राजा रिपुंजय से कहा, “तुम धरती का राज सँभालो।”'],
  [28.86, 33.17, 'राजा बोले, “प्रभु, मैं राज करूँगा, पर एक शर्त पर।'],
  [34.20, 39.77, 'मेरे राज्य में देवता नहीं रहेंगे, ताकि मैं अपने बल पर धर्म का राज चला सकूँ।”'],
  [40.61, 44.85, 'ब्रह्मा जी ने वचन दे दिया, और राजा का नाम पड़ा दिवोदास।'],
  [45.60, 51.29, 'ब्रह्मा के वचन का मान रखने के लिए स्वयं महादेव भी काशी छोड़कर मंदराचल पर्वत पर चले गए।'],
  [52.19, 57.94, 'दिवोदास ने ऐसा राज किया कि प्रजा सुखी हो गई, कहीं अन्याय नहीं, कहीं दुख नहीं।'],
  [58.98, 62.59, 'पर मंदराचल पर बैठे महादेव का मन काशी में ही अटका रहा।'],
  [63.14, 67.91, 'उन्होंने काशी लौटने का उपाय ढूँढने के लिए पहले चौंसठ योगिनियाँ भेजीं,'],
  [68.59, 71.48, 'फिर सूर्य देव को, फिर स्वयं ब्रह्मा जी को।'],
  [72.37, 77.73, 'पर राजा के राज में किसी को कोई दोष न मिला, और सब काशी के मोह में वहीं बस गए।'],
  [78.69, 80.46, 'सूर्य लोलार्क बनकर रुक गए,'],
  [81.20, 87.53, 'और ब्रह्मा जी ने वहाँ दस अश्वमेध यज्ञ किए, जिससे वह घाट दशाश्वमेध कहलाया।'],
  [88.36, 91.33, 'अंत में गणेश जी एक ज्योतिषी का रूप धरकर पहुँचे'],
  [91.88, 97.32, 'और बोले, “राजन, अठारह दिन बाद एक ब्राह्मण आएँगे, उनकी बात मान लेना।”'],
  [98.29, 100.40, 'वह ब्राह्मण थे स्वयं भगवान विष्णु।'],
  [101.34, 107.47, 'उन्होंने राजा को समझाया कि राज का सुख भी अनित्य है, सच्चा सुख शिव की शरण में है।'],
  [108.22, 110.18, 'दिवोदास के मन में वैराग्य जागा।'],
  [111.05, 117.74, 'उन्होंने शिवलिंग की स्थापना की, राजपाट त्याग दिया, और एक दिव्य विमान में बैठकर शिवलोक चले गए।'],
  [118.57, 123.00, 'और तब, बरसों बाद, महादेव अपनी काशी लौटे।'],
  [123.94, 129.87, 'गणेश जी वहीं ढुंढिराज बनकर बस गए, जिनके दर्शन आज भी विश्वनाथ से पहले होते हैं।'],
  [130.63, 133.65, 'पर काशी में गंगा उत्तर की ओर क्यों बहती हैं?'],
  [134.48, 135.89, 'जानिए अगले भाग में।'],
  [136.63, 137.71, 'हर हर महादेव!'],
];
const DURATION = 138.7;

// V1 — recap: Kashi became Mahadev's home; the jyotirlinga
function v1(t) {
  const jy = ease(prog(t, 6.9, 7.8));
  let w = ghatSet(t) + jyoti(t, 960, -400, 640, lerp(40, 160, jy), jy);
  if (jy > 0) w += G(at(960, 650, 1.0), shivling(), `opacity="${R(jy)}"`);
  w += G(at(560, 900, .95), shiva({ t, smile: .8, tSide: -1, armL: [50, -45], armR: [70, 10], handR: 'palm', look: [4, 0] })) + G(at(1360, 900, .95), parvati({ t, smile: .85, look: [-4, -2], armL: [30, -120] }));
  const rp = backOut(prog(t, .3, .8)) * (1 - prog(t, 5.6, 6.1));
  const ribbon = rp > 0 ? G(at(60, 70, 1), G(`scale(${R(rp)})`, `<path d="M0,0 L470,0 L440,46 L470,92 L0,92Z" fill="#8f1420" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/>` + txt(215, 64, 'पिछली कथा में…', 52, '#ffe9b0', { sw: 0 }))) : '';
  return cam(960, 560, lerp(1.0, 1.05, prog(t, 0, 10.2)), w) + vignette(.22) + ribbon + titleAt(t, 7.6, 960, 170, 'विश्वेश्वर', 160);
}
// V2 — the question: why did he leave?
function v2(t) {
  const wk = (t - 10.2) * 5;
  let w = skyGrad('skC', '#3a2a7a', '#ff9a4a') + `<circle cx="1500" cy="200" r="80" fill="#fff3c0" opacity=".9"/>`;
  w += G('translate(-700,0)', kashi(t, 620, { noUmb: 1 })) + `<rect x="-400" y="716" width="2720" height="700" fill="#c4743a" stroke="${OUT}" stroke-width="5"/>`;
  w += G(at(lerp(640, 1100, prog(t, 10.4, 16.2)), 1010 - Math.abs(Math.sin(wk)) * 8, 1.0), shiva({ t, walk: wk, smile: -.4, brow: -.6, tSide: 1, armR: [50, -45], armL: [20 + 14 * Math.sin(wk), 14], look: [-5, 0], tilt: -4 }));
  return cam(1000, 560, lerp(1.0, 1.06, prog(t, 10.2, 16.2)), w) + vignette(.35) + titleAt(t, 12.4, 960, 170, 'महादेव ने छोड़ी काशी?', 120);
}
// V3 — famine and chaos
function v3(t) {
  const sh = shakeXY(t, between(t, 19.8, 21.6) ? 5 : 0);
  let w = skyGrad('skF', '#4a2a3a', '#c9773a') + `<circle cx="1500" cy="230" r="110" fill="#ffb03c" opacity=".7"/>`;
  w += `<path d="M-400,640 Q300,580 760,630 T1600,610 T2320,640 L2320,760 L-400,760Z" fill="#8a5a3a" stroke="${OUT}" stroke-width="5"/><rect x="-400" y="740" width="2720" height="700" fill="#b8865a" stroke="${OUT}" stroke-width="5"/>` + cracks(1, 2400, 760);
  for (const [x, k] of [[220, 1.1], [1640, 1.2], [1180, .8]]) w += G(at(x, 780, k), `<path d="M-12,0 L-8,-200 L8,-200 L12,0Z" fill="#6b4a2a" stroke="${OUT}" stroke-width="5"/><path d="M0,-150 L-70,-240 M0,-180 L60,-260 M-40,-200 L-80,-200 M30,-220 L70,-210" stroke="#6b4a2a" stroke-width="10" stroke-linecap="round"/>`);
  w += G(at(760, 900, 1.2), chulha(t, 0));
  const ch = prog(t, 19.6, 21.9);
  if (ch > 0) { for (let i = 0; i < 5; i++) { const ph = (t * .4 + i / 5) % 1; w += `<circle cx="${R(300 + i * 340 + 40 * Math.sin(ph * 5))}" cy="${R(700 - ph * 500)}" r="${R(50 + ph * 120)}" fill="#3a2a2a" opacity="${R(.4 * ch * (1 - ph))}" filter="url(#blur8)"/>`; } w += G(at(1400, 880, 1), flame(t, 3) + G('translate(70,10) scale(.6)', flame(t, 5)), `opacity="${R(ch)}"`); }
  return cam(960 + sh[0], 560 + sh[1], lerp(1.0, 1.05, prog(t, 16.2, 22.3)), w) + vignette(.4) + titleAt(t, 17.2, 960, 170, 'अकाल', 170, 19.7) + titleAt(t, 19.9, 960, 170, 'अराजकता', 170);
}
// V4 — Brahma asks Ripunjaya to rule; the king's condition
function v4(t) {
  const bSpeak = between(t, 26.65, 27.98), kSpeak = between(t, 28.86, 33.17) || between(t, 34.2, 39.77);
  let w = bg(t, 2, { cx: 560, cy: 300, rays: .14 }) + clouds(t, 2, 1080);
  w += `<rect x="-400" y="900" width="2720" height="600" fill="#e9a85c" stroke="${OUT}" stroke-width="5"/>`;
  w += G(at(560, 760), cloudPad(300)) + G(at(560, 760, .95), brahma({ t, open: bSpeak ? talk(t) * .7 : 0, look: [4, 2], armL: [14, 8], armR: bSpeak || between(t, 40.6, 42.2) ? [70, 20] : [14, 8], handR: 'palm', smile: .4 }));
  w += G(at(1360, 1000, 1.0), king({ t, open: kSpeak ? talk(t) * .8 : 0, look: [-4, -2], armL: kSpeak ? [60, 30 + 6 * Math.sin(t * 3)] : [24, -140], handL: kSpeak ? 'palm' : 'none', armR: kSpeak ? [16, 8] : [24, -140], handR: kSpeak ? undefined : 'none', smile: .3 }));
  let ov = popRibbon(t, 23.6, 28.0, 1360, 140, 'राजा रिपुंजय', 72, 440) + popRibbon(t, 32.4, 34.0, 1360, 140, 'एक शर्त', 76, 320);
  const mp = prog(t, 34.6, 35.8) * (1 - prog(t, 39.6, 40.2));
  if (mp > 0) ov += medallion(960, 280, 150, `<rect x="-160" y="-160" width="320" height="320" fill="#cfe0ff"/>` + G('translate(-70,-20) scale(.42)', surya(t)) + G('translate(70,10) scale(.9)', crownIcon()) + G('translate(0,90) scale(.35)', trishul(200)), 'x', mp, 'देवता नहीं रहेंगे');
  return cam(960, 560, 1.0, w) + vignette(.22) + ov;
}
// V5 — Brahma gives his word: the king becomes Divodas
function v5(t) {
  let w = bg(t, 2, { cx: 960, cy: 300, rays: .2 }) + clouds(t, 2, 1080) + `<rect x="-400" y="900" width="2720" height="600" fill="#e9a85c" stroke="${OUT}" stroke-width="5"/>`;
  const bl = ease(prog(t, 40.6, 41.4));
  w += G(at(560, 760), cloudPad(300)) + G(at(560, 760, .95), brahma({ t, look: [4, 2], armR: [lerp(14, 110, bl), 20], handR: 'palm', smile: .6 }));
  if (bl > 0) w += `<path d="M760,330 L1200,500 L1200,640Z" fill="#fff3a0" opacity="${R(.35 * bl)}"/>` + `<circle cx="1360" cy="520" r="${R(200 + 40 * Math.sin(t * 4))}" fill="#fff3a0" opacity="${R(.35 * bl)}" filter="url(#blur40)"/>`;
  w += G(at(1360, 1000, 1.0), king({ t, look: [-4, -2], armL: [24, -140], armR: [24, -140], handL: 'none', handR: 'none', smile: .6, lid: between(t, 41, 42.5) ? .7 : 0 }));
  return cam(960, 560, lerp(1.0, 1.05, prog(t, 40.3, 45.3)), w) + vignette(.22) + popRibbon(t, 40.7, 43.3, 760, 140, 'ब्रह्मा का वचन', 70, 420) + titleAt(t, 43.5, 1360, 170, 'दिवोदास', 160);
}
// V6 — Mahadev leaves Kashi for Mandarachal
function v6(t) {
  const W = 120 * (t - 45.3), wk = (t - 45.3) * 6;
  let w = skyGrad('skM', '#ff8a2a', '#ffe7a8') + sunRays(1500, 260, t, .12);
  w += G(`translate(${R(-W)},0)`, G('translate(-600,0)', kashi(t, 660, { noUmb: 1 })) + mountainPeak(2200, 900, 600, 760));
  w += `<rect x="-400" y="890" width="2720" height="600" fill="#d9984c" stroke="${OUT}" stroke-width="5"/>`;
  w += G(at(960, 1010 - Math.abs(Math.sin(wk)) * 9, 1.0), shiva({ t, walk: wk, smile: -.1, brow: -.3, tSide: 1, armR: [50, -45], armL: [20 + 14 * Math.sin(wk), 14], look: [5, 0] }));
  return cam(960, 560, 1.0, w) + vignette(.25) + popRibbon(t, 49.0, 51.9, 1500, 160, 'मंदराचल पर्वत', 68, 420);
}
// V7 — Divodas' righteous, happy kingdom
function v7(t) {
  let w = skyGrad('skP', '#ff9a3c', '#ffe7a8') + sunRays(960, 260, t, .16) + `<circle cx="960" cy="260" r="160" fill="#fff6cf" stroke="#ffcf6a" stroke-width="10"/>`;
  w += `<path d="M-400,680 Q300,620 760,670 T1600,650 T2320,680 L2320,1400 L-400,1400Z" fill="#e8b84c" stroke="${OUT}" stroke-width="5"/>`;
  for (let r = 0; r < 2; r++) for (let i = 0; i < 30; i++) w += G(at(-80 + i * 72 + r * 30, 720 + r * 50, .7 + r * .1), wheat(t, 0, i + r * 7));
  w += `<rect x="-400" y="820" width="2720" height="600" fill="#f2b05c" stroke="${OUT}" stroke-width="5"/>`;
  w += G(at(960, 1000, .9), throne()) + G(at(960, 1000, .9), king({ t, smile: .8, look: [0, 1], armR: [70, 110], handR: 'palm', armL: [16, 8] })) + G(at(820, 640, .9), chhatra());
  [[300, '#c8281e'], [520, '#3f9b46'], [1400, '#ffd21f'], [1620, '#4f8be0']].forEach(([x, c], i) => { w += G(at(x, 1010, .62), rishi({ t, skin: ['#c98a58', '#d99a66', '#e0a878', '#c98a58'][i], hair: '#1c1420', seed: i + 3, armL: [24, -140], armR: [24, -140], open: .2 })) ; });
  w += sparkles(t, 960, 420, 700, 12);
  return cam(960, 560, lerp(1.0, 1.05, prog(t, 51.9, 58.6)), w) + vignette(.22) + popRibbon(t, 52.6, 55.6, 960, 140, 'प्रजा सुखी', 76, 360) + popRibbon(t, 55.9, 58.4, 960, 140, 'न अन्याय, न दुख', 70, 480);
}
// Mandarachal set (shared by V8 and V9)
function mandarSet(t) {
  let w = bg(t, 2, { cx: 1500, cy: 260, rays: .12 }) + mountainPeak(560, 1100, 760, 760) + clouds(t, 2, 1090);
  return w;
}
// V8 — Mahadev's heart stays in Kashi
function v8(t) {
  let w = mandarSet(t) + G(at(560, 1000, .95), shiva({ t, smile: .1, brow: -.4, tSide: -1, armL: [50, -45], armR: [16, 8], look: [5, -2], tilt: 4 }));
  const tb = backOut(prog(t, 59.2, 59.8));
  if (tb > 0) w += `<circle cx="780" cy="420" r="14" fill="#fff6dc" stroke="${OUT}" stroke-width="5"/><circle cx="850" cy="370" r="22" fill="#fff6dc" stroke="${OUT}" stroke-width="5"/>` + G(at(1200, 300, R(tb)), `<circle r="210" fill="#fff6dc" stroke="${OUT}" stroke-width="7"/><clipPath id="tbc"><circle r="202"/></clipPath><g clip-path="url(#tbc)"><rect x="-220" y="-220" width="440" height="440" fill="#ffcf86"/>` + G('translate(0,60) scale(.22) translate(-960,-96)', kashi(t, 0, { noUmb: 1 })) + `<rect x="-220" y="80" width="440" height="160" fill="#5fb0c8"/></g>` + `<path d="M-30,-150 C-30,-180 0,-180 0,-156 C0,-180 30,-180 30,-150 C30,-124 0,-104 0,-96 C0,-104 -30,-124 -30,-150Z" fill="#e8402e" stroke="${OUT}" stroke-width="4"/>`);
  return cam(960, 560, lerp(1.0, 1.05, prog(t, 58.6, 62.9)), w) + vignette(.22);
}
// V9 — he sends envoys: 64 yoginis, then Surya, then Brahma
function v9(t) {
  let w = mandarSet(t) + G(at(560, 1000, .95), shiva({ t, smile: .3, tSide: -1, armL: [50, -45], armR: between(t, 65.6, 71.6) ? [110, 10] : [16, 8], handR: 'palm', look: [5, 0] }));
  for (let i = 0; i < 64; i++) { const t0 = 66.1 + (i % 16) * .05, u = prog(t, t0, t0 + 2.6); if (u <= 0 || u >= 1) continue; const a = i * 2.4, sp = 40 + (i % 8) * 18; const x = lerp(760, 2200, u) + Math.cos(a + u * 6) * sp, y = lerp(560, 300 + (i % 5) * 60, u) + Math.sin(a + u * 6) * sp * .6; w += G(at(x, y, .32 + (i % 3) * .05, 10 * Math.sin(t * 5 + i)), yogini(t, i)); }
  const su = prog(t, 68.6, 71.2); if (su > 0 && su < 1) w += G(at(lerp(760, 2300, ease(su)), lerp(420, 220, su) - 120 * Math.sin(su * Math.PI)), surya(t, .7));
  const bu = prog(t, 70.1, 72.2); if (bu > 0) w += G(at(lerp(800, 2300, ease(bu)), 640 - 160 * Math.sin(bu * Math.PI)), G('scale(.55)', cloudPad(300) + brahma({ t, look: [5, 0], smile: .4 })));
  return cam(960, 560, 1.0, w) + vignette(.22) + popRibbon(t, 66.3, 68.5, 1400, 150, '६४ योगिनियाँ', 70, 400) + popRibbon(t, 68.6, 70.1, 1400, 150, 'सूर्य देव', 70, 320) + popRibbon(t, 70.1, 72.0, 1400, 150, 'ब्रह्मा जी', 70, 320);
}
// V10 — no fault in the king's rule; they all stay in Kashi
function v10(t) {
  let w = ghatSet(t);
  for (let i = 0; i < 12; i++) w += G(at(160 + i * 140, 660 + (i % 2) * 40 + 6 * Math.sin(t * 3 + i), .34), yogini(t, i));
  w += G(at(1500, 230 + 10 * Math.sin(t)), surya(t, .55)) + G(at(420, 900, .75), brahma({ t, look: [3, 0], smile: lerp(.1, .8, prog(t, 75.4, 76.4)) }));
  let ov = titleAt(t, 72.6, 960, 170, 'दोष?', 170, 74.6) + popRibbon(t, 74.6, 77.8, 960, 160, 'कोई दोष नहीं', 76, 440);
  if (t > 75.6) ov += G('', [0, 1, 2, 3, 4, 5].map(i => { const ph = ((t - 75.6) * .6 + i / 6) % 1; return G(at(300 + i * 280, 700 - ph * 300, .8), `<path d="M-20,-10 C-20,-30 0,-30 0,-14 C0,-30 20,-30 20,-10 C20,8 0,22 0,28 C0,22 -20,8 -20,-10Z" fill="#e8402e" stroke="${OUT}" stroke-width="3"/>`, `opacity="${R(1 - ph)}"`); }).join(''));
  return cam(960, 560, lerp(1.0, 1.04, prog(t, 72.0, 78.3)), w) + vignette(.22) + ov;
}
// V11 — Surya stays as Lolark
function v11(t) {
  const d = ease(prog(t, 78.6, 80.2));
  let w = ghatSet(t) + G(at(960, 840, 1.6), kundPit(t, 1, 1, .4 + .4 * d));
  w += G(at(960, lerp(260, 760, d), lerp(.8, .45, d)), surya(t)) + `<ellipse cx="960" cy="850" rx="${R(240 * d)}" ry="${R(70 * d)}" fill="#fff3a0" opacity="${R(.6 * d)}" filter="url(#blur20)"/>`;
  return cam(960, 600, lerp(1.0, 1.08, prog(t, 78.3, 81.0)), w) + vignette(.22) + popRibbon(t, 79.4, 81.0, 960, 170, 'लोलार्क कुंड', 74, 420);
}
// V12 — Brahma's ten Ashwamedha yagyas: Dashashwamedh ghat
function v12(t) {
  let w = ghatSet(t, .25);
  let n = 0;
  for (let i = 0; i < 10; i++) { const x = 140 + i * 182, y = 760 + (i % 2) * 34, t0 = 81.6 + i * .42, p = backOut(prog(t, t0, t0 + .4)); if (p <= 0) continue; n++; w += G(at(x, y, .5), kund() + G(`translate(0,-100) scale(${R(1.2 * p)})`, flame(t, i))) + `<circle cx="${x}" cy="${y - 70}" r="60" fill="#ffb21c" opacity="${R(.35 * p)}" filter="url(#blur20)"/>`; }
  w += G(at(960, 1010, .8), brahma({ t, sit: true, look: [0, 2], smile: .6, armL: [24, -130], armR: [24, -130] }));
  let ov = n > 0 && t < 86.1 ? G(at(1730, 160), `<circle r="90" fill="#fff6dc" stroke="${OUT}" stroke-width="8"/>` + txt(0, 30, String(n), 96, '#8f1420', { sw: 0 })) : '';
  ov += titleAt(t, 86.1, 960, 180, 'दशाश्वमेध घाट', 140);
  return cam(960, 560, lerp(1.0, 1.04, prog(t, 81.0, 88.0)), w) + vignette(.25) + ov;
}
// royal court (shared)
function court(t) {
  let w = skyGrad('skCt', '#ffb347', '#ffe9b0');
  for (const x of [170, 1750]) w += `<rect x="${x - 40}" y="80" width="80" height="900" fill="#c8281e" stroke="${OUT}" stroke-width="5"/><rect x="${x - 60}" y="80" width="120" height="44" fill="#ffc21a" stroke="${OUT}" stroke-width="5"/>`;
  w += `<rect x="-400" y="40" width="2720" height="60" fill="#8f1420" stroke="${OUT}" stroke-width="5"/>`;
  for (let k = 0; k < 5; k++) for (let i = 0; i <= 12; i++) { const u = i / 12, x = -40 + k * 420 + u * 420, y = 106 + 70 * Math.sin(u * Math.PI); w += `<circle cx="${R(x)}" cy="${R(y)}" r="13" fill="${i % 2 ? '#ffc21a' : '#ff7a12'}" stroke="${OUT}" stroke-width="3"/>`; }
  w += `<rect x="-400" y="980" width="2720" height="500" fill="#d9692a" stroke="${OUT}" stroke-width="5"/>`;
  return w;
}
// V13 — Ganesha disguised as an astrologer: "in eighteen days a Brahmin will come"
function v13(t) {
  const app = ease(prog(t, 88.4, 89.4)), gSpeak = between(t, 93.75, 97.32);
  let w = court(t) + G(at(1420, 1000, .9), throne()) + G(at(1420, 1000, .9), king({ t, look: [-4, 0], smile: .4, armL: [16, 8], armR: [16, 8], brow: between(t, 93.8, 97.4) ? .2 : 0 }));
  const armL = [70, 30], h = armHand(-1, armL);
  w += G(at(lerp(-200, 600, app), 1000, .95), ganesha({ t, disguise: 1, look: [4, 0], armL, armR: gSpeak ? [60, 20 + 6 * Math.sin(t * 3)] : [44, -40], open: gSpeak ? talk(t) : 0, held: G(at(h[0], h[1] - 10, 1, -20), scroll()) }));
  const bp = backOut(prog(t, 93.6, 94.0)) * (1 - prog(t, 97.4, 97.8));
  if (bp > 0) w += G(at(900, 300, R(bp)), `<path d="M-190,-90 Q-190,-120 -160,-120 L160,-120 Q190,-120 190,-90 L190,50 Q190,80 160,80 L-60,80 L-110,134 L-100,80 L-160,80 Q-190,80 -190,50Z" fill="#fff6dc" stroke="${OUT}" stroke-width="7" stroke-linejoin="round"/>` + txt(0, -8, '१८ दिन', 84, '#8f1420', { sw: 0 }) + txt(0, 56, 'एक ब्राह्मण…', 46, '#2a5bd7', { sw: 0 }));
  return cam(960, 560, 1.0, w) + vignette(.22) + popRibbon(t, 89.0, 93.4, 600, 140, 'ज्योतिषी', 70, 300);
}
// V14 — the Brahmin is Vishnu: royal joy is fleeting, true joy is Shiva's refuge
function v14(t) {
  const rv = ease(prog(t, 98.4, 99.6)), vSpeak = between(t, 101.34, 107.47);
  let w = court(t) + G(at(1420, 1000, .9), throne()) + G(at(1420, 1000, .9), king({ t, look: [-4, 0], smile: .3, armL: [24, -140], armR: [24, -140], handL: 'none', handR: 'none' }));
  w += `<circle cx="600" cy="560" r="${R(240 + 40 * Math.sin(t * 3))}" fill="#fff3a0" opacity="${R(.25 + .3 * Math.sin(rv * Math.PI))}" filter="url(#blur40)"/>`;
  if (rv < 1) w += G(at(600, 1000, 1.05), `<path d="M-80,0 L-60,-470 Q0,-500 60,-470 L80,0Z" fill="#fff8e0"/><circle cy="-545" r="58" fill="#fff8e0"/><circle cy="-605" r="22" fill="#fff8e0"/>`, `opacity="${R(1 - rv)}"`);
  w += G(at(600, 1000, 1.0), vishnu({ t, pray: !vSpeak, look: [4, 0], open: vSpeak ? talk(t) * .8 : 0, smile: .5, armL: vSpeak ? [70, 30 + 6 * Math.sin(t * 3)] : undefined }), `opacity="${R(rv)}"`);
  let ov = medallion(1080, 200, 110, `<rect x="-120" y="-120" width="240" height="240" fill="#ffe9b0"/>` + G('translate(-20,10)', crownIcon()) + G('translate(60,-40) scale(.6)', `<path d="M-30,-50 L30,-50 L0,0 L30,50 L-30,50 L0,0Z" fill="#cfe0ff" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/>`), 'x', prog(t, 103.0, 104.4), 'राज-सुख अनित्य');
  ov += medallion(1500, 200, 110, `<rect x="-120" y="-120" width="240" height="240" fill="#2a1838"/>` + jyoti(t, 0, -200, 40, 60, 1) + G('translate(0,80) scale(.8)', shivling()), 'ok', prog(t, 105.6, 107.0), 'शिव की शरण');
  return cam(960, 560, 1.0, w) + vignette(.22) + titleAt(t, 98.8, 600, 170, 'भगवान विष्णु', 110, 102.7) + ov;
}
// V15/V16 — vairagya; the shivalinga; the vimana carries Divodas to Shivaloka
function v15(t) {
  const off = ease(prog(t, 108.4, 109.4)), ling = ease(prog(t, 111.1, 112.0)), vim = ease(prog(t, 114.9, 116.0)), up = ease(prog(t, 116.0, 118.2));
  const [cx, cy, z] = kf(t, [[108.0, [1100, 560, 1.15]], [110.8, [1100, 560, 1.2]], [111.6, [960, 560, 1.0]], [118.4, [960, 500, 1.0]]]);
  let w = court(t) + `<rect x="-400" y="-300" width="2720" height="1800" fill="#ffe9a0" opacity="${R(.15 * off)}"/>`;
  w += G(at(1420, 1000, .9), throne()) + (t > 113.2 ? G(at(1420, lerp(500, 760, ease(prog(t, 113.2, 113.9))), .8), crownIcon()) : '');
  if (ling > 0) w += jyoti(t, 660, -300, 760, 70 * ling, ling) + G(at(660, 880, 1.4 * backOut(ling)), shivling());
  const KX = lerp(1220, 1180, off), KY = 1000 - 900 * up;
  if (vim > 0) w += G(at(KX, lerp(-400, 1060, vim) - 900 * up, .9), vimana(t));
  w += G(at(KX, KY, .9), king({ t, crown: 1 - off, lid: off > .5 ? .85 : 0, smile: .5 * off, look: [-3, 0], armL: off > 0 && off < 1 ? [120, 60] : [24, -140], armR: [24, -140], handL: off > 0 && off < 1 ? undefined : 'none', handR: 'none' }));
  if (off > 0 && off < 1) w += G(at(KX - 70, KY - 640 + 120 * off, .7), crownIcon());
  if (off > 0) w += G('', sparkles(t, KX, KY - 420, 260, 10), `opacity="${R(off * (1 - up))}"`);
  return cam(cx, cy, z, w) + vignette(.22) + titleAt(t, 108.7, 960, 160, 'वैराग्य', 150, 110.9) + popRibbon(t, 116.2, 118.4, 960, 140, 'शिवलोक', 76, 300);
}
// V17 — Mahadev returns to his Kashi
function v17(t) {
  const mv = prog(t, 118.6, 121.6), e = 1 - Math.pow(1 - mv, 1.6), wk = mv < 1 ? (t - 118.6) * 6 : undefined;
  let w = ghatSet(t) + G(at(960, 920, .95), gate({ t }));
  w += G(at(lerp(1700, 1120, e), 900, .9), parvati({ t, smile: .9, look: [-3, -1], armL: [30, -120] }));
  w += G(at(lerp(1500, 820, e), 900 - (wk !== undefined ? Math.abs(Math.sin(wk)) * 8 : 0), .9), shiva({ t, walk: wk, smile: .9, tSide: 1, armR: [50, -45], armL: mv >= 1 ? [140, 10] : [20, 14], handL: mv >= 1 ? 'palm' : undefined, look: [-4, 0] }));
  w += flowerRain(t, prog(t, 120.2, 121.0));
  return cam(960, 560, lerp(1.0, 1.05, prog(t, 118.4, 123.8)), w) + vignette(.22) + titleAt(t, 121.4, 960, 170, 'महादेव लौटे', 150);
}
// V18 — Dhundhiraj Ganesha, worshipped before Vishwanath
function v18(t) {
  let w = skyGrad('skDh', '#ff9a3c', '#ffe7a8') + sunRays(960, 300, t, .14) + `<rect x="-400" y="900" width="2720" height="600" fill="#f2b05c" stroke="${OUT}" stroke-width="5"/>`;
  w += spire(1640, 900, 260, 560, '#ffc21a', t) + `<path d="M680,900 L680,380 Q960,140 1240,380 L1240,900Z" fill="#c8281e" stroke="${OUT}" stroke-width="7"/><path d="M740,900 L740,420 Q960,230 1180,420 L1180,900Z" fill="#ffe9b0" stroke="${OUT}" stroke-width="6"/>`;
  for (let i = 0; i <= 14; i++) { const u = i / 14, a = Math.PI * u, x = 960 - 220 * Math.cos(a), y = 420 - 190 * Math.sin(a) * (.55 + .45 * Math.sin(a)); w += `<circle cx="${R(x)}" cy="${R(y + 4)}" r="13" fill="${i % 2 ? '#ffc21a' : '#ff5a1c'}" stroke="${OUT}" stroke-width="3"/>`; }
  w += `<circle cx="960" cy="600" r="230" fill="#fff3a0" opacity=".5" filter="url(#blur40)"/>` + G(at(960, 880, .62), ganesha({ t, armL: [40, 60], armR: [44, -40], held: G(at(armHand(-1, [40, 60])[0], armHand(-1, [40, 60])[1] - 30), modak()) }));
  [[420, '#c8281e'], [600, '#3f9b46'], [1340, '#ffd21f'], [1520, '#4f8be0']].forEach(([x, c], i) => { w += G(at(x, 1060, .62), devotee(c, '#1c1420', '#d99a66', t * 2 + i, 1)); });
  w += G(at(560, 920), diya(t, 1, 1.2)) + G(at(1360, 920), diya(t, 4, 1.2));
  return cam(960, 560, lerp(1.0, 1.05, prog(t, 123.8, 130.3)), w) + vignette(.22) + titleAt(t, 124.4, 960, 150, 'ढुंढिराज गणेश', 130) + popRibbon(t, 127.2, 130.2, 1640, 200, 'विश्वनाथ से पहले', 60, 460);
}
// V19 — teaser: why does the Ganga flow north in Kashi?
function v19(t) {
  let w = skyGrad('skN', '#ff9a3c', '#ffe7a8') + `<path d="M-400,0 L2320,0 L2320,1400 L-400,1400Z" fill="#9fd07a"/>`;
  w += `<path d="M1300,1300 C1250,1000 1060,900 1080,700 C1100,500 1300,400 1260,-100" stroke="${OUT}" stroke-width="250" fill="none"/><path d="M1300,1300 C1250,1000 1060,900 1080,700 C1100,500 1300,400 1260,-100" stroke="#5fb0d8" stroke-width="230" fill="none"/>`;
  for (let i = 0; i < 14; i++) { const ph = (t * .25 + i / 14) % 1, u = 1 - ph, x = 1300 + (1260 - 1300) * u - 60 * Math.sin(u * Math.PI * 1.6) + (rnd(i) - .5) * 120, y = 1300 - 1400 * u; w += `<path d="M${R(x)},${R(y)} l0,-40" stroke="#e6fbff" stroke-width="6" stroke-linecap="round" opacity="${R(Math.sin(ph * Math.PI))}"/>`; }
  w += G('translate(620,760) scale(.3) translate(-960,-96)', kashi(t, 0, { noUmb: 1 })) + `<rect x="300" y="760" width="660" height="40" fill="#ffe3b0" stroke="${OUT}" stroke-width="4"/>`;
  for (let i = 0; i < 8; i++) w += G(at(200 + rnd(i) * 400, 200 + rnd(i + 3) * 900, .4), tree());
  const ap = ease(prog(t, 131.4, 132.3));
  w += G(at(1500, lerp(800, 560, ap)), `<path d="M0,-200 L60,-110 L22,-110 L22,120 L-22,120 L-22,-110 L-60,-110Z" fill="#ffc21a" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/>` + txt(0, 200, 'उत्तर', 64, '#8f1420', { stroke: '#fff6dc', sw: 12 }), `opacity="${R(ap)}"`);
  return cam(960, 560, 1.0, w) + vignette(.25) + titleAt(t, 130.8, 760, 170, 'उत्तरवाहिनी गंगा?', 120);
}
// V20 — end card
function v20(t) {
  const hp = prog(t, 136.6, 137.05), z = lerp(1, 1.06, prog(t, 134.3, DURATION));
  let w = bg(t, lerp(1, .35, ease(hp)), { rays: .2 + .15 * hp });
  w += `<circle cx="960" cy="560" r="${R(330 + 120 * hp)}" fill="#ffe27a" opacity="${R(.5 + .3 * hp)}" filter="url(#blur40)"/>`;
  w += G(at(960, 1330, 1 + .02 * Math.sin(t * 2)), trishul(690));
  for (let i = 0; i < 7; i++) w += G(at(600 + i * 120, 1090, 1.5 + .5 * rnd(i)), flame(t, i + 30));
  w += embers(t, 960, 900, 40);
  const p1 = backOut(prog(t, 134.5, 134.95)) * (1 - prog(t, 136.2, 136.5));
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
  [0, v1, 'fade'], [10.2, v2, 'fade'], [16.2, v3, 'fade'], [22.3, v4, 'fade'], [40.3, v5, 'fade'], [45.3, v6, 'fade'], [51.9, v7, 'fade'],
  [58.6, v8, 'fade'], [62.9, v9, 'fade'], [72.0, v10, 'fade'], [78.3, v11, 'fade'], [81.0, v12, 'fade'], [88.0, v13, 'fade'], [97.8, v14, 'flash'],
  [108.0, v15, 'fade'], [118.4, v17, 'fade'], [123.8, v18, 'fade'], [130.3, v19, 'fade'], [134.3, v20, 'fade'],
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
