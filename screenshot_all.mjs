import { chromium } from 'playwright';
import fs from 'fs';

const filePath = 'file:///C:/Users/awabeltarabilly/Downloads/Brochure-3/index.html';
const outDir = 'C:/Users/awabeltarabilly/Downloads/Brochure-3/screenshots/audit';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const viewports = [
  { name: 'mob', width: 844, height: 390 },
  { name: 'ipad', width: 1024, height: 768 },
];

const allSlides = ['s1','s1b','s2','s3','s4','s_pillars','s5','s5b','s6','s7','s8','s8b','s9','s10','s11','s12','s13'];

const browser = await chromium.launch();
for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  await page.goto(filePath, { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(3000);
  for (const id of allSlides) {
    await page.evaluate((sid) => {
      document.querySelectorAll('.slide').forEach(s => {
        s.classList.remove('active');
        s.style.cssText = 'opacity:0;visibility:hidden;transform:scale(1);z-index:1';
      });
      const t = document.getElementById(sid);
      if (t) { t.classList.add('active'); t.style.cssText = 'opacity:1;visibility:visible;z-index:10'; }
    }, id);
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${outDir}/${vp.name}_${id}.png` });
  }
  console.log(`✓ ${vp.name} done`);
  await ctx.close();
}
await browser.close();
console.log('Done');
