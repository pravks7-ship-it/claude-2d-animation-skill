// Episode 3 — why Kashi is special: the trishul, Avimukta, Manikarnika and the boon of moksha.
// Timings come from the pauses in audio/narration.wav
const CAPS = [
  [0.28, 3.72, 'पिछली कथा में आपने देखा था कि काशी में कदम रखते ही'],
  [4.04, 6.19, 'भैरव के हाथ से वह कपाल छूट गया,'],
  [6.86, 8.93, 'पाप की छाया सीमा पर ही ठिठक गई,'],
  [9.47, 12.62, 'और महादेव ने भैरव को काशी का कोतवाल बना दिया।'],
  [13.46, 16.51, 'पर सवाल यह था कि यह काशी इतनी खास क्यों है?'],
  [17.48, 20.40, 'कहते हैं, काशी इस धरती पर टिकी ही नहीं है।'],
  [20.99, 23.40, 'यह महादेव के त्रिशूल की नोक पर बसी है।'],
  [24.19, 27.84, 'जब प्रलय आता है और सारी सृष्टि जल में डूब जाती है,'],
  [28.27, 30.69, 'तब शिव जी अपना त्रिशूल ऊपर उठा लेते हैं,'],
  [31.26, 33.67, 'और काशी जस की तस बनी रहती है।'],
  [34.49, 39.43, 'महादेव इस नगरी को कभी नहीं छोड़ते, इसीलिए इसका एक नाम अविमुक्त भी है।'],
  [40.22, 44.06, 'बहुत पहले, इसी काशी में भगवान विष्णु ने घोर तपस्या की थी।'],
  [44.64, 47.00, 'उन्होंने अपने चक्र से एक कुंड खोदा,'],
  [47.55, 50.47, 'और तप करते-करते वह कुंड उनके पसीने से भर गया।'],
  [51.38, 54.15, 'महादेव माता पार्वती के साथ वहाँ प्रकट हुए।'],
  [54.77, 58.10, 'विष्णु जी की तपस्या देखकर शिव जी प्रसन्न होकर झूम उठे,'],
  [58.84, 61.92, 'और तभी उनके कान की मणि उस कुंड में गिर पड़ी।'],
  [62.71, 65.38, 'तभी से वह स्थान मणिकर्णिका कहलाता है।'],
  [66.14, 68.67, 'शिव जी ने कहा, “माँगो, क्या वर चाहिए?”'],
  [69.36, 71.27, 'विष्णु जी ने हाथ जोड़कर कहा,'],
  [71.97, 73.47, '“प्रभु, मुझे अपने लिए कुछ नहीं चाहिए।'],
  [74.18, 79.41, 'बस इतना वर दीजिए कि इस नगरी में जो भी प्राण त्यागे, उसे मुक्ति मिल जाए।”'],
  [80.19, 82.88, 'महादेव मुस्कुराए और बोले, “तथास्तु।'],
  [83.67, 89.63, 'काशी में जिसकी भी अंतिम साँस निकलेगी, उसके कान में मैं स्वयं तारक मंत्र कहूँगा,'],
  [90.26, 92.48, 'और वह जन्म-मरण के बंधन से छूट जाएगा।”'],
  [93.07, 96.52, 'इसीलिए कहा जाता है कि काशी में मृत्यु भी मंगल है।'],
  [97.04, 101.08, 'और मणिकर्णिका घाट पर चिता की आग आज तक कभी नहीं बुझी।'],
  [102.02, 105.47, 'पर ज़रा सोचिए, जिस नगरी में मुक्ति इतनी सहज है,'],
  [105.92, 111.20, 'वहाँ एक बार स्वयं महादेव को भिक्षा का पात्र लेकर द्वार-द्वार भटकना पड़ा था।'],
  [111.87, 115.52, 'ऐसा क्यों हुआ, और किसके द्वार पर जाकर उनकी भूख मिटी?'],
  [116.24, 117.37, 'जानिए अगले भाग में।'],
  [117.99, 118.85, 'हर हर महादेव!'],
];
const DURATION = 119.8;
const between = (t, a, b) => t >= a && t <= b;
const shakeXY = (t, A) => [A * Math.sin(t * 83) * Math.cos(t * 31), A * Math.cos(t * 67) * Math.sin(t * 41)];
const showFor = (t, a, b, inner) => { const p = prog(t, a, a + .4), q = 1 - prog(t, b - .3, b); return p > 0 && q > 0 ? G('', inner(p), `opacity="${R(q)}"`) : ''; };
const cloudPad = (w = 300) => `<path d="M${-w},0 a${w * .26},${w * .26} 0 0 1 ${w * .42},${-w * .18} a${w * .32},${w * .32} 0 0 1 ${w * .58},${-w * .1} a${w * .3},${w * .3} 0 0 1 ${w * .5},${w * .08} a${w * .26},${w * .26} 0 0 1 ${w * .5},${w * .2} Z" fill="#fff6e6" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><path d="M${-w * .8},-4 Q0,${w * .08} ${w * .8},-4" stroke="#ffd98a" stroke-width="10" fill="none" opacity=".7"/>`;

// R1 — recap at the gate of Kashi
function r1(t) {
  const HIT = 7.0, push = ease(prog(t, 7.5, 9.0)), SK = 5.0;
  const z = lerp(1.0, 1.05, prog(t, 0, 9.3));
  let w = skyGrad('sk7', '#a83a1a', '#ffc36a');
  w += `<path d="M-400,760 L-100,520 L200,700 L460,480 L760,760Z" fill="#7a2a1c" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/>` + G(at(150, 930, 1.1), tree()) + G(at(560, 930, .9), tree());
  w += `<clipPath id="kc"><rect x="1000" y="-400" width="1500" height="1800"/></clipPath><g clip-path="url(#kc)">` + skyGrad('sk7b', '#ffb03c', '#fff3c0') + sunRays(1500, 420, t, .2) + `<circle cx="1500" cy="420" r="200" fill="#fff8d8"/>` + kashi(t, 834, { noUmb: 1 }) + `</g>`;
  w += `<rect x="-400" y="930" width="2720" height="500" fill="#d9692a" stroke="${OUT}" stroke-width="5"/><rect x="1000" y="930" width="1400" height="500" fill="#ffc86a" stroke="${OUT}" stroke-width="5"/>`;
  const pulse = Math.max(between(t, HIT, HIT + 1) ? 1 - prog(t, HIT, HIT + 1) : 0, push * (.6 + .4 * Math.sin(t * 9)));
  w += `<rect x="970" y="-300" width="60" height="1240" fill="#fff3a0" opacity="${R(.35 + .5 * pulse)}" filter="url(#blur20)"/>`;
  w += G(at(1000, 934, 1.12), gate({ t }));
  const hit = t - HIT, bump = hit > 0 ? Math.exp(-hit * 4) * Math.cos(hit * 16) : 0;
  const shx = hit < 0 ? lerp(-300, 800, prog(t, 2.8, HIT)) : 800 - 60 * (1 - Math.exp(-hit * 3)) - 230 * push, ss = 1.08 * (1 - .22 * push);
  w += G(`translate(${R(shx)},${R(950 - 10 * Math.sin(t * 2.4))}) scale(${R(ss * (1 - .25 * Math.max(0, bump)))},${R(ss * (1 + .1 * Math.max(0, bump)))})`, shadowFig(t, { fear: hit > 0 ? 1 : 0, reach: hit > 0 ? 1 : .6 + .4 * Math.sin(t * 2), alpha: lerp(.93, .7, push) }));
  if (hit > 0) for (let i = 0; i < 3; i++) { const ph = clamp(hit * 1.4 - i * .2); if (ph > 0 && ph < 1) w += `<ellipse cx="985" cy="560" rx="${R(40 + ph * 260)}" ry="${R(80 + ph * 520)}" fill="none" stroke="#fff6c8" stroke-width="${R(16 * (1 - ph))}" opacity="${R(1 - ph)}"/>`; }
  const mv = prog(t, .3, 3.9), bx = lerp(380, 1400, mv), wk = mv < 1 ? (t - .3) * 7 : undefined, free = t >= SK;
  const [HX, HY] = kHand(bx, 960, 1.0);
  w += G(at(bx, 960 - (wk !== undefined ? Math.abs(Math.sin(wk)) * 9 : 0), 1.0), bhK({ t, walk: wk, noSkull: free, glow: .5, skRot: between(t, 4.2, SK) ? 14 * Math.sin(t * 22) : 0, look: hit > .2 ? [-5, 0] : [3, 0], brow: free ? 0 : -.5, smile: free ? ease(prog(t, SK + .5, SK + 1.2)) : 0, armL: wk !== undefined ? [20 + 16 * Math.sin(wk), 14] : [16, 10] }));
  if (free) {
    const dt = t - SK, land = 926, y = Math.min(land, HY + 1600 * dt * dt);
    w += `<circle cx="${R(HX + 30 * Math.min(dt, .5))}" cy="${R(y)}" r="70" fill="#fff3a0" opacity="${R(.6 * Math.exp(-Math.max(0, dt - .5)))}" filter="url(#blur20)"/>` + G(at(HX + 30 * Math.min(dt, .5), y - 26, 1.2, Math.min(dt, .5) * 400), skull(.5));
    w += G('', sparkles(t, HX + 15, land - 40, 120, 9), `opacity="${R(clamp((dt - .4) * 3) * (1 - prog(t, 8.6, 9.3)))}"`);
  }
  const rp = backOut(prog(t, .3, .8)) * (1 - prog(t, 4.6, 5.1));
  const ribbon = rp > 0 ? G(at(60, 70, 1), G(`scale(${R(rp)})`, `<path d="M0,0 L470,0 L440,46 L470,92 L0,92Z" fill="#8f1420" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/>` + txt(215, 64, 'पिछली कथा में…', 52, '#ffe9b0', { sw: 0 }))) : '';
  return cam(960, 540, z, w) + vignette(.3) + ribbon;
}

// R2 — Bhairava, Kotwal of Kashi
function r2(t) {
  const z = lerp(1.0, 1.06, prog(t, 9.3, 13.2));
  let w = skyGrad('sk10', '#ffa63c', '#fff3c8') + sunRays(1040, 440, t, .22) + G('', kashi(t, 760, { noUmb: 1 }), 'opacity=".55"');
  w += `<rect x="-400" y="856" width="2720" height="600" fill="#f2b05c" stroke="${OUT}" stroke-width="5"/><circle cx="1040" cy="520" r="330" fill="#fff8d0" opacity=".75" filter="url(#blur40)"/>`;
  const armL = [58, -52], h = armHand(-1, armL);
  w += G(at(500, 1010, 1.0), shiva({ t, smile: .5, look: [4, 0], tSide: -1, armL: [50, -45], armR: [70, 110], handR: 'palm' }));
  w += G(at(1040, 1010, 1.05), bhairava({ t, smile: .6, brow: -.1, armL, armR: [16, 10], held: G(at(h[0], h[1] + 190, 1), danda()) }));
  w += G(at(1400, 1010, 1), dog(t)) + G('', sparkles(t, 1040, 500, 380, 12), 'opacity=".8"');
  const tp = prog(t, 11.0, 11.4);
  return cam(960, 596, z, w) + vignette(.22) + (tp > 0 ? G(at(960, 170), bigTitle('काशी के कोतवाल', 120, tp)) : '');
}

// C2 — why is Kashi special?
function c2(t) {
  const z = lerp(1.0, 1.06, prog(t, 13.2, 17.0));
  let w = kashiScene(t, { sunY: 420, top: '#f06a1e', bot: '#ffe09a', id: 'skQ' }) + sparkles(t, 960, 420, 620, 16, '#fff8d8');
  let ov = '';
  const tp = prog(t, 14.6, 15.0); if (tp > 0) ov += G(at(960, 200), bigTitle('काशी इतनी खास क्यों?', 130, tp));
  [[330, 430, -14, 15.4], [1600, 400, 14, 15.7], [960, 480, 0, 16.0]].forEach(([x, y, r, t0], i) => { const p = backOut(prog(t, t0, t0 + .35)); if (p > 0) ov += G(at(x, y + 10 * Math.sin(t * 4 + i), R(p * (i === 2 ? 1.2 : 1)), r), txt(0, 0, '?', 220, '#fff3c0', { stroke: '#8f1420', sw: 30 })); });
  return cam(960, 520, z, w) + vignette(.3) + ov;
}

// C3 — Kashi rests on the tip of Shiva's trishul
function c3(t) {
  const [cx, cy, z] = kf(t, [[17.0, [960, 330, 1.7]], [19.4, [960, 330, 1.75]], [20.8, [960, 820, 1.35]], [21.9, [960, 680, .8]], [23.8, [960, 680, .84]]]);
  let w = bg(t, 2, { cx: 960, cy: 380, rays: .2 });
  for (let i = 0; i < 4; i++) w += G(at(-200 + i * 760 + 60 * Math.sin(t * .3 + i), 180 + 70 * (i % 2), 1.4), cloudPad(160), 'opacity=".75"');
  w += G(at(960, 470, 1), kashiOnTrishul(t, 1.0, 1300, .5 + .3 * Math.sin(t * 2)));
  w += clouds(t, 2, 1290) + clouds(t + 30, 2, 1420);
  const tp = prog(t, 21.3, 21.7);
  return cam(cx, cy, z, w) + vignette(.25) + (tp > 0 ? G(at(960, 105), bigTitle('त्रिशूल की नोक पर काशी', 100, tp)) : '');
}

// C4 — the deluge; Shiva lifts the trishul and Kashi stays untouched
function c4(t) {
  const L0 = 28.3, lift = ease(prog(t, L0, 30.4)), calm = ease(prog(t, 30.8, 32.6));
  const storm = prog(t, 23.8, 24.6) * (1 - .7 * calm);
  const [sx, sy] = shakeXY(t, 7 * storm * (between(t, 24.2, 30.6) ? 1 : .2));
  const WL = lerp(1200, 820, ease(prog(t, 24.2, 27.8))) + 14 * Math.sin(t * 1.3);
  const Y = lerp(760, 400, lift) + 8 * Math.sin(t * 1.6) * lift;
  let w = skyGrad('skP', mix('#0b1640', '#3a2a6a', calm * .4), mix('#2a4fb0', '#ff9a4a', calm * .6));
  w += `<ellipse cx="960" cy="${R(Y - 200)}" rx="${R(200 + 700 * calm)}" ry="${R(160 + 500 * calm)}" fill="#ffd27a" opacity="${R(.7 * calm)}" filter="url(#blur40)"/>`;
  if (calm > 0) w += sunRays(960, Y - 200, t, .22 * calm, '#fff3c0');
  w += G('', rain(t, 80, .55), `opacity="${R(storm)}"`);
  for (let i = 0; i < 4; i++) { const on = between(t, 24.3, 30.4) && Math.sin(t * 17 + i * 2.3) > .82; if (on) { const [x, y] = [[260, 60], [1650, 40], [620, 30], [1380, 90]][i]; w += bolt(x, y, i % 2 ? -1 : 1, 1.1) + `<rect x="-400" y="-300" width="2720" height="1700" fill="#cfe0ff" opacity=".12"/>`; } }
  w += G(at(960, Y, .9), kashiOnTrishul(t, 1.0, 1300, lift * (.7 + .3 * Math.sin(t * 5)) + calm * .4));
  if (between(t, L0, 31)) for (let i = 0; i < 3; i++) { const ph = clamp((t - L0) * .9 - i * .25); if (ph > 0 && ph < 1) w += `<ellipse cx="960" cy="${R(WL)}" rx="${R(120 + ph * 900)}" ry="${R(30 + ph * 140)}" fill="none" stroke="#e6f2ff" stroke-width="${R(14 * (1 - ph))}" opacity="${R(1 - ph)}"/>`; }
  w += waves(t, WL);
  w += G('', stormClouds(t, 110), `opacity="${R(.95 - .6 * calm)}"`);
  let ov = '';
  ov += showFor(t, 24.5, 27.6, p => G(at(960, 190), bigTitle('प्रलय', 190, p)));
  ov += showFor(t, 31.5, 34.0, p => G(at(380, 330), G(`scale(${R(backOut(clamp(p * 1.4)))})`, ribbonLabel('जस की तस', 84, 420))));
  return cam(960 + sx, 540 + sy, lerp(1, 1.08, calm), w) + vignette(.4 - .15 * calm) + ov;
}

// C5 — Avimukta: the city Mahadev never leaves
function c5(t) {
  const z = lerp(1.0, 1.05, prog(t, 34.1, 39.8)), dome = ease(prog(t, 35.0, 36.4));
  let w = skyGrad('skA', '#ff8a2a', '#ffe7a8') + sunRays(1250, 420, t, .2);
  w += `<circle cx="1250" cy="420" r="360" fill="#fff6cf" opacity=".7" filter="url(#blur40)"/>`;
  w += G(at(1250, 1150, 1.35), shiva({ t, smile: .45, tSide: -1, armL: [50, -45], armR: [70, 110], handR: 'palm', look: [-2, 2], lid: between(t, 34.4, 35.6) ? .9 : 0 }));
  w += G('translate(960,900) scale(.6) translate(-960,-900)', kashi(t, 900, { noUmb: 1 })) + river(t, 958);
  w += `<path d="M260,960 Q960,${R(lerp(960, 120, dome))} 1660,960" fill="#fff3a0" opacity="${R(.18 * dome)}" stroke="#fff6c8" stroke-width="${R(10 * dome)}"/>`;
  w += G('', sparkles(t, 960, 700, 520, 14), `opacity="${R(dome)}"`);
  const tp = prog(t, 37.8, 38.2);
  return cam(960, 540, z, w) + vignette(.25) + (tp > 0 ? G(at(560, 330), bigTitle('अविमुक्त', 170, tp)) : '');
}

// Shared set for Vishnu's tapasya and the Manikarnika kund
const VX = 520, VY = 960, VS = 1.05, KX = 1260, KY = 930;
function chakraHome() { const h = armHand(-1, [118, 62]); return [VX + VS * h[0], VY + VS * (h[1] - 44 + 252)]; }
function forestSet(t, o) {
  let w = bg(t, 2, { cx: 1300, cy: 300, rays: .14 });
  w += `<path d="M-400,700 Q200,560 700,660 T1600,630 T2320,670 L2320,900 L-400,900Z" fill="#f2a24a" stroke="${OUT}" stroke-width="5"/>`;
  w += `<rect x="-400" y="760" width="2720" height="70" fill="#5fb0c8" stroke="${OUT}" stroke-width="5"/>`;
  for (let i = 0; i < 8; i++) w += `<path d="M${R(-200 + i * 300 + 30 * Math.sin(t + i))},${790 + (i % 2) * 18} h70" stroke="#e6fbff" stroke-width="5" stroke-linecap="round" opacity=".6"/>`;
  w += `<rect x="-400" y="830" width="2720" height="600" fill="#e9a85c" stroke="${OUT}" stroke-width="5"/>`;
  w += G(at(110, 860, 1.25), tree()) + G(at(1840, 860, 1.35), tree()) + G(at(900, 830, .8), tree());
  const aura = o.aura || 0;
  if (aura > 0) for (let i = 0; i < 3; i++) { const ph = (t * .5 + i / 3) % 1; w += `<circle cx="${VX}" cy="${R(VY - VS * 330)}" r="${R(160 + ph * 260)}" fill="none" stroke="#fff3a0" stroke-width="${R(12 * (1 - ph))}" opacity="${R(aura * (1 - ph))}"/>`; }
  if (aura > 0) w += `<circle cx="${VX}" cy="${R(VY - VS * 330)}" r="230" fill="#fff3a0" opacity="${R(.35 * aura)}" filter="url(#blur40)"/>`;
  w += G(at(KX, KY), kundPit(t, o.dig === undefined ? 1 : o.dig, o.fill === undefined ? 1 : o.fill, o.glow || 0, o.rims === undefined ? 1 : o.rims));
  w += G(at(VX, VY, VS), vishnu({ t, sit: true, pray: true, lid: o.lid === undefined ? .9 : o.lid, look: o.look || [0, 0], noChakra: o.noChakra, smile: o.smile || .3, brow: o.brow || 0 }));
  if (o.sweat) for (let i = 0; i < 3; i++) { const ph = (t * .9 + i / 3) % 1; w += G(at(VX - 30 + i * 30, VY - VS * 335 + ph * 40, .8), `<path d="M0,-14 C9,0 9,9 0,10 C-9,9 -9,0 0,-14Z" fill="#9fe0ff" stroke="${OUT}" stroke-width="3"/>`, `opacity="${R(o.sweat * (1 - ph))}"`); }
  return w;
}

// C6 — Vishnu's tapasya; the chakra digs a kund; it fills with his sweat
function c6(t) {
  const [cx, cy, z] = kf(t, [[39.8, [820, 560, 1.0]], [44.3, [760, 580, 1.1]], [45.0, [960, 560, 1.0]], [51.0, [960, 560, 1.03]]]);
  const F0 = 44.6, F1 = 45.2, D1 = 46.9, B1 = 47.5, flying = between(t, F0, B1);
  const dig = ease(prog(t, F1, D1)), fill = ease(prog(t, 47.8, 50.2));
  let w = forestSet(t, { aura: .5 + .4 * Math.sin(t * 2.2) * .5, dig: Math.max(.001, dig), fill, rims: prog(t, 46.6, 47.2), noChakra: flying, sweat: prog(t, 47.3, 47.8), lid: .9 });
  if (flying) {
    const H = chakraHome(), tgt = [KX, KY - 70 + 16 * Math.sin(t * 9)];
    let p, k;
    if (t < F1) { const u = ease(prog(t, F0, F1)); p = [lerp(H[0], tgt[0], u), lerp(H[1], tgt[1], u) - 160 * Math.sin(u * Math.PI)]; k = lerp(1, 2.6, u); }
    else if (t < D1) { p = tgt; k = 2.6; }
    else { const u = ease(prog(t, D1, B1)); p = [lerp(tgt[0], H[0], u), lerp(tgt[1], H[1], u) - 160 * Math.sin(u * Math.PI)]; k = lerp(2.6, 1, u); }
    w += `<circle cx="${R(p[0])}" cy="${R(p[1])}" r="${R(50 * k)}" fill="#ffe27a" opacity=".55" filter="url(#blur20)"/>` + G(at(p[0], p[1], k, t * 900), chakra(t * 3));
    if (between(t, F1, D1)) for (let i = 0; i < 18; i++) { const ph = (t * 1.8 + i / 18) % 1, sd = i % 2 ? 1 : -1, v = 220 + rnd(i) * 260; w += G(at(KX + sd * (60 + ph * v), KY - 30 - 300 * ph + 380 * ph * ph, .6 + rnd(i + 3) * .6, ph * 400), `<path d="M-14,-8 L10,-14 L16,6 L-4,14Z" fill="#8a4a1c" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>`, `opacity="${R(1 - ph)}"`); }
  }
  if (between(t, 47.7, 50.6)) for (let i = 0; i < 14; i++) { // drops of sweat arc into the kund
    const t0 = 47.7 + i * .17, u = prog(t, t0, t0 + .9); if (u <= 0 || u >= 1) continue;
    const x = lerp(VX + 20, KX - 80 + rnd(i) * 160, u), y = lerp(VY - VS * 320, KY, u) - 260 * Math.sin(u * Math.PI);
    w += G(at(x, y, 1.1), `<path d="M0,-16 C10,0 10,10 0,11 C-10,10 -10,0 0,-16Z" fill="#9fe0ff" stroke="${OUT}" stroke-width="3"/>`);
  }
  if (fill > 0 && fill < 1) w += sparkles(t, KX, KY, 220, 6, '#e6fbff');
  let ov = showFor(t, 40.6, 44.2, p => G(at(960, 160), G(`scale(${R(backOut(clamp(p * 1.4)))})`, ribbonLabel('विष्णु की तपस्या', 74, 560))));
  return cam(cx, cy, z, w) + vignette(.22) + ov;
}

// C7 — Shiva and Parvati appear; Shiva sways in joy; his ear-jewel falls into the kund → Manikarnika
function c7(t) {
  const A = 51.6, app = backOut(prog(t, A, A + .7)), E0 = 59.0, E1 = 60.9;
  const dancing = between(t, 54.8, 58.4), sway = dancing ? 6 * Math.sin((t - 54.8) * 5) : 0, tilt = dancing ? 8 * Math.sin((t - 54.8) * 5 + 1) : 0;
  const [cx, cy, z] = kf(t, [[51.0, [1000, 540, 1.0]], [54.5, [1050, 520, 1.0]], [55.3, [1460, 430, 1.45]], [58.7, [1460, 430, 1.45]], [59.5, [1320, 540, 1.15]], [60.7, [KX, 780, 1.5]], [65.8, [KX, 800, 1.62]]]);
  const glow = t > E1 ? .85 * Math.exp(-(t - E1) * .35) + .15 : 0;
  let w = forestSet(t, { aura: .25, glow, lid: t > A ? 0 : .9, look: t > A ? [4, -3] : [0, 0], smile: .45, brow: t > A ? -.3 : 0 });
  const SX = 1380, PX = 1640, CY = 700, SS = .78;
  if (app > 0) {
    w += `<circle cx="1510" cy="420" r="${R(420 * Math.min(1, app))}" fill="#fff6cf" opacity=".75" filter="url(#blur40)"/>`;
    const bp = prog(t, A, A + 1.0); if (bp < 1) for (let i = 0; i < 16; i++) w += `<path d="M0,-${R(120 + bp * 420)} L0,-${R(200 + bp * 620)}" transform="translate(1510,420) rotate(${i * 22.5})" stroke="#fff6c8" stroke-width="14" stroke-linecap="round" opacity="${R(1 - bp)}"/>`;
    let pair = G(at(1510, CY + 8), cloudPad(330));
    const armL = dancing ? [150 + 10 * Math.sin(t * 10), 25] : [50, -45], armR = dancing ? [120, 50 + 10 * Math.sin(t * 10 + 1)] : [16, 8];
    const hL = armHand(-1, armL);
    pair += G(at(PX, CY, SS * .95), parvati({ t, smile: .6, look: [-3, 0], armL: [30, -120], armR: [16, 8] }));
    pair += G(at(SX, CY, SS, sway), shiva({ t, smile: dancing ? .9 : .5, open: dancing ? .3 : 0, tilt, armL, armR, noTrishul: true, noEarR: t >= E0, look: dancing ? [0, -1] : [-4, 2], lid: dancing ? .7 : 0, held: G(at(hL[0], hL[1] - 30), damaru(t)) }));
    w += G(`translate(1510,${CY}) scale(${R(Math.min(1, app))}) translate(-1510,${-CY})`, pair, `opacity="${R(clamp(app * 2) * (1 - prog(t, 61.4, 62.2)))}"`);
  }
  if (dancing) for (let i = 0; i < 4; i++) { const ph = ((t - 54.8) * 1.4 + i * .25) % 1; w += G(at(SX - 120 + i * 80, CY - 640 - ph * 160, .8), txt(0, 0, '♪', 60, '#fff3c0', { sw: 8 }), `opacity="${R(1 - ph)}"`); }
  if (between(t, E0, E1)) {
    const e0 = shivaEar(SX, CY, SS, 0, 0), u = prog(t, E0, E1), x = lerp(e0[0], KX, u), y = lerp(e0[1], KY - 10, u * u);
    for (let i = 1; i < 6; i++) { const v = clamp(u - i * .035); w += `<circle cx="${R(lerp(e0[0], KX, v))}" cy="${R(lerp(e0[1], KY - 10, v * v))}" r="${R(12 - i * 1.6)}" fill="#fff3a0" opacity="${R(.7 - i * .1)}"/>`; }
    w += `<circle cx="${R(x)}" cy="${R(y)}" r="46" fill="#fff3a0" opacity=".7" filter="url(#blur8)"/>` + G(at(x, y, 1.1, u * 540), maniJewel());
  }
  if (t >= E1) {
    const dt = t - E1;
    for (let i = 0; i < 4; i++) { const ph = (dt * .6 + i * .25) % 1; if (dt * .6 + i * .25 < 3) w += `<ellipse cx="${KX}" cy="${KY + 10}" rx="${R(30 + ph * 220)}" ry="${R(9 + ph * 66)}" fill="none" stroke="#fff" stroke-width="${R(7 * (1 - ph))}" opacity="${R((1 - ph) * Math.exp(-dt * .3))}"/>`; }
    if (dt < .8) for (let i = 0; i < 12; i++) { const a = -Math.PI * (i + .5) / 12, v = 240 + rnd(i) * 200; w += `<circle cx="${R(KX + Math.cos(a) * v * dt)}" cy="${R(KY + Math.sin(a) * v * dt * 1.2 + 600 * dt * dt)}" r="${R(6 + rnd(i + 2) * 6)}" fill="#dff6ff" stroke="${OUT}" stroke-width="2.5" opacity="${R(1 - dt / .8)}"/>`; }
    w += `<ellipse cx="${KX}" cy="${KY + 10}" rx="90" ry="28" fill="#fff6c8" opacity="${R(.8 * glow)}" filter="url(#blur20)"/>` + G(at(KX, KY + 6, .6), maniJewel(), `opacity="${R(.35 + .25 * Math.sin(t * 4))}"`);
    w += G('', sparkles(t, KX, KY - 20, 200, 10), `opacity="${R(clamp(dt))}"`);
  }
  let ov = '';
  const tp = prog(t, 63.1, 63.5); if (tp > 0) ov += G(at(960, 190), bigTitle('मणिकर्णिका', 190, tp));
  const sp = backOut(prog(t, 63.9, 64.3)); if (sp > 0) ov += G(at(960, 330, R(sp)), txt(0, 0, 'मणि (रत्न) + कर्ण (कान)', 66, '#fff6dc', { stroke: '#8f1420', sw: 12 }));
  return cam(cx, cy, z, w) + vignette(.22) + ov;
}

// C9 — "Ask for a boon" … "Tathastu"
function c9(t) {
  const [cx, cy, z] = kf(t, [[65.8, [960, 560, 1.0]], [79.7, [960, 560, 1.04]], [80.5, [1300, 470, 1.32]], [83.4, [1300, 470, 1.4]]]);
  const sSpeak = between(t, 66.14, 68.67), vSpeak = between(t, 69.36, 79.41) && !between(t, 71.27, 71.97) && !between(t, 73.47, 74.18), tath = ease(prog(t, 82.2, 82.6));
  let w = bg(t, 2, { cx: 1300, cy: 360, rays: .18 + .2 * tath }) + clouds(t, 2, 1050);
  w += `<circle cx="1300" cy="430" r="${R(330 + 120 * tath)}" fill="#fff8d0" opacity="${R(.55 + .3 * tath)}" filter="url(#blur40)"/>`;
  if (tath > 0) { let b = ''; for (let i = 0; i < 18; i++) b += `<path d="M0,-${R(160 + 300 * tath)} L-12,-${R(260 + 700 * tath)} L12,-${R(260 + 700 * tath)}Z" transform="rotate(${i * 20 + t * 6})" fill="#fff6c8"/>`; w += G('translate(1290,340)', b, `opacity="${R(.6 * (1 - prog(t, 82.6, 83.4) * .5))}"`); }
  w += G(at(1440, 1000), cloudPad(380));
  w += G(at(1590, 990, .95), parvati({ t, smile: lerp(.5, .8, prog(t, 80, 81)), look: t > 69 && t < 80 ? [-4, 0] : [-2, 0], armL: [30, -120], armR: [16, 8] }));
  const armL = tath > 0 ? [lerp(70, 140, tath), lerp(30, 10, tath)] : (sSpeak ? [70, 30 + 5 * Math.sin(t * 4)] : [16, 8]);
  w += G(at(1300, 990, 1.0), shiva({ t, smile: lerp(.4, .9, prog(t, 80.2, 81)), open: sSpeak || between(t, 82.38, 82.9) ? talk(t) * .8 : 0, tSide: 1, armL, armR: [50, -45], handL: armL[0] > 30 ? 'palm' : undefined, look: [-4, 0] }));
  w += G(at(560, 990, 1.0), vishnu({ t, pray: true, open: vSpeak ? talk(t) * .8 : 0, look: [4, -1], brow: -.3, smile: .3, bow: vSpeak ? .5 : 0, tilt: vSpeak ? 3 : 0 }));
  const mp = prog(t, 74.4, 75.9) * (1 - prog(t, 79.5, 80.0));
  if (mp > 0) {
    let inner = `<rect x="-200" y="-200" width="400" height="400" fill="#ffcf86"/>` + G('translate(0,70) scale(.18) translate(-960,-96)', kashi(t, 0, { noUmb: 1 })) + `<rect x="-200" y="88" width="400" height="120" fill="#5fb0c8"/>`;
    for (let i = 0; i < 9; i++) { const ph = (t * .35 + i / 9) % 1; inner += `<circle cx="${R(-130 + rnd(i) * 260 + 14 * Math.sin(ph * 6 + i))}" cy="${R(40 - ph * 260)}" r="${R(9 + 6 * (1 - ph))}" fill="#fff8d8" opacity="${R(Math.sin(ph * Math.PI))}"/><circle cx="${R(-130 + rnd(i) * 260 + 14 * Math.sin(ph * 6 + i))}" cy="${R(40 - ph * 260)}" r="22" fill="#fff3a0" opacity="${R(.4 * Math.sin(ph * Math.PI))}" filter="url(#blur8)"/>`; }
    w += `<circle cx="760" cy="430" r="14" fill="#fff6dc" stroke="${OUT}" stroke-width="5" opacity="${R(clamp(mp * 4))}"/><circle cx="800" cy="380" r="22" fill="#fff6dc" stroke="${OUT}" stroke-width="5" opacity="${R(clamp(mp * 4 - 1))}"/>`;
    w += medallion(930, 250, 170, inner, '', mp * 1.5, 'मुक्ति का वर');
  }
  const tp = prog(t, 82.3, 82.7);
  return cam(cx, cy, z, w) + vignette(.22) + (tp > 0 ? G(at(520, 220), bigTitle('तथास्तु', 190, tp)) : '');
}

// C10 — at the last breath, Shiva whispers the Taraka mantra; the soul is freed
function c10(t) {
  const [cx, cy, z] = kf(t, [[83.4, [900, 600, 1.0]], [86.0, [860, 640, 1.12]], [89.8, [860, 640, 1.16]], [90.6, [900, 520, 1.0]], [92.8, [900, 520, 1.03]]]);
  const SR_ = 90.4, sp = prog(t, SR_, 92.7);
  let w = skyGrad('skN', '#0b1a4a', '#3a4fa0');
  for (let i = 0; i < 50; i++) w += `<circle cx="${R(rnd(i) * 1920)}" cy="${R(rnd(i + 9) * 520)}" r="${R(1.5 + rnd(i + 3) * 3)}" fill="#fff8d8" opacity="${R(.35 + .45 * Math.abs(Math.sin(t * 1.4 + i)))}"/>`;
  w += G(at(1600, 190), `<circle r="80" fill="#fff6dc" opacity=".4" filter="url(#blur20)"/><path d="M0,-70 A70,70 0 1,0 0,70 A50,58 0 1,1 0,-70Z" fill="#fff8d8" stroke="${OUT}" stroke-width="5" transform="rotate(25)"/>`);
  w += kashi(t, 560, { noUmb: 1 }) + `<rect x="-400" y="-100" width="2720" height="760" fill="#0b1a4a" opacity=".42"/>`;
  for (let i = 0; i < 5; i++) w += `<rect x="-400" y="${656 + i * 46}" width="2720" height="46" fill="${i % 2 ? '#c9925c' : '#e0ab70'}" stroke="${OUT}" stroke-width="4"/>`;
  w += river(t, 886, 500, '#3a5aa8', '#122a66');
  w += `<rect x="-400" y="640" width="2720" height="800" fill="#0b1a4a" opacity=".22"/>`;
  w += `<circle cx="760" cy="760" r="300" fill="#ffd27a" opacity=".22" filter="url(#blur40)"/>`;
  const lean = -8, SXp = 1180, SYp = 960, SSc = .9;
  w += G(at(SXp, SYp, SSc, lean), shiva({ t, smile: .4, tilt: -6, open: between(t, 84.0, 89.6) ? .25 + .15 * Math.sin(t * 9) : 0, armL: [62, 34], handL: 'palm', armR: [50, -45], look: [-4, 3], lid: .35 }));
  w += G(at(760, 905), cot() + oldManLying(t, { lid: .95, smile: lerp(.1, .7, prog(t, SR_, SR_ + .8)) }));
  w += G(at(380, 905), diya(t, 3, 1.2)) + G(at(1060, 902), diya(t, 7, 1.1));
  const mouth = [SXp - 64, 503], ear = [566, 757];
  for (let i = 0; i < 6; i++) { const t0 = 84.4 + i * .85, u = prog(t, t0, t0 + 1.4); if (u <= 0 || u >= 1) continue; const x = lerp(mouth[0], ear[0], u), y = lerp(mouth[1], ear[1], u) - 120 * Math.sin(u * Math.PI); w += `<circle cx="${R(x)}" cy="${R(y)}" r="40" fill="#ffd84a" opacity="${R(.5 * Math.sin(u * Math.PI))}" filter="url(#blur8)"/>` + G(at(x, y, R(.7 + .3 * Math.sin(u * Math.PI))), txt(0, 20, 'ॐ', 64, '#fff3a0', { stroke: '#b8520a', sw: 10 }), `opacity="${R(Math.sin(u * Math.PI))}"`); }
  if (between(t, 84.2, 89.8)) for (let i = 0; i < 3; i++) { const ph = (t * .9 + i / 3) % 1; w += `<path d="M${R(ear[0] + 30)},${R(ear[1] - 40 - ph * 50)} q${R(20 + ph * 30)},${R(30 + ph * 20)} 0,${R(60 + ph * 40)}" stroke="#fff3a0" stroke-width="${R(6 * (1 - ph))}" fill="none" opacity="${R(1 - ph)}" transform="rotate(-60,${ear[0]},${ear[1]})"/>`; }
  if (sp > 0) {
    const ox = 800, oy = lerp(760, 250, ease(clamp((t - SR_ - .7) / 2)));
    w += `<circle cx="${ox}" cy="${R(oy)}" r="${R(70 + 30 * Math.sin(t * 4))}" fill="#fff6c8" opacity=".75" filter="url(#blur20)"/><circle cx="${ox}" cy="${R(oy)}" r="30" fill="#fffdf0"/>`;
    w += G(at(ox, oy), chainRing(t, ease(prog(t, SR_ + .5, SR_ + 1.4)), 80));
    w += G('', sparkles(t, ox, oy, 140, 8), `opacity="${R(sp)}"`);
  }
  let ov = showFor(t, 86.6, 89.8, p => G(at(1450, 200), G(`scale(${R(backOut(clamp(p * 1.4)))})`, ribbonLabel('तारक मंत्र', 76, 380))));
  const tp = prog(t, 91.4, 91.8); if (tp > 0) ov += G(at(1450, 200), bigTitle('मोक्ष', 170, tp));
  return cam(cx, cy, z, w) + vignette(.4) + ov;
}

// C11 — death is auspicious in Kashi; the fires of Manikarnika never go out
function c11(t) {
  const [cx, cy, z] = kf(t, [[92.8, [960, 540, 1.0]], [96.6, [960, 540, 1.04]], [97.6, [760, 640, 1.38]], [101.6, [1180, 640, 1.38]]]);
  let w = skyGrad('skD', '#1e3a8a', '#ff9a3c');
  w += `<circle cx="960" cy="610" r="190" fill="#ffcf6a" stroke="#ff9a3c" stroke-width="10"/>` + sunRays(960, 610, t, .12, '#ffd27a');
  w += kashi(t, 600, { noUmb: 1 }) + `<rect x="-400" y="-100" width="2720" height="700" fill="#1e3a8a" opacity=".18"/>`;
  for (let i = 0; i < 4; i++) w += `<rect x="-400" y="${696 + i * 46}" width="2720" height="46" fill="${i % 2 ? '#d99a5c' : '#eab478'}" stroke="${OUT}" stroke-width="4"/>`;
  w += river(t, 880, 500, '#ff9a5c', '#1e3a8a');
  [[230, 0], [700, 4], [1220, 8], [1690, 12]].forEach(([x, s]) => { w += G(at(x, 860, .9), pyre(t, s)); });
  for (let i = 0; i < 9; i++) { const x = ((i * 260 + t * 22) % 2400) - 200, y = 930 + (i % 3) * 50; w += G(at(x, y + 4 * Math.sin(t * 2 + i), .9), leafDiya(t, i)); }
  w += G(at(1500 - 30 * Math.sin(t * .25), 1010, 1.0), boat(t, 2));
  let ov = showFor(t, 93.2, 96.9, p => G(at(960, 170), bigTitle('काशी में मृत्यु भी मंगल', 112, p)));
  ov += showFor(t, 97.5, 101.7, p => G(at(960, 170), G(`scale(${R(backOut(clamp(p * 1.4)))})`, ribbonLabel('मणिकर्णिका घाट', 80, 600))));
  return cam(cx, cy, z, w) + vignette(.3) + ov;
}

// C12a — the city where moksha comes so easily
function c12a(t) {
  const z = lerp(1.0, 1.07, prog(t, 101.6, 105.75));
  let w = kashiScene(t, { sunY: 420, top: '#ff8a2a', bot: '#ffe7a8', tri: .8 + .2 * Math.sin(t * 2), id: 'skM' });
  for (let i = 0; i < 14; i++) { const ph = (t * .22 + i / 14) % 1, x = 120 + rnd(i) * 1680 + 20 * Math.sin(ph * 6 + i), y = 600 - ph * 560; w += `<circle cx="${R(x)}" cy="${R(y)}" r="24" fill="#fff3a0" opacity="${R(.45 * Math.sin(ph * Math.PI))}" filter="url(#blur8)"/><circle cx="${R(x)}" cy="${R(y)}" r="9" fill="#fffdf0" opacity="${R(Math.sin(ph * Math.PI))}"/>`; }
  return cam(960, 520, z, w) + vignette(.25);
}

// C12b — yet Mahadev himself went door to door with a begging bowl
function c12b(t) {
  const W = 230 * (t - 105.75), wk = (t - 105.75) * 6.5;
  let w = skyGrad('skS', '#ff8a3c', '#ffe1a0') + sunRays(1500, 260, t, .12) + `<circle cx="1500" cy="260" r="110" fill="#fff3c0" stroke="#ffb03c" stroke-width="10"/>`;
  w += G(`translate(${R(-((W * .25) % 960))},0)`, `<path d="M-200,820 L60,580 L300,720 L560,540 L760,820 L1020,580 L1260,720 L1520,540 L1720,820 L1980,580 L2220,720 L2480,540 L2900,820Z" fill="#e88a3c" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/>`);
  const cols = ['#ffe1a6', '#f6b98a', '#ffd27a', '#f2a66a'];
  for (let i = -1; i < 20; i++) { const sx = i * 440 + 300 - W; if (sx < -500 || sx > 2500) continue; w += G(at(sx, 900), i % 5 === 3 ? tree() : houseClosed(cols[((i % 4) + 4) % 4])); }
  w += `<rect x="-400" y="900" width="2720" height="500" fill="#e9a85c" stroke="${OUT}" stroke-width="5"/>`;
  for (let i = 0; i < 12; i++) { const gx = ((i * 260 - W) % 2800 + 2800) % 2800 - 400; w += `<path d="M${R(gx)},${950 + (i % 3) * 36} h80" stroke="${OUT}" stroke-width="5" stroke-linecap="round" opacity=".25"/>`; }
  const ext = ease(prog(t, 107.6, 108.0)) * (1 - ease(prog(t, 108.9, 109.3))), armR = [lerp(52, 72, ext), lerp(60, 40, ext)], h = armHand(1, armR);
  w += G(at(960, 1010 - Math.abs(Math.sin(wk)) * 9, 1.12), shiva({ t, walk: wk, noTrishul: true, armR, armL: [20 + 16 * Math.sin(wk), 14], smile: -.35, brow: -.6, look: ext > .5 ? [5, 0] : [2, 2], tilt: 3, held: G(at(h[0], h[1] - 14), bowl()) }));
  let ov = showFor(t, 106.6, 111.4, p => G(at(960, 160), G(`scale(${R(backOut(clamp(p * 1.4)))})`, ribbonLabel('द्वार-द्वार भिक्षा', 76, 540))));
  return cam(960, 560, 1.0, w) + vignette(.25) + ov;
}

// C13 — at whose door was his hunger stilled?
function c13(t) {
  const z = lerp(1.0, 1.12, ease(prog(t, 111.6, 116.0))), op = ease(prog(t, 111.9, 112.9));
  let w = skyGrad('skT', '#3a2a7a', '#ff9a4a') + `<circle cx="300" cy="200" r="80" fill="#fff3c0" opacity=".9"/>`;
  w += `<path d="M-400,780 L2320,780 L2320,900 L-400,900Z" fill="#c4743a" stroke="${OUT}" stroke-width="5"/>`;
  w += G(at(1400, 900, 1.5), house('#ffd27a', 0) + `<path d="M-54,0 L-54,-150 Q0,-204 54,-150 L54,0Z" fill="${mix('#4a1d0c', '#fff3a0', op)}" stroke="${OUT}" stroke-width="5"/>` + G('translate(0,-4) scale(.36)', ladySil(), `opacity="${R(op)}"`));
  w += `<rect x="-400" y="900" width="2720" height="500" fill="#d9894a" stroke="${OUT}" stroke-width="5"/>`;
  w += `<path d="M1319,900 L1481,900 L1640,1300 L1160,1300Z" fill="#fff3a0" opacity="${R(.55 * op)}"/><ellipse cx="1400" cy="700" rx="${R(260 * op)}" ry="${R(320 * op)}" fill="#fff3a0" opacity="${R(.5 * op)}" filter="url(#blur40)"/>`;
  for (let i = 0; i < 9; i++) w += `<path d="M0,-150 L-30,-${R(600 * op)} L30,-${R(600 * op)}Z" transform="translate(1400,840) rotate(${-80 + i * 20})" fill="#fff6c8" opacity="${R(.18 * op)}"/>`;
  const step = ease(prog(t, 113.5, 115.3)), wk = between(t, 113.5, 115.3) ? (t - 113.5) * 6 : undefined, armR = [60, 50], h = armHand(1, armR);
  w += G(at(lerp(520, 760, step), 1010 - (wk !== undefined ? Math.abs(Math.sin(wk)) * 8 : 0), 1.0), shiva({ t, walk: wk, noTrishul: true, armR, armL: [16, 10], smile: lerp(-.3, .4, op), brow: lerp(-.6, .2, op), look: [5, -1], held: G(at(h[0], h[1] - 14), bowl()) }));
  let ov = '';
  const tp = prog(t, 113.2, 113.6); if (tp > 0) ov += G(at(820, 190), bigTitle('किसके द्वार पर?', 140, tp));
  [[1640, 360, 14, 114.2], [1180, 300, -12, 114.5]].forEach(([x, y, r, t0], i) => { const p = backOut(prog(t, t0, t0 + .35)); if (p > 0) ov += G(at(x, y + 8 * Math.sin(t * 4 + i), R(p), r), txt(0, 0, '?', 180, '#fff3c0', { stroke: '#8f1420', sw: 26 })); });
  return cam(1000, 560, z, w) + vignette(.35) + ov;
}

// C14 — end card
function c14(t) {
  const hp = prog(t, 117.9, 118.35), z = lerp(1, 1.06, prog(t, 116.0, DURATION));
  let w = bg(t, lerp(1, .35, ease(hp)), { rays: .2 + .15 * hp });
  w += `<circle cx="960" cy="560" r="${R(330 + 120 * hp)}" fill="#ffe27a" opacity="${R(.5 + .3 * hp)}" filter="url(#blur40)"/>`;
  w += G(at(960, 1330, 1 + .02 * Math.sin(t * 2)), trishul(690));
  for (let i = 0; i < 7; i++) w += G(at(600 + i * 120, 1090, 1.5 + .5 * rnd(i)), flame(t, i + 30));
  w += embers(t, 960, 900, 40);
  const p1 = backOut(prog(t, 116.2, 116.65)) * (1 - prog(t, 117.55, 117.85));
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
  [0, r1, 'fade'], [9.3, r2, 'fade'], [13.2, c2, 'fade'], [17.0, c3, 'fade'], [23.8, c4, 'flash'], [34.1, c5, 'flash'], [39.8, c6, 'fade'],
  [51.0, c7, 'fade'], [65.8, c9, 'fade'], [83.4, c10, 'fade'], [92.8, c11, 'fade'], [101.6, c12a, 'fade'], [105.75, c12b, 'fade'], [111.6, c13, 'fade'], [116.0, c14, 'fade'],
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
