import { chromium } from 'playwright';
import fs from 'fs';

const filePath = 'file:///C:/Users/awabeltarabilly/Downloads/Brochure-3/index.html';
const outDir = 'C:/Users/awabeltarabilly/Downloads/Brochure-3/screenshots';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const viewports = [
  { name: 'iPad-landscape-1024x768',    width: 1024, height: 768  },
  { name: 'iPad-portrait-768x1024',     width: 768,  height: 1024 },
  { name: 'iPad-Air-portrait-820x1180', width: 820,  height: 1180 },
];

const slideIds = ['s1','s2','s3','s4','s_pillars','s7','s8','s8b','s9','s10','s11','s12','s13'];

const browser = await chromium.launch();

for (const vp of viewports) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();
  await page.goto(filePath, { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(2500);

  for (const slideId of slideIds) {
    await page.evaluate((id) => {
      const slides = document.querySelectorAll('.slide');
      slides.forEach(s => {
        s.classList.remove('active');
        s.style.opacity = '0';
        s.style.visibility = 'hidden';
        s.style.transform = 'scale(1)';
      });
      const target = document.getElementById(id);
      if (target) {
        target.classList.add('active');
        target.style.opacity = '1';
        target.style.visibility = 'visible';
        target.style.zIndex = '10';
      }
    }, slideId);
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${outDir}/${vp.name}_${slideId}.png` });
    console.log(`✓ ${vp.name} → ${slideId}`);
  }
  await context.close();
}

await browser.close();
console.log('Done →', outDir);
