import { describe, expect, it } from "vitest";
import {
  canFloatWindows,
  CASCADE_STEP,
  clampWindowRect,
  createCascadedWindowRect,
  createDefaultWindowRect,
  createFlipTransform,
  getWorkspaceBounds,
  moveWindowRect,
  resizeWindowRect,
  WINDOW_MIN_HEIGHT,
  WINDOW_MIN_WIDTH,
  type WindowRect,
  type WindowViewport,
} from "./window-geometry";

const desktop = { width: 1920, height: 1080 };
const initial = { x: 200, y: 180, width: 800, height: 400 };

function expectContained(rect: WindowRect, viewport: WindowViewport) {
  const bounds = getWorkspaceBounds(viewport);
  for (const value of Object.values(rect)) {
    expect(Number.isFinite(value)).toBe(true);
  }
  expect(rect.x).toBeGreaterThanOrEqual(bounds.left - 1e-8);
  expect(rect.y).toBeGreaterThanOrEqual(bounds.top - 1e-8);
  expect(rect.x + rect.width).toBeLessThanOrEqual(bounds.right + 1e-8);
  expect(rect.y + rect.height).toBeLessThanOrEqual(bounds.bottom + 1e-8);
  expect(rect.width).toBeGreaterThanOrEqual(
    Math.min(WINDOW_MIN_WIDTH, bounds.width),
  );
  expect(rect.height).toBeGreaterThanOrEqual(
    Math.min(WINDOW_MIN_HEIGHT, bounds.height),
  );
}

describe("window geometry", () => {
  it.each([
    [1024, 600, true],
    [1920, 1080, true],
    [1023, 600, false],
    [1024, 599, false],
    [768, 1024, false],
    [390, 844, false],
    [Infinity, 1080, false],
    [1920, NaN, false],
  ])(
    "uses a floating panel only at %s×%s when supported",
    (width, height, expected) => {
      expect(canFloatWindows({ width, height })).toBe(expected);
    },
  );

  it("reserves the header, taskbar and horizontal safety inset", () => {
    expect(getWorkspaceBounds(desktop)).toEqual({
      left: 12,
      top: 64,
      right: 1908,
      bottom: 960,
      width: 1896,
      height: 896,
    });
    expect(createDefaultWindowRect(desktop)).toEqual({
      x: 365,
      y: 152,
      width: 1190,
      height: 720,
    });
  });

  it("keeps every window above the taskbar at a short desktop", () => {
    const short = { width: 1024, height: 768 };
    const bounds = getWorkspaceBounds(short);
    expect(bounds.bottom).toBe(648);
    expect(bounds.bottom).toBeLessThanOrEqual(short.height - 44);
    const rect = clampWindowRect(
      { x: 500, y: 600, width: 900, height: 900 },
      short,
    );
    expect(rect.y + rect.height).toBeLessThanOrEqual(bounds.bottom);
  });

  it("cascades each window from the icon column edge without covering it", () => {
    const edge = 250;
    const first = createCascadedWindowRect(desktop, 0, edge);
    const second = createCascadedWindowRect(desktop, 1, edge);
    expect(first.x).toBeGreaterThanOrEqual(edge + 24);
    expect(second.x - first.x).toBe(CASCADE_STEP);
    expect(second.y - first.y).toBe(CASCADE_STEP);
    expectContained(second, desktop);
  });

  it("mirrors the first placement in RTL so it clears the icon column on the right", () => {
    const wide = { width: 1440, height: 900 };
    const ltr = createCascadedWindowRect(wide, 0, 240, "ltr");
    const rtl = createCascadedWindowRect(wide, 0, 240, "rtl");
    expect(rtl.x).toBe(wide.width - (ltr.x + ltr.width));
    expect(rtl.y).toBe(ltr.y);
    expect(rtl.width).toBe(ltr.width);
    expect(rtl.height).toBe(ltr.height);
    expect(rtl.x + rtl.width).toBeLessThanOrEqual(wide.width - (240 + 24));
    expectContained(rtl, wide);
  });

  it("keeps the default direction identical to an explicit LTR call", () => {
    const wide = { width: 1440, height: 900 };
    for (let placement = 0; placement < 8; placement++) {
      expect(createCascadedWindowRect(wide, placement, 240, "ltr")).toEqual(
        createCascadedWindowRect(wide, placement, 240),
      );
    }
  });

  it("steps RTL placements left and down, mirroring the LTR cascade", () => {
    // 1920x1080 leaves room for the full vertical step, as the LTR cascade test does.
    const roomy = { width: 1920, height: 1080 };
    const first = createCascadedWindowRect(roomy, 0, 250, "rtl");
    const second = createCascadedWindowRect(roomy, 1, 250, "rtl");
    expect(first.x - second.x).toBe(CASCADE_STEP);
    expect(second.y - first.y).toBe(CASCADE_STEP);
    expectContained(second, roomy);
  });

  it("keeps every RTL placement contained and clear of the icon column", () => {
    const wide = { width: 1440, height: 900 };
    for (let placement = 0; placement < 12; placement++) {
      const rect = createCascadedWindowRect(wide, placement, 240, "rtl");
      expectContained(rect, wide);
      expect(rect.x + rect.width).toBeLessThanOrEqual(wide.width - (240 + 24));
    }
  });

  it("caps the first placement so a 1024 desktop keeps clear of the icons", () => {
    const narrow = { width: 1024, height: 768 };
    const rect = createCascadedWindowRect(narrow, 0, 250);
    expect(rect.x).toBeGreaterThanOrEqual(274);
    expect(rect.x + rect.width).toBeLessThanOrEqual(1012);
    expect(rect.width).toBeGreaterThanOrEqual(WINDOW_MIN_WIDTH);
    expectContained(rect, narrow);
  });

  it("builds a FLIP transform from the old box and nothing when it is unchanged", () => {
    expect(
      createFlipTransform(
        { x: 100, y: 50, width: 800, height: 400 },
        { x: 12, y: 64, width: 1000, height: 600 },
      ),
    ).toBe(`translate(88px, -14px) scale(0.8, ${400 / 600})`);
    expect(createFlipTransform(initial, { ...initial })).toBeNull();
    expect(createFlipTransform(initial, { ...initial, width: 0 })).toBeNull();
  });

  it("clamps a previously large panel after shrinking the viewport", () => {
    const viewport = { width: 1024, height: 600 };
    expect(
      clampWindowRect({ x: 1400, y: 900, width: 1190, height: 720 }, viewport),
    ).toEqual({ x: 12, y: 64, width: 1000, height: 416 });
  });

  it("keeps dragging away from both chrome edges", () => {
    expect(
      moveWindowRect(initial, { x: -10_000, y: -10_000 }, desktop),
    ).toEqual({
      ...initial,
      x: 12,
      y: 64,
    });
    expect(moveWindowRect(initial, { x: 10_000, y: 10_000 }, desktop)).toEqual({
      ...initial,
      x: 1108,
      y: 560,
    });
  });

  it("keeps physical drag directions unchanged for every document direction", () => {
    const physicalMove = { ...initial, x: 225, y: 170 };
    for (const direction of ["ltr", "rtl"]) {
      // Direction affects chrome layout, not the meaning of a physical pointer delta.
      const viewport = { ...desktop, direction };
      expect(moveWindowRect(initial, { x: 25, y: -10 }, viewport)).toEqual(
        physicalMove,
      );
    }
  });

  it("resizes without moving the top-left corner or crossing the dock", () => {
    expect(
      resizeWindowRect(initial, { x: 10_000, y: 10_000 }, desktop),
    ).toEqual({
      x: 200,
      y: 180,
      width: 1708,
      height: 780,
    });
    expect(
      resizeWindowRect(initial, { x: -10_000, y: -10_000 }, desktop),
    ).toEqual({
      x: 200,
      y: 180,
      width: 320,
      height: 240,
    });
  });

  it("retains a narrow reading pane through movement and viewport changes", () => {
    const narrow = resizeWindowRect(initial, { x: -480, y: 0 }, desktop);
    expect(narrow).toEqual({ ...initial, width: 320 });
    const moved = moveWindowRect(narrow, { x: 1400, y: 20 }, desktop);
    expect(moved.width).toBe(320);
    expectContained(moved, desktop);
    const smallerDesktop = { width: 1024, height: 768 };
    const reclamped = clampWindowRect(moved, smallerDesktop);
    expect(reclamped.width).toBe(320);
    expectContained(reclamped, smallerDesktop);
  });

  it("uses centered bounded defaults for non-finite stored coordinates", () => {
    expect(
      clampWindowRect(
        { x: NaN, y: Infinity, width: NaN, height: -Infinity },
        desktop,
      ),
    ).toEqual(createDefaultWindowRect(desktop));
    expect(moveWindowRect(initial, { x: NaN, y: Infinity }, desktop)).toEqual(
      initial,
    );
    expect(
      resizeWindowRect(initial, { x: -Infinity, y: NaN }, desktop),
    ).toEqual(initial);
  });

  it("saturates extremely large finite gesture deltas", () => {
    expect(
      moveWindowRect(
        initial,
        { x: Number.MAX_VALUE, y: Number.MAX_VALUE },
        desktop,
      ),
    ).toEqual({ ...initial, x: 1108, y: 560 });
    expectContained(
      resizeWindowRect(
        initial,
        { x: Number.MAX_VALUE, y: Number.MAX_VALUE },
        desktop,
      ),
      desktop,
    );
  });

  it("does not mutate input rectangles, deltas or viewports", () => {
    const rect = Object.freeze({ ...initial });
    const delta = Object.freeze({ x: 10, y: 20 });
    const viewport = Object.freeze({ ...desktop });
    expect(() => {
      clampWindowRect(rect, viewport);
      moveWindowRect(rect, delta, viewport);
      resizeWindowRect(rect, delta, viewport);
    }).not.toThrow();
    expect(rect).toEqual(initial);
  });

  it.each([
    [1920, 1080],
    [1440, 900],
    [1280, 800],
    [1024, 768],
    [768, 1024],
    [430, 932],
    [390, 844],
    [320, 700],
    [20, 120],
    [0, 0],
    [-200, -300],
    [NaN, Infinity],
    [Infinity, 600],
    [1024.5, 600.25],
  ])(
    "keeps defaults and extreme rectangles contained at %s×%s",
    (width, height) => {
      const viewport = { width, height };
      const extreme = { x: -50_000, y: 50_000, width: -500, height: 50_000 };
      expectContained(createDefaultWindowRect(viewport), viewport);
      expectContained(clampWindowRect(extreme, viewport), viewport);
      expectContained(
        moveWindowRect(extreme, { x: 50_000, y: -50_000 }, viewport),
        viewport,
      );
      expectContained(
        resizeWindowRect(extreme, { x: 50_000, y: -50_000 }, viewport),
        viewport,
      );
    },
  );

  it("preserves containment and idempotence through varied move/resize sequences", () => {
    let seed = 20261011;
    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 2 ** 32;
    };
    let rect = initial;
    for (let step = 0; step < 250; step++) {
      const viewport = {
        width: 1024 + random() * 1400,
        height: 600 + random() * 900,
      };
      const delta = { x: (random() - 0.5) * 4000, y: (random() - 0.5) * 4000 };
      rect =
        step % 2
          ? moveWindowRect(rect, delta, viewport)
          : resizeWindowRect(rect, delta, viewport);
      expectContained(rect, viewport);
      expect(clampWindowRect(rect, viewport)).toEqual(rect);
    }
  });
});
