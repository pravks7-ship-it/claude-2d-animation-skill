// Episode 2 — Bhairava the Kapali, Kashi and Kapalmochan. Timings come from the pauses in audio/narration.wav
const CAPS = [
  [0.27, 5.59, 'कल की कथा में आपने देखा था कि भैरव ने ब्रह्मा जी का पाँचवाँ सिर काट दिया,'],
  [6.34, 9.53, 'लेकिन वह कटा हुआ सिर उनके हाथ से चिपक गया'],
  [9.93, 11.92, 'और छूटने का नाम ही नहीं लिया।'],
  [12.93, 15.82, 'भैरव पर ब्रह्म-हत्या का पाप लग चुका था,'],
  [16.34, 20.79, 'और वह पाप एक काली छाया बनकर उनके पीछे-पीछे चलने लगा।'],
  [21.66, 25.20, 'भैरव घबराकर महादेव के पास पहुँचे और पूछा,'],
  [25.80, 28.32, '“प्रभु, मैंने तो आपकी आज्ञा मानी थी,'],
  [28.88, 30.41, 'फिर यह बोझ मेरे साथ क्यों है?”'],
  [31.29, 33.19, 'शिव जी ने शांत स्वर में कहा,'],
  [34.06, 35.24, '“आज्ञा मेरी थी,'],
  [35.71, 37.73, 'पर कर्म तुम्हारे हाथों से हुआ है।'],
  [38.46, 40.45, 'इसका प्रायश्चित तुम्हें ही करना होगा।'],
  [41.26, 45.25, 'हाथ में यह कपाल लेकर तीनों लोकों में भिक्षा माँगते घूमो,'],
  [45.73, 47.54, 'और जब यह सिर अपने आप गिर जाएगा,'],
  [47.98, 48.96, 'तभी तुम मुक्त होगे।”'],
  [49.83, 51.78, 'भैरव कपाली बनकर निकल पड़े।'],
  [52.55, 55.30, 'वे द्वार-द्वार, तीर्थ-तीर्थ भटकते रहे,'],
  [55.72, 56.74, 'भिक्षा माँगते रहे,'],
  [57.24, 59.56, 'पर सिर हाथ से टस से मस न हुआ,'],
  [60.27, 63.17, 'और वह छाया हर कदम पर उनके पीछे लगी रही।'],
  [63.90, 64.88, 'बरसों बीत गए।'],
  [65.40, 67.61, 'फिर एक दिन भैरव काशी पहुँचे,'],
  [68.18, 69.91, 'महादेव की अपनी नगरी।'],
  [70.48, 75.20, 'जैसे ही उन्होंने काशी में कदम रखा, वह छाया वहीं ठिठक गई,'],
  [75.70, 78.34, 'क्योंकि काशी में पाप का प्रवेश नहीं था।'],
  [79.17, 83.18, 'और तभी वह कपाल उनके हाथ से छूटकर गिर पड़ा।'],
  [83.96, 88.99, 'जिस स्थान पर वह गिरा, वह आज भी कपालमोचन तीर्थ कहलाता है।'],
  [89.69, 91.43, 'भैरव पाप से मुक्त हुए,'],
  [91.76, 95.14, 'और महादेव ने उन्हें काशी का कोतवाल बना दिया।'],
  [95.91, 96.52, 'कहते हैं,'],
  [97.05, 101.51, 'आज भी काशी में कदम रखने वाले हर भक्त पर पहली नज़र'],
  [101.85, 103.43, 'काल भैरव की ही पड़ती है।'],
  [104.30, 109.03, 'पर सवाल यह है कि महादेव की यह काशी इतनी खास क्यों है?'],
  [109.78, 111.22, 'जानिए अगले भाग में।'],
  [112.03, 113.53, 'हर हर महादेव!'],
];
const DURATION = 114.6;
const between = (t, a, b) => t >= a && t <= b;
const shakeXY = (t, A) => [A * Math.sin(t * 83) * Math.cos(t * 31), A * Math.cos(t * 67) * Math.sin(t * 41)];
const skyGrad = (id, top, bot) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs><rect x="-1500" y="-1200" width="4920" height="3500" fill="url(#${id})"/>`;
const sunRays = (x, y, t, op = .14, col = '#fff6c8') => { let r = ''; for (let i = 0; i < 14; i++) r += `<path d="M0,0 L-170,-2600 L170,-2600Z" transform="rotate(${R(i * (360 / 14))})" fill="${col}"/>`; return G(`translate(${x},${y}) rotate(${R(t * 4)})`, r, `opacity="${op}"`); };

// K1 — recap: the cut, and the skull that stuck
function k1(t) {
  const rp = backOut(prog(t, .3, .8)) * (1 - prog(t, 5.3, 5.8));
  const ribbon = rp > 0 ? G(at(60, 70, 1), G(`scale(${R(rp)})`, `<path d="M0,0 L470,0 L440,46 L470,92 L0,92Z" fill="#8f1420" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/>` + txt(215, 64, 'पिछली कथा में…', 52, '#ffe9b0', { sw: 0 }))) : '';
  if (t < 5.95) {
    const T = 4.75, cut = t >= T, lunge = ease(prog(t, 4.2, T));
    const [sx, sy] = shakeXY(t, between(t, T, T + .5) ? 16 * (1 - prog(t, T, T + .5)) : 0);
    let w = bg(t, 1, { cx: 1100, rays: .18 }) + clouds(t, 1, 950);
    const bx = 1500, by = 985, bs = 1.05, hx = bx, hy = by - (545 + 142) * bs;
    w += G(at(bx + (cut ? 5 * Math.sin(t * 50) * (1 - prog(t, T, T + 1.2)) : 0), by, bs), brahma({ t, fifth: cut ? 0 : 1, lid: cut ? .9 : 0, sideLid: cut ? .9 : 0, brow: -1, look: [-3, -1], open: cut ? .3 : .2, fifthBrow: -1, fifthOpen: .3, armL: [22, -140], armR: [22, -140] }));
    const bhx = lerp(880, 1090, lunge) - 40 * ease(prog(t, T + .3, T + 1.1)), sw = ease(prog(t, T - .12, T + .1));
    const armL = cut ? kf(t, [[T + .2, [30, 20]], [T + .8, [100, 70]]]) : [30, 20];
    const hd = armHand(-1, armL), handW = [bhx + hd[0] * 1.15, 975 + (hd[1] - 4) * 1.15], fly = prog(t, T + .15, T + 1.05);
    w += G(at(bhx, 975, 1.15), bhairava({ t, sword: 1, armR: [lerp(lerp(40, 158, ease(prog(t, 2.6, 3.8))), 62, sw), lerp(20, -14, sw)], armL, open: between(t, 4.0, T + .4) ? .8 : 0, look: [3, -1] }));
    if (cut) {
      const u = ease(fly), x = lerp(hx, handW[0], u), y = lerp(hy, handW[1], u) - 260 * Math.sin(u * Math.PI);
      w += `<circle cx="${R(x)}" cy="${R(y)}" r="80" fill="#fff3a0" opacity=".8" filter="url(#blur20)"/>` + G(at(x, y, lerp(.84, .6, u), u * 360), brahmaHead({ skin: '#ffe9a0', lid: .9, brow: -1, shortBeard: true }));
    }
    const sl = prog(t, T - .08, T + .22);
    if (sl > 0 && sl < 1) w += G(at(hx, hy + 70, 1, lerp(-50, 40, sl)), `<path d="M-330,0 Q0,-90 330,0 Q0,-40 -330,0Z" fill="#fff" stroke="#ffe66b" stroke-width="8"/>`, `opacity="${R(1 - sl * sl)}"`);
    const fl = between(t, T, T + .3) ? 1 - prog(t, T, T + .3) : 0;
    return cam(1200 + sx, 540 + sy, lerp(1.34, 1.42, prog(t, 0, 5.95)), w) + vignette(.5) + (fl > 0 ? `<rect width="1920" height="1080" fill="#fff" opacity="${R(fl)}"/>` : '') + ribbon;
  }
  const [cx, cy, z] = kf(t, [[5.95, [900, 540, 1.0]], [7.4, [1130, 500, 1.42]], [12.4, [1140, 500, 1.5]]]);
  const shk = between(t, 10.0, 11.9) ? Math.sin((t - 10) * 19) * 13 * (.6 + .4 * Math.sin((t - 10) * 2.1)) : 0;
  let w = bg(t, 1, { cx: 900, rays: .14 }) + clouds(t, 1, 1040) + embers(t, 900, 900, 26, '#ff8a2a');
  const armR = [82 + shk, 48 + shk * .6], [HX, HY] = kHand(800, 1500, 2, armR), stuck = prog(t, 8.2, 8.7);
  w += `<circle cx="${R(HX)}" cy="${R(HY)}" r="170" fill="#fff3a0" opacity="${R(.5 * stuck * (.7 + .3 * Math.sin(t * 6)))}" filter="url(#blur40)"/>`;
  w += G(at(800, 1500, 2.0), bhK({ t, armR, skRot: shk * .5, glow: .6 + .4 * Math.sin(t * 6), brow: -.9, look: [4, -2], open: shk ? .5 : .3, tilt: 4 }));
  if (shk !== 0) for (const sd of [-1, 1]) for (let i = 0; i < 2; i++) w += `<path d="M${R(HX + sd * (120 + i * 40))},${R(HY - 70)} q${sd * 34},70 0,140" fill="none" stroke="#fff3c0" stroke-width="10" stroke-linecap="round" opacity="${R(.5 + .4 * Math.sin(t * 30 + i))}"/>`;
  if (stuck > 0) for (let i = 0; i < 8; i++) w += `<path d="M0,-118 L0,-${R(150 + 16 * Math.sin(t * 8 + i))}" transform="translate(${R(HX)},${R(HY - 8)}) rotate(${i * 45 + t * 20})" stroke="#fff3a0" stroke-width="8" stroke-linecap="round" opacity="${R(stuck * .8)}"/>`;
  const fl = t < 6.25 ? 1 - prog(t, 5.95, 6.25) : 0;
  return cam(cx, cy, z, w) + vignette(.5) + (fl > 0 ? `<rect width="1920" height="1080" fill="#fff6d8" opacity="${R(fl)}"/>` : '');
}

// K2 — the sin becomes a shadow that follows him
function k2(t) {
  const [cx, cy, z] = kf(t, [[12.4, [1000, 500, 1.25]], [15.9, [1010, 500, 1.3]], [17.6, [880, 880, .66]], [18.6, [880, 880, .66]], [21.2, [1240, 880, .66]]]);
  const wp = prog(t, 18.6, 21.4), walking = t > 18.6, bx = 800 + 760 * wp, wk = walking ? (t - 18.6) * 7 : undefined;
  let w = bg(t, 1, { cx: 900, cy: 700, rays: .12 });
  w += `<rect x="-1500" y="-1200" width="4920" height="3500" fill="#1a0616" opacity="${R(.35 * ease(prog(t, 13, 17)))}"/>`;
  const rise = ease(prog(t, 16.4, 18.1)), sx = 40 + 760 * prog(t, 19.0, 21.8);
  if (rise > 0) w += G(at(sx, 1560 + 1500 * (1 - rise) - 14 * Math.sin(t * 2.4), 2.05), shadowFig(t, { reach: .5 + .5 * Math.sin(t * 1.3) }));
  w += clouds(t, 1, 1480);
  const [HX, HY] = kHand(bx, 1500, 2);
  const sm = prog(t, 12.9, 14.2) * (1 - prog(t, 17.2, 18.4));
  if (sm > 0) for (let i = 0; i < 16; i++) { const ph = (t * .45 + i / 16) % 1, a = i * 2.1 + t * 1.4, r = 60 + ph * 330; w += `<circle cx="${R(HX + Math.cos(a) * r * .8 - ph * 260)}" cy="${R(HY + Math.sin(a) * r * .5 + ph * 120)}" r="${R(40 + ph * 70)}" fill="#1a0b22" opacity="${R(sm * .55 * (1 - ph))}" filter="url(#blur8)"/>`; }
  w += G(at(bx, 1500 - (walking ? Math.abs(Math.sin(wk)) * 14 : 0), 2.0), bhK({ t, walk: wk, glow: .4, brow: -.8, look: between(t, 17.3, 18.9) ? [-5, 0] : (t < 17.3 ? [4, -2] : [-3, 0]), open: between(t, 17.4, 18.8) ? .5 : 0, tilt: between(t, 17.3, 18.9) ? -6 : 3, armL: walking ? [20 + 16 * Math.sin(wk), 14] : [16, 10] }));
  const tp = prog(t, 13.9, 14.3) * (1 - prog(t, 15.9, 16.3));
  const stamp = tp > 0 ? G(at(1440, 250, 1, -6), G(`scale(${R(lerp(2.2, 1, easeOut(tp)))})`, txt(0, 0, 'ब्रह्म-हत्या', 128, '#fff3c0', { stroke: '#5e0b12', sw: 26 }) + txt(0, 118, 'का पाप', 100, '#ff5a3c', { stroke: '#2a0508', sw: 22 })), `opacity="${R(clamp(tp * 2))}"`) : '';
  return cam(cx, cy, z, w) + vignette(.55) + stamp;
}

// K3 — Bhairava hurries to Mahadev on Kailash
function k3(t) {
  const [cx, cy, z] = kf(t, [[21.2, [960, 540, 1]], [25.1, [960, 540, 1.03]], [26.0, [1040, 480, 1.42]], [30.9, [1050, 480, 1.48]]]);
  let w = bg(t, 2, { cx: 1400, cy: 420 }) + peaks(900);
  w += G(at(lerp(-500, 110, ease(prog(t, 23.0, 25.0))), 1010 - 10 * Math.sin(t * 2.4), 1.12), shadowFig(t, { alpha: .88 }));
  w += clouds(t, 2, 930);
  w += `<circle cx="1420" cy="430" r="300" fill="#fff8d8" opacity=".6" filter="url(#blur40)"/>`;
  w += G(at(1420, 950, 1.05), shiva({ t, look: [-4, 1], smile: .25, brow: -.1 }));
  const mv = prog(t, 21.4, 24.2), bx = lerp(-260, 800, 1 - Math.pow(1 - mv, 1.6)), wk = mv < 1 ? (t - 21.4) * 9 : undefined;
  const sp = between(t, 25.8, 26.2) || between(t, 26.8, 28.32) || between(t, 28.88, 30.41);
  w += G(at(bx, 950 - (wk !== undefined ? Math.abs(Math.sin(wk)) * 9 : 0), 1.05), bhK({ t, walk: wk, glow: .4, brow: -.9, look: [4, 0], open: sp ? talk(t) : (mv < 1 ? .35 : 0), tilt: 3,
    armR: kf(t, [[28.6, [82, 48]], [29.1, [98, 62]]]), armL: mv < 1 ? [20 + 16 * Math.sin(wk), 14] : (between(t, 26.6, 28.5) ? [44 + 6 * Math.sin(t * 5), -70] : [16, 10]) }));
  for (let i = 0; i < 3; i++) if (mv >= 1 && t < 25.6) { const ph = (t * 1.6 + i * .37) % 1; w += G(at(880 + i * 30, 300 + ph * 110, .8), `<path d="M0,-22 C14,0 14,14 0,16 C-14,14 -14,0 0,-22Z" fill="#9fe0ff" stroke="${OUT}" stroke-width="4"/>`, `opacity="${R(1 - ph)}"`); }
  w += clouds(t + 40, 2, 1020);
  return cam(cx, cy, z, w) + vignette(.25);
}

// K4 — Mahadev's answer
function k4(t) {
  const z = lerp(1, 1.04, prog(t, 30.9, 49.4));
  const sp = [[34.06, 35.24], [35.71, 37.73], [38.46, 40.45], [41.26, 45.25], [45.73, 47.54], [47.98, 48.96]].some(([a, b]) => between(t, a, b));
  let w = bg(t, 2, { cx: 420 }) + clouds(t, 2, 1040);
  w += `<circle cx="420" cy="430" r="330" fill="#fff8d8" opacity=".6" filter="url(#blur40)"/>`;
  const arm = kf(t, [[33.8, [14, 6]], [34.2, [24, -138]], [35.4, [24, -138]], [35.9, [84, 6]], [38.2, [84, 6]], [38.7, [70, 110]], [49.4, [70, 110]]]);
  const hand = between(t, 35.6, 38.3) || between(t, 38.6, 40.7) ? 'point' : (t > 40.7 ? 'palm' : undefined);
  w += G(at(420, 1500, 2.0), shiva({ t, smile: .35, tSide: -1, armL: [50, -45], armR: arm, handR: hand, open: sp ? talk(t) * .8 : 0, look: [3, 0], lid: between(t, 31.4, 33) ? .9 : 0 }));
  // medallion art
  const m1 = G('translate(0,20)', `<circle r="120" fill="#ffd98a"/>` + G('translate(-10,70) rotate(38)', `<path d="M-14,-10 L-16,-170 L0,-214 L16,-170 L14,-10Z" fill="#eef1f4" stroke="${BO}" stroke-width="5" stroke-linejoin="round"/><rect x="-34" y="-14" width="68" height="16" rx="6" fill="#e9b21c" stroke="${BO}" stroke-width="5"/><rect x="-9" y="0" width="18" height="50" rx="6" fill="#8a4a1c" stroke="${BO}" stroke-width="5"/><circle cx="0" cy="26" r="30" fill="#3c3b78" stroke="${BO}" stroke-width="5"/><path d="M-22,14 L22,14 M-24,28 L24,28" stroke="${BO}" stroke-width="3.5" opacity=".7"/>`));
  const sy = 96 * Math.sin((t - 41.4) * 1.5);
  const m2 = `<rect x="-160" y="-160" width="320" height="110" fill="#bfe4ff"/><rect x="-160" y="-50" width="320" height="100" fill="#9fd07a"/><rect x="-160" y="50" width="320" height="120" fill="#3a2350"/><path d="M-160,-50 L160,-50 M-160,50 L160,50" stroke="${OUT}" stroke-width="4"/>` +
    `<circle cx="-84" cy="-104" r="20" fill="#fff"/><circle cx="-58" cy="-98" r="16" fill="#fff"/><path d="M84,-124 l6,14 l15,2 l-11,10 l3,15 l-13,-8 l-13,8 l3,-15 l-11,-10 l15,-2Z" fill="#ffd23c" stroke="${OUT}" stroke-width="3"/>` +
    `<path d="M-130,50 L-80,-30 L-30,50Z" fill="#6fa857" stroke="${OUT}" stroke-width="3.5"/>` + G('translate(92,50) scale(.22)', temple({ t })) + `<path d="M-110,110 q20,-24 40,0 t40,0 t40,0" fill="none" stroke="#b08ad8" stroke-width="7" stroke-linecap="round"/><path d="M70,96 q14,-18 28,0 t28,0" fill="none" stroke="#b08ad8" stroke-width="7" stroke-linecap="round"/>` +
    G(`translate(0,${R(sy)}) scale(.82)`, skull(.8));
  const fall = ((t - 46.1) % 1.5 + 1.5) % 1.5 / 1.5;
  const m3 = `<circle r="150" fill="#ffe9a8"/><circle cx="-10" cy="-96" r="34" fill="#3c3b78" stroke="${BO}" stroke-width="5"/><path d="M-150,-112 L-40,-100" stroke="${BO}" stroke-width="44" stroke-linecap="round"/><path d="M-150,-112 L-40,-100" stroke="#3c3b78" stroke-width="34" stroke-linecap="round"/>` +
    G(`translate(${R(10 + fall * 30)},${R(-40 + fall * fall * 150)}) rotate(${R(fall * 70)}) scale(1.35)`, skull(0), `opacity="${R(1 - fall * fall * .6)}"`) + sparkles(t, 10, 20, 110, 7);
  w += medallion(1010, 420, 150, m1, '', prog(t, 35.9, 37.4), 'कर्म तुम्हारा');
  w += medallion(1335, 420, 150, m2, '', prog(t, 41.4, 42.9), 'भिक्षाटन');
  w += medallion(1660, 420, 150, m3, 'ok', prog(t, 46.0, 47.6), 'तब मुक्ति');
  return cam(960, 540, z, w) + vignette(.22);
}

// K5 — the long wandering
function k5(t) {
  const W = 250 * (t - 49.4), fast = prog(t, 63.4, 65.1);
  const th = (t < 63.4 ? lerp(150, 62, prog(t, 49.4, 63.4)) : 62 - 1080 * fast) * Math.PI / 180;
  const d = clamp(Math.sin(th) * 2 + .35);
  const [cx, cy, z] = kf(t, [[49.4, [960, 540, 1]], [52.2, [960, 540, 1]], [53.2, [1090, 560, 1.25]], [59.8, [1090, 560, 1.25]], [60.8, [960, 540, 1]], [65.1, [960, 540, 1.03]]]);
  let w = skyGrad('sk5', mix('#2b1247', '#ff9d2e', d), mix('#7a2a3a', '#ffe7ad', d));
  for (let i = 0; i < 40; i++) w += `<circle cx="${R(rnd(i) * 1920)}" cy="${R(rnd(i + 9) * 600)}" r="${R(2 + rnd(i + 3) * 3)}" fill="#fff8d8" opacity="${R((1 - d) * (.4 + .5 * rnd(i + 5)))}"/>`;
  const sunx = 960 + 860 * Math.cos(th), suny = 900 - 680 * Math.sin(th);
  w += `<circle cx="${R(sunx)}" cy="${R(suny)}" r="110" fill="#fff3c0" stroke="#ffb03c" stroke-width="10"/>`;
  w += G(at(960 - 860 * Math.cos(th), 900 + 680 * Math.sin(th)), `<path d="M0,-80 A80,80 0 1,0 0,80 A58,66 0 1,1 0,-80Z" fill="#fff8d8" stroke="${OUT}" stroke-width="5" transform="rotate(30)"/>`);
  const hx = -((W * .25) % 960);
  w += G(`translate(${R(hx)},0)`, `<path d="M-200,820 L60,560 L300,720 L560,520 L760,820 L1020,560 L1260,720 L1520,520 L1720,820 L1980,560 L2220,720 L2480,520 L2900,820Z" fill="${mix('#3a1840', '#d9782e', d)}" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/>`);
  const cols = ['#ffe1a6', '#f6b98a', '#ffd27a', '#f2a66a'], seq = ['h', 'h', 't', 'tr', 'h', 't', 'h', 'tr'];
  for (let i = -1; i < 40; i++) {
    const sx = i * 470 + 500 - W; if (sx < -500 || sx > 2500) continue; const k = seq[((i % 8) + 8) % 8];
    w += G(at(sx, 900, 1), k === 'h' ? house(cols[((i % 4) + 4) % 4], 1 + (i & 1)) : k === 't' ? G('scale(.86)', temple({ t, spire: i % 2 ? '#d8401e' : '#f09a2e' })) : tree());
  }
  w += `<rect x="-400" y="900" width="2720" height="500" fill="${mix('#5a2a3a', '#e08a3c', d)}" stroke="${OUT}" stroke-width="5"/>`;
  for (let i = 0; i < 12; i++) { const gx = ((i * 260 - W) % 2800 + 2800) % 2800 - 400; w += `<path d="M${R(gx)},${950 + (i % 3) * 36} h80" stroke="${OUT}" stroke-width="5" stroke-linecap="round" opacity=".25"/>`; }
  w += `<rect x="-400" y="-400" width="2720" height="2000" fill="#1a0a30" opacity="${R((1 - d) * .4)}"/>`;
  const wk = (t - 49.4) * 7, beg = ease(prog(t, 55.4, 55.9)) * (1 - ease(prog(t, 57.0, 57.5)));
  const shx = lerp(210, 500, ease(prog(t, 59.9, 61.2)));
  w += G(at(shx, 1010 - 12 * Math.abs(Math.sin(wk * .5)), 1.12), shadowFig(t, { reach: .5 + .5 * Math.sin(t * 1.7), alpha: .9 }));
  const armR = [lerp(82, 96, beg), lerp(48, 24, beg)];
  w += G(at(1080, 990 - Math.abs(Math.sin(wk)) * 9, 1.12), bhK({ t, walk: wk, armR, glow: .35, brow: lerp(.2, -.8, prog(t, 56, 60)), look: between(t, 60.3, 63.2) ? [-5, 0] : [3, 0], tilt: between(t, 60.3, 63.2) ? -5 : 2, armL: [20 + 16 * Math.sin(wk), 14], open: beg > .5 ? talk(t) * .6 : 0 }));
  let ov = '';
  const ip = backOut(prog(t, 57.15, 57.6)) * (1 - prog(t, 59.6, 59.9));
  if (ip > 0) { // close-up inset: the skull will not budge
    const tug = 10 * Math.sin(t * 24), h = armHand(1, K_ARM);
    ov += G(at(400, 350, R(ip)), `<circle r="250" fill="#7d1717" stroke="${OUT}" stroke-width="16"/><circle r="250" fill="none" stroke="#e9a21c" stroke-width="8"/><clipPath id="ins"><circle r="242"/></clipPath><g clip-path="url(#ins)">` + sunRays(0, 0, t, .18, '#ffb03c') +
      G(`translate(${R(-h[0] * 3.2 - 10)},${R(-h[1] * 3.2 + 30)}) scale(3.2)`, bhK({ t, glow: .8 })) + G(`translate(${R(70 + tug)},-150)`, `<circle r="52" fill="#3c3b78" stroke="${BO}" stroke-width="12"/><path d="M40,-30 L220,-150" stroke="${BO}" stroke-width="84" stroke-linecap="round"/><path d="M40,-30 L220,-150" stroke="#3c3b78" stroke-width="62" stroke-linecap="round"/>`) + `</g>` +
      [-1, 1].map(sd => `<path d="M${sd * 150},-60 q${sd * 30},50 0,100" fill="none" stroke="#fff3c0" stroke-width="12" stroke-linecap="round" opacity="${R(.5 + .5 * Math.sin(t * 24))}"/>`).join(''));
  }
  const yp = prog(t, 63.8, 64.15);
  if (yp > 0) ov += G(at(960, 180), bigTitle('बरसों बीत गए…', 124, yp));
  const kp = backOut(prog(t, 50.2, 50.7)) * (1 - prog(t, 52.0, 52.4));
  if (kp > 0) ov += G(at(1560, 230, R(kp)), ribbonLabel('कपाली', 96, 330));
  return cam(cx, cy, z, w) + vignette(.3) + ov;
}

function kashiScene(t, o = {}) { // skyline across the Ganga
  const { y0 = 640, sunY = 430, top = '#ff8a2a', bot = '#ffe7a8', tri = 0 } = o;
  let w = skyGrad('skK', top, bot) + sunRays(960, sunY, t, .16);
  w += `<circle cx="960" cy="${R(sunY)}" r="250" fill="#fff6cf" stroke="#ffcf6a" stroke-width="12"/>`;
  if (tri > 0) w += G(at(960, y0 + 40, 1.02), trishul(560), `opacity="${R(tri * .5)}" filter="url(#blur8)"`) + G(at(960, y0 + 40, 1.02), trishul(560), `opacity="${R(tri * .28)}"`);
  w += kashi(t, y0) + river(t, y0 + 96);
  w += G(at(380 + 40 * Math.sin(t * .3), y0 + 210, .9), boat(t, 1)) + G(at(1500 - 30 * Math.sin(t * .25), y0 + 290, 1.1), boat(t, 2));
  return w;
}

// K6 — Kashi, Mahadev's own city
function k6(t) {
  const z = lerp(1.0, 1.1, prog(t, 65.1, 70.2));
  let w = kashiScene(t, { sunY: lerp(600, 400, ease(prog(t, 65.1, 68.5))), tri: ease(prog(t, 68.1, 69.2)) });
  w += `<path d="M-400,1010 Q300,950 700,1000 T1500,1010 T2320,990 L2320,1300 L-400,1300Z" fill="#c4541f" stroke="${OUT}" stroke-width="5"/>`;
  w += G(at(120, 1090, .78), shadowFig(t, { alpha: .85 })) + G(at(300, 1085, .8), bhK({ t, glow: .4, look: [4, -2], brow: -.5 }));
  const tp = prog(t, 66.7, 67.1);
  return cam(960, 520, z, w) + vignette(.25) + (tp > 0 ? G(at(960, 280), bigTitle('काशी', 220, tp)) : '');
}

// K7 — the shadow cannot cross into Kashi
function k7(t) {
  const HIT = 73.3, push = ease(prog(t, 75.7, 77.2));
  const [cx, cy, z] = kf(t, [[70.2, [900, 540, 1.0]], [73.0, [960, 540, 1.0]], [74.2, [860, 520, 1.16]], [78.8, [850, 520, 1.2]]]);
  let w = skyGrad('sk7', '#a83a1a', '#ffc36a');
  w += `<path d="M-400,760 L-100,520 L200,700 L460,480 L760,760Z" fill="#7a2a1c" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/>` + G(at(150, 930, 1.1), tree()) + G(at(560, 930, .9), tree());
  w += `<clipPath id="kc"><rect x="1000" y="-400" width="1500" height="1800"/></clipPath><g clip-path="url(#kc)">` + skyGrad('sk7b', '#ffb03c', '#fff3c0') + sunRays(1500, 420, t, .2) + `<circle cx="1500" cy="420" r="200" fill="#fff8d8"/>` + kashi(t, 834, { noUmb: 1 }) + `</g>`;
  w += `<rect x="-400" y="930" width="2720" height="500" fill="#d9692a" stroke="${OUT}" stroke-width="5"/><rect x="1000" y="930" width="1400" height="500" fill="#ffc86a" stroke="${OUT}" stroke-width="5"/>`;
  const pulse = Math.max(between(t, HIT, HIT + 1) ? 1 - prog(t, HIT, HIT + 1) : 0, push * (.6 + .4 * Math.sin(t * 9)));
  w += `<circle cx="2230" cy="930" r="1240" fill="#ffe27a" opacity="${R(.12 + .2 * pulse)}" stroke="#fff3a0" stroke-width="${R(8 + 14 * pulse)}"/>`;
  w += `<rect x="970" y="-300" width="60" height="1240" fill="#fff3a0" opacity="${R(.35 + .5 * pulse)}" filter="url(#blur20)"/>`;
  w += G(at(1000, 934, 1.12), gate({ t }));
  const hit = t - HIT, bump = hit > 0 ? Math.exp(-hit * 4) * Math.cos(hit * 16) : 0;
  const shx = hit < 0 ? lerp(-260, 800, prog(t, 70.9, HIT)) : 800 - 60 * (1 - Math.exp(-hit * 3)) - 230 * push;
  const ss = 1.08 * (1 - .22 * push);
  w += G(`translate(${R(shx)},${R(950 - 10 * Math.sin(t * 2.4))}) scale(${R(ss * (1 - .25 * Math.max(0, bump)))},${R(ss * (1 + .1 * Math.max(0, bump)))})`, shadowFig(t, { fear: hit > 0 ? 1 : 0, reach: hit > 0 ? 1 : .6 + .4 * Math.sin(t * 2), alpha: lerp(.93, .7, push) }));
  if (hit > 0) for (let i = 0; i < 3; i++) { const ph = clamp(hit * 1.4 - i * .2); if (ph > 0 && ph < 1) w += `<ellipse cx="985" cy="560" rx="${R(40 + ph * 260)}" ry="${R(80 + ph * 520)}" fill="none" stroke="#fff6c8" stroke-width="${R(16 * (1 - ph))}" opacity="${R(1 - ph)}"/>`; }
  if (push > 0) for (let i = 0; i < 5; i++) { const ph = (t * 1.3 + i * .2) % 1; w += `<path d="M${R(980 - ph * 300)},${330 + i * 110} l-70,0" stroke="#fff6c8" stroke-width="10" stroke-linecap="round" opacity="${R((1 - ph) * push)}"/>`; }
  const mv = prog(t, 70.6, 73.5), bx = lerp(430, 1480, mv), wk = mv < 1 ? (t - 70.6) * 7 : undefined, back = hit > .2;
  w += G(at(bx, 960 - (wk !== undefined ? Math.abs(Math.sin(wk)) * 9 : 0), 1.0), bhK({ t, walk: wk, glow: .4, look: back ? [-5, 0] : [3, 0], tilt: back ? -6 : 2, brow: back ? lerp(-.6, 0, push) : -.5, open: back && hit < 1.4 ? .5 : 0, smile: push * .6, armL: wk !== undefined ? [20 + 16 * Math.sin(wk), 14] : [16, 10] }));
  const lp = backOut(prog(t, 76.2, 76.7));
  if (lp > 0) w += G(at(520, 250, R(lp)), ribbonLabel('पाप का प्रवेश नहीं', 70, 640));
  return cam(cx, cy, z, w) + vignette(.3);
}

// K8 — the skull lets go
function k8(t) {
  const T = 80.6, free = t >= T, dt = t - T;
  const [sx, sy] = shakeXY(t, between(t, T + .7, T + 1.2) ? 12 * (1 - prog(t, T + .7, T + 1.2)) : 0);
  const [cx, cy, z] = kf(t, [[78.8, [1080, 520, 1.18]], [80.4, [1130, 510, 1.32]], [81.6, [1100, 540, 1.2]], [83.6, [1040, 520, 1.12]]]);
  let w = bg(t, 2, { cx: 1000 });
  const [HX, HY] = kHand(860, 1500, 2), wob = prog(t, 79.2, T), rot = free ? 0 : Math.sin(t * 22) * 16 * wob;
  w += `<circle cx="${R(HX)}" cy="${R(HY)}" r="${R(160 + 60 * wob)}" fill="#fff8d0" opacity="${R(.5 + .3 * wob)}" filter="url(#blur40)"/>`;
  const joy = ease(prog(t, T + 1.0, T + 1.8));
  w += G(at(860, 1500, 2.0), bhK({ t, noSkull: free, skRot: rot, glow: 1 - wob, brow: lerp(-.6, -.2, joy), smile: joy, look: free && dt < 1 ? [3, 5] : [4, -2], open: free && dt < 1.1 ? .6 : 0, tilt: 4, armR: free ? [82 + 5 * Math.sin(t * 6) * joy, 48] : K_ARM }));
  if (free) {
    const y = HY - 12 + 1500 * dt * dt, x = HX + 12 + 50 * dt;
    if (y < 1300) w += `<path d="M${R(x)},${R(y - 60)} L${R(x - 10)},${R(Math.max(HY, y - 380))}" stroke="#fff3a0" stroke-width="22" stroke-linecap="round" opacity=".5"/>` + G(at(x, y, 2.5, 12 + dt * 260), skull(0));
    const bp = prog(t, T, T + .6); if (bp < 1) for (let i = 0; i < 12; i++) w += `<path d="M0,-${R(60 + bp * 170)} L0,-${R(100 + bp * 260)}" transform="translate(${R(HX)},${R(HY)}) rotate(${i * 30})" stroke="#fff3a0" stroke-width="12" stroke-linecap="round" opacity="${R(1 - bp)}"/>`;
    const ip = prog(t, T + .7, T + 1.7);
    if (ip > 0 && ip < 1) { w += `<ellipse cx="${R(HX + 50)}" cy="1120" rx="${R(200 + ip * 900)}" ry="${R(120 + ip * 420)}" fill="#fff6c8" opacity="${R((1 - ip) * .8)}" filter="url(#blur40)"/>`; for (let i = 0; i < 10; i++) w += `<circle cx="${R(HX + 50 + (rnd(i) - .5) * 700 * ip)}" cy="${R(1080 - ip * (200 + rnd(i + 3) * 500) + ip * ip * 300)}" r="${R(6 + rnd(i + 5) * 8)}" fill="#fff3a0" opacity="${R(1 - ip)}"/>`; }
    if (joy > 0) w += G('', sparkles(t, HX, HY, 150, 12), `opacity="${R(joy)}"`);
  }
  return cam(cx + sx, cy + sy, z, w) + vignette(.25);
}

// K9 — Kapalmochan tirtha
function k9(t) {
  const z = lerp(1.0, 1.08, prog(t, 83.6, 89.3)), S = 84.75, dt = t - S;
  let w = skyGrad('sk9', '#ffa63c', '#fff0c0') + sunRays(960, 300, t, .16) + `<circle cx="960" cy="300" r="170" fill="#fff8d8"/>`;
  w += G('translate(0,0)', kashi(t, 520, { noUmb: 1 }), 'opacity=".75"');
  w += `<rect x="-400" y="600" width="2720" height="800" fill="#e9a85c" stroke="${OUT}" stroke-width="5"/>`;
  w += G(at(170, 700, 1.25), tree()) + G(at(1790, 720, 1.35), tree()) + spire(1500, 690, 150, 300, '#e2562a', t);
  for (let i = 0; i < 4; i++) w += `<ellipse cx="960" cy="${800 + i * 4}" rx="${760 - i * 62}" ry="${250 - i * 24}" fill="${i % 2 ? '#f3c98c' : '#ffe3b0'}" stroke="${OUT}" stroke-width="5"/>`;
  w += `<defs><radialGradient id="kw" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="${mix('#5fc0cc', '#fff3a0', dt > 0 ? .7 * Math.exp(-dt * .5) : 0)}"/><stop offset="1" stop-color="#2f8fa8"/></radialGradient></defs><ellipse cx="960" cy="818" rx="540" ry="160" fill="url(#kw)" stroke="${OUT}" stroke-width="5"/>`;
  if (dt > 0) {
    w += `<ellipse cx="960" cy="818" rx="150" ry="46" fill="#fff6c8" opacity="${R(.75 * Math.exp(-dt * .35) * (.7 + .3 * Math.sin(t * 4)))}" filter="url(#blur20)"/>`;
    for (let i = 0; i < 4; i++) { const ph = (dt * .55 + i * .25) % 1; if (dt * .55 + i * .25 < 3.2) w += `<ellipse cx="960" cy="818" rx="${R(40 + ph * 480)}" ry="${R(12 + ph * 140)}" fill="none" stroke="#fff" stroke-width="${R(8 * (1 - ph))}" opacity="${R((1 - ph) * Math.exp(-dt * .5))}"/>`; }
    if (dt < .9) for (let i = 0; i < 12; i++) { const a = -Math.PI * (i + .5) / 12, v = 300 + rnd(i) * 260; w += `<circle cx="${R(960 + Math.cos(a) * v * dt * .9)}" cy="${R(818 + Math.sin(a) * v * dt + 700 * dt * dt)}" r="${R(7 + rnd(i + 2) * 7)}" fill="#dff6ff" stroke="${OUT}" stroke-width="3" opacity="${R(1 - dt / .9)}"/>`; }
    [[700, 790, 85.7], [1210, 800, 85.95], [840, 880, 86.2], [1100, 892, 86.4], [560, 836, 86.6], [1370, 842, 86.8]].forEach(([x, y, t0], i) => { const p = backOut(prog(t, t0, t0 + .45)); if (p > 0) w += G(at(x + 6 * Math.sin(t + i), y, R(p * .85)), lotus()); });
  } else { const u = prog(t, 83.6, S), y = lerp(-200, 800, u * u); w += `<path d="M960,${R(y - 60)} L960,${R(y - 420)}" stroke="#fff3a0" stroke-width="20" stroke-linecap="round" opacity=".5"/>` + G(at(960, y, 1.5, u * 300), skull(.8)); }
  const lp = backOut(prog(t, 86.6, 87.1));
  if (lp > 0) w += G(at(960, 230, R(lp)), ribbonLabel('कपालमोचन तीर्थ', 88, 760));
  return cam(960, 540, z, w) + vignette(.22);
}

// K10 — freed, and made Kotwal of Kashi
function k10(t) {
  const z = lerp(1.0, 1.06, prog(t, 89.3, 95.5));
  const joy = ease(prog(t, 89.5, 90.0)) * (1 - ease(prog(t, 91.3, 91.9)));
  let w = skyGrad('sk10', '#ffa63c', '#fff3c8') + sunRays(1040, 440, t, .2 + .1 * joy) + G('', kashi(t, 760, { noUmb: 1 }), 'opacity=".55"');
  w += `<rect x="-400" y="856" width="2720" height="600" fill="#f2b05c" stroke="${OUT}" stroke-width="5"/>`;
  w += `<circle cx="1040" cy="520" r="${R(330 + 60 * joy)}" fill="#fff8d0" opacity=".75" filter="url(#blur40)"/>`;
  for (let i = 0; i < 3; i++) { const ph = ((t - 89.5) * .7 + i / 3) % 1; if (joy > 0) w += `<circle cx="1040" cy="520" r="${R(120 + ph * 520)}" fill="none" stroke="#fff" stroke-width="${R(14 * (1 - ph))}" opacity="${R((1 - ph) * joy)}"/>`; }
  for (let i = 0; i < 14; i++) { const ph = prog(t, 89.5 + rnd(i) * .5, 91.2 + rnd(i) * .5); if (ph > 0 && ph < 1) w += `<circle cx="${R(1040 + (rnd(i + 3) - .5) * 420 + 40 * Math.sin(ph * 6 + i))}" cy="${R(700 - ph * 620)}" r="${R((1 - ph) * (10 + rnd(i + 7) * 16))}" fill="#170b20" opacity="${R((1 - ph) * .8)}"/>`; }
  const sx = lerp(-300, 520, easeOut(prog(t, 91.6, 92.9))), give = ease(prog(t, 93.2, 93.8));
  const sArm = [lerp(14, 78, ease(prog(t, 92.6, 93.1))), 8], sh = armHand(1, sArm), bArm = [lerp(16, 58, give), lerp(10, -52, give)], bh = armHand(-1, bArm);
  const p0 = [sx + sh[0] * 1.02, 1010 + sh[1] * 1.02 + 150], p1 = [1040 + bh[0] * 1.05, 1010 + bh[1] * 1.05 + 190];
  const dx = lerp(p0[0], p1[0], give), dy = lerp(p0[1], p1[1], give) - 60 * Math.sin(give * Math.PI);
  if (t > 91.5) w += G(at(sx, 1010, 1.02), shiva({ t, smile: .5, look: [4, 0], tSide: -1, armL: [50, -45], armR: sArm, open: between(t, 92.9, 93.6) ? talk(t) * .6 : 0 }));
  const staff = t > 91.5 ? `<circle cx="${R(dx)}" cy="${R(dy - 300)}" r="150" fill="#fff3a0" opacity="${R(.6 * Math.sin(give * Math.PI))}" filter="url(#blur20)"/>` + G(at(dx, dy, 1.05), danda()) : '';
  w += (give < .5 ? '' : staff) + G(at(1040, 1010, 1.05), bhairava({ t, smile: Math.max(joy, prog(t, 91, 92)), brow: lerp(.2, -.2, joy), look: t > 91.8 && give < 1 ? [-4, 0] : [0, 0], armL: joy > 0 ? [lerp(16, 150, joy), lerp(10, 20, joy)] : bArm, armR: [lerp(16, 150, joy), lerp(10, 20, joy)], open: joy > .5 ? .5 : 0 })) + (give < .5 ? staff : '');
  if (joy > 0) w += G('', sparkles(t, 1040, 500, 380, 16), `opacity="${R(joy)}"`);
  const dp = backOut(prog(t, 93.9, 94.4)); if (dp > 0) w += G(at(1400, 1010, R(dp)), dog(t));
  const tp = prog(t, 93.45, 93.85);
  return cam(960, 596, z, w) + vignette(.22) + (tp > 0 ? G(at(960, 170), bigTitle('काशी के कोतवाल', 120, tp)) : '');
}

// K11 — every devotee is first seen by Kal Bhairav
function k11(t) {
  const z = lerp(1.0, 1.07, prog(t, 95.5, 103.9)), gaze = ease(prog(t, 101.7, 102.3));
  let w = skyGrad('sk11', '#ff9a34', '#fff0c0') + sunRays(960, 300, t, .16) + G('', kashi(t, 800, { noUmb: 1 }), 'opacity=".7"');
  w += `<path d="M-400,896 L2320,896 L2320,1400 L-400,1400Z" fill="#f2b05c" stroke="${OUT}" stroke-width="5"/><path d="M640,1300 L860,980 L1060,980 L1280,1300Z" fill="#ffd98a" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/>`;
  w += G(at(960, 980, 1.1), gate({ t, noTop: 1, sign: false }));
  // devotees walk in through the gate
  const D = [['#c8281e', '#1c1420', '#d99a66', 0, -520], ['#3f9b46', '#2b1a14', '#c98a58', .2, 420], ['#ffd21f', '#1c1420', '#e0a878', .42, -260], ['#4f8be0', '#4a2a18', '#d99a66', .62, 560], ['#ff7a12', '#1c1420', '#c98a58', .82, -40]];
  const list = D.map(([c, h, sk, off, x0], i) => { const ph = ((t - 95.5) * .135 + off) % 1; return { c, h, sk, i, ph, x: lerp(960 + x0, 960 + x0 * .08, ease(ph)), y: lerp(1160, 950, ph), s: lerp(1.1, .5, ph) }; }).sort((a, b) => b.ph - a.ph);
  const near = list[list.length - 1], tgt = list.find(d => d.ph > .35 && d.ph < .8) || near;
  let beams = '';
  if (gaze > 0) list.forEach(d => { if (d.ph < .92) beams += `<path d="M930,290 L990,290 L${R(d.x + 70 * d.s)},${R(d.y - 180 * d.s)} L${R(d.x - 70 * d.s)},${R(d.y - 180 * d.s)}Z" fill="#fff6c8" opacity="${R(.22 * gaze * (1 - d.ph * .5))}"/>`; });
  w += beams;
  list.forEach(d => { w += G(at(d.x, d.y, R(d.s)), devotee(d.c, d.h, d.sk, t * 7 + d.i, d.i % 2), `opacity="${R(clamp((1 - d.ph) * 9) * clamp(d.ph * 12))}"`); });
  // Kal Bhairav above the gate
  const lk = [clamp((tgt.x - 960) / 90, -5, 5), 4];
  let niche = `<circle r="${R(196 + 8 * Math.sin(t * 3))}" fill="#fff3a0" opacity="${R(.5 + .4 * gaze)}" filter="url(#blur20)"/>`;
  for (let i = 0; i < 24; i++) niche += `<circle cx="${R(Math.cos(i * Math.PI / 12) * 176)}" cy="${R(Math.sin(i * Math.PI / 12) * 176)}" r="19" fill="${i % 2 ? '#ffc21a' : '#ff5a1c'}" stroke="${OUT}" stroke-width="4"/>`;
  niche += `<circle r="160" fill="#8f1420" stroke="${OUT}" stroke-width="8"/><clipPath id="nc"><circle r="154"/></clipPath><g clip-path="url(#nc)">` + sunRays(0, 0, t * 2, .25, '#ffb03c') + G('translate(0,600) scale(1.02)', bhairava({ t, look: lk, brow: .6, lid: blink(t, 8) })) + `</g>`;
  if (gaze > 0) niche += `<circle cx="-22" cy="40" r="26" fill="#fff3a0" opacity="${R(gaze * .6)}" filter="url(#blur8)"/><circle cx="22" cy="40" r="26" fill="#fff3a0" opacity="${R(gaze * .6)}" filter="url(#blur8)"/>`;
  w += G(at(960, 280, 1.15), niche);
  return cam(960, 560, z, w) + vignette(.25);
}

// K12 — why is Kashi so special?
function k12(t) {
  const z = lerp(1.0, 1.08, prog(t, 103.9, 109.4));
  let w = kashiScene(t, { sunY: 420, top: '#f06a1e', bot: '#ffe09a', tri: .7 + .3 * Math.sin(t * 2) });
  w += sparkles(t, 960, 420, 620, 18, '#fff8d8');
  let ov = '';
  const tp = prog(t, 106.0, 106.4); if (tp > 0) ov += G(at(960, 210), bigTitle('काशी इतनी खास क्यों?', 130, tp));
  [[330, 430, -14, 107.2], [1600, 400, 14, 107.5], [960, 470, 0, 107.8]].forEach(([x, y, r, t0], i) => { const p = backOut(prog(t, t0, t0 + .35)); if (p > 0) ov += G(at(x, y + 10 * Math.sin(t * 4 + i), R(p * (i === 2 ? 1.3 : 1)), r), txt(0, 0, '?', 230, '#fff3c0', { stroke: '#8f1420', sw: 30 })); });
  return cam(960, 520, z, w) + vignette(.3) + ov;
}

// K13 — end card
function k13(t) {
  const hp = prog(t, 111.95, 112.4), z = lerp(1, 1.06, prog(t, 109.4, DURATION));
  let w = bg(t, lerp(1, .35, ease(hp)), { rays: .2 + .15 * hp });
  w += `<circle cx="960" cy="560" r="${R(330 + 120 * hp)}" fill="#ffe27a" opacity="${R(.5 + .3 * hp)}" filter="url(#blur40)"/>`;
  w += G(at(960, 1330, 1 + .02 * Math.sin(t * 2)), trishul(690));
  for (let i = 0; i < 7; i++) w += G(at(600 + i * 120, 1090, 1.5 + .5 * rnd(i)), flame(t, i + 30));
  w += embers(t, 960, 900, 40);
  const p1 = backOut(prog(t, 109.75, 110.2)) * (1 - prog(t, 111.6, 111.9));
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
  [0, k1, 'fade'], [12.4, k2, 'fade'], [21.2, k3, 'fade'], [30.9, k4, 'fade'], [49.4, k5, 'fade'], [65.1, k6, 'flash'], [70.2, k7, 'fade'],
  [78.8, k8, 'fade'], [83.6, k9, 'fade'], [89.3, k10, 'flash'], [95.5, k11, 'fade'], [103.9, k12, 'fade'], [109.4, k13, 'fade'],
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
