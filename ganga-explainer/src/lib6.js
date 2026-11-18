// ---------- episode 7 additions: Ganga, Bhagiratha's chariot, the north-bending river ----------
const gangaDevi = (o = {}) => parvati({ sari: '#f4f8ff', border: '#3a8fd8', blouse: '#3a8fd8', pallu: '#7cc4ec', ...o });
const kalash = () => `<path d="M-30,0 Q-44,-40 -20,-58 L20,-58 Q44,-40 30,0Z" fill="#e9a21c" stroke="${OUT}" stroke-width="4.5" stroke-linejoin="round"/><rect x="-18" y="-70" width="36" height="14" rx="4" fill="#ffc21a" stroke="${OUT}" stroke-width="4"/><path d="M-14,-70 Q-20,-96 0,-104 Q20,-96 14,-70" fill="#4e9a3a" stroke="${OUT}" stroke-width="3.5"/><path d="M8,-50 Q30,-30 20,0" stroke="#7cc4ec" stroke-width="7" fill="none" stroke-linecap="round"/>`;
// wavy water ribbon along a polyline of points
function waterRibbon(t, pts, w = 60, a = 1) {
  const d = 'M' + pts.map(p => R(p[0]) + ',' + R(p[1])).join('L');
  let s = `<path d="${d}" stroke="${OUT}" stroke-width="${w + 10}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${a}"/><path d="${d}" stroke="#5fb0e0" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${a}"/><path d="${d}" stroke="#bfe6ff" stroke-width="${R(w * .45)}" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="40 50" stroke-dashoffset="${R(-t * 160)}" opacity="${R(.9 * a)}"/>`;
  return s;
}
function horse(t, ph = 0) { // side view, facing right, origin at hooves ~ 220 long
  const g = Math.sin(t * 12 + ph) * 18;
  const leg = (x, a) => `<path d="M${x},-90 L${R(x + a)},-10" stroke="${OUT}" stroke-width="18" stroke-linecap="round"/><path d="M${x},-90 L${R(x + a)},-10" stroke="#fff8ec" stroke-width="10" stroke-linecap="round"/>`;
  return leg(-60, g) + leg(-40, -g) + leg(50, -g) + leg(70, g) + `<ellipse cx="0" cy="-110" rx="96" ry="44" fill="#fff8ec" stroke="${OUT}" stroke-width="5"/><path d="M70,-130 Q100,-200 130,-200 Q160,-196 156,-176 L118,-160 Q100,-140 92,-112Z" fill="#fff8ec" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><path d="M80,-160 Q100,-210 126,-204 Q100,-190 92,-150Z" fill="#e8402e" stroke="${OUT}" stroke-width="3"/><circle cx="138" cy="-186" r="4" fill="${OUT}"/><path d="M-96,-118 Q-140,-120 -150,-80" stroke="${OUT}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M-30,-152 L30,-152" stroke="#ffc21a" stroke-width="10"/>`;
}
function chariot(t, rider = '') { // origin at ground, facing right, ~560 long including horses
  const sp = t * 300;
  const wheel = (x) => G(at(x, -70, 1, sp), `<circle r="70" fill="none" stroke="${OUT}" stroke-width="18"/><circle r="70" fill="none" stroke="#c4541f" stroke-width="10"/>` + [0, 1, 2, 3].map(i => `<path d="M0,0 L0,-66" transform="rotate(${i * 45})" stroke="${OUT}" stroke-width="7"/><path d="M0,0 L0,66" transform="rotate(${i * 45})" stroke="${OUT}" stroke-width="7"/>`).join('') + `<circle r="14" fill="#ffc21a" stroke="${OUT}" stroke-width="4"/>`);
  let s = horse(t, 0) .replace(/^/, '') ;
  s = G('translate(250,0)', horse(t, 0)) + G('translate(330,-10) scale(.95)', horse(t, 1.4));
  s += `<path d="M110,-120 L220,-110" stroke="${OUT}" stroke-width="8"/>`;
  s += `<path d="M-150,-150 L120,-150 L100,-60 L-140,-60Z" fill="#c8281e" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/><path d="M-140,-130 L110,-130" stroke="#ffc21a" stroke-width="8"/>`;
  s += rider;
  s += `<path d="M-140,-150 L-140,-420 M100,-150 L100,-420" stroke="${OUT}" stroke-width="10"/><path d="M-170,-420 Q-20,-500 130,-420Z" fill="#ffc21a" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/><path d="M-20,-470 L-20,-560" stroke="${OUT}" stroke-width="6"/><path d="M-20,-560 L${R(50 + 8 * Math.sin(t * 6))},-540 L-20,-516Z" fill="#ff7a12" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/>`;
  s += wheel(-80) + wheel(60);
  return s;
}
// aerial (plan) view of the Ganga: east-flowing, bending north into a crescent at Kashi
const RIV = [[[-300, 720], [300, 760], [650, 800], [940, 740]], [[940, 740], [1180, 690], [1270, 520], [1180, 380]], [[1180, 380], [1100, 260], [1240, 110], [1500, -200]]];
const bez = (P, u) => { const v = 1 - u; return [0, 1].map(k => v * v * v * P[0][k] + 3 * v * v * u * P[1][k] + 3 * v * u * u * P[2][k] + u * u * u * P[3][k]); };
const rivAt = s => { const seg = Math.min(2, Math.floor(s * 3)); return bez(RIV[seg], s * 3 - seg); }; // s in 0..1 along the whole river
const rivD = () => `M${RIV[0][0].join(',')} ` + RIV.map(P => `C${P[1].join(',')} ${P[2].join(',')} ${P[3].join(',')}`).join(' ');
function aerial(t, o = {}) {
  const { reveal = 1, crescent = 0, assi = 0, varuna = 0, city = 1 } = o;
  let s = `<rect x="-600" y="-500" width="3120" height="2100" fill="#9fd07a"/>`;
  for (let i = 0; i < 26; i++) s += `<ellipse cx="${R(-300 + rnd(i) * 2600)}" cy="${R(-200 + rnd(i + 5) * 1500)}" rx="${R(120 + rnd(i + 2) * 200)}" ry="${R(60 + rnd(i + 3) * 90)}" fill="${['#b4dc84', '#8cc46a', '#c9e49a'][i % 3]}" opacity=".8"/>`;
  for (let i = 0; i < 30; i++) { const x = -300 + rnd(i + 40) * 2600, y = -200 + rnd(i + 41) * 1500; if (Math.abs(x - 1150) < 260 && y > 200 && y < 820) continue; s += G(at(x, y, .22 + rnd(i + 42) * .12), tree()); }
  const d = rivD();
  s += `<path d="${d}" stroke="${OUT}" stroke-width="150" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="${R(reveal * 1.02)} 2"/><path d="${d}" stroke="#5fb0e0" stroke-width="134" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="${R(reveal * 1.02)} 2"/>`;
  for (let i = 0; i < 40; i++) { const u = ((t * .05 + i / 40) % 1); if (u > reveal) continue; const [x, y] = rivAt(u), [x2, y2] = rivAt(Math.min(1, u + .012)); s += `<path d="M${R(x)},${R(y)} L${R(x2)},${R(y2)}" stroke="#e6fbff" stroke-width="7" stroke-linecap="round" opacity=".75"/>`; }
  if (assi > 0) s += `<path d="M700,1100 Q900,960 1060,760" stroke="${OUT}" stroke-width="${R(46 * assi)}" fill="none" stroke-linecap="round"/><path d="M700,1100 Q900,960 1060,760" stroke="#7cc4ec" stroke-width="${R(34 * assi)}" fill="none" stroke-linecap="round"/>`;
  if (varuna > 0) s += `<path d="M700,120 Q980,180 1150,330" stroke="${OUT}" stroke-width="${R(46 * varuna)}" fill="none" stroke-linecap="round"/><path d="M700,120 Q980,180 1150,330" stroke="#7cc4ec" stroke-width="${R(34 * varuna)}" fill="none" stroke-linecap="round"/>`;
  if (city > 0) { // ghats and temples along the west bank of the crescent
    let c = ''; for (let i = 0; i < 9; i++) { const u = .36 + i * .028, [x, y] = rivAt(u); c += G(at(x - 120, y + 20, .2), i % 3 === 1 ? spire(0, 0, 160, 360, ['#ffc21a', '#e2562a', '#f09a2e'][i % 3]) : block(0, 0, 200, 170, ['#ffe1a6', '#f6c98a', '#f2a66a'][i % 3])) + `<rect x="${R(x - 86)}" y="${R(y - 22)}" width="34" height="44" fill="#ffe3b0" stroke="${OUT}" stroke-width="3"/>`; }
    s += G('', c, `opacity="${R(city)}"`);
  }
  if (crescent > 0) s += `<path d="${'M' + Array.from({ length: 21 }, (_, i) => rivAt(.34 + i * .016).map(R).join(',')).join(' L')}" stroke="#fff6c8" stroke-width="${R(40 + 30 * crescent)}" fill="none" stroke-linecap="round" opacity="${R(.65 * crescent)}" filter="url(#blur8)"/>`;
  return s;
}
function compass(a = 1) { return G('', `<circle r="74" fill="#fff6dc" stroke="${OUT}" stroke-width="6"/><path d="M0,-58 L18,0 L0,-10 L-18,0Z" fill="#c8281e" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/><path d="M0,58 L18,0 L0,10 L-18,0Z" fill="#fff" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>` + txt(0, -84, 'उत्तर', 34, '#8f1420', { stroke: '#fff6dc', sw: 8 }), `opacity="${R(a)}"`); }
function bather(t, i, c) { // devotee waist-deep in the river, pouring water
  const pour = .5 + .5 * Math.sin(t * 1.6 + i);
  return `<path d="M-44,0 Q-50,-120 -20,-128 L20,-128 Q50,-120 44,0Z" fill="${c}" stroke="${OUT}" stroke-width="4.5"/>` + limb([[-36, -110], [-60, -170], [-20, R(-220 - 20 * pour)]], 16, '#d99a66') + limb([[36, -110], [60, -170], [20, R(-220 - 20 * pour)]], 16, '#d99a66') + `<circle cy="-160" r="34" fill="#d99a66" stroke="${OUT}" stroke-width="4.5"/><circle cy="-188" r="24" fill="#1c1420"/>` + G(`translate(0,${R(-232 - 20 * pour)})`, `<path d="M-20,0 Q-26,-26 0,-30 Q26,-26 20,0Z" fill="#e9a21c" stroke="${OUT}" stroke-width="3.5"/>`) + `<path d="M6,${R(-210 - 20 * pour)} Q14,-180 8,-150" stroke="#bfe6ff" stroke-width="6" fill="none" opacity="${R(pour)}"/>`;
}
function hanumanSil(a = 1) { const C = '#ff8a1e'; return G('', `<circle r="230" fill="#ffd27a" opacity=".5" filter="url(#blur40)"/><path d="M-80,300 L-60,40 Q0,0 60,40 L80,300Z" fill="${C}"/><circle cy="-40" r="70" fill="${C}"/><circle cx="-62" cy="-50" r="26" fill="${C}"/><circle cx="62" cy="-50" r="26" fill="${C}"/><path d="M-36,-110 L-30,-150 L-12,-128 L0,-166 L12,-128 L30,-150 L36,-110Z" fill="${C}"/><path d="M60,80 L150,-40" stroke="${C}" stroke-width="36" stroke-linecap="round"/><circle cx="170" cy="-70" r="56" fill="${C}"/><path d="M150,-30 L210,140" stroke="${C}" stroke-width="20" stroke-linecap="round"/><path d="M-60,240 Q-200,260 -210,120 Q-216,40 -150,40" stroke="${C}" stroke-width="22" fill="none" stroke-linecap="round"/>`, `opacity="${R(a)}"`); }
function saintSil() { const C = '#3a1a2a'; return `<path d="M-150,0 Q-150,-90 -50,-96 L60,-96 Q160,-90 160,0Z" fill="${C}"/><path d="M-60,-96 L-50,-300 Q0,-330 50,-300 L60,-96Z" fill="${C}"/><circle cy="-360" r="52" fill="${C}"/><path d="M-30,-410 Q0,-440 30,-410" stroke="${C}" stroke-width="18" fill="none"/><path d="M40,-260 L120,-170 L60,-150" stroke="${C}" stroke-width="30" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="40" y="-180" width="120" height="80" rx="6" fill="${C}" transform="rotate(-14,100,-140)"/><path d="M120,-196 L176,-260" stroke="${C}" stroke-width="8"/>`; }
