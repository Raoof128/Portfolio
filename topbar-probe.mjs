import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "light" });
const page = await ctx.newPage();
await page.goto("http://127.0.0.1:3419/en", { waitUntil: "load", timeout: 60000 });
await page.waitForTimeout(600);
const b = await page.$("#os-enter"); if (b) { await b.click(); await page.waitForTimeout(3800); }
const r = await page.evaluate(() => {
  const c = document.querySelector("header.os-topbar .os-top-clock");
  if (!c) return "none";
  const cs = getComputedStyle(c); const bb = c.getBoundingClientRect(); const top = document.querySelector("header.os-topbar");
  return { display: cs.display, vis: cs.visibility, op: cs.opacity, rect: [bb.x, bb.y, bb.width, bb.height], topbarDisplay: getComputedStyle(top).display, topbarRect: top.getBoundingClientRect().height };
});
console.log(JSON.stringify(r));
await browser.close();
