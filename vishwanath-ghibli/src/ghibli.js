// Ghibli-inspired nostalgic overrides: painted skies, big shaded cumulus clouds, soft mountains, lush trees, golden light.
// Loaded after lib*.js so these declarations replace the flat versions.
const GH_DEFS = `<defs><filter id="ghsoft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2"/></filter><filter id="ghhaze" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter></defs>`;
const GH_SKIES = [ // [top, mid, horizon]
  ['#4f97d4', '#a6d2ec', '#ffe2b0'], // golden afternoon
  ['#3a1d44', '#b0453c', '#ffb27a'], // wrath
  ['#5aa7e0', '#bfe3f4', '#fff0cf'], // bright day
];
const GH_CLOUD = [{ sh: '#b6c4e2', bo: '#fffaf0', hi: '#fff0c8' }, { sh: '#7a3448', bo: '#f0a890', hi: '#ffd0a0' }, { sh: '#c2d0ea', bo: '#ffffff', hi: '#fff6dc' }];
const lum = c => { const p = [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16) / 255); return .3 * p[0] + .59 * p[1] + .11 * p[2]; };
function ghMood(m) { const i = Math.min(1, Math.floor(clamp(m, 0, 2))), u = clamp(m - i); return { sky: GH_SKIES[i].map((c, j) => mix(c, GH_SKIES[i + 1][j], u)), cl: Object.fromEntries(['sh', 'bo', 'hi'].map(k => [k, mix(GH_CLOUD[i][k], GH_CLOUD[i + 1][k], u)])) }; }
function sky3(id, top, mid, bot) { return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset=".55" stop-color="${mid}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs><rect x="-1500" y="-1200" width="4920" height="3500" fill="url(#${id})"/>`; }
// one cumulus cloud: bluish shadow underside, white body, warm sunlit crown, flat-ish base
function cumulus(x, y, s, seed, c) {
  const P = []; for (let i = 0; i < 11; i++) { const px = (rnd(seed + i) - .5) * 380, top = 1 - Math.pow(Math.abs(px) / 200, 2); P.push([px, -40 - rnd(seed + i + 20) * 150 * Math.max(.2, top), 55 + rnd(seed + i + 40) * 60 * (.5 + .5 * Math.max(0, top))]); }
  let sh = `<ellipse cx="0" cy="6" rx="230" ry="46" fill="${c.sh}"/>`, bo = '', hi = '';
  P.forEach(([px, py, r]) => { sh += `<circle cx="${R(px + 6)}" cy="${R(py + 22)}" r="${R(r)}" fill="${c.sh}"/>`; bo += `<circle cx="${R(px)}" cy="${R(py)}" r="${R(r)}" fill="${c.bo}"/>`; hi += `<circle cx="${R(px - r * .25)}" cy="${R(py - r * .3)}" r="${R(r * .62)}" fill="${c.hi}"/>`; });
  bo += `<rect x="-215" y="-30" width="430" height="24" fill="${c.bo}"/>`;
  return G(at(x, y, s), `<g filter="url(#ghsoft)">${sh}${bo}<g opacity=".85">${hi}</g></g>`);
}
function ghClouds(t, c, n = 6, yMax = 380) { let s = ''; for (let i = 0; i < n; i++) { const x = ((-300 + i * 460 + t * (6 + 3 * (i % 3))) % 2700 + 2700) % 2700 - 400, y = 120 + rnd(i + 3) * (yMax - 120), k = .7 + rnd(i + 8) * .6; s += cumulus(x, y, k, i * 31, c); } return s; }
function bg(t, m, o = {}) {
  const M = typeof m === 'number' ? ghMood(m) : ghMood(0), cx = o.cx === undefined ? 960 : o.cx, cy = o.cy === undefined ? 420 : o.cy;
  let s = GH_DEFS + sky3('ghSky', ...M.sky);
  s += `<circle cx="${cx}" cy="${cy}" r="520" fill="#fff4cf" opacity=".45" filter="url(#ghhaze)"/><circle cx="${cx}" cy="${cy}" r="120" fill="#fffbe8" opacity=".9" filter="url(#ghsoft)"/>`;
  let rays = ''; for (let i = 0; i < 10; i++) rays += `<path d="M0,0 L-110,-2600 L110,-2600Z" transform="rotate(${R(i * 36 + 8)})" fill="#fff8e0"/>`;
  s += G(`translate(${cx},${cy}) rotate(${R(t * 2)})`, rays, `opacity="${R((o.rays === undefined ? .13 : o.rays) * .45)}"`);
  s += ghClouds(t, M.cl);
  return s;
}
function cloudSea(t, y, c) {
  let s = '';
  for (let row = 0; row < 3; row++) for (let i = 0; i < 18; i++) { const x = ((-400 + i * 170 + row * 60 + t * (10 + row * 6)) % 3000 + 3000) % 3000 - 500; s += cumulus(x, y - 40 + row * 50, .55 + rnd(i + row * 9) * .25, i * 7 + row * 101, c); }
  return s + `<rect x="-1500" y="${y + 20}" width="4920" height="900" fill="${c.bo}"/>`;
}
function clouds(t, m, y = 900) { return cloudSea(t, y, ghMood(typeof m === 'number' ? m : 0).cl); }
// mountains: hazy far ranges + a snow-lit Kailash with soft shading
function peaks(y = 900) {
  const range = (pts, col) => `<path d="M-500,${y} ${pts.map(([x, h]) => `L${x},${y - h}`).join(' ')} L2400,${y}Z" fill="${col}"/>`;
  let s = `<g filter="url(#ghsoft)">` + range([[-200, 260], [80, 380], [320, 300], [560, 420], [900, 340], [1200, 450], [1500, 330], [1800, 430], [2100, 300]], '#b9c6e6') + range([[-100, 180], [200, 300], [460, 220], [1000, 250], [1360, 300], [1700, 220], [2000, 280]], '#9fb2dc') + `</g>`;
  const pk = (x, w, h) => `<path d="M${x - w},${y} Q${x - w * .45},${y - h * .55} ${x - w * .12},${y - h * .96} Q${x},${y - h * 1.04} ${x + w * .14},${y - h * .95} Q${x + w * .5},${y - h * .5} ${x + w},${y}Z" fill="#eef3fb" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/><path d="M${x + w * .14},${y - h * .95} Q${x + w * .5},${y - h * .5} ${x + w},${y} L${x + w * .05},${y} Q${x + w * .2},${y - h * .5} ${x + w * .02},${y - h * .98}Z" fill="#b3c3e6" opacity=".85"/><path d="M${x - w * .7},${y} Q${x - w * .4},${y - h * .25} ${x - w * .25},${y - h * .45} Q${x - w * .1},${y - h * .3} ${x + w * .1},${y - h * .4} Q${x + w * .35},${y - h * .2} ${x + w * .6},${y}Z" fill="#c9d6ef" opacity=".55"/>`;
  return s + pk(1820, 460, 520) + pk(180, 420, 470) + pk(1320, 380, 400) + pk(700, 520, 660);
}
function skyGrad(id, top, bot) {
  const mid = mix(top, bot, .55), bright = lum(bot) > .55 && lum(top) > .3;
  let s = sky3(id, mix(top, '#5aa0d8', bright ? .25 : 0), mid, mix(bot, '#fff0d0', .15));
  if (bright) s += GH_DEFS + `<circle cx="1500" cy="300" r="460" fill="#fff4cf" opacity=".35" filter="url(#ghhaze)"/>` + ghClouds(0, { sh: mix(top, '#c0cce8', .6), bo: '#fffaf0', hi: '#fff0c8' }, 5, 300);
  return s;
}
function river(t, y, h = 600, c1 = '#ffb65c', c2 = '#2f93ad') {
  let s = `<defs><linearGradient id="rvg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(c1, '#fff0c8', .35)}"/><stop offset=".35" stop-color="${mix(c2, '#7fc4e0', .4)}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect x="-400" y="${y}" width="2720" height="${h}" fill="url(#rvg)" stroke="${OUT}" stroke-width="4"/>`;
  for (let i = 0; i < 26; i++) { const x = -100 + rnd(i) * 2100 + 40 * Math.sin(t * .8 + i), yy = y + 16 + rnd(i + 20) * (h * .55), a = .35 + .4 * Math.abs(Math.sin(t * 2 + i)); s += `<path d="M${R(x)},${R(yy)} h${R(30 + rnd(i + 4) * 90)}" stroke="#fffbe8" stroke-width="${R(3 + rnd(i + 1) * 4)}" stroke-linecap="round" opacity="${R(a)}"/>`; }
  return s;
}
// lush tree: trunk + layered foliage clumps with sunlit tops and cool shadows
function tree() {
  const C = [[-62, -180, 64], [58, -186, 68], [0, -250, 80], [-30, -300, 56], [40, -296, 52], [0, -196, 60]];
  let s = `<path d="M-16,0 Q-8,-80 -12,-160 L12,-160 Q8,-80 16,0Z" fill="#7a4a2a" stroke="${OUT}" stroke-width="4"/><path d="M0,-120 L-40,-170 M2,-140 L36,-180" stroke="#7a4a2a" stroke-width="9" stroke-linecap="round"/>`;
  C.forEach(([x, y, r]) => { s += `<circle cx="${x}" cy="${y + 8}" r="${r}" fill="#3f7f45" stroke="${OUT}" stroke-width="4"/>`; });
  C.forEach(([x, y, r]) => { s += `<circle cx="${x - r * .12}" cy="${y - r * .1}" r="${R(r * .82)}" fill="#5fa04c"/>`; });
  C.forEach(([x, y, r]) => { s += `<circle cx="${R(x - r * .3)}" cy="${R(y - r * .35)}" r="${R(r * .42)}" fill="#9ccf6a" opacity=".9"/>`; });
  for (let i = 0; i < 8; i++) s += `<circle cx="${R(-80 + rnd(i) * 160)}" cy="${R(-320 + rnd(i + 5) * 200)}" r="5" fill="#d8f0a0" opacity=".8"/>`;
  return s;
}
