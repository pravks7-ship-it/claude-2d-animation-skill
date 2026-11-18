// Episode 7 — why the Ganga flows north in Kashi (Uttarvahini), the crescent, and the name Varanasi.
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

// G1a — recap: Mahadev returns to Kashi
function g1a(t) {
  const mv = prog(t, .3, 3.4), e = 1 - Math.pow(1 - mv, 1.6), wk = mv < 1 ? (t - .3) * 6 : undefined;
  let w = ghatSet(t) + G(at(960, 920, .95), gate({ t }));
  w += G(at(lerp(1700, 1120, e), 900, .9), parvati({ t, smile: .9, look: [-3, -1], armL: [30, -120] }));
  w += G(at(lerp(1500, 820, e), 900 - (wk !== undefined ? Math.abs(Math.sin(wk)) * 8 : 0), .9), shiva({ t, walk: wk, smile: .9, tSide: 1, armR: [50, -45], armL: mv >= 1 ? [140, 10] : [20, 14], handL: mv >= 1 ? 'palm' : undefined, look: [-4, 0] }));
  w += flowerRain(t, prog(t, 2.6, 3.4));
  const rp = backOut(prog(t, .3, .8)) * (1 - prog(t, 6.2, 6.7));
  const ribbon = rp > 0 ? G(at(60, 70, 1), G(`scale(${R(rp)})`, `<path d="M0,0 L470,0 L440,46 L470,92 L0,92Z" fill="#8f1420" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/>` + txt(215, 64, 'पिछली कथा में…', 52, '#ffe9b0', { sw: 0 }))) : '';
  return cam(960, 560, lerp(1.0, 1.05, prog(t, 0, 7.1)), w) + vignette(.2) + ribbon;
}
// G1b — recap: Dhundhiraj Ganesh
function g1b(t) {
  let w = skyGrad('skDh', '#ff9a3c', '#ffe7a8') + `<rect x="-400" y="900" width="2720" height="600" fill="#f2b05c" stroke="${OUT}" stroke-width="5"/>`;
  w += `<path d="M680,900 L680,380 Q960,140 1240,380 L1240,900Z" fill="#c8281e" stroke="${OUT}" stroke-width="7"/><path d="M740,900 L740,420 Q960,230 1180,420 L1180,900Z" fill="#ffe9b0" stroke="${OUT}" stroke-width="6"/>`;
  w += `<circle cx="960" cy="600" r="230" fill="#fff3a0" opacity=".5" filter="url(#blur40)"/>` + G(at(960, 880, .62), ganesha({ t, armL: [40, 60], armR: [44, -40], held: G(at(armHand(-1, [40, 60])[0], armHand(-1, [40, 60])[1] - 30), modak()) }));
  w += G(at(560, 920), diya(t, 1, 1.2)) + G(at(1360, 920), diya(t, 4, 1.2));
  return cam(960, 560, lerp(1.0, 1.05, prog(t, 7.1, 10.6)), w) + vignette(.2) + titleAt(t, 7.6, 960, 150, 'ढुंढिराज गणेश', 130);
}
// G2 — why does the Ganga flow north here?
function g2(t) {
  let w = aerial(t, { reveal: 1, city: 1 });
  const ap = ease(prog(t, 12.0, 12.8));
  w += G(at(1420, lerp(640, 470, ap)), `<path d="M0,-170 L56,-90 L20,-90 L20,110 L-20,110 L-20,-90 L-56,-90Z" fill="#ffc21a" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/>`, `opacity="${R(ap)}"`);
  return cam(1060, 500, lerp(1.0, 1.08, prog(t, 10.6, 15.1)), w) + G(at(1780, 160), compass(1)) + vignette(.25) + titleAt(t, 11.6, 820, 160, 'गंगा उत्तर की ओर क्यों?', 110);
}
// G3 — Bhagiratha's tapas brings the Ganga down
function g3(t) {
  const d = ease(prog(t, 17.6, 19.8));
  let w = bg(t, 2, { cx: 1300, cy: 220 }) + `<rect x="-400" y="860" width="2720" height="700" fill="#8fc46a" stroke="${OUT}" stroke-width="5"/>`;
  w += G(at(160, 880, 1.2), tree()) + G(at(1780, 880, 1.25), tree()) + G(at(1500, 870, .9), tree());
  for (let i = 0; i < 3; i++) { const ph = (t * .5 + i / 3) % 1; w += `<circle cx="760" cy="560" r="${R(150 + ph * 220)}" fill="none" stroke="#fff3a0" stroke-width="${R(10 * (1 - ph))}" opacity="${R(.8 * (1 - ph))}"/>`; }
  w += G(at(760, 980, 1.0), rishi({ t, skin: '#e9b07a', hair: '#1c1420', closed: 1, armL: [24, -140], armR: [24, -140] })) + G('translate(760,690)', `<path d="M-42,-56 L-38,-96 L-18,-78 L0,-110 L18,-78 L38,-96 L42,-56Z" fill="#ffc21a" stroke="${OUT}" stroke-width="4.5" stroke-linejoin="round"/>`);
  if (d > 0) { w += waterRibbon(t, [[1400, -200], [1380, lerp(-200, 220, d)], [1400, lerp(-200, 520, d)]], 70, d) + G(at(1400, lerp(-200, 680, d), .62), gangaDevi({ t, smile: .7, look: [-4, 1], armL: [30, -120], armR: [40, 70], held: G(at(armHand(1, [40, 70])[0], armHand(1, [40, 70])[1] - 10), kalash()) }), `opacity="${R(d)}"`); }
  return cam(960, 560, lerp(1.0, 1.05, prog(t, 15.1, 20.2)), w) + vignette(.2) + popRibbon(t, 15.8, 18.6, 760, 150, 'राजा भगीरथ', 72, 400) + titleAt(t, 18.4, 1400, 150, 'गंगा अवतरण', 100);
}
// G4 — the torrent; Shiva holds her in his jata and releases her gently
function g4(t) {
  const fall = ease(prog(t, 20.5, 21.8)), coil = prog(t, 22.0, 25.4), rel = ease(prog(t, 26.2, 28.0));
  const sh = shakeXY(t, between(t, 21.0, 22.4) ? 7 : 0);
  let w = bg(t, 2, { cx: 960, cy: 120, rays: .1 }) + peaks(980) + clouds(t, 2, 1010);
  w += G(at(960, 1040, 1.0), shiva({ t, smile: .5, lid: .6, tSide: -1, armL: [50, -45], armR: between(t, 21.4, 25.6) ? [150, 10] : [16, 8], handR: 'palm', look: [0, -3] }));
  const HY = 1040 - 640;
  if (fall > 0) { const top = -300, bot = lerp(top, HY, fall), wid = lerp(260, 110, prog(t, 22.0, 25.4)) * (1 - .8 * rel); w += waterRibbon(t, [[960, top], [940 + 20 * Math.sin(t * 3), (top + bot) / 2], [960, bot]], wid, 1 - .7 * rel); if (fall < 1 || coil < .2) for (let i = 0; i < 14; i++) { const ph = (t * 1.4 + i / 14) % 1; w += `<circle cx="${R(960 + (rnd(i) - .5) * 400 * ph)}" cy="${R(HY - 40 * ph + 160 * ph * ph)}" r="${R(8 + 10 * (1 - ph))}" fill="#bfe6ff" stroke="${OUT}" stroke-width="2" opacity="${R(1 - ph)}"/>`; } }
  if (coil > 0) for (let i = 0; i < 3; i++) w += `<ellipse cx="960" cy="${HY + 40 + i * 30}" rx="${R(110 - i * 10)}" ry="26" fill="none" stroke="#5fb0e0" stroke-width="16" stroke-dasharray="70 30" stroke-dashoffset="${R(-t * 200 * (i % 2 ? 1 : -1))}" opacity="${R(Math.min(1, coil * 2) * (1 - .6 * rel))}"/>`;
  if (rel > 0) w += waterRibbon(t, [[1010, HY + 60], [1150, HY + 260], [1260, 780], [1600, 950], [2100, 1000]], 36 * rel, 1);
  return cam(960 + sh[0], 560 + sh[1], lerp(1.0, 1.06, prog(t, 20.2, 28.5)), w) + vignette(.2) + titleAt(t, 22.4, 960, 150, 'जटाओं में गंगा', 120);
}
// G5 — Bhagiratha's chariot leads; the Ganga follows east to the sea
function g5(t) {
  const W = 260 * (t - 28.5);
  let w = bg(t, 2, { cx: 1500, cy: 260, rays: .1 });
  w += G(`translate(${R(-((W * .3) % 1200))},0)`, `<path d="M-400,640 Q0,580 400,630 T1200,610 T2000,630 T2800,610 L2800,820 L-400,820Z" fill="#b8c9e6" opacity=".7"/>`);
  w += `<rect x="-400" y="700" width="2720" height="800" fill="#9fd07a" stroke="${OUT}" stroke-width="5"/>`;
  for (let i = -1; i < 14; i++) { const x = ((i * 300 - W * .8) % 3900 + 3900) % 3900 - 400; w += G(at(x, 760, .5), tree()); }
  w += waterRibbon(t, [[-500, 980], [200, 960], [700, 940], [1100, 920]], 130);
  w += G(at(1000, 860, .62), gangaDevi({ t, smile: .7, look: [5, 0], armL: [30, -120], armR: [40, 70], held: G(at(armHand(1, [40, 70])[0], armHand(1, [40, 70])[1] - 10), kalash()) }));
  w += G(at(1360, 980 - 6 * Math.abs(Math.sin(t * 12)), .85), chariot(t, G('translate(-30,-150) scale(.55)', king({ t, smile: .6, look: [5, 0], armL: [70, 40], armR: [60, 20] }))));
  for (let i = 0; i < 8; i++) { const ph = (t * 1.2 + i / 8) % 1; w += `<circle cx="${R(1180 - ph * 300)}" cy="${R(990 - ph * 40)}" r="${R(14 + 30 * ph)}" fill="#e8d0a8" opacity="${R(.5 * (1 - ph))}"/>`; }
  return cam(960, 560, 1.0, w) + vignette(.2) + popRibbon(t, 33.0, 35.4, 1500, 170, 'पूर्व → सागर', 70, 400);
}
// G6 — the Ganga reaches Kashi and recognises Mahadev's own city
function g6(t) {
  const rec = ease(prog(t, 37.8, 39.0));
  let w = bg(t, 2, { cx: 960, cy: 260, rays: .12 + .1 * rec });
  w += `<circle cx="960" cy="380" r="${R(260 + 80 * rec)}" fill="#fff3a0" opacity="${R(.25 + .3 * rec)}" filter="url(#blur40)"/>`;
  if (rec > 0) w += G(at(960, 760, .9), trishul(560), `opacity="${R(.35 * rec)}"`) + G(at(960, 620, .8), `<circle r="60" fill="#fff6c8" opacity=".6" filter="url(#blur20)"/>` + G('scale(.5)', shivling()), `opacity="${R(rec)}"`);
  w += kashi(t, 560, { noUmb: 1 }) + river(t, 656, 800);
  w += G(at(480, 980, .9), gangaDevi({ t, smile: lerp(.4, .95, rec), look: [5, -3], lid: 0, armL: rec > .5 ? [24, -140] : [30, -120], armR: [40, 70], held: G(at(armHand(1, [40, 70])[0], armHand(1, [40, 70])[1] - 10), kalash()) }));
  if (rec > 0) w += G('', sparkles(t, 600, 400, 220, 8), `opacity="${R(rec)}"`);
  return cam(960, 560, lerp(1.0, 1.06, prog(t, 35.5, 45.0)), w) + vignette(.2) + titleAt(t, 36.2, 960, 150, 'काशी', 180) + popRibbon(t, 41.7, 44.8, 1450, 170, 'महादेव की नगरी', 66, 480);
}
// G7 — she turns north, toward Kailash
function g7(t) {
  const rv = lerp(.3, 1, ease(prog(t, 45.4, 49.6)));
  let w = aerial(t, { reveal: rv, city: .5 });
  const kp = ease(prog(t, 50.4, 51.4));
  w += G('translate(1420,20)', `<path d="M-500,120 L-300,-60 L-160,40 L0,-140 L160,30 L320,-80 L520,120Z" fill="#dfe9f7" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/><path d="M-60,-60 L0,-140 L60,-60 L30,-70 L0,-40 L-30,-70Z" fill="#fff" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/>`, `opacity="${R(kp)}"`);
  const [hx, hy] = rivAt(Math.min(rv, .999));
  w += `<circle cx="${R(hx)}" cy="${R(hy)}" r="60" fill="#fff6c8" opacity=".7" filter="url(#blur8)"/>`;
  let ov = G(at(1780, 160), compass(1)) + titleAt(t, 46.2, 760, 160, 'उत्तर की ओर ↑', 120, 50.4) + popRibbon(t, 50.6, 53.9, 760, 150, 'कैलाश की ओर', 72, 440);
  const mp = prog(t, 51.6, 53.0);
  if (mp > 0) ov += medallion(380, 640, 170, `<rect x="-180" y="-180" width="360" height="360" fill="#cfe6ff"/>` + G('translate(0,-120)', `<path d="M-200,60 L-80,-40 L0,20 L80,-60 L200,60Z" fill="#fff" stroke="${OUT}" stroke-width="4"/>`) + G('translate(0,420) scale(.72)', gangaDevi({ t, smile: .8, lid: .8, look: [0, -3], armL: [22, -146], armR: [22, -146] })), '', mp, 'प्रणाम');
  return cam(1100, 400, lerp(.9, 1.0, prog(t, 45.0, 54.0)), w) + vignette(.25) + ov;
}
// G8 — Uttarvahini: bathing here is many times more meritorious
function g8(t) {
  let w = ghatSet(t);
  w += `<rect x="-400" y="880" width="2720" height="600" fill="#5fb0d8" opacity=".25"/>`;
  [[300, '#c8281e'], [640, '#ffd21f'], [1300, '#3f9b46'], [1640, '#ff7a12']].forEach(([x, c], i) => { w += G(at(x, 1010 + 6 * Math.sin(t * 2 + i), .9), bather(t, i, c)) + `<ellipse cx="${x}" cy="1010" rx="80" ry="18" fill="none" stroke="#e6fbff" stroke-width="5" opacity=".7"/>`; });
  w += G(at(960, 840, .9), `<path d="M0,-80 L50,-10 L18,-10 L18,90 L-18,90 L-18,-10 L-50,-10Z" fill="#ffc21a" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/>`);
  return cam(960, 560, lerp(1.0, 1.05, prog(t, 54.0, 61.0)), w) + vignette(.2) + titleAt(t, 54.6, 960, 150, 'उत्तरवाहिनी गंगा', 130) + popRibbon(t, 57.6, 60.9, 960, 330, 'पुण्य कई गुना', 70, 420);
}
// G9 — the crescent bend, like the moon on Mahadev's head
function g9(t) {
  const cr = ease(prog(t, 64.0, 66.2)), moon = ease(prog(t, 68.5, 69.5));
  let w = aerial(t, { reveal: 1, crescent: cr, city: 1 });
  let ov = popRibbon(t, 63.5, 67.8, 760, 160, 'अर्धचंद्र जैसा मोड़', 66, 520);
  if (moon > 0) {
    let ins = `<rect x="-200" y="-200" width="400" height="400" fill="#bfe3f4"/>` + G('translate(0,680) scale(1.2)', shiva({ t, smile: .5, noTrishul: true, look: [0, 0] }));
    ins += `<circle cx="48" cy="-170" r="60" fill="#fff3a0" opacity="${R(.6 + .3 * Math.sin(t * 4))}" filter="url(#blur8)"/>`;
    ov += medallion(380, 640, 190, ins, '', moon, 'मस्तक पर चंद्र');
  }
  return cam(1120, 520, lerp(1.0, 1.25, ease(prog(t, 61.0, 66.0))), w) + G(at(1780, 160), compass(1)) + vignette(.25) + ov;
}
// G10 — Assi and Varuna: Varanasi
function g10(t) {
  const as = ease(prog(t, 73.6, 74.8)), va = ease(prog(t, 76.6, 77.8));
  let w = aerial(t, { reveal: 1, assi: as, varuna: va, city: 1 });
  let ov = '';
  if (as > 0) ov += G(at(820, 930, R(backOut(as))), `<rect x="-90" y="-40" width="180" height="76" rx="14" fill="#fff6dc" stroke="${OUT}" stroke-width="6"/>` + txt(0, 20, 'असी', 50, '#2a5bd7', { sw: 0 }));
  if (va > 0) ov += G(at(820, 150, R(backOut(va))), `<rect x="-110" y="-40" width="220" height="76" rx="14" fill="#fff6dc" stroke="${OUT}" stroke-width="6"/>` + txt(0, 20, 'वरुणा', 50, '#2a5bd7', { sw: 0 }));
  return cam(1000, 560, 1.0, w) + G(at(1780, 160), compass(1)) + vignette(.22) + ov + titleAt(t, 79.6, 470, 420, 'वरुणा + असी', 84, 81.6) + titleAt(t, 81.6, 470, 420, 'वाराणसी', 150);
}
// G11 — teaser: a saint, and Hanuman
function g11(t) {
  const hp = ease(prog(t, 85.8, 87.0));
  let w = skyGrad('skT', '#3a2a7a', '#ff9a4a') + `<circle cx="1500" cy="220" r="90" fill="#fff3c0" opacity=".9"/>`;
  w += G('', kashi(t, 620, { noUmb: 1 }), 'opacity=".6"') + `<rect x="-400" y="716" width="2720" height="700" fill="#c4743a" stroke="${OUT}" stroke-width="5"/>`;
  w += G(at(560, 760, 1.4), tree());
  if (hp > 0) w += G(at(980, 640, .95 + .05 * Math.sin(t * 2)), hanumanSil(hp));
  w += G(at(720, 1000, 1.0), saintSil()) + G(at(880, 1000), diya(t, 2, 1.2));
  let ov = titleAt(t, 87.2, 960, 150, 'संत और हनुमान?', 130);
  [[1380, 380, 12, 89.9], [1640, 300, -10, 90.3]].forEach(([x, y, r, t0], i) => { const p = backOut(prog(t, t0, t0 + .35)); if (p > 0) ov += G(at(x, y + 8 * Math.sin(t * 4 + i), R(p), r), txt(0, 0, '?', 180, '#fff3c0', { stroke: '#8f1420', sw: 26 })); });
  return cam(960, 560, lerp(1.0, 1.06, prog(t, 83.6, 93.0)), w) + vignette(.35) + ov;
}
// G12 — end card
function g12(t) {
  const hp = prog(t, 96.0, 96.45), z = lerp(1, 1.06, prog(t, 93.0, DURATION));
  let w = bg(t, lerp(1, .35, ease(hp)), { rays: .2 + .15 * hp });
  w += `<circle cx="960" cy="560" r="${R(330 + 120 * hp)}" fill="#ffe27a" opacity="${R(.5 + .3 * hp)}" filter="url(#blur40)"/>`;
  w += G(at(960, 1330, 1 + .02 * Math.sin(t * 2)), trishul(690));
  for (let i = 0; i < 7; i++) w += G(at(600 + i * 120, 1090, 1.5 + .5 * rnd(i)), flame(t, i + 30));
  w += embers(t, 960, 900, 40);
  const p1 = backOut(prog(t, 93.4, 93.85)) * (1 - prog(t, 95.6, 95.9));
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
  [0, g1a, 'fade'], [7.1, g1b, 'fade'], [10.6, g2, 'fade'], [15.1, g3, 'fade'], [20.2, g4, 'fade'], [28.5, g5, 'fade'], [35.5, g6, 'fade'],
  [45.0, g7, 'fade'], [54.0, g8, 'fade'], [61.0, g9, 'fade'], [73.0, g10, 'fade'], [83.6, g11, 'fade'], [93.0, g12, 'fade'],
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
