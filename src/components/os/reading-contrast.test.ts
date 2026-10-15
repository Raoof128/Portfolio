import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

type RGB = readonly [number, number, number];

const stylesheet = readFileSync(
  resolve(process.cwd(), "src/components/os/research-os.css"),
  "utf8",
);

function variables(
  selector: string,
  source = stylesheet,
): Record<string, string> {
  const start = source.indexOf(`${selector} {`);
  if (start < 0) throw new Error(`Missing appearance: ${selector}`);
  const block = source.slice(start, source.indexOf("}", start));
  return Object.fromEntries(
    [...block.matchAll(/(--os-[\w-]+):\s*([^;]+);/g)].map((match) => [
      match[1],
      match[2].trim(),
    ]),
  );
}

function color(tokens: Record<string, string>, role: string): RGB {
  let value = tokens[role];
  const visited = new Set<string>();
  while (value?.startsWith("var(")) {
    if (visited.has(value)) throw new Error(`Circular color role: ${role}`);
    visited.add(value);
    value = tokens[value.slice(4, -1)];
  }
  if (!value || !/^#[\da-f]{6}$/i.test(value)) {
    throw new Error(`Reading role must resolve to an opaque color: ${role}`);
  }
  const channel = (offset: number) =>
    parseInt(value.slice(offset, offset + 2), 16);
  return [channel(1), channel(3), channel(5)];
}

function luminance(rgb: RGB): number {
  const channels = rgb.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(foreground: RGB, background: RGB): number {
  const [lower, higher] = [luminance(foreground), luminance(background)].sort(
    (a, b) => a - b,
  );
  return (higher + 0.05) / (lower + 0.05);
}

function mutedBadgeSurface(
  tokens: Record<string, string>,
  surface: string,
): RGB {
  const tint = tokens["--os-line"];
  if (!/^#[\da-f]{8}$/i.test(tint)) {
    throw new Error("Muted badge tint must include its alpha channel");
  }
  const alpha = parseInt(tint.slice(7, 9), 16) / 255;
  const foreground = color({ "--tint": tint.slice(0, 7) }, "--tint");
  const background = color(tokens, surface);
  const channel = (index: number) =>
    foreground[index] * alpha + background[index] * (1 - alpha);
  return [channel(0), channel(1), channel(2)];
}

const dark = variables(".os-shell");
const light = {
  ...dark,
  ...variables('.os-shell[data-appearance="light"]'),
};
const welcomeSelector = '.os-shell[data-appearance="light"] .os-welcome';
const lightWelcome = {
  ...light,
  ...(stylesheet.includes(`${welcomeSelector} {`)
    ? variables(welcomeSelector)
    : {}),
};

describe("opaque reading contrast", () => {
  it.each([
    ["dark", dark],
    ["light", light],
  ] as const)(
    "keeps small prose and status labels readable in %s",
    (_, tokens) => {
      // --os-success, --os-warning and --os-resume-accent are retired by the
      // Apple 2026 spec (status is text plus accent or muted), so they are no longer checked.
      for (const foreground of ["--os-text", "--os-muted", "--os-accent"]) {
        for (const background of ["--os-bg", "--os-surface"]) {
          expect(
            contrast(color(tokens, foreground), color(tokens, background)),
            `${foreground} on ${background}`,
          ).toBeGreaterThanOrEqual(4.5);
        }
      }
    },
  );

  it.each([
    ["dark", dark],
    ["light", light],
  ] as const)("keeps original code readable in %s", (_, tokens) => {
    expect(
      contrast(
        color(tokens, "--os-code-text"),
        color(tokens, "--os-code-surface"),
      ),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it.each([
    ["dark", dark],
    ["light", light],
  ] as const)(
    "keeps neutral status readable on its tinted badge in %s",
    (_, tokens) => {
      for (const background of ["--os-bg", "--os-surface"]) {
        expect(
          contrast(
            color(tokens, "--os-text"),
            mutedBadgeSurface(tokens, background),
          ),
        ).toBeGreaterThanOrEqual(4.5);
      }
    },
  );
});

describe("welcome wallpaper contrast", () => {
  // Native Spanish 320×700 samples are adjacent orbit pixels outside the text
  // ranges. They reproduce the reported boundary, not every wallpaper position.
  it.each([
    ["introduction", [216, 222, 237]],
    ["project shortcut", [222, 224, 232]],
    ["caption", [224, 224, 228]],
  ] as const)("keeps %s readable over its orbit stroke", (_, background) => {
    const previousForeground: RGB = [83, 103, 129];
    expect(contrast(previousForeground, background)).toBeLessThan(4.5);
    expect(
      contrast(color(lightWelcome, "--os-muted"), background),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it("retains stronger label contrast when requested", () => {
    const moreContrastStyle = stylesheet.slice(
      stylesheet.indexOf("@media (prefers-contrast: more)"),
    );
    const moreContrastWelcome = {
      ...lightWelcome,
      ...variables(welcomeSelector, moreContrastStyle),
    };
    for (const background of [
      [216, 222, 237],
      [222, 224, 232],
      [224, 224, 228],
    ] as const) {
      expect(
        contrast(color(moreContrastWelcome, "--os-muted"), background),
      ).toBeGreaterThanOrEqual(
        contrast(color(lightWelcome, "--os-muted"), background),
      );
    }
  });
});

describe("control contrast", () => {
  // Apple 2026 review: control boundaries, focus rings and button labels on
  // the supporting pages must keep WCAG 1.4.11 and 1.4.3 minimums in both themes.
  it.each([
    ["dark", dark],
    ["light", light],
  ] as const)(
    "keeps control boundaries, focus and button labels in %s",
    (_, tokens) => {
      expect(
        contrast(
          color(tokens, "--os-control-line"),
          color(tokens, "--os-surface"),
        ),
      ).toBeGreaterThanOrEqual(3);
      expect(
        contrast(color(tokens, "--os-focus"), color(tokens, "--os-surface")),
      ).toBeGreaterThanOrEqual(3);
      expect(
        contrast(color(tokens, "--os-on-accent"), color(tokens, "--os-accent")),
      ).toBeGreaterThanOrEqual(4.5);
    },
  );
});
