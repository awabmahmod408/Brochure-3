import { chromium } from 'playwright';
import fs from 'fs';

const filePath = 'file:///C:/Users/awabeltarabilly/Downloads/Brochure-3/index.html';
const outDir = 'C:/Users/awabeltarabilly/Downloads/Brochure-3/screenshots';

const viewports = [
  { name: 'iPad-portrait-768x1024',     width: 768,  height: 1024 },
  { name: 'iPad-Air-portrait-820x1180', width: 820,  height: 1180 },
  { name: 'iPad-landscape-1024x768',    width: 1024, height: 768  },
  { name: 'phone-390x844',              width: 390,  height: 844  },
];

const browser = await chromium.launch();
for (const vp of viewports) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();
  await page.goto(filePath, { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${outDir}/check_${vp.name}.png` });
  console.log(`✓ ${vp.name}`);
  await context.close();
}
await browser.close();
