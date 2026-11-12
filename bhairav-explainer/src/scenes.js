// Timings come from the pauses detected in audio/narration.mp3
const CAPS = [
  [0.0, 4.54, 'पिछली बार आपने देखा था कि अग्नि-स्तंभ से महादेव प्रकट हुए,'],
  [5.14, 8.30, 'और उनके सामने विष्णु जी सिर झुकाए खड़े थे,'],
  [8.79, 11.14, 'जबकि ब्रह्मा जी की नज़रें झुकी हुई थीं।'],
  [12.10, 13.85, 'महादेव ने ब्रह्मा जी से पूछा,'],
  [14.31, 16.68, '“क्या तुमने सच में स्तंभ का शिखर देखा था?”'],
  [17.32, 18.62, 'ब्रह्मा जी काँप गए,'],
  [19.03, 20.87, 'फिर भी अपनी बात पर अड़े रहे,'],
  [21.26, 23.08, 'और केतकी का फूल भी बोल पड़ा,'],
  [23.50, 25.56, '“हाँ प्रभु, ये सच कह रहे हैं।”'],
  [26.20, 29.05, 'यह सुनते ही महादेव की आँखें लाल हो उठीं।'],
  [29.52, 32.30, 'उनके क्रोध से एक भयंकर रूप प्रकट हुआ,'],
  [32.60, 33.23, 'भैरव,'],
  [33.55, 35.90, 'जिसकी हुंकार से दिशाएँ काँप उठीं।'],
  [36.50, 42.51, 'शिव जी के आदेश पर भैरव ने ब्रह्मा जी का वह पाँचवाँ सिर काट दिया, जिससे झूठ निकला था।'],
  [43.05, 45.20, 'तब विष्णु जी ने हाथ जोड़कर कहा,'],
  [45.72, 47.86, '“प्रभु, ब्रह्मा को क्षमा कर दें।”'],
  [48.50, 51.32, 'महादेव का क्रोध शांत हुआ और उन्होंने कहा,'],
  [51.68, 53.23, '“झूठ की सज़ा तो मिलेगी।'],
  [53.68, 55.73, 'ब्रह्मा की पूजा अलग से नहीं होगी,'],
  [56.05, 58.96, 'और केतकी मेरी पूजा में कभी नहीं चढ़ेगी।'],
  [59.32, 62.09, 'पर यज्ञों में ब्रह्मा का स्थान सदा रहेगा।”'],
  [62.69, 66.48, 'इसीलिए आज भी यज्ञ में ब्रह्मा पुरोहित बनकर बैठते हैं,'],
  [66.84, 68.68, 'पर उनके मंदिर गिनती के ही हैं,'],
  [68.95, 71.94, 'जिनमें सबसे प्रसिद्ध राजस्थान का पुष्कर है।'],
  [72.42, 73.95, 'लेकिन भैरव का क्या हुआ?'],
  [74.36, 79.96, 'ब्रह्मा जी का वह कटा हुआ सिर उनके हाथ से चिपक गया और छूटने का नाम ही नहीं लिया।'],
  [80.36, 82.43, 'यह कहानी जानिए अगले भाग में।'],
  [82.82, 84.69, 'हर हर महादेव!'],
];
const DURATION = 85.5;
const between = (t, a, b) => t >= a && t <= b;
const shakeXY = (t, A) => [A * Math.sin(t * 83) * Math.cos(t * 31), A * Math.cos(t * 67) * Math.sin(t * 41)];

// S1 — recap: pillar of fire, Mahadev appears; Vishnu bowed, Brahma eyes lowered
function s1(t) {
  const [cx, cy, z] = kf(t, [[0, [960, 470, 1.4]], [4.4, [960, 540, 1]], [4.9, [960, 540, 1]], [6.0, [640, 480, 1.45]], [8.4, [650, 480, 1.48]], [9.5, [1280, 470, 1.45]], [11.6, [1290, 470, 1.5]]]);
  const ap = ease(prog(t, 1.0, 3.6));
  let w = bg(t, 0) + pillar(t, 960, 330) + embers(t, 960, 520);
  w += `<circle cx="960" cy="420" r="${R(380 * ap)}" fill="#fff6c8" opacity="${R(.75 * ap)}" filter="url(#blur40)"/>`;
  w += G(at(960, 930 + 60 * (1 - ap), .7 + .45 * ap), shiva({ t, smile: .2 }), `opacity="${R(ap)}"`);
  for (let i = 0; i < 5; i++) w += G(at(820 + i * 70, 960 + 10 * Math.sin(i * 2), 1.1 + .3 * rnd(i)), flame(t, i + 20));
  w += clouds(t, 0, 930);
  w += G(at(380, 930, 1.05), vishnu({ t, lid: .9, tilt: 5, bow: 1, smile: .3 }));
  w += G(at(1540, 935, 1.0), brahma({ t, lid: .6, look: [0, 3], brow: -.7, sideLid: .6, fifthLid: .6, fifthBrow: -.5 }));
  w += clouds(t + 40, 0, 1010);
  const rp = backOut(prog(t, .25, .8)) * (1 - prog(t, 4.3, 4.8));
  const ribbon = rp > 0 ? G(at(60, 70, 1), G(`scale(${R(rp)})`, `<path d="M0,0 L440,0 L410,46 L440,92 L0,92Z" fill="#8f1420" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/>` + txt(200, 64, 'पिछले भाग में…', 52, '#ffe9b0', { sw: 0 }))) : '';
  return cam(cx, cy, z, w) + vignette(.3) + ribbon;
}

// S2 — Mahadev's question
function s2(t) {
  const z = lerp(1, 1.06, prog(t, 11.6, 17));
  const sp = between(t, 14.31, 16.68);
  let w = bg(t, 0, { cx: 520 }) + G('translate(0,0)', pillar(t, 520, 420), 'opacity=".55"') + embers(t, 520, 600);
  w += G(at(1570, 1290, 1.3), brahma({ t, lid: .5, look: [-2, 3], brow: -.8, sideLid: .5, fifthBrow: -.6, armL: [20, -140], armR: [20, -140] }));
  w += G(at(500, 1500, 2.05), shiva({ t, look: [4, 1], brow: .35, open: sp ? talk(t) : 0, tSide: -1, armL: [50, -45], armR: sp ? [78 + 4 * Math.sin(t * 3), 44] : [14, 6], handR: sp ? 'palm' : undefined }));
  const bp = backOut(prog(t, 14.2, 14.75));
  if (bp > 0) {
    let b = `<circle r="215" fill="#fff6dc" stroke="${OUT}" stroke-width="7"/><clipPath id="bc"><circle r="208"/></clipPath><g clip-path="url(#bc)"><rect x="-220" y="-220" width="440" height="440" fill="#ffd98a"/>` + G('translate(0,-520) scale(.42)', pillar(t, 0, 300)) +
      G('translate(0,-70) scale(1,-1)', cloudRow(0, 46, '#fff', t * 6, -400, 400)) + `</g>`;
    b += G(`translate(0,-110) scale(${R(1 + .08 * Math.sin(t * 6))})`, txt(0, 40, '?', 150, '#c8281e', { stroke: '#fff', sw: 16 }));
    w += `<circle cx="760" cy="350" r="16" fill="#fff6dc" stroke="${OUT}" stroke-width="5" opacity="${bp > .3 ? 1 : 0}"/><circle cx="812" cy="318" r="24" fill="#fff6dc" stroke="${OUT}" stroke-width="5" opacity="${bp > .6 ? 1 : 0}"/>` + G(at(1090, 262, R(bp)), b);
  }
  return cam(960, 540, z, w) + vignette(.3);
}

// S3 — Brahma trembles but insists; the ketaki flower backs him
function s3(t) {
  const [cx, cy, z] = kf(t, [[17, [900, 540, 1.04]], [20.9, [900, 540, 1.08]], [21.6, [1040, 540, 1.0]], [25.9, [1060, 540, 1.04]]]);
  const tr = between(t, 17.2, 18.75) ? 1 : 0, firm = ease(prog(t, 18.85, 19.3));
  const jx = tr * 7 * Math.sin(t * 62);
  let w = bg(t, 0, { cx: 700 });
  w += clouds(t, 0, 1030);
  const insist = between(t, 19.03, 20.87);
  w += G(at(700 + jx, 1570, 1.9), brahma({
    t, lid: tr ? .15 : .1, look: tr ? [Math.sin(t * 30) * 2, 1] : [-3, -1], brow: tr ? -1 : lerp(-1, .5, firm), sideLid: 0, fifthBrow: lerp(-.8, .7, firm),
    fifthOpen: insist ? talk(t) : 0, open: tr ? .35 : 0,
    armL: tr ? [20, -140] : kf(t, [[18.85, [20, -140]], [19.3, [72, 108]]]), handL: firm > .5 ? 'point' : undefined,
    armR: tr ? [20, -140] : [16, 10],
  }));
  if (tr) {
    for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) w += `<path d="M${700 + sd * (330 + i * 36)},${380 + i * 20} q${sd * 14},40 0,80 q${-sd * 14},40 0,80" fill="none" stroke="#fff6dc" stroke-width="9" stroke-linecap="round" opacity="${R(.5 + .5 * Math.sin(t * 40 + i))}"/>`;
    for (let i = 0; i < 3; i++) { const ph = (t * 1.6 + i * .37) % 1; w += G(at(860 + i * 44, 400 + ph * 150, 1), `<path d="M0,-22 C14,0 14,14 0,16 C-14,14 -14,0 0,-22Z" fill="#9fe0ff" stroke="${OUT}" stroke-width="4"/>`, `opacity="${R(1 - ph)}"`); }
  }
  if (firm > 0 && t < 21.1) for (let i = 0; i < 4; i++) w += `<path d="M0,-70 L0,-112" transform="translate(700,255) rotate(${-48 + i * 32})" stroke="#fff6dc" stroke-width="10" stroke-linecap="round" opacity="${R(insist ? .5 + .5 * Math.sin(t * 16 + i) : 0)}"/>`;
  const fp = backOut(prog(t, 21.2, 21.8));
  if (fp > 0) {
    const sp = between(t, 23.5, 25.56);
    w += G(at(1420, 600 + 400 * (1 - fp), 1.7, 4 * Math.sin(t * 2)), ketaki(t, { open: sp ? talk(t) : (between(t, 21.4, 23.1) ? .25 : 0), look: [-3, 0], brow: -.3 }));
    const bp = backOut(prog(t, 23.45, 23.85));
    if (bp > 0) w += G(at(1500, 170, R(bp)), `<path d="M-200,-80 Q-200,-110 -170,-110 L170,-110 Q200,-110 200,-80 L200,40 Q200,70 170,70 L-40,70 L-90,128 L-84,70 L-170,70 Q-200,70 -200,40Z" fill="#fff6dc" stroke="${OUT}" stroke-width="7" stroke-linejoin="round"/>` + txt(0, 8, 'हाँ प्रभु!', 84, '#c8281e', { sw: 0 }));
  }
  return cam(cx, cy, z, w) + vignette(.3);
}

// S4 — Mahadev's eyes turn red
function s4(t) {
  const rage = ease(prog(t, 26.7, 28.3)), z = lerp(4.6, 5.6, prog(t, 25.9, 29.3));
  const [sx, sy] = shakeXY(t, rage * 6);
  let w = bg(t, rage, { rays: .13 + rage * .15 });
  let lines = '';
  for (let i = 0; i < 28; i++) { const a = i * (360 / 28) + rnd(i) * 8, r0 = 520 + rnd(i + 3) * 160 - 60 * Math.sin(t * 20 + i); lines += `<path d="M0,${-r0} L-9,-1500 L9,-1500Z" transform="rotate(${R(a)})" fill="#fff0c0"/>`; }
  w += G('translate(960,520)', lines, `opacity="${R(rage * .55)}"`);
  w += G(at(960 + sx, 520 + 545 * z + 20 + sy, z), shiva({ t, rage, noTrishul: true, look: [0, 0] }));
  return w + vignette(.25 + rage * .35);
}

// S5 — Bhairava is born of Shiva's fury
function s5(t) {
  const roar = between(t, 33.5, 35.95) ? 1 : 0, rp = prog(t, 33.5, 35.95);
  const [cx, cy, z] = kf(t, [[29.3, [960, 540, 1.0]], [32.2, [990, 540, 1.04]], [32.9, [1190, 520, 1.3]], [36.2, [1200, 520, 1.36]]]);
  const [sx, sy] = shakeXY(t, roar * 13 * (1 - rp * .5));
  let w = bg(t, 1, { cx: 1300, rays: .2 });
  for (let i = 0; i < 4; i++) { // lightning in the four directions
    const on = roar && Math.sin(t * 23 + i * 1.9) > .35; if (!on) continue;
    const [x, y] = [[240, 150], [1900, 130], [200, 800], [1960, 780]][i], dx = i % 2 ? -1 : 1;
    w += `<path d="M${x},${y} l${dx * 60},90 l${-dx * 30},10 l${dx * 70},110 l${-dx * 26},8 l${dx * 50},100" fill="none" stroke="${OUT}" stroke-width="22" stroke-linejoin="round" stroke-linecap="round"/><path d="M${x},${y} l${dx * 60},90 l${-dx * 30},10 l${dx * 70},110 l${-dx * 26},8 l${dx * 50},100" fill="none" stroke="#fff3a0" stroke-width="11" stroke-linejoin="round" stroke-linecap="round"/>`;
  }
  w += clouds(t, 1, 940);
  w += `<circle cx="420" cy="500" r="330" fill="#ff3a00" opacity=".45" filter="url(#blur40)"/>`;
  w += G(at(420, 960, 1.05), shiva({ t, rage: 1, armR: [50, -45] }));
  // streak from third eye to the birth-fire
  const st = prog(t, 29.5, 30.5), sf = 1 - prog(t, 31.2, 31.8);
  if (st > 0 && sf > 0) { const ex = lerp(430, 1280, ease(st)); w += `<path d="M420,356 Q${R((420 + ex) / 2)},120 ${R(ex)},${R(lerp(356, 560, ease(st)))}" fill="none" stroke="#ff4a00" stroke-width="34" stroke-linecap="round" opacity="${R(sf * .9)}"/><path d="M420,356 Q${R((420 + ex) / 2)},120 ${R(ex)},${R(lerp(356, 560, ease(st)))}" fill="none" stroke="#ffe66b" stroke-width="14" stroke-linecap="round" opacity="${R(sf)}"/>`; }
  const fg = ease(prog(t, 30.3, 31.3)), bp = prog(t, 30.9, 32.1);
  w += `<circle cx="1300" cy="560" r="${R(420 * fg)}" fill="#ffb21c" opacity="${R(.6 * fg)}" filter="url(#blur40)"/>`;
  if (fg > 0) w += G(at(1300, 1000, 5.4 * fg * (1 - .25 * ease(prog(t, 31.6, 32.6)))), flame(t, 3));
  if (roar) for (let i = 0; i < 4; i++) { const ph = (rp * 2.6 + i * .25) % 1; w += `<circle cx="1300" cy="400" r="${R(80 + ph * 900)}" fill="none" stroke="#ffe9a0" stroke-width="${R(22 * (1 - ph))}" opacity="${R((1 - ph) * .8)}"/>`; }
  if (bp > 0) w += G(at(1300 + sx, 975 + sy, 1.22 * backOut(bp)), bhairava({ t, sword: 1, armR: roar ? [150, 20] : [40, -30], armL: roar ? [120, 40] : [30, 20], open: roar ? .85 + .15 * Math.sin(t * 30) : (bp < 1 ? .3 : 0), look: [-2, 0] }), `opacity="${R(clamp(bp * 3))}"`);
  for (let i = 0; i < 6; i++) w += G(at(1100 + i * 80, 1010, 1.2 + .4 * rnd(i)), flame(t, i + 7), `opacity="${R(fg)}"`);
  w += embers(t, 1300, 700, 40, '#ffb21c');
  const tp = prog(t, 32.5, 32.85);
  const title = tp > 0 ? G(at(400, 640, R(lerp(2.6, 1, easeOut(tp)))), txt(0, 0, 'भैरव', 250, '#ffd23c', { sw: 30 }) + txt(0, 0, 'भैरव', 250, '#ffd23c', { stroke: '#c8281e', sw: 8 }), `opacity="${R(clamp(tp * 2))}"`) : '';
  return cam(cx + sx, cy + sy, z, w) + vignette(.5) + title;
}

// S6 — on Shiva's command Bhairava severs the fifth head
function s6(t) {
  const [cx, cy, z] = kf(t, [[36.2, [650, 540, 1.46]], [37.9, [660, 540, 1.5]], [38.6, [1190, 540, 1.38]], [42.8, [1200, 530, 1.44]]]);
  const T = 40.3, cut = t >= T, lunge = ease(prog(t, 39.7, T));
  const [sx, sy] = shakeXY(t, between(t, T, T + .5) ? 16 * (1 - prog(t, T, T + .5)) : 0);
  let w = bg(t, 1, { cx: 1100, rays: .18 }) + clouds(t, 1, 950);
  w += `<circle cx="300" cy="500" r="300" fill="#ff3a00" opacity=".4" filter="url(#blur40)"/>`;
  const pt = ease(prog(t, 36.4, 36.9));
  w += G(at(300, 965, .98), shiva({ t, rage: 1, tSide: -1, armL: [50, -45], armR: [lerp(14, 88, pt), lerp(6, 4, pt)], handR: 'point', open: between(t, 36.5, 37.7) ? talk(t) * .7 : 0, look: [3, 0] }));
  // Brahma
  const bx = 1500, by = 985, bs = 1.05, hx = bx, hy = by - (545 + 142) * bs;
  w += G(at(bx + (cut ? 5 * Math.sin(t * 50) * (1 - prog(t, T, T + 1.2)) : 0), by, bs), brahma({ t, fifth: cut ? 0 : 1, lid: cut ? .9 : 0, sideLid: cut ? .9 : 0, brow: -1, look: [-3, -1], open: cut ? .3 : .2, fifthBrow: -1, fifthOpen: .3, armL: [22, -140], armR: [22, -140] }));
  // Bhairava
  const bhx = lerp(880, 1090, lunge) - 40 * ease(prog(t, T + .3, T + 1.2)), sw = ease(prog(t, T - .12, T + .1));
  const armL = cut ? kf(t, [[T + .2, [30, 20]], [T + .9, [100, 70]]]) : [30, 20];
  const hd = armHand(-1, armL), handW = [bhx + hd[0] * 1.15, 975 + (hd[1] - 4) * 1.15];
  const fly = prog(t, T + .15, T + 1.35);
  w += G(at(bhx, 975, 1.15), bhairava({ t, sword: 1, armR: [lerp(lerp(40, 158, ease(prog(t, 38.9, 39.8))), 62, sw), lerp(20, -14, sw)], armL, open: between(t, 39.8, T + .4) ? .8 : 0, look: [3, -1] }));
  if (cut) { // the severed head becomes a glowing orb that flies to Bhairava's hand and sticks
    const u = ease(fly), x = lerp(hx, handW[0], u), y = lerp(hy, handW[1], u) - 260 * Math.sin(u * Math.PI);
    w += `<circle cx="${R(x)}" cy="${R(y)}" r="80" fill="#fff3a0" opacity=".8" filter="url(#blur20)"/>` + G(at(x, y, lerp(.84, .6, u), u * 360), G('scale(1)', brahmaHead({ skin: '#ffe9a0', lid: .9, brow: -1, shortBeard: true })));
    for (let i = 0; i < 5; i++) { const v = clamp(u - i * .05), xx = lerp(hx, handW[0], v), yy = lerp(hy, handW[1], v) - 260 * Math.sin(v * Math.PI); w += `<circle cx="${R(xx)}" cy="${R(yy)}" r="${14 - i * 2}" fill="#ffe66b" opacity="${R(.5 * (1 - fly))}"/>`; }
  }
  const sl = prog(t, T - .08, T + .22);
  if (sl > 0 && sl < 1) w += G(at(hx, hy + 70, 1, lerp(-50, 40, sl)), `<path d="M-330,0 Q0,-90 330,0 Q0,-40 -330,0Z" fill="#fff" stroke="#ffe66b" stroke-width="8"/>`, `opacity="${R(1 - sl * sl)}"`);
  const fl = between(t, T, T + .3) ? 1 - prog(t, T, T + .3) : 0;
  return cam(cx + sx, cy + sy, z, w) + vignette(.5) + (fl > 0 ? `<rect width="1920" height="1080" fill="#fff" opacity="${R(fl)}"/>` : '');
}

// S7 — Vishnu pleads for forgiveness
function s7(t) {
  const z = lerp(1, 1.07, prog(t, 42.8, 48.2)), m = lerp(1, .55, ease(prog(t, 42.8, 47.5)));
  const sp = between(t, 45.72, 46.1) || between(t, 46.54, 47.86);
  let w = bg(t, m, { cx: 1120 });
  w += `<circle cx="330" cy="520" r="280" fill="#ff3a00" opacity=".35" filter="url(#blur40)"/>`;
  w += G(at(330, 1060, 1.12), shiva({ t, rage: lerp(1, .55, prog(t, 43, 48)), look: [3, 0] }));
  w += clouds(t, m, 1010);
  let halo = '';
  for (let i = 0; i < 16; i++) halo += `<path d="M0,-250 C-46,-320 -30,-390 0,-430 C30,-390 46,-320 0,-250Z" transform="rotate(${i * 22.5 + t * 3})" fill="#fff3c0" opacity=".5"/>`;
  w += G('translate(1150,420)', halo + `<circle r="270" fill="#fff6d0" opacity=".55"/>`);
  w += G(at(1150, 1520, 2.0), vishnu({ t, pray: true, brow: -.9, look: [-4, 0], open: sp ? talk(t) : 0, tilt: -3 + 1.5 * Math.sin(t * 2), smile: .1 }));
  return cam(1000, 540, z, w) + vignette(.3);
}

// S8 — the verdict
function s8(t) {
  const m = lerp(.7, 2, ease(prog(t, 48.3, 50.3))), z = lerp(1, 1.04, prog(t, 48.2, 62.4));
  const sp = between(t, 51.68, 53.23) || between(t, 53.68, 55.73) || between(t, 56.05, 58.96) || between(t, 59.32, 62.09);
  const calm = ease(prog(t, 48.4, 50.2));
  let w = bg(t, m, { cx: 420 }) + clouds(t, m, 1040);
  w += `<circle cx="420" cy="430" r="330" fill="#fff8d8" opacity="${R(.6 * calm)}" filter="url(#blur40)"/>`;
  const up = ease(prog(t, 50.4, 51.2)), fin = between(t, 51.6, 53.4);
  w += G(at(420, 1500, 2.0), shiva({ t, rage: lerp(.5, 0, calm), smile: .5 * calm, tSide: -1, armL: [50, -45], armR: [lerp(14, 70, up), lerp(6, 110, up)], handR: up > .3 ? (fin ? 'point' : 'palm') : undefined, open: sp ? talk(t) * .8 : 0, look: [3, 0], lid: between(t, 48.6, 49.9) ? .9 : 0 }));
  const temp = G('translate(0,96) scale(.52)', temple({ t })) + G('translate(0,60) scale(.2)', brahmaHead({ skin: '#f6cfa3' }));
  const ling = G('translate(-18,100) scale(.78)', shivling()) + G(`translate(64,${R(-52 + 6 * Math.sin(t * 3))}) rotate(160) scale(.9)`, miniKetaki());
  const yag = G('translate(0,104) scale(.72)', kund() + G('translate(0,-100) scale(1.35)', flame(t, 2)));
  w += medallion(1010, 420, 150, temp, 'x', prog(t, 53.7, 55.2), 'अलग पूजा नहीं');
  w += medallion(1335, 420, 150, ling, 'x', prog(t, 56.1, 57.6), 'केतकी वर्जित');
  w += medallion(1660, 420, 150, yag, 'ok', prog(t, 59.35, 60.85), 'यज्ञ में स्थान');
  return cam(960, 540, z, w) + vignette(.22);
}

// S9a — Brahma as the priest of every yajna
function s9a(t) {
  const z = lerp(1.0, 1.09, prog(t, 62.4, 66.7));
  let w = `<defs><linearGradient id="sky9" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb347"/><stop offset="1" stop-color="#ffe9a8"/></linearGradient></defs><rect x="-200" y="-200" width="2320" height="1480" fill="url(#sky9)"/>`;
  w += `<circle cx="960" cy="330" r="250" fill="#fff6cf" opacity=".8"/><path d="M-200,720 Q300,600 760,690 T1500,660 T2120,700 L2120,1300 L-200,1300Z" fill="#f2903a" stroke="${OUT}" stroke-width="5"/>`;
  w += `<rect x="-200" y="860" width="2320" height="420" fill="#d9692a" stroke="${OUT}" stroke-width="5"/><path d="M-200,930 L2120,930" stroke="${OUT}" stroke-width="3" opacity=".3"/>`;
  for (const x of [170, 1750]) w += `<rect x="${x - 34}" y="60" width="68" height="810" fill="#c8281e" stroke="${OUT}" stroke-width="5"/><rect x="${x - 52}" y="820" width="104" height="50" fill="#ffc21a" stroke="${OUT}" stroke-width="5"/><rect x="${x - 52}" y="60" width="104" height="40" fill="#ffc21a" stroke="${OUT}" stroke-width="5"/>`;
  w += `<rect x="60" y="0" width="1800" height="70" fill="#8f1420" stroke="${OUT}" stroke-width="5"/>`;
  for (let k = 0; k < 4; k++) for (let i = 0; i <= 12; i++) { const u = i / 12, x = 204 + k * 378 + u * 378, y = 78 + 90 * Math.sin(u * Math.PI); w += `<circle cx="${R(x)}" cy="${R(y)}" r="15" fill="${i % 2 ? '#ffc21a' : '#ff7a12'}" stroke="${OUT}" stroke-width="3.5"/>`; }
  for (let i = 0; i < 5; i++) { const ph = (t * .22 + i * .2) % 1; w += `<circle cx="${R(960 + 60 * Math.sin(ph * 7 + i))}" cy="${R(560 - ph * 520)}" r="${R(30 + ph * 60)}" fill="#fff" opacity="${R(.38 * (1 - ph))}"/>`; }
  w += G(at(300, 905, .95), rishi({ t, seed: 7, hair: '#6b6b6b', skin: '#c98a58', closed: 1 }));
  w += G(at(560, 950, 1.1), rishi({ t, seed: 9, open: talk(t + 2) * .5 }));
  w += `<circle cx="960" cy="700" r="230" fill="#ffd84a" opacity=".55" filter="url(#blur40)"/>`;
  w += G(at(960, 985, 1.25), kund()) + G(at(960, 850, 2.5), flame(t, 1));
  const pour = .5 + .5 * Math.sin(t * 2.4), ap = [lerp(60, 76, pour), lerp(10, 26, pour)], h = armHand(-1, ap);
  const ladle = G(at(h[0], h[1], 1, 62), `<path d="M0,0 L-150,0" stroke="${OUT}" stroke-width="16" stroke-linecap="round"/><path d="M0,0 L-150,0" stroke="#a85a1e" stroke-width="8" stroke-linecap="round"/><ellipse cx="-164" cy="2" rx="26" ry="15" fill="#e9b21c" stroke="${OUT}" stroke-width="4.5"/>`);
  w += G(at(1380, 960, 1.22), brahma({ t, sit: true, fifth: 0, armL: ap, held: ladle, armR: [24, -130], look: [-3, 2], smile: .5, open: talk(t) * .4 }));
  w += embers(t, 960, 220, 16);
  return cam(960, 560, z, w) + vignette(.25);
}

// S9b — few temples; the famous one at Pushkar
function s9b(t) {
  const [cx, cy, z] = kf(t, [[66.66, [960, 540, 1.0]], [68.6, [960, 540, 1.0]], [70.0, [1010, 520, 1.3]], [72.2, [1010, 515, 1.36]]]);
  let w = `<defs><linearGradient id="skyP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7a1a"/><stop offset=".6" stop-color="#ffd27a"/></linearGradient><linearGradient id="lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb65c"/><stop offset="1" stop-color="#3f9db5"/></linearGradient></defs><rect x="-200" y="-200" width="2320" height="1480" fill="url(#skyP)"/>`;
  w += `<circle cx="1420" cy="330" r="150" fill="#fff3c0" stroke="#ffb03c" stroke-width="10"/>`;
  w += `<path d="M-200,620 L120,430 L330,560 L560,380 L820,580 L1100,440 L1340,570 L1600,400 L1900,560 L2120,470 L2120,760 L-200,760Z" fill="#b8521e" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/>`;
  w += `<path d="M-200,680 Q300,600 700,670 T1500,650 T2120,680 L2120,800 L-200,800Z" fill="#e88a34" stroke="${OUT}" stroke-width="5"/>`;
  const xs = [200, 480, 1380, 1650, 1850];
  xs.forEach((x, i) => { const f = 1 - prog(t, 67.2 + i * .28, 67.7 + i * .28); if (f > 0) w += G(at(x, 730, .62), temple({ wall: 'none', spire: 'none', gold: 'none', pillar: 'none', flag: 'none', out: '#7a2a0c' }), `opacity="${R(f * .55)}" stroke-dasharray="14 12"`) + G(at(x, 520 - (1 - f) * 40, 1), txt(0, 0, '?', 90, '#7a2a0c', { sw: 0 }), `opacity="${R(f * .6)}"`); });
  w += `<circle cx="960" cy="560" r="260" fill="#fff6c8" opacity="${R(.35 + .25 * ease(prog(t, 68.6, 70)))}" filter="url(#blur40)"/>`;
  w += `<path d="M700,770 L1220,770 L1260,800 L660,800Z M740,740 L1180,740 L1220,770 L700,770Z" fill="#fff3da" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/>`;
  w += G(at(960, 740, 1.3), temple({ t }));
  for (const x of [740, 1180]) w += G(at(x, 740, 1), `<rect x="-34" y="-70" width="8" height="70" fill="#fff3da" stroke="${OUT}" stroke-width="3.5"/><rect x="26" y="-70" width="8" height="70" fill="#fff3da" stroke="${OUT}" stroke-width="3.5"/><path d="M-46,-70 Q0,-140 46,-70Z" fill="#fff3da" stroke="${OUT}" stroke-width="5"/><circle cx="0" cy="-112" r="7" fill="#ffc21a" stroke="${OUT}" stroke-width="3"/>`);
  w += `<rect x="-200" y="800" width="2320" height="480" fill="url(#lake)" stroke="${OUT}" stroke-width="5"/>`;
  w += G('translate(960,800) scale(1.3,-1.04)', temple({ t }), 'opacity=".22"');
  for (let i = 0; i < 14; i++) { const x = 100 + rnd(i) * 1720 + 30 * Math.sin(t * .8 + i), y = 830 + rnd(i + 20) * 200; w += `<path d="M${R(x)},${R(y)} h${R(60 + rnd(i + 4) * 90)}" stroke="#fff6dc" stroke-width="6" stroke-linecap="round" opacity=".55"/>`; }
  const lp = backOut(prog(t, 69.9, 70.4));
  if (lp > 0) w += G(at(570, 330, R(lp)), `<path d="M-250,-62 L250,-62 Q274,-62 274,-38 L274,38 Q274,62 250,62 L30,62 L0,96 L-30,62 L-250,62 Q-274,62 -274,38 L-274,-38 Q-274,-62 -250,-62Z" fill="#fff6dc" stroke="${OUT}" stroke-width="7" stroke-linejoin="round"/>` + txt(0, 22, 'पुष्कर, राजस्थान', 64, '#8f1420', { sw: 0 }));
  return cam(cx, cy, z, w) + vignette(.25);
}

// S10 — the skull that will not let go
function s10(t) {
  const [cx, cy, z] = kf(t, [[72.2, [900, 540, 1.0]], [74.2, [900, 540, 1.04]], [75.0, [1130, 500, 1.42]], [80.15, [1140, 500, 1.5]]]);
  const shk = between(t, 76.9, 79.9) ? Math.sin((t - 76.9) * 19) * 13 * (.6 + .4 * Math.sin((t - 76.9) * 2.1)) : 0;
  let w = bg(t, 1, { cx: 900, rays: .14 }) + clouds(t, 1, 1040) + embers(t, 900, 900, 26, '#ff8a2a');
  const armL = [16, 10], armR = [82 + shk, 48 + shk * .6];
  const h = armHand(1, armR), HX = 800 + h[0] * 2, HY = 1500 + h[1] * 2;
  const stuck = prog(t, 74.3, 74.8);
  w += `<circle cx="${R(HX)}" cy="${R(HY)}" r="170" fill="#fff3a0" opacity="${R(.5 * stuck * (.7 + .3 * Math.sin(t * 6)))}" filter="url(#blur40)"/>`;
  const sk = G(at(h[0] + 6, h[1] - 6, 1.25, 12 + shk * .5), skull(.6 + .4 * Math.sin(t * 6)));
  w += G(at(800, 1500, 2.0), bhairava({ t, armL, armR, held: sk, brow: lerp(1, -.9, ease(prog(t, 72.3, 72.9))), look: between(t, 72.2, 74.2) ? [2 * Math.sin(t * 3), 0] : [4, -2], open: between(t, 76.9, 79.9) ? .5 : (t > 74.3 ? .3 : 0), tilt: t > 74.3 ? 4 : 0 }));
  if (t < 74.4) [[440, 300, -14, 72.45], [1210, 240, 12, 72.75], [300, 560, -8, 73.05]].forEach(([x, y, r, t0], i) => { const p = backOut(prog(t, t0, t0 + .35)) * (1 - prog(t, 74.0, 74.35)); if (p > 0) w += G(at(x, y + 8 * Math.sin(t * 4 + i), R(p), r), txt(0, 0, '?', 210, '#ffd23c', { sw: 26 })); });
  if (shk !== 0) for (const sd of [-1, 1]) for (let i = 0; i < 2; i++) w += `<path d="M${R(HX + sd * (120 + i * 40))},${R(HY - 70)} q${sd * 34},70 0,140" fill="none" stroke="#fff3c0" stroke-width="10" stroke-linecap="round" opacity="${R(.5 + .4 * Math.sin(t * 30 + i))}"/>`;
  if (stuck > 0) for (let i = 0; i < 8; i++) w += `<path d="M0,-118 L0,-${R(150 + 16 * Math.sin(t * 8 + i))}" transform="translate(${R(HX)},${R(HY - 8)}) rotate(${i * 45 + t * 20})" stroke="#fff3a0" stroke-width="8" stroke-linecap="round" opacity="${R(stuck * .8)}"/>`;
  return cam(cx, cy, z, w) + vignette(.5);
}

// S11 — to be continued / Har Har Mahadev
function s11(t) {
  const hp = prog(t, 82.75, 83.2), z = lerp(1, 1.06, prog(t, 80.15, 85.5));
  let w = bg(t, lerp(1, .35, ease(hp)), { rays: .2 + .15 * hp });
  w += `<circle cx="960" cy="560" r="${R(330 + 120 * hp)}" fill="#ffe27a" opacity="${R(.5 + .3 * hp)}" filter="url(#blur40)"/>`;
  w += G(at(960, 1330, 1 + .02 * Math.sin(t * 2)), trishul(690));
  for (let i = 0; i < 7; i++) w += G(at(600 + i * 120, 1090, 1.5 + .5 * rnd(i)), flame(t, i + 30));
  w += embers(t, 960, 900, 40);
  const p1 = backOut(prog(t, 80.3, 80.75)) * (1 - prog(t, 82.5, 82.75));
  if (p1 > 0) w += G(at(960, 250, R(p1)), txt(0, 0, 'यह कहानी जानिए अगले भाग में…', 92, '#fff3c0', { sw: 18 }));
  if (hp > 0) {
    let burst = ''; for (let i = 0; i < 18; i++) burst += `<path d="M0,-${R(300 + 500 * hp)} L-14,-${R(380 + 620 * hp)} L14,-${R(380 + 620 * hp)}Z" transform="rotate(${i * 20})" fill="#fff6c8"/>`;
    w += G('translate(960,330)', burst, `opacity="${R((1 - hp) * .9)}"`);
    w += G(at(960, 330, R(lerp(2.4, 1, easeOut(hp)) * (1 + .02 * Math.sin(t * 5)))), txt(0, 60, 'हर हर महादेव!', 210, '#ffd23c', { sw: 34 }) + txt(0, 60, 'हर हर महादेव!', 210, '#ffd23c', { stroke: '#c8281e', sw: 9 }), `opacity="${R(clamp(hp * 2.5))}"`);
  }
  const fade = prog(t, 84.9, 85.5);
  return cam(960, 540, z, w) + vignette(.45) + (fade > 0 ? `<rect width="1920" height="1080" fill="#1a0406" opacity="${R(fade)}"/>` : '');
}

const SCENES = [
  [0, s1, 'fade'], [11.6, s2, 'fade'], [17.0, s3, 'fade'], [25.9, s4, 'flash'], [29.3, s5, 'flash'], [36.2, s6, 'fade'],
  [42.8, s7, 'fade'], [48.2, s8, 'fade'], [62.4, s9a, 'fade'], [66.66, s9b, 'fade'], [72.2, s10, 'flash'], [80.15, s11, 'fade'],
];
function renderFrame(t) {
  let i = SCENES.length - 1;
  while (i > 0 && t < SCENES[i][0]) i--;
  let out = DEFS + SCENES[i][1](t);
  const X = .22;
  if (i < SCENES.length - 1 && SCENES[i + 1][2] === 'fade' && t > SCENES[i + 1][0] - X) // cross-dissolve into next
    out += `<g opacity="${R(ease(prog(t, SCENES[i + 1][0] - X, SCENES[i + 1][0] + X)) )}">${SCENES[i + 1][1](t)}</g>`;
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
