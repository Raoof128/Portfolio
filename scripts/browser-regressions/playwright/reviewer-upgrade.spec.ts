import { test, expect, type Page, type TestInfo } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const locales = ["en", "fa", "ar", "es", "zh"] as const;
const themes = ["light", "dark"] as const;
const route = (locale: string, path: string) =>
  locale === "en" ? path : `/${locale}${path === "/" ? "" : path}`;
const pane = (page: Page) =>
  page.locator('[data-window-path][data-active="true"]:not([hidden])');
const highlights = (page: Page) => page.locator(".os-desktop .os-intro:visible");

async function freshVisitor(page: Page, theme: string = "dark") {
  await page.addInitScript((appearance) => {
    // Every navigation in these cases exercises a fresh visitor, including locale
    // roots. Persistence has its own coverage in portfolio.spec.ts.
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem("researchos.appearance.v1", appearance);
  }, theme);
}

async function ready(page: Page, path: string, theme: string = "dark") {
  const response = await page.goto(path, { waitUntil: "domcontentloaded" });
  expect(response?.status(), path).toBe(200);
  await expect(page.locator(".os-shell")).toHaveAttribute("data-appearance", theme);
  await page.evaluate(() => document.fonts.ready);
  if (!locales.some((locale) => path === route(locale, "/"))) {
    await expect(pane(page)).toBeVisible();
    await expect(pane(page).locator("h1")).toBeVisible();
  }
}

async function enterWorkspace(page: Page) {
  await expect(page.locator(".os-welcome")).toBeVisible();
  await expect(page.locator(".os-lock-profile button")).toHaveCount(1);
  await page.locator("#os-lock-name").click();
  await page.locator(".os-lock-portrait").click();
  await expect(page.locator(".os-enter")).toBeEnabled();
  await expect(page.locator(".os-enter-status")).toBeEmpty();
  const arrow = page.locator(".os-enter");
  await arrow.evaluate((element) => {
    performance.clearMarks("arrow-selected");
    element.addEventListener("click", () => performance.mark("arrow-selected"), { once: true });
  });
  await arrow.click();
  await expect(page.locator(".os-enter")).toBeDisabled();
  await expect(page.locator(".os-enter-status")).not.toBeEmpty();
  await expect(page.locator(".os-welcome")).not.toBeVisible();
  const elapsed = await page.evaluate(() =>
    performance.now() - performance.getEntriesByName("arrow-selected")[0].startTime,
  );
  expect(elapsed).toBeGreaterThanOrEqual(3000);
}

async function capture(page: Page, info: TestInfo, name: string) {
  // Actual captures for review; no screenshot is silently accepted as a golden.
  await info.attach(name, {
    body: await page.screenshot({ animations: "disabled" }),
    contentType: "image/png",
  });
}

async function resizePane(page: Page, width: number) {
  await expect(pane(page)).toHaveClass(/os-window--floating/);
  const before = await pane(page).boundingBox();
  const grip = await pane(page).locator(".os-window-resize").boundingBox();
  if (!before || !grip) throw new Error("Reading window has no resize grip");
  const x = grip.x + grip.width / 2;
  const y = grip.y + grip.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + width - before.width, y, { steps: 5 });
  await page.mouse.up();
  await expect.poll(async () => {
    const box = await pane(page).boundingBox();
    return box ? Math.abs(box.width - width) : Infinity;
  }).toBeLessThanOrEqual(1);
}

for (const theme of themes) {
  test(`arrow entry opens reviewer actions in all five languages: ${theme}`, async ({ page }, info) => {
    await freshVisitor(page, theme);
    await page.setViewportSize({ width: 390, height: 844 });
    for (const locale of locales) {
      await ready(page, route(locale, "/"), theme);
      await enterWorkspace(page);
      await expect(highlights(page).locator("h1")).toBeVisible();
      await expect(highlights(page).locator(".os-role")).not.toBeEmpty();
      await expect(highlights(page).locator(".os-desktop-summary")).not.toBeEmpty();
      const actions = highlights(page).locator(".os-direct-links a");
      await expect(actions).toHaveCount(3);
      await expect(highlights(page).locator(`.os-direct-links a[href="${route(locale, "/projects")}"]`)).toHaveCount(1);
      await expect(highlights(page).locator(`.os-direct-links a[href="${route(locale, "/contact")}"]`)).toHaveCount(1);
      await expect(highlights(page).locator('.os-direct-links a[href="/Mohammad_Raouf_Abedini_Resume.pdf"]')).toHaveCount(1);
      for (let index = 0; index < 3; index += 1) {
        await expect(actions.nth(index)).toHaveAccessibleName(/\S/);
        await expect(actions.nth(index)).toBeInViewport({ ratio: 1 });
      }
      const atlas = page.locator(".proof-atlas--desktop:visible");
      await expect(atlas).toBeVisible();
      const introBox = await highlights(page).boundingBox();
      const atlasBox = await atlas.boundingBox();
      if (!introBox || !atlasBox) throw new Error("Home research windows have no geometry");
      expect(introBox.height).toBeLessThan(700);
      const researchGap = atlasBox.y - (introBox.y + introBox.height);
      expect(researchGap).toBeGreaterThanOrEqual(0);
      expect(researchGap).toBeLessThanOrEqual(30);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
      await expect(page.locator("html")).toHaveAttribute("dir", locale === "ar" || locale === "fa" ? "rtl" : "ltr");
      if (locale === "en" || locale === "ar") {
        await capture(page, info, `immediate-reviewer-home-${locale}-${theme}`);
      }
    }
  });
}

test("reviewer actions and a flagship dossier preserve keyboard focus and history", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await freshVisitor(page);
  await ready(page, "/");
  await enterWorkspace(page);
  const explore = highlights(page).getByRole("link", { name: "Explore Research", exact: true });
  // The first meaningful action is reachable in the document's native tab order.
  for (let index = 0; index < 40 && !(await explore.evaluate((element) => element === document.activeElement)); index += 1) {
    await page.keyboard.press("Tab");
  }
  await expect(explore).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(pane(page)).toHaveAttribute("data-window-path", "/projects");
  await expect(pane(page).locator("h1")).toBeFocused();
  await page.goBack();
  await expect(highlights(page)).toBeVisible();

  const contact = highlights(page).locator('.os-direct-links a[href="/contact"]');
  await contact.focus();
  await page.keyboard.press("Enter");
  await expect(pane(page)).toHaveAttribute("data-window-path", "/contact");
  await expect(pane(page).locator("h1")).toBeFocused();
  await page.goBack();
  await expect(highlights(page)).toBeVisible();

  // The PDF action deliberately opens a separate document. Check its resource
  // and semantics without depending on a browser-specific built-in PDF viewer.
  const resume = highlights(page).locator('.os-direct-links a[href="/Mohammad_Raouf_Abedini_Resume.pdf"]');
  await expect(resume).toHaveAttribute("target", "_blank");
  await expect(resume).toHaveAttribute("rel", /noopener/);
  const pdf = await page.request.get((await resume.getAttribute("href"))!);
  expect(pdf.status()).toBe(200);
  expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");

  const flagship = page.locator('.proof-atlas--desktop .proof-atlas-link[href="/projects/project-simurgh"]');
  await expect(flagship).toBeVisible();
  await flagship.focus();
  await page.keyboard.press("Enter");
  await expect(pane(page)).toHaveAttribute("data-window-path", "/projects/project-simurgh");
  await expect(pane(page).locator("h1")).toBeFocused();
  await page.goBack();
  await expect(highlights(page)).toBeVisible();
  await page.goForward();
  await expect(pane(page)).toHaveAttribute("data-window-path", "/projects/project-simurgh");
  await expect(pane(page).locator("h1")).toBeFocused();
  await capture(page, info, "reviewer-opened-flagship");
  expect(errors).toEqual([]);
});

test("representative reviewer home and dossier keep accessibility rules intact", async ({ page }, info) => {
  await freshVisitor(page, "light");
  const observations = [];
  for (const path of ["/", "/projects/project-simurgh"]) {
    await ready(page, path, "light");
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    observations.push({ path, violations: result.violations, incomplete: result.incomplete,
      passingRuleCount: result.passes.length });
    expect.soft(result.violations, path).toEqual([]);
  }
  // Incomplete contrast/background checks remain explicitly incomplete.
  await info.attach("representative-accessibility-observations", {
    body: JSON.stringify(observations, null, 2),
    contentType: "application/json",
  });
});

test("artwork arrival keeps the Aero frame stable and respects reduced motion", async ({ page }, info) => {
  await freshVisitor(page);
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    await page.emulateMedia({ reducedMotion });
    await ready(page, "/projects");
    const frame = await pane(page).elementHandle();
    const before = await pane(page).boundingBox();
    if (!frame || !before) throw new Error("Missing retained Aero frame");
    await pane(page).locator('.os-project-row a[href="/projects/project-simurgh"]').first().click();
    await expect(pane(page)).toHaveAttribute("data-window-path", "/projects/project-simurgh");
    await expect(pane(page).locator("h1")).toBeFocused();
    expect(await frame.evaluate((element) =>
      element.isConnected && element === document.querySelector('[data-window-path][data-active="true"]:not([hidden])'),
    )).toBe(true);
    const after = await pane(page).boundingBox();
    expect(after).toEqual(before);

    const stage = pane(page).locator('.os-motion-stage[data-artwork-ready="true"]');
    await expect(stage).toBeVisible();
    const style = await stage.evaluate((element) => {
      const computed = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return { animation: computed.animationName, duration: computed.animationDuration,
        opacity: computed.opacity, width: box.width, height: box.height };
    });
    expect(style.width).toBeGreaterThan(0);
    expect(style.height).toBeGreaterThan(0);
    if (reducedMotion === "reduce") {
      expect(style.animation).toBe("none");
      expect(style.opacity).toBe("1");
    } else {
      expect(style.animation).toBe("os-project-artwork-arrival");
      expect(style.duration).toBe("0.22s");
    }
    await capture(page, info, `artwork-${reducedMotion}`);
    await page.goBack();
    await expect(pane(page)).toHaveAttribute("data-window-path", "/projects");
    await page.goForward();
    await expect(pane(page)).toHaveAttribute("data-window-path", "/projects/project-simurgh");
    await expect(pane(page).locator("h1")).toBeFocused();
  }
});

test("Simurgh walkthrough exposes every source-backed stage and the reading path", async ({ page }, info) => {
  await freshVisitor(page);
  await ready(page, "/projects/project-simurgh");
  const story = pane(page).locator(".os-simurgh-story");
  const steps = story.locator(".os-simurgh-instrument-chain button");
  await expect(steps).toHaveCount(6);
  await expect(story.locator(".os-evidence-story-note")).toContainText(/earlier frozen four-boundary architecture/i);
  await expect(story.locator(".os-evidence-story-note")).toContainText(/not a current study run trace/i);
  for (let index = 0; index < 6; index += 1) {
    const button = steps.nth(index);
    await button.focus();
    await page.keyboard.press("Space");
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(story.locator('.os-simurgh-instrument-chain button[aria-pressed="true"]')).toHaveCount(1);
    const current = story.locator('.os-simurgh-explanations [aria-current="step"]');
    await expect(current).toHaveCount(1);
    await expect(current).toBeVisible();
    await expect(current).toHaveAttribute("id", (await button.getAttribute("aria-describedby"))!);
  }
  await expect(story.locator('.os-simurgh-explanations [aria-current="step"]')).toContainText(/reviewer|independent|replay/i);
  const path = pane(page).locator(".os-dossier-reading-path a");
  await expect(path).toHaveCount(5);
  for (const index of [2, 3, 4, 0, 1]) {
    const link = path.nth(index);
    const href = await link.getAttribute("href");
    expect(href).toMatch(/^#/);
    await link.click();
    const target = page.locator(`[id="${href!.slice(1)}"]`);
    await expect(target).toBeVisible();
    await expect(target).toBeFocused();
  }
  await capture(page, info, "simurgh-reading-path-and-walkthrough");
});

for (const { width, height } of [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 640, height: 360 },
]) {
  test(`phone reading uses document scrolling at ${width}x${height}`, async ({ page }, info) => {
    await freshVisitor(page);
    await page.setViewportSize({ width, height });
    await ready(page, "/resume");
    await expect(pane(page)).not.toHaveClass(/os-window--floating/);
    const reading = pane(page).locator(".os-page-content");
    const initial = await reading.evaluate((element) => ({
      overflowY: getComputedStyle(element).overflowY,
      bodyScrollHeight: document.documentElement.scrollHeight,
      viewportHeight: innerHeight,
      pageWidth: document.documentElement.scrollWidth,
    }));
    expect(["auto", "scroll", "hidden"]).not.toContain(initial.overflowY);
    expect(initial.bodyScrollHeight).toBeGreaterThan(initial.viewportHeight + 100);
    expect(initial.pageWidth).toBeLessThanOrEqual(width + 1);

    // A real wheel over reading text must move the document, rather than an
    // invisible fixed-height inner viewport. This also covers short landscape.
    await page.mouse.move(width / 2, Math.max(100, height / 2));
    await page.mouse.wheel(0, 700);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(50);
    expect(await reading.evaluate((element) => element.scrollTop)).toBe(0);
    await capture(page, info, `document-scroll-${width}x${height}`);
  });
}

const readingRoutes = [
  "/projects",
  "/about",
  "/resume",
  "/contact",
  "/write-ups",
  "/projects/project-simurgh",
];

for (const path of readingRoutes) {
  test(`reading reflows inside an independently resized pane: ${path}`, async ({ page }, info) => {
    await freshVisitor(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await ready(page, path);
    const observations = [];
    for (const width of [320, 560, 800]) {
      // Exercise the real pointer resize, keeping the browser wide throughout.
      // A viewport-only media query cannot make this test pass accidentally.
      await resizePane(page, width);
      const state = await pane(page).locator(".os-page-content").evaluate((element) => ({
        browserWidth: innerWidth,
        contentWidth: element.clientWidth,
        contentScrollWidth: element.scrollWidth,
        pageScrollWidth: document.documentElement.scrollWidth,
        headings: [...element.querySelectorAll("h1")]
          .filter((heading) => heading.getBoundingClientRect().height > 0).length,
      }));
      expect(state.browserWidth).toBe(1440);
      expect(state.contentWidth).toBeGreaterThan(250);
      expect(state.contentScrollWidth, `${path} at pane ${width}`).toBeLessThanOrEqual(state.contentWidth + 1);
      expect(state.pageScrollWidth).toBeLessThanOrEqual(1441);
      expect(state.headings).toBe(1);
      observations.push({ path, paneWidth: width, ...state });
      if (width === 320 || width === 800) {
        await capture(page, info, `${path.replaceAll("/", "_")}-pane-${width}`);
      }
    }
    await info.attach("independent-pane-observations", {
      body: JSON.stringify(observations, null, 2),
      contentType: "application/json",
    });
  });
}

test("Explorer navigation responds to its own 880/881px boundary", async ({ page }, info) => {
  await freshVisitor(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page, "/projects/project-simurgh");
  const explorer = pane(page).locator(".os-project-explorer");
  const toggle = explorer.locator(".os-explorer-nav-toggle");
  const search = explorer.getByRole("searchbox", { name: "Search Projects", exact: true });
  for (const contentWidth of [880, 881]) {
    const current = await pane(page).boundingBox();
    if (!current) throw new Error("Missing Explorer frame");
    const currentContent = await explorer.evaluate((element) => element.clientWidth);
    await resizePane(page, current.width + contentWidth - currentContent);
    await expect.poll(() => explorer.evaluate((element) => element.clientWidth)).toBe(contentWidth);
    if (contentWidth === 880) {
      await expect(toggle).toBeVisible();
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await expect(search).not.toBeVisible();
      await toggle.focus();
      await page.keyboard.press("Enter");
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await expect(search).toBeVisible();
      await toggle.click();
      await expect(search).not.toBeVisible();
    } else {
      await expect(toggle).not.toBeVisible();
      await expect(search).toBeVisible();
    }
  }
  await capture(page, info, "explorer-wide-sidebar-boundary");
});

