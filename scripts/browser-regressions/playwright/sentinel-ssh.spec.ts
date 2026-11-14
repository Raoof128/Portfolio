import { test, expect } from "@playwright/test";

test("SentinelSSH thumbnail is centred and sized like the other project previews", async ({
  page,
}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/projects");
    await page
      .locator('input[type="search"][id^="_r_"]')
      .waitFor({ state: "attached" });
    const dimensions = [];
    for (const slug of ["sentinel-ssh", "syllabus-sync"]) {
      const frame = page.locator(`[data-project-art="${slug}"]`);
      await frame.scrollIntoViewIfNeeded();
      const svg = frame.locator("svg").first();
      await svg.waitFor();
      const box = await frame.boundingBox();
      const art = await svg.boundingBox();
      expect(box).not.toBeNull();
      expect(art).not.toBeNull();
      expect(
        Math.abs(art!.x + art!.width / 2 - (box!.x + box!.width / 2)),
      ).toBeLessThan(1);
      expect(
        Math.abs(art!.y + art!.height / 2 - (box!.y + box!.height / 2)),
      ).toBeLessThan(1);
      expect(art!.height).toBeLessThan(box!.height);
      dimensions.push(art!.height);
    }
    expect(Math.abs(dimensions[0] - dimensions[1])).toBeLessThan(1);
  }
});

test("SentinelSSH preserves its animation phase when paused and respects reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/projects/sentinel-ssh");
  await page
    .locator('input[type="search"][id^="_r_"]')
    .waitFor({ state: "attached" });
  await page.locator(".os-project-motion").scrollIntoViewIfNeeded();
  const artwork = page.locator(".sentinel-artwork");
  await artwork.waitFor();
  const animationState = () =>
    artwork.evaluate(async (element) => {
      const animations = element.getAnimations({ subtree: true });
      // Firefox reports playState before the pending pause reaches the timeline.
      await Promise.all(animations.map((animation) => animation.ready));
      return animations.map((animation) => ({
        time: Number(animation.currentTime),
        state: animation.playState,
      }));
    });
  await expect
    .poll(
      async () =>
        (await animationState()).filter((a) => a.state === "running").length,
    )
    .toBe(8);
  await page
    .getByRole("button", { name: "Pause Animation", exact: true })
    .click();
  await expect
    .poll(async () =>
      (await animationState()).every((a) => a.state === "paused"),
    )
    .toBe(true);
  const paused = await animationState();
  // Sampling a later frame catches animations that merely hide or restart on pause.
  await page.waitForTimeout(200);
  expect(await animationState()).toEqual(paused);
  await page
    .getByRole("button", { name: "Play Animation", exact: true })
    .click();
  await expect
    .poll(async () =>
      (await animationState()).every((a, i) => a.time > paused[i].time),
    )
    .toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(async () => (await animationState()).length).toBe(0);
  await expect(page.locator(".os-motion-preference")).toHaveText("Still");
});

test("SentinelSSH follows Zurvan and opens its localized dossier", async ({
  page,
}) => {
  for (const locale of ["en", "fa", "ar", "es", "zh"]) {
    const prefix = locale === "en" ? "" : `/${locale}`;
    await page.goto(`${prefix}/projects`);
    await page
      .locator('input[type="search"][id^="_r_"]')
      .waitFor({ state: "attached" });
    const slugs = await page
      .locator("[data-project-art]")
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute("data-project-art")),
      );
    expect(
      slugs.slice(
        slugs.indexOf("project-zurvan") + 1,
        slugs.indexOf("project-zurvan") + 3,
      ),
    ).toEqual(["sentinel-ssh", "forma"]);
    await page.keyboard.press("Control+k");
    await page.locator("#os-search-input").fill("SentinelSSH");
    const result = page.locator("#os-search-results a").first();
    await expect(result).toHaveAttribute(
      "href",
      `${prefix}/projects/sentinel-ssh`,
    );
    await result.click();
    await expect(page.locator(".os-project-dossier h1")).toHaveText(
      "SentinelSSH",
    );
    await expect(page.locator(".os-project-resources a")).toHaveAttribute(
      "href",
      "https://github.com/Raoof128/sentinel-ssh",
    );
    await page.locator(".os-project-motion").scrollIntoViewIfNeeded();
    await expect(page.locator(".sentinel-artwork svg")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
