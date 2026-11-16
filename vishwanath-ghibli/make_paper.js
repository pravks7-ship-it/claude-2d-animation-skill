// renders a 1920x1080 watercolour-paper texture (grey around mid) used as a multiply overlay
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.setContent(`<body style="margin:0"><svg width="1920" height="1080"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency=".012 .016" numOctaves="4" seed="7"/><feColorMatrix type="matrix" values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  .9 .9 .9 0 -.35"/></filter><filter id="g"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix type="saturate" values="0"/></filter><rect width="1920" height="1080" fill="#fff"/><rect width="1920" height="1080" filter="url(#f)" opacity=".55"/><rect width="1920" height="1080" filter="url(#g)" opacity=".10"/></svg></body>`);
  await p.screenshot({ path: 'out/paper.png' }); await b.close();
})();
