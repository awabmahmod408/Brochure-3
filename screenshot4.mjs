import { chromium } from 'playwright';
import fs from 'fs';

const filePath = 'file:///C:/Users/awabeltarabilly/Downloads/Brochure-3/index.html';
const outDir = 'C:/Users/awabeltarabilly/Downloads/Brochure-3/screenshots';

const browser = await chromium.launch();

// Check portrait mobile
const ctx1 = await browser.newContext({ viewport: { width: 390, height: 844 } });
const p1 = await ctx1.newPage();
await p1.goto(filePath, { waitUntil: 'load', timeout: 20000 });
await p1.waitForTimeout(4000);
await p1.screenshot({ path: `${outDir}/verify_portrait_390x844.png` });
console.log('portrait done');
await ctx1.close();

// Check landscape mobile
const ctx2 = await browser.newContext({ viewport: { width: 844, height: 390 } });
const p2 = await ctx2.newPage();
await p2.goto(filePath, { waitUntil: 'load', timeout: 20000 });
await p2.waitForTimeout(4000);
await p2.screenshot({ path: `${outDir}/verify_landscape_844x390.png` });
console.log('landscape done');
await ctx2.close();

await browser.close();
