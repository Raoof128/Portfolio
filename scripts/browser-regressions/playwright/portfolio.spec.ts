import { test, expect, type Page, type TestInfo } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";

const locales = ["en", "fa", "ar", "zh", "es"] as const;
const sizes = [[320,568], [360,740], [390,844], [768,1024], [1024,768],
  [1280,720], [1440,900], [1920,1080], [640,360]];
const route = (locale: string, path: string) => locale === "en"
  ? path : `/${locale}${path === "/" ? "" : path}`;
const pane = (page: Page) => page.locator('[data-window-path][data-active="true"]:not([hidden])');

async function prepare(page: Page, theme = "dark") {
  await page.addInitScript((appearance) => {
    const key = "researchos.appearance.v1";
    if (localStorage.getItem(key) === null) localStorage.setItem(key, appearance);
  }, theme);
  await page.addInitScript(() => {
    const metrics: { lcp: number | null; cls: number | null } = {
      lcp: PerformanceObserver.supportedEntryTypes.includes("largest-contentful-paint") ? 0 : null,
      cls: PerformanceObserver.supportedEntryTypes.includes("layout-shift") ? 0 : null,
    };
    Object.assign(window, { portfolioLabMetrics: metrics });
    if (PerformanceObserver.supportedEntryTypes.includes("largest-contentful-paint")) new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) metrics.lcp = entry.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    let windowStart = 0, lastShift = 0, windowScore = 0;
    if (PerformanceObserver.supportedEntryTypes.includes("layout-shift")) new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
        if (shift.hadRecentInput) continue;
        if (windowScore && shift.startTime - lastShift < 1000 && shift.startTime - windowStart < 5000) {
          windowScore += shift.value;
        } else {
          windowStart = shift.startTime;
          windowScore = shift.value;
        }
        lastShift = shift.startTime;
        metrics.cls = Math.max(metrics.cls ?? 0, windowScore);
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
}

async function ready(page: Page, path: string, theme = "dark") {
  const response = await page.goto(path, { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
  await expect(page.locator(`.os-shell[data-appearance="${theme}"]`)).toBeVisible();
  if (!locales.some((l) => path === route(l, "/"))) await expect(pane(page)).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

async function capture(page: Page, info: TestInfo, name: string) {
  // Captures are review artifacts, never silently accepted screenshot goldens.
  await info.attach(name, { body: await page.screenshot({ animations: "disabled" }), contentType: "image/png" });
}

async function geometry(page: Page) {
  return page.evaluate(() => ({
    width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
    mainCount: [...document.querySelectorAll('main,[role="main"]')]
      .filter((e) => e.getBoundingClientRect().height > 0 && !e.closest('[hidden], [inert]')).length,
    duplicateIds: [...document.querySelectorAll("[id]")].map((e) => e.id)
      .filter((id, i, all) => all.indexOf(id) !== i),
    brokenImages: [...document.images].filter((e) => e.complete && !e.naturalWidth).map((e) => e.src),
    metrics: (window as Window & { portfolioLabMetrics?: unknown }).portfolioLabMetrics,
  }));
}

test("reviewer journey, window controls, history, search and contact", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await prepare(page);
  await ready(page, "/projects");
  const projectSearch = page.getByRole("searchbox", { name: "Search Projects", exact: true });
  await projectSearch.fill("zurvan");
  await expect(page.locator(".os-project-row")).toHaveCount(1);
  await pane(page).getByRole("button", { name: "Minimise: Projects", exact: true }).click();
  await expect(pane(page)).toHaveCount(0);
  await page.locator('.os-dock-app[href="/projects"]').click();
  await expect(projectSearch).toHaveValue("zurvan");
  const fullSize = pane(page).locator(".os-expand");
  await fullSize.click();
  await expect(pane(page)).toHaveAttribute("data-expanded", "true");
  await fullSize.click();
  await expect(pane(page)).not.toHaveAttribute("data-expanded", "true");
  const windowControls = pane(page).locator(".os-window-controls > summary");
  const controlsPanel = page.locator(".os-window-controls-panel");
  await windowControls.click();
  await expect(controlsPanel.getByRole("button").first()).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(controlsPanel).not.toBeVisible();
  await expect(windowControls).toBeFocused();
  await windowControls.click();
  await controlsPanel.getByRole("button", { name: "Down", exact: true }).click();
  await controlsPanel.getByRole("button", { name: "Done", exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(controlsPanel).not.toBeVisible();
  await expect(windowControls).not.toBeFocused();
  await windowControls.click();
  await controlsPanel.getByRole("button", { name: "Done", exact: true }).click();
  await expect(windowControls).toBeFocused();
  await page.locator('.os-dock-app[href="/about"]').click();
  await expect(pane(page)).toHaveAttribute("data-window-path", "/about");
  await expect(pane(page).locator("h1")).toBeFocused();
  await page.goBack();
  await expect(pane(page)).toHaveAttribute("data-window-path", "/projects");
  await expect(projectSearch).toHaveValue("");
  await page.keyboard.press("Control+k");
  const dialog = page.locator(".os-search-dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("searchbox").fill("Simurgh");
  await expect(dialog.locator('a[href="/projects/project-simurgh"]')).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await page.locator('.os-dock-app[href="/resume"]').click();
  await expect(pane(page).locator('a[href$=".pdf"]').first()).toBeVisible();
  const pdf = await page.request.get("/Mohammad_Raouf_Abedini_Resume.pdf");
  expect(pdf.status()).toBe(200);
  expect((await pdf.body()).subarray(0,5).toString()).toBe("%PDF-");
  await page.locator('.os-dock-app[href="/contact"]').click();
  await expect(pane(page).locator('a[href^="mailto:"]').first()).toBeVisible();
  await capture(page, info, "reviewer-contact");
  expect(errors).toEqual([]);
});

test("pointer geometry, search selection, locale and appearance persistence", async ({ page }, info) => {
  await prepare(page);
  await ready(page, "/about");
  const before = await pane(page).boundingBox();
  expect(before).not.toBeNull();
  const title = await pane(page).locator(".os-window-title").boundingBox();
  if (!title || !before) throw new Error("Missing draggable window geometry");
  await page.mouse.move(title.x + 50, title.y + title.height / 2);
  await page.mouse.down();
  await page.mouse.move(title.x + 90, title.y + title.height / 2 + 30, { steps: 5 });
  await page.mouse.up();
  const moved = await pane(page).boundingBox();
  expect(moved?.x).toBeGreaterThan(before.x);
  expect(moved?.y).toBeGreaterThan(before.y);
  const resize = await pane(page).locator(".os-window-resize").boundingBox();
  if (!resize || !moved) throw new Error("Missing resize geometry");
  await page.mouse.move(resize.x + resize.width / 2, resize.y + resize.height / 2);
  await page.mouse.down();
  await page.mouse.move(resize.x + resize.width / 2 - 60, resize.y + resize.height / 2 - 40, { steps: 5 });
  await page.mouse.up();
  expect((await pane(page).boundingBox())?.width).toBeLessThan(moved.width);
  await page.locator(".os-theme-switch").click();
  await expect(page.locator(".os-shell")).toHaveAttribute("data-appearance", "light");
  await page.reload();
  await expect(page.locator(".os-shell")).toHaveAttribute("data-appearance", "light");
  await page.keyboard.press("Control+k");
  const dialog = page.locator(".os-search-dialog");
  await dialog.getByRole("searchbox").fill("no-matching-document-2349867");
  await expect(dialog.locator(".os-search-results a")).toHaveCount(0);
  await dialog.getByRole("searchbox").fill("Simurgh");
  await dialog.locator('a[href="/projects/project-simurgh"]').click();
  await expect(pane(page)).toHaveAttribute("data-window-path", "/projects/project-simurgh");
  await page.goBack();
  await expect(pane(page)).toHaveAttribute("data-window-path", "/about");
  await page.goForward();
  await expect(pane(page)).toHaveAttribute("data-window-path", "/projects/project-simurgh");
  await page.locator(".os-language > summary").click();
  await page.locator('.os-language a[href="/fa/projects/project-simurgh"]').click();
  await expect(page.locator("html")).toHaveAttribute("lang", "fa");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(pane(page)).toHaveAttribute("data-window-path", "/fa/projects/project-simurgh");
  await capture(page, info, "rtl-selected-project");
  await pane(page).locator(".is-close").click();
  await expect(page).toHaveURL(/\/fa$/);
  await expect(pane(page)).toHaveCount(0);
});

test("forced colours preserve caption glyph geometry and language fonts", async ({ page }, info) => {
  await prepare(page);
  await page.emulateMedia({ forcedColors: "active" });
  await ready(page, "/projects");
  const glass = await pane(page).evaluate((el) => ({
    opacity: getComputedStyle(el, "::before").opacity,
    blur: getComputedStyle(el, "::after").backdropFilter,
  }));
  expect(glass).toEqual({ opacity: "1", blur: "none" });
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ forcedColors: "active", colorScheme });
    const breadcrumb = await page.locator(".os-explorer-address > [aria-current='page']").evaluate((el) => ({
      ink: getComputedStyle(el).color,
      inheritedInk: getComputedStyle(el.parentElement!).color,
    }));
    expect(breadcrumb.ink).toBe(breadcrumb.inheritedInk);
    const atlas = await page.locator(".proof-atlas--desktop:visible").first().evaluate((el) => {
      const plate = getComputedStyle(el.querySelector(".proof-atlas-boundary-plate")!);
      const label = getComputedStyle(el.querySelector(".proof-atlas-node text")!);
      return { plateFill: plate.fill, plateStroke: plate.stroke, labelFill: label.fill, labelStroke: label.stroke };
    });
    expect(atlas.plateStroke).not.toBe(atlas.plateFill);
    expect(atlas.labelFill).not.toBe(atlas.labelStroke);
  }
  for (const cls of ["is-minimize", "is-maximize", "is-close"]) {
    const style = await pane(page).locator(`.${cls}`).evaluate((el) => {
      const s = getComputedStyle(el, "::before");
      return { width: parseFloat(s.width), stroke: parseFloat(s.borderTopWidth) };
    });
    expect(style.width).toBeGreaterThan(0);
    expect(style.stroke).toBeGreaterThan(0);
  }
  const strokes = await pane(page).locator(".is-close").evaluate((el) =>
    ["::before", "::after"].map((pseudo) => {
      const s = getComputedStyle(el, pseudo);
      return { width: parseFloat(s.width), padding: parseFloat(s.paddingLeft),
        background: s.backgroundColor, transform: s.transform };
    }));
  expect(strokes.map((s) => s.width)).toEqual([14, 14]);
  expect(strokes.map((s) => s.padding)).toEqual([0, 0]);
  expect(strokes[0].transform).not.toBe(strokes[1].transform);
  await capture(page, info, "forced-colours");
  // A latched native gradient must not erase the selected label when forced
  // colours supplies HighlightText. Exercise the actual evidence control.
  await ready(page, "/projects/invisible-window-research");
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ forcedColors: "active", colorScheme });
    const platform = pane(page).locator(".os-story-platform-picker button").last();
    await platform.focus();
    await page.keyboard.press("Space");
    await expect(platform).toHaveAttribute("aria-pressed", "true");
    const paint = await platform.evaluate((el) => {
      const style = getComputedStyle(el);
      return { ink: style.color, face: style.backgroundColor, border: style.borderTopWidth };
    });
    expect(paint.face).toMatch(/^rgb\(/);
    expect(paint.ink).not.toBe(paint.face);
    expect(paint.border).toBe("2px");
  }
  await page.emulateMedia({ forcedColors: "none" });
  await ready(page, "/fa/about");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  const font = await pane(page).locator(".title-bar-text").evaluate((el) => getComputedStyle(el).fontFamily);
  expect(font.toLowerCase()).toContain("vazirmatn");
});

test("increased contrast and reduced transparency use opaque window frames", async ({ page, browserName }) => {
  await prepare(page);
  await ready(page, "/projects");
  await page.emulateMedia({ contrast: "more" });
  expect(await page.evaluate(() => matchMedia("(prefers-contrast: more)").matches)).toBe(true);
  if (browserName === "firefox") {
    // Bundled Firefox 157 resets this override on navigation and can leave CSS media
    // evaluation stale after emulation, even while matchMedia returns true. A minimal
    // fixture reproduces it. Invalidate layout, then restore the exact test viewport;
    // the application's media rules and all opacity/blur assertions stay unchanged.
    const viewport = page.viewportSize();
    if (!viewport) throw new Error("Contrast regression requires a fixed viewport");
    await page.setViewportSize({ ...viewport, width: viewport.width + 1 });
    await page.setViewportSize(viewport);
  }
  const frame = () => pane(page).evaluate((el) => ({
    opacity: getComputedStyle(el, "::before").opacity,
    blur: getComputedStyle(el, "::after").backdropFilter,
    background: getComputedStyle(el, "::before").backgroundColor,
  }));
  const contrast = await frame();
  expect(contrast.opacity).toBe("1");
  expect(contrast.blur).toBe("none");
  expect(contrast.background).toMatch(/^rgb\(/);

  // Playwright exposes contrast in all engines. Chromium CDP also exposes the
  // separate transparency preference; other engines are not claimed for this part.
  if (browserName === "chromium") {
    const session = await page.context().newCDPSession(page);
    await session.send("Emulation.setEmulatedMedia", { features: [
      { name: "prefers-reduced-transparency", value: "reduce" },
      { name: "prefers-contrast", value: "no-preference" },
      { name: "prefers-reduced-motion", value: "reduce" },
    ] });
    expect(await page.evaluate(() => matchMedia("(prefers-reduced-transparency: reduce)").matches)).toBe(true);
    const transparency = await frame();
    expect(transparency.opacity).toBe("1");
    expect(transparency.blur).toBe("none");
    expect(transparency.background).toMatch(/^rgb\(/);
    await session.detach();
  }
});

test("keyboard workspace entry and five-language 404 recovery", async ({ page }, info) => {
  await prepare(page);
  await ready(page, "/");
  // Home starts on the profile screen; its entry control remains keyboard reachable.
  await expect(page.locator(".os-welcome")).toBeVisible();
  const enter = page.locator(".os-enter");
  await expect(enter).toHaveAccessibleName(/Enter workspace/);
  // Reach the entry by sequential keyboard navigation, without click/focus injection.
  for (let i = 0; i < 25 && !(await enter.evaluate((el) => el === document.activeElement)); i++) {
    await page.keyboard.press("Tab");
  }
  await expect(enter).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator(".os-welcome")).not.toBeVisible();
  await page.locator('.os-dock-app[href="/projects"]').focus();
  await page.keyboard.press("Enter");
  await expect(pane(page).locator("h1")).toBeFocused();
  await capture(page, info, "keyboard-opened-projects");
  for (const locale of locales) {
    const response = await page.goto(route(locale, "/not-a-portfolio-route"), { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(404);
    await expect(page.locator("html")).toHaveAttribute("lang", locale === "en" ? /en/ : locale);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator(`.global-not-found-actions a[href="${route(locale, "/projects")}"]`)).toBeVisible();
    const state = await geometry(page);
    expect(state.scrollWidth).toBeLessThanOrEqual(1441);
    await capture(page, info, `404-${locale}`);
  }
});

test("five-language keyboard search, empty results and dismissal", async ({ page }, info) => {
  await prepare(page);
  for (const locale of locales) {
    await ready(page, route(locale, "/projects"));
    await page.keyboard.press("Control+k");
    const dialog = page.locator(".os-search-dialog");
    await expect(dialog).toBeVisible();
    const input = dialog.getByRole("searchbox");
    await input.fill("no-such-publication-802460");
    await expect(dialog.locator(".os-search-results a")).toHaveCount(0);
    await input.fill("Simurgh");
    const first = dialog.locator(".os-search-results a").first();
    await expect(first).toBeVisible();
    const href = await first.getAttribute("href");
    expect(href).toBeTruthy();
    await page.keyboard.press("Enter");
    await expect(dialog).not.toBeVisible();
    await expect(page).toHaveURL(new URL(href!, page.url()).href);
    await page.keyboard.press("Control+k");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await capture(page, info, `search-selected-${locale}`);
  }
});

for (const theme of ["light", "dark"]) for (const locale of locales) {
  test(`responsive ${locale} ${theme}`, async ({ page }, info) => {
    await prepare(page, theme);
    const observations = [];
    for (const [width, height] of sizes) {
      await page.setViewportSize({ width, height });
      for (const path of ["/", "/projects", "/lab/001", "/contact"]) {
        await ready(page, route(locale, path), theme);
        const state = await geometry(page);
        expect(state.scrollWidth, `${locale} ${path} ${width} overflow`).toBeLessThanOrEqual(width + 1);
        expect(state.duplicateIds).toEqual([]);
        expect(state.brokenImages).toEqual([]);
        expect(state.mainCount).toBe(1);
        observations.push({ locale, theme, path, height, ...state });
        await capture(page, info, `${locale}-${theme}-${width}x${height}-${path.replaceAll("/", "_")}`);
      }
    }
    await info.attach("responsive-observations", { body: JSON.stringify(observations, null, 2), contentType: "application/json" });
  });
}

// The sitemap is generated by the same build being tested. English canonical
// paths omit /en; no stale hard-coded route list can silently skip new content.
const sitemap = readFileSync("out/sitemap.xml", "utf8");
const routes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
for (let chunk = 0; chunk < routes.length; chunk += 10) {
  const paths = routes.slice(chunk, chunk + 10);
  test(`exported route audit ${chunk + 1}-${chunk + paths.length}`, async ({ page }, info) => {
    await prepare(page);
    const observations = [];
    for (const path of paths) {
      await ready(page, path);
      const state = await geometry(page);
      expect(state.scrollWidth).toBeLessThanOrEqual(1441);
      expect(state.duplicateIds).toEqual([]);
      expect(state.brokenImages).toEqual([]);
      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      observations.push({ path, ...state, axe: { violations: axe.violations, incomplete: axe.incomplete, passes: axe.passes.length } });
      expect.soft(axe.violations, `accessibility: ${path}`).toEqual([]);
    }
    await info.attach("route-observations", { body: JSON.stringify(observations, null, 2), contentType: "application/json" });
  });
}
