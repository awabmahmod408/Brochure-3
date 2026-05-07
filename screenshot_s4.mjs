import { chromium } from 'playwright';
const filePath = 'file:///C:/Users/awabeltarabilly/Downloads/Brochure-3/index.html';
const outDir = 'C:/Users/awabeltarabilly/Downloads/Brochure-3/screenshots/audit';
const browser = await chromium.launch();

for (const vp of [{n:'mob',w:844,h:390},{n:'ipad',w:1024,h:768}]) {
  const ctx = await browser.newContext({ viewport:{width:vp.w,height:vp.h} });
  const page = await ctx.newPage();
  await page.goto(filePath,{waitUntil:'load',timeout:20000});
  await page.waitForTimeout(2000);
  for (const id of ['s4','s_pillars','s2','s3','s5','s5b','s9','s13']) {
    await page.evaluate((sid) => {
      document.querySelectorAll('.slide').forEach(s=>{s.classList.remove('active');s.style.cssText='opacity:0;visibility:hidden;z-index:1';});
      const t=document.getElementById(sid);
      if(t){t.classList.add('active');t.style.cssText='opacity:1;visibility:visible;z-index:10';}
    }, id);
    await page.waitForTimeout(1500);
    await page.screenshot({path:`${outDir}/${vp.n}_${id}.png`});
    console.log(`✓ ${vp.n}_${id}`);
  }
  await ctx.close();
}
await browser.close();
