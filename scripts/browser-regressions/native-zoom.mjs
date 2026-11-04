import { chromium, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// Native browser page zoom via Chromium's own settings UI. The persistent
// context uses a fresh temporary profile; no user profile/policy is touched.
// Usage: node scripts/browser-regressions/native-zoom.mjs [previewOrigin] [outputDir] [...routePaths]
const baseURL = process.argv[2] ?? "http://127.0.0.1:4398";
const outputDir = path.resolve(
  process.argv[3] ?? "work/full-frontend-audit/native-zoom",
);
const routes = process.argv.slice(4);
if (!routes.length) routes.push("/", "/projects", "/projects/project-simurgh");
if (!/^https?:$/.test(new URL(baseURL).protocol))
  throw Error("The preview origin must use HTTP or HTTPS");
if (routes.some((route) => !route.startsWith("/") || route.startsWith("//")))
  throw Error("Route paths must begin with a single slash");
await mkdir(outputDir, { recursive: true });
const context = await chromium.launchPersistentContext("", {
  executablePath: "/usr/bin/chromium",
  headless: true,
  viewport: { width: 1280, height: 1024 },
  deviceScaleFactor: 1,
});
const results = {
  method:
    "Real Chromium global Page zoom selected via chrome://settings/appearance select#zoomLevel, in a fresh temporary persistent context.",
  notUsed: [
    "extension",
    "browser policy override",
    "CDP pageScaleFactor/pinch",
    "CSS zoom",
    "viewport resizing",
  ],
  baseURL,
  physicalViewport: { width: 1280, height: 1024 },
  browserVersion: context.browser()?.version(),
  samples: [],
  screenshotMethod:
    "Read-only CDP Page.captureScreenshot without clip/emulation options. Playwright page.screenshot clips incorrectly after native-zoom document scrolling in this Chromium environment.",
};
try {
  const settings = context.pages()[0];
  await settings.goto("chrome://settings/appearance", {
    waitUntil: "domcontentloaded",
    timeout: 10000,
  });
  const zoom = settings.locator("select#zoomLevel");
  await zoom.waitFor({ state: "visible", timeout: 10000 });
  results.nativeZoomOptions = await zoom
    .locator("option")
    .evaluateAll((nodes) =>
      nodes.map((o) => ({ label: o.label, value: o.value })),
    );
  await zoom.selectOption({ label: "100%" });
  await expect(zoom).toHaveValue("1");
  const page = await context.newPage();
  page.setDefaultNavigationTimeout(15000);
  const captureSession = await context.newCDPSession(page);
  async function capture(filename) {
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
    const screenshot = await captureSession.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });
    await writeFile(
      path.join(outputDir, filename),
      Buffer.from(screenshot.data, "base64"),
    );
  }
  const baselineResponse = await page.goto(new URL(routes[0], baseURL).href, {
    waitUntil: "networkidle",
  });
  if (baselineResponse?.status() !== 200)
    throw Error("Baseline route did not return 200");
  const baseline = await page.evaluate(() => ({
    innerWidth,
    innerHeight,
    devicePixelRatio,
    visualScale: visualViewport?.scale,
    outerWidth,
    outerHeight,
  }));
  results.baseline100 = baseline;
  if (
    baseline.devicePixelRatio !== 1 ||
    baseline.innerWidth !== 1280 ||
    baseline.innerHeight !== 1024 ||
    baseline.visualScale !== 1
  )
    throw Error(`Unexpected 100% baseline: ${JSON.stringify(baseline)}`);
  for (const factor of [2, 4]) {
    await zoom.selectOption({ label: `${factor * 100}%` });
    await expect(zoom).toHaveValue(String(factor));
    for (const route of routes) {
      const response = await page.goto(new URL(route, baseURL).href, {
        waitUntil: "networkidle",
      });
      if (response?.status() !== 200)
        throw Error(`${route} did not return 200`);
      await page.evaluate(() => document.fonts.ready);
      await expect
        .poll(() => page.evaluate(() => devicePixelRatio), { timeout: 5000 })
        .toBeCloseTo(baseline.devicePixelRatio * factor, 2);
      const geometry = await page.evaluate(() => {
        const visible = (e) =>
          Boolean(e.getClientRects().length) &&
          getComputedStyle(e).visibility !== "hidden";
        const box = (e) => {
          const b = e.getBoundingClientRect();
          return { x: b.x, y: b.y, width: b.width, height: b.height };
        };
        return {
          innerWidth,
          innerHeight,
          devicePixelRatio,
          visualScale: visualViewport?.scale,
          outerWidth,
          outerHeight,
          documentWidth: document.documentElement.scrollWidth,
          documentHeight: document.documentElement.scrollHeight,
          bodyWidth: document.body.scrollWidth,
          appearance: document
            .querySelector(".os-shell")
            ?.getAttribute("data-appearance"),
          heading: [...document.querySelectorAll("h1")]
            .filter(visible)
            .map((e) => ({ text: e.textContent, box: box(e) })),
          activePane: [
            ...document.querySelectorAll(
              '[data-window-path][data-active="true"]',
            ),
          ]
            .filter(visible)
            .map((e) => ({
              route: e.getAttribute("data-window-path"),
              box: box(e),
              content: [...e.querySelectorAll(".os-page-content")].map((p) => ({
                box: box(p),
                clientWidth: p.clientWidth,
                scrollWidth: p.scrollWidth,
                clientHeight: p.clientHeight,
                scrollHeight: p.scrollHeight,
              })),
            })),
        };
      });
      if (Math.abs(geometry.innerWidth - baseline.innerWidth / factor) > 1)
        throw Error(
          `Native reflow did not match zoom factor: ${JSON.stringify(geometry)}`,
        );
      if (Math.abs(geometry.innerHeight - baseline.innerHeight / factor) > 1)
        throw Error(`Native zoom height did not match: ${route}`);
      if (
        geometry.outerWidth !== baseline.outerWidth ||
        geometry.outerHeight !== baseline.outerHeight
      )
        throw Error(`Browser window size changed during zoom: ${route}`);
      if (geometry.visualScale !== 1)
        throw Error("Visual viewport pinch detected");
      if (geometry.documentWidth > geometry.innerWidth + 1)
        throw Error(`Horizontal document overflow: ${route}`);
      if (
        geometry.activePane.some((pane) =>
          pane.content.some(
            (content) => content.scrollWidth > content.clientWidth + 1,
          ),
        )
      )
        throw Error(`Horizontal reading-pane overflow: ${route}`);
      const name = `${factor * 100}-${route.replace(/^\//, "").replaceAll("/", "-") || "home"}`;
      await capture(`${name}.png`);
      // At 400% the first fold can contain primarily the window toolbar. Preserve
      // that view, then prove that ordinary document scrolling reaches the text.
      const scrollTarget = Math.min(
        geometry.innerHeight * 2,
        geometry.documentHeight - geometry.innerHeight,
      );
      let scrolled;
      if (scrollTarget > 0) {
        await page.evaluate(
          (top) => window.scrollTo({ top, behavior: "instant" }),
          scrollTarget,
        );
        await expect
          .poll(() => page.evaluate(() => scrollY), { timeout: 5000 })
          .toBeGreaterThan(0);
        scrolled = await page.evaluate(() => ({
          scrollX,
          scrollY,
          innerWidth,
          innerHeight,
          documentWidth: document.documentElement.scrollWidth,
          devicePixelRatio,
          visualScale: visualViewport?.scale,
        }));
        if (
          scrolled.devicePixelRatio !== geometry.devicePixelRatio ||
          scrolled.innerWidth !== geometry.innerWidth ||
          scrolled.visualScale !== 1 ||
          scrolled.documentWidth > scrolled.innerWidth + 1
        )
          throw Error(`Zoom/reflow changed while scrolling: ${route}`);
        await capture(`${name}-scrolled.png`);
      }
      results.samples.push({
        factor,
        percent: factor * 100,
        route,
        status: response.status(),
        screenshot: `${name}.png`,
        geometry,
        scrolled,
        scrolledScreenshot: scrolled ? `${name}-scrolled.png` : undefined,
      });
      console.log(
        JSON.stringify({
          factor,
          route,
          innerWidth: geometry.innerWidth,
          devicePixelRatio: geometry.devicePixelRatio,
          visualScale: geometry.visualScale,
          documentWidth: geometry.documentWidth,
        }),
      );
    }
  }
  results.success = true;
} catch (error) {
  results.success = false;
  results.error = error.stack ?? error.message;
  process.exitCode = 1;
  console.error(results.error);
} finally {
  try {
    await writeFile(
      path.join(outputDir, "geometry.json"),
      JSON.stringify(results, null, 2) + "\n",
    );
  } finally {
    await context.close();
  }
}
