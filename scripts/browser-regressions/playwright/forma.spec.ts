import { test, expect } from "@playwright/test";

test("FORMA thumbnail is centred and sized like the other project previews", async ({
  page,
}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/projects");
    await page.locator('input[type="search"][id^="_r_"]').waitFor({ state: "attached" });
    const dimensions = [];
    for (const slug of ["forma", "syllabus-sync"]) {
      const frame = page.locator(`[data-project-art="${slug}"]`);
      await frame.scrollIntoViewIfNeeded();
      const svg = frame.locator("svg").first();
      await svg.waitFor();
      const box = await frame.boundingBox();
      const art = await svg.boundingBox();
      expect(box).not.toBeNull();
      expect(art).not.toBeNull();
      expect(Math.abs(art!.x + art!.width / 2 - (box!.x + box!.width / 2))).toBeLessThan(1);
      expect(Math.abs(art!.y + art!.height / 2 - (box!.y + box!.height / 2))).toBeLessThan(1);
      expect(art!.height).toBeLessThan(box!.height);
      dimensions.push(art!.height);
    }
    expect(Math.abs(dimensions[0] - dimensions[1])).toBeLessThan(1);
  }
});

test("FORMA preserves its animation phase when paused and respects reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/projects/forma");
  await page
    .locator('input[type="search"][id^="_r_"]')
    .waitFor({ state: "attached" });
  await page.locator(".os-project-motion").scrollIntoViewIfNeeded();
  const artwork = page.locator(".forma-artwork");
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
    .toBe(3);
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

test("FORMA is reachable through global search and uses the shared dossier controls", async ({
  page,
}) => {
  await page.goto("/projects");
  await page
    .locator('input[type="search"][id^="_r_"]')
    .waitFor({ state: "attached" });
  await page.keyboard.press("Control+k");
  await page.locator("#os-search-input").fill("fOrMa");
  const result = page.locator("#os-search-results a").first();
  await expect(result).toHaveAttribute("href", "/projects/forma");
  await result.click();
  await expect(page).toHaveURL(/\/projects\/forma$/);
  await expect(page.locator(".os-project-dossier h1")).toHaveText("FORMA");
  await expect(page.locator(".os-project-resources a")).toHaveCount(1);
  await expect(page.locator(".os-project-resources a")).toHaveAttribute(
    "href",
    "https://forma.raoufabedini.dev",
  );
  await expect(page.locator('.os-project-tablist [role="tab"]')).toHaveCount(3);
});

test("shared dossier section links preserve fragment history and focus", async ({
  page,
}) => {
  await page.goto("/projects/project-simurgh");
  await page
    .locator('input[type="search"][id^="_r_"]')
    .waitFor({ state: "attached" });
  await page
    .getByRole("link", { name: "Scope and limitations", exact: true })
    .click();
  const limits = page.getByRole("heading", {
    name: "Scope and limitations",
    exact: true,
  });
  await expect(limits).toBeFocused();
  const limitUrl = page.url();
  await page
    .getByRole("link", { name: "Read the HTML research summary", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Problem", exact: true }),
  ).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL(limitUrl);
  await expect(limits).toBeVisible();
  await expect(limits).toBeFocused();
});
