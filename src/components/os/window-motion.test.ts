import { describe, expect, it } from "vitest";
import {
  createFlipTransform,
  createUniformFlipOrigin,
} from "./window-geometry";

// Fixed inputs with exact results. Every value is plain arithmetic on literals, so the output is
// the same on every run. 800 / 1000 and 480 / 600 both round to the same double, 0.8, so the
// string assertions need no tolerance.
describe("uniform FLIP origin", () => {
  it("keeps the old box's position and the new box's aspect ratio", () => {
    const from = { x: 100, y: 50, width: 800, height: 400 };
    const to = { x: 12, y: 64, width: 1000, height: 600 };
    const origin = createUniformFlipOrigin(from, to);
    // The larger factor (0.8, from the width) is applied to both axes, so the scale is uniform.
    expect(origin).toEqual({ x: 100, y: 50, width: 800, height: 480 });
    expect(createFlipTransform(origin, to)).toBe(
      "translate(88px, -14px) scale(0.8, 0.8)",
    );
  });

  it("returns the old box unchanged when a rectangle is not usable", () => {
    const from = { x: 1, y: 2, width: 0, height: 10 };
    expect(
      createUniformFlipOrigin(from, { x: 0, y: 0, width: 10, height: 10 }),
    ).toBe(from);
  });
});
