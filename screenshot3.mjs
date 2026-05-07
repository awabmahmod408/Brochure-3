import { chromium } from 'playwright';
import fs from 'fs';

const filePath = 'file:///C:/Users/awabeltarabilly/Downloads/Brochure-3/index.html';
const outDir = 'C:/Users/awabeltarabilly/Downloads/Brochure-3/screenshots';

const scenarios = [
  { name: 'mobile-portrait-390x844',      width: 390,  height: 844 },
  { name: 'mobile-landscape-844x390',     width: 844,  height: 390 },
  { name: 'mobile-landscape-667x375',     width: 667,  height: 375 },
  { name: 'tablet-portrait-768x1024',     width: 768,  height: 1024 },
  { name: 'tablet-landscape-1024x768',    width: 1024, height: 768 },
];

// Key slides to check
const slides = ['s1', 's3', 's4', 's9', 's10', 's12', 's13'];

const browser = await chromium.launch();
for (const vp of scenarios) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();
  await page.goto(filePath, { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(1500);

  // First screenshot = default/home state
  await page.screenshot({ path: `${outDir}/mob_${vp.name}_home.png` });

  // Only screenshot slides for landscape (where presentation is accessible)
  if (vp.height < vp.width) {
    for (const id of slides) {
      await page.evaluate((sid) => {
        document.querySelectorAll('.slide').forEach(s => {
          s.classList.remove('active'); s.style.opacity='0'; s.style.visibility='hidden';
        });
        const t = document.getElementById(sid);
        if (t) { t.classList.add('active'); t.style.opacity='1'; t.style.visibility='visible'; t.style.zIndex='10'; }
      }, id);
      await page.waitForTimeout(350);
      await page.screenshot({ path: `${outDir}/mob_${vp.name}_${id}.png` });
    }
  }
  console.log(`✓ ${vp.name}`);
  await context.close();
}
await browser.close();
console.log('Done');
