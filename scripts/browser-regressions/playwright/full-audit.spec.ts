import { test, expect, type Locator, type Page, type TestInfo } from "@playwright/test";

const locales = ["en", "fa", "ar", "zh", "es"] as const;
const themes = ["light", "dark"] as const;
const route = (locale: string, path: string) =>
  locale === "en" ? path : `/${locale}${path === "/" ? "" : path}`;
const pane = (page: Page) =>
  page.locator('[data-window-path][data-active="true"]:not([hidden])');

async function prepare(page: Page, theme: string = "dark") {
  await page.addInitScript((appearance) => {
    if (window.location.protocol === "about:") return;
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem("researchos.appearance.v1", appearance);
  }, theme);
}

async function ready(page: Page, path: string, theme: string = "dark") {
  const response = await page.goto(path, { waitUntil: "domcontentloaded" });
  expect(response?.status(), path).toBe(200);
  await expect(page.locator(".os-shell")).toHaveAttribute("data-appearance", theme);
  if (locales.some((locale) => path === route(locale, "/"))) {
    // The root opens on the lock screen and enters only through the arrow (38842e2).
    // A press before hydration does nothing, so retry until the orb starts its wait;
    // it is disabled while waiting, so a second press is never sent.
    const desktop = page.locator(".os-desktop:visible");
    const enter = page.locator(".os-enter");
    await expect(async () => {
      if ((await enter.isVisible()) && (await enter.isEnabled())) await enter.click({ timeout: 1_000 });
      await expect(desktop).toBeVisible({ timeout: 4_500 });
    }).toPass({ timeout: 20_000 });
  } else {
    await expect(pane(page)).toBeVisible();
    await expect(pane(page).locator("h1")).toBeVisible();
  }
  await page.evaluate(() => document.fonts.ready);
}

async function capture(page: Page, info: TestInfo, name: string) {
  // Review artifacts only; this suite never accepts screenshots as new goldens.
  await info.attach(name, {
    body: await page.screenshot({ animations: "disabled" }),
    contentType: "image/png",
  });
}

async function insideViewport(locator: Locator, page: Page) {
  await expect.poll(async () => locator.evaluate((element) => {
    const box = element.getBoundingClientRect();
    return box.width > 0 && box.height > 0 && box.left >= -1 && box.top >= -1
      && box.right <= innerWidth + 1 && box.bottom <= innerHeight + 1;
  })).toBe(true);
  await expect(locator).toBeInViewport({ ratio: 1 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth))
    .toBeLessThanOrEqual((page.viewportSize()?.width ?? 0) + 1);
}

test.describe("native contact fallback", () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });

  test("required fields block empty submission and a valid draft stays out of HTTP URLs", async ({ page, context, browserName }, info) => {
    test.skip(browserName !== "chromium",
      "This native mailto navigation oracle uses Chromium CDP; an external mail client is not installed or verified.");
    const response = await page.goto("/contact", { waitUntil: "load" });
    expect(response?.status()).toBe(200);
    const form = page.locator(".os-secure-form");
    await expect(form).toBeVisible();
    await expect(form).toHaveAttribute("action", /^mailto:[^?]+\?subject=/);
    await expect(form).toHaveAttribute("method", "post");
    await expect(form).toHaveAttribute("enctype", "text/plain");
    expect(await form.evaluate((element) => (element as HTMLFormElement).noValidate)).toBe(false);
    await expect(page.locator("noscript .os-secure-note a[href^='mailto:']")).toBeVisible();
    const initialURL = page.url();
    const action = new URL((await form.getAttribute("action"))!);
    const nativeAttempts: Array<{ reason: string; url: string; disposition: string }> = [];
    const cdp = await context.newCDPSession(page);
    await cdp.send("Page.enable");
    cdp.on("Page.frameRequestedNavigation", (event) => {
      if (event.url.startsWith("mailto:")) nativeAttempts.push(event);
    });
    const httpSubmissions: Array<{ url: string; method: string; body: string | null }> = [];
    page.on("request", (request) => {
      if (/^https?:/.test(request.url()) && (
        request.isNavigationRequest()
        || /AuditBrowserProbe|audit-browser-probe|PRIVATE_DRAFT_PROBE/.test(
          `${request.url()} ${request.postData() ?? ""}`,
        )
      )) {
        httpSubmissions.push({ url: request.url(), method: request.method(), body: request.postData() });
      }
    });

    const submit = form.locator('button[type="submit"]');
    await submit.click();
    await expect(page.locator("#contact-name")).toBeFocused();
    expect(await form.evaluate((element) => (element as HTMLFormElement).checkValidity())).toBe(false);
    await expect(page).toHaveURL(initialURL);
    expect(nativeAttempts).toEqual([]);

    await page.locator("#contact-name").fill("AuditBrowserProbe");
    await page.locator("#contact-email").fill("audit-browser-probe@example.invalid");
    await page.locator("#contact-message").fill("PRIVATE_DRAFT_PROBE: a synthetic browser regression draft.");
    expect(await form.evaluate((element) => (element as HTMLFormElement).checkValidity())).toBe(true);
    await capture(page, info, "contact-native-valid-draft");
    // Exercise native submission with scripting disabled. A mail handler is outside
    // this browser fixture, so only URL/privacy and native validation are certified.
    await submit.click();
    await expect.poll(() => nativeAttempts.length).toBeGreaterThan(0);
    const attempt = nativeAttempts.at(-1)!;
    expect(attempt.reason).toBe("formSubmissionPost");
    expect(attempt.disposition).toBe("currentTab");
    const mailto = new URL(attempt.url);
    expect(mailto.protocol).toBe("mailto:");
    expect(mailto.pathname).toBe(action.pathname);
    expect(mailto.searchParams.get("subject")).toBe(action.searchParams.get("subject"));
    expect(mailto.searchParams.get("body")?.split(/\r?\n/).filter(Boolean)).toEqual([
      "name=AuditBrowserProbe",
      "email=audit-browser-probe@example.invalid",
      "message=PRIVATE_DRAFT_PROBE: a synthetic browser regression draft.",
    ]);
    // With no external protocol handler, Chromium may display its internal error
    // document. Accept that only after observing the actual native mailto POST.
    await expect(page).toHaveURL((url) => url.href === initialURL
      || url.href === "chrome-error://chromewebdata/");
    expect(httpSubmissions).toEqual([]);
    await info.attach("native-contact-observation", {
      body: JSON.stringify({ javaScriptEnabled: false, initialURL, finalURL: page.url(),
        nativeAttempts, httpSubmissions, mailClientLaunchVerified: false }, null, 2),
      contentType: "application/json",
    });
    await capture(page, info, "contact-native-handoff-browser-result");
    await cdp.detach();
  });
});

for (const locale of locales) {
  test(`direct dossier fragments reveal and focus their initial section: ${locale}`, async ({ page }, info) => {
    await prepare(page);
    for (const [fragment, section] of [
      ["methods", "methods"],
      ["methods-heading", "methods"],
      ["research-papers", "evidence"],
    ] as const) {
      // A hash-only page.goto may stay in the same document and return null.
      // Each assertion here exercises a genuine direct load through hydration.
      await page.goto("about:blank");
      await ready(page, `${route(locale, "/projects/project-simurgh")}#${fragment}`);
      const target = pane(page).locator(`[id="${fragment}"]`);
      await expect(target).toBeVisible();
      await expect(target).toBeFocused();
      await expect(target).toHaveAttribute("tabindex", "-1");
      await expect(pane(page).locator(`[data-dossier-section="${section}"]`)).not.toHaveAttribute("hidden", "");
      const selected = pane(page).getByRole("tab", { selected: true });
      await expect(selected).toHaveCount(1);
      await expect(selected).toHaveAttribute("aria-controls", section);
      await expect(selected).toHaveAttribute("tabindex", "0");
      await expect(page).toHaveURL(new RegExp(`#${fragment}$`));
    }
    await capture(page, info, `dossier-direct-evidence-${locale}`);
  });
}

for (const theme of themes) {
  test(`every selected Zurvan ledger type keeps body and strong text contrast: ${theme}`, async ({ page }, info) => {
    await prepare(page, theme);
    await ready(page, "/projects/project-zurvan", theme);
    const story = pane(page).locator(".os-zurvan-story");
    const types = story.locator("button.os-zurvan-typed");
    await expect(types).toHaveCount(4);
    const observations = [];
    for (let index = 0; index < 4; index += 1) {
      await types.nth(index).focus();
      await page.keyboard.press("Space");
      await expect(types.nth(index)).toHaveAttribute("aria-pressed", "true");
      const selected = story.locator('.os-zurvan-type-ledger li[data-selected="true"]');
      await expect(selected).toHaveCount(1);
      await expect(selected).toHaveAttribute("id", (await types.nth(index).getAttribute("aria-describedby"))!);
      await selected.scrollIntoViewIfNeeded();
      const paint = await selected.evaluate((element) => {
        const surface = getComputedStyle(element);
        const body = getComputedStyle(element.querySelector("p")!);
        const strong = getComputedStyle(element.querySelector("strong")!);
        const rgba = (color: string) => {
          if (!/^rgba?\(/.test(color)) throw new Error(`Unsupported computed color: ${color}`);
          const channels = color.match(/[\d.]+/g)!.map(Number);
          return { rgb: channels.slice(0, 3), alpha: channels[3] ?? 1 };
        };
        const luminance = (rgb: number[]) => rgb.map((channel) => {
          const s = channel / 255;
          return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        }).reduce((sum, channel, i) => sum + channel * [0.2126, 0.7152, 0.0722][i], 0);
        const background = rgba(surface.backgroundColor);
        const contrast = (color: string) => {
          const ink = rgba(color);
          const a = luminance(ink.rgb);
          const b = luminance(background.rgb);
          return { ink: color, alpha: ink.alpha, ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) };
        };
        return { background: surface.backgroundColor, backgroundAlpha: background.alpha,
          backgroundImage: surface.backgroundImage, opacity: surface.opacity,
          body: contrast(body.color), strong: contrast(strong.color) };
      });
      // These assertions measure the actual opaque selected row, not a token or
      // an axe approximation of a gradient/background it could not resolve.
      expect(paint.backgroundImage).toBe("none");
      expect(paint.backgroundAlpha).toBe(1);
      expect(paint.opacity).toBe("1");
      for (const text of [paint.body, paint.strong]) {
        expect(text.alpha).toBe(1);
        expect(text.ratio).toBeGreaterThanOrEqual(4.5);
      }
      observations.push({ index, ...paint });
    }
    await info.attach(`zurvan-selected-ledger-contrast-${theme}`, {
      body: JSON.stringify(observations, null, 2), contentType: "application/json",
    });
    await capture(page, info, `zurvan-selected-ledger-${theme}`);
  });
}

test.describe("coarse pointer phone chrome", () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });

  for (const theme of themes) {
    test(`wallpaper footer, pending language and Start search stay readable and contained: ${theme}`, async ({ page }, info) => {
      await prepare(page, theme);
      await ready(page, "/", theme);
      expect(await page.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(true);

      const checkLocaleChrome = async (locale: string) => {
        const footerLink = page.locator(".os-desktop-footer a").first();
        await expect(footerLink).toHaveCSS("color", "rgb(255, 255, 255)");
        await footerLink.hover();
        await expect(footerLink).toHaveCSS("color", "rgb(255, 255, 255)");
        const launcher = page.locator(".os-top-actions button[aria-keyshortcuts]");
        await launcher.click();
        const dialog = page.locator(".os-search-dialog[open]");
        await expect(dialog).toBeVisible();
        await expect(dialog.getByRole("searchbox")).toBeFocused();
        await insideViewport(dialog, page);
        await capture(page, info, `phone-search-${locale}-${theme}`);
        await page.keyboard.press("Escape");
        await expect(dialog).not.toBeVisible();
        await expect(launcher).toBeFocused();

        await page.setViewportSize({ width: 320, height: 225 });
        await launcher.click();
        const shortDialog = page.locator(".os-search-dialog[open]");
        await insideViewport(shortDialog, page);
        await expect.poll(async () => shortDialog.locator(".os-search-body")
          .evaluate((element) => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
        const search = shortDialog.getByRole("searchbox");
        await search.fill("Simurgh");
        const result = shortDialog.locator(
          `.os-search-results a[href="${route(locale, "/projects/project-simurgh")}"]`,
        ).first();
        await expect(result).toHaveAttribute("href", route(locale, "/projects/project-simurgh"));
        for (let step = 0; step < 20 && !(await result.evaluate((element) => element === document.activeElement)); step += 1) {
          await page.keyboard.press("Tab");
        }
        await expect(result).toBeFocused();
        // The outer dialog may scroll in a short viewport. The focused result
        // must be reachable; all of its children need not fit simultaneously.
        await expect(result).toBeInViewport();
        await capture(page, info, `short-search-${locale}-${theme}`);
        await page.keyboard.press("Escape");
        await expect(shortDialog).not.toBeVisible();
        await page.setViewportSize({ width: 390, height: 844 });
      };
      await checkLocaleChrome("en");

      // Hold the actual destination request so the transient pending state is
      // inspected deterministically rather than forcing aria-busy on the DOM.
      let releaseNavigation!: () => void;
      const navigationGate = new Promise<void>((resolve) => { releaseNavigation = resolve; });
      await page.route((url) => url.pathname === "/fa"
        || url.pathname === "/fa.txt"
        || url.pathname.startsWith("/fa/__next."), async (request) => {
        await navigationGate;
        await request.continue();
      });
      try {
        await page.locator(".os-language > summary").click();
        await page.locator('.os-language a[href="/fa"]').click({ noWaitAfter: true });
        const summary = page.locator(".os-language > summary");
        await expect(summary).toHaveAttribute("aria-busy", "true");
        await expect(summary).toHaveCSS("opacity", "1");
        await capture(page, info, `phone-language-pending-${theme}`);
      } finally {
        releaseNavigation();
      }
      await expect(page).toHaveURL(/\/fa$/);
      await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
      await expect(page.locator(".os-desktop:visible")).toBeVisible();
      await checkLocaleChrome("fa");
    });
  }

  test("Contact keeps keyboard focus visible when the available viewport shrinks", async ({ page }, info) => {
    await prepare(page, "light");
    await ready(page, "/contact", "light");
    await page.locator("#contact-name").focus();
    await page.keyboard.press("Tab");
    await expect(page.locator("#contact-email")).toBeFocused();
    await page.keyboard.press("Tab");
    const message = page.locator("#contact-message");
    await expect(message).toBeFocused();
    await expect(message).toBeInViewport({ ratio: 1 });
    // This is a browser viewport-shrink regression, not a claim of testing a
    // physical device's software keyboard or visualViewport implementation.
    await page.setViewportSize({ width: 390, height: 360 });
    await expect(message).toBeFocused();
    await expect(message).toBeInViewport({ ratio: 1 });
    expect(await message.evaluate((element) => element.matches(":focus-visible"))).toBe(true);
    await expect.poll(async () => message.evaluate((element) => {
      const field = element.getBoundingClientRect();
      const dock = document.querySelector(".os-dock")?.getBoundingClientRect();
      return field.top >= 0 && field.bottom <= (dock?.top ?? innerHeight);
    })).toBe(true);
    await capture(page, info, "contact-keyboard-viewport-shrink");
  });
});

test("a new document does not inherit the old reading offset on a phone resize", async ({ page }, info) => {
  await prepare(page);
  await ready(page, "/projects/project-simurgh");
  await expect(pane(page)).toHaveClass(/os-window--floating/);
  const oldBody = pane(page).locator(".os-page-content");
  await oldBody.evaluate((element) => {
    element.scrollTop = 600;
    element.dispatchEvent(new Event("scroll"));
  });
  await expect.poll(async () => oldBody.evaluate((element) => element.scrollTop)).toBeGreaterThan(500);
  await page.locator('.os-dock-app[data-app="resume"]').click();
  await expect(pane(page)).toHaveAttribute("data-window-path", "/resume");
  const newBody = pane(page).locator(".os-page-content");
  await expect.poll(async () => newBody.evaluate((element) => element.scrollTop)).toBe(0);
  await expect(pane(page).locator("h1")).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(pane(page)).not.toHaveClass(/os-window--floating/);
  await expect(pane(page).locator("h1")).toBeInViewport({ ratio: 1 });
  await expect.poll(async () => pane(page).locator("h1").evaluate((element) => {
    const heading = element.getBoundingClientRect();
    const dock = document.querySelector(".os-dock")?.getBoundingClientRect();
    return heading.top >= 0 && heading.bottom <= (dock?.top ?? innerHeight);
  })).toBe(true);
  await expect.poll(async () => newBody.evaluate((element) => element.scrollTop)).toBe(0);
  await capture(page, info, "new-resume-phone-reading-position");
});

for (const hasTouch of [false, true]) {
  test.describe(`rounded taskbar with ${hasTouch ? "coarse" : "fine"} pointer`, () => {
    test.use({ hasTouch });

    test("all five labelled pins and tray controls fit the usable width in LTR and RTL", async ({ page }, info) => {
      await prepare(page, "light");
      const observations = [];
      for (const locale of ["en", "fa"]) {
        await page.setViewportSize({ width: 1440, height: 900 });
        await ready(page, route(locale, "/about"), "light");
        for (const [width, height] of [
          [320, 568], [390, 844], [640, 360], [768, 1024],
          [1024, 768], [1440, 900], [1920, 1080], [320, 225],
        ]) {
          await page.setViewportSize({ width, height });
          await page.evaluate(() => new Promise<void>((resolve) => {
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
          }));
          if (height < 600) {
            // The short-viewport taskbar follows the document; inspect it where
            // the visitor reaches it, without asserting a fixed overlay there.
            await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
          }
          const dock = page.locator(".os-dock");
          await insideViewport(dock, page);
          const geometry = await dock.evaluate((element) => {
            const rect = (node: Element) => {
              const box = node.getBoundingClientRect();
              return { left: box.left, top: box.top, right: box.right,
                bottom: box.bottom, width: box.width, height: box.height };
            };
            const strip = element.querySelector(".os-dock-strip")!;
            return {
              radius: parseFloat(getComputedStyle(element).borderTopLeftRadius),
              dock: rect(element), strip: rect(strip),
              pins: [...strip.querySelectorAll(".os-dock-app")].map((pin) => {
                const label = pin.querySelector("span:last-child")!;
                return { app: pin.getAttribute("data-app"), box: rect(pin), label: rect(label),
                  text: label.textContent, labelClientWidth: label.clientWidth, labelScrollWidth: label.scrollWidth };
              }),
              tray: [...document.querySelectorAll(".os-top-actions > button, .os-language > summary")]
                .filter((control) => control.getBoundingClientRect().width > 0)
                .map(rect),
            };
          });
          const contained = (
            child: { left: number; top: number; right: number; bottom: number },
            parent: { left: number; top: number; right: number; bottom: number },
          ) => child.left >= parent.left - 1 && child.top >= parent.top - 1
            && child.right <= parent.right + 1 && child.bottom <= parent.bottom + 1;
          expect(geometry.radius).toBeGreaterThan(0);
          expect(geometry.pins).toHaveLength(5);
          for (const pin of geometry.pins) {
            expect(pin.box.width, `${locale} ${width}: ${pin.app}`).toBeGreaterThan(0);
            expect(contained(pin.box, geometry.strip), `${locale} ${width}: ${pin.app} pin`).toBe(true);
            expect(contained(pin.label, pin.box), `${locale} ${width}: ${pin.app} label`).toBe(true);
            expect(pin.text?.trim()).toBeTruthy();
            expect(pin.labelScrollWidth).toBeLessThanOrEqual(pin.labelClientWidth + 1);
          }
          for (const control of geometry.tray) {
            expect(contained(control, geometry.dock), `${locale} ${width}: tray control`).toBe(true);
            for (const pin of geometry.pins) {
              const intersects = control.left < pin.box.right - 1 && control.right > pin.box.left + 1
                && control.top < pin.box.bottom - 1 && control.bottom > pin.box.top + 1;
              expect(intersects, `${locale} ${width}: tray versus ${pin.app}`).toBe(false);
            }
          }
          for (let a = 0; a < geometry.tray.length; a += 1) {
            for (let b = a + 1; b < geometry.tray.length; b += 1) {
              const first = geometry.tray[a];
              const second = geometry.tray[b];
              expect(first.left < second.right - 1 && first.right > second.left + 1
                && first.top < second.bottom - 1 && first.bottom > second.top + 1,
              `${locale} ${width}: overlapping tray controls`).toBe(false);
            }
          }
          observations.push({ locale, width, height, hasTouch, ...geometry });
          if (width === 320 || width === 1440) {
            await capture(page, info, `taskbar-${locale}-${width}x${height}-${hasTouch ? "coarse" : "fine"}`);
          }
        }
      }
      await info.attach("taskbar-geometry", {
        body: JSON.stringify(observations, null, 2), contentType: "application/json",
      });
    });
  });
}

test.describe("short viewport entry", () => {
  // On short screens the taskbar sits in normal flow after the page. Revealing the pressed dock
  // pin must scroll only its strip, never the window, so a cold visit opens at the heading.
  for (const [width, height] of [[320, 568], [640, 360]] as const) {
    test.describe(`${width}x${height}`, () => {
      test.use({ hasTouch: true, viewport: { width, height } });

      for (const path of ["/projects", "/projects/project-simurgh"]) {
        test(`cold load of ${path} keeps the window at the top with the heading in view`, async ({ page }) => {
          await prepare(page, "light");
          await page.goto(path, { waitUntil: "networkidle" });
          await page.waitForTimeout(600);
          // /projects names its window with a screen-reader-only h1, so the visible top of the
          // page is the window title bar; it must be on screen and the window unscrolled.
          await expect(pane(page).locator("h1")).toBeAttached();
          expect(await page.evaluate(() => window.scrollY)).toBe(0);
          await expect(pane(page).locator(".os-window-title")).toBeInViewport();
        });
      }
    });
  }
});
