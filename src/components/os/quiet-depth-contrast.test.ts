import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Apple 2026 v1.1 contrast guard (design system, section 8.6). The tests read the
// token values from research-os.css and liquid-glass.css as text, then check every
// token pair against its WCAG 2.2 floor: text 4.5:1, non-text 3:1. Any alpha or token
// change reruns this table. The two guards at the end pin pairs that must stay out.

type RGB = readonly [number, number, number];
type Rgba = {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
};
type Tokens = Readonly<Record<string, string>>;

const BLACK: RGB = [0, 0, 0];

const researchOs = readFileSync(
  resolve(process.cwd(), "src/components/os/research-os.css"),
  "utf8",
);
const liquidGlass = readFileSync(
  resolve(process.cwd(), "src/components/os/liquid-glass.css"),
  "utf8",
);

// The body of the first rule that opens with `${selector} {`, read to its closing brace.
function block(source: string, selector: string): string {
  const start = source.indexOf(`${selector} {`);
  if (start < 0) throw new Error(`Missing block: ${selector}`);
  return source.slice(start + selector.length + 2, source.indexOf("}", start));
}

function tokensOf(body: string): Tokens {
  return Object.fromEntries(
    [...body.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((match) => [
      match[1],
      match[2].trim(),
    ]),
  );
}

function parseColour(value: string): Rgba {
  const hex = value.match(/^#([\da-f]{6})([\da-f]{2})?$/i);
  if (hex) {
    const digits = hex[1];
    return {
      r: parseInt(digits.slice(0, 2), 16),
      g: parseInt(digits.slice(2, 4), 16),
      b: parseInt(digits.slice(4, 6), 16),
      a: hex[2] ? parseInt(hex[2], 16) / 255 : 1,
    };
  }
  const rgb = value.match(
    /^rgba?\(\s*(\d+)\s+(\d+)\s+(\d+)\s*(?:\/\s*([\d.]+)(%?)\s*)?\)$/,
  );
  if (rgb) {
    const alpha =
      rgb[4] === undefined ? 1 : Number(rgb[4]) / (rgb[5] ? 100 : 1);
    return {
      r: Number(rgb[1]),
      g: Number(rgb[2]),
      b: Number(rgb[3]),
      a: alpha,
    };
  }
  throw new Error(`Unsupported colour value: ${value}`);
}

function colourOf(tokens: Tokens, name: string): Rgba {
  let value = tokens[name];
  const visited = new Set<string>();
  while (value?.startsWith("var(")) {
    const next = value.slice(4, -1);
    if (visited.has(next)) throw new Error(`Circular token: ${name}`);
    visited.add(next);
    value = tokens[next];
  }
  if (!value) throw new Error(`Missing token: ${name}`);
  return parseColour(value);
}

// Composites a translucent colour over an opaque backdrop.
function flatten(top: Rgba, backdrop: RGB): RGB {
  const mix = (channel: number, under: number) =>
    channel * top.a + under * (1 - top.a);
  return [
    mix(top.r, backdrop[0]),
    mix(top.g, backdrop[1]),
    mix(top.b, backdrop[2]),
  ];
}

// An opaque token, or a translucent one flattened over the given backdrop.
function rgbOf(tokens: Tokens, name: string, backdrop: RGB = BLACK): RGB {
  return flatten(colourOf(tokens, name), backdrop);
}

// A translucent tint (such as the accent tint) laid over an opaque surface token.
function tintOver(tokens: Tokens, tint: string, surface: string): RGB {
  return flatten(colourOf(tokens, tint), rgbOf(tokens, surface));
}

function luminance([r, g, b]: RGB): number {
  const [red, green, blue] = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

function ratio(foreground: RGB, background: RGB): number {
  const [lower, higher] = [luminance(foreground), luminance(background)].sort(
    (a, b) => a - b,
  );
  return (higher + 0.05) / (lower + 0.05);
}

// Dark: the default shell block, then the increased-contrast overrides.
const dark = tokensOf(block(researchOs, ".os-shell"));
const light: Tokens = {
  ...dark,
  ...tokensOf(block(researchOs, '.os-shell[data-appearance="light"]')),
};

const moreContrast = researchOs.slice(
  researchOs.indexOf("@media (prefers-contrast: more)"),
);
const moreDark: Tokens = {
  ...dark,
  ...tokensOf(block(moreContrast, '.os-shell:not([data-appearance="light"])')),
};
const moreLight: Tokens = {
  ...light,
  ...tokensOf(block(moreContrast, '.os-shell[data-appearance="light"]')),
};

const glassDark = tokensOf(block(liquidGlass, ".os-shell"));
const glassLight: Tokens = {
  ...glassDark,
  ...tokensOf(block(liquidGlass, '.os-shell[data-appearance="light"]')),
};

const DARK_TIERS = ["--os-bg", "--os-surface", "--os-elevated", "--os-inset"];
const LIGHT_TIERS = ["--os-bg", "--os-surface", "--os-inset"];

describe("quiet depth text contrast (4.5:1)", () => {
  it("keeps dark text and muted text readable on every tier", () => {
    for (const tier of DARK_TIERS) {
      const background = rgbOf(dark, tier);
      expect(
        ratio(rgbOf(dark, "--os-text"), background),
        `--os-text on ${tier}`,
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        ratio(rgbOf(dark, "--os-muted"), background),
        `--os-muted on ${tier}`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("keeps light text and muted text readable on background, white and inset", () => {
    for (const tier of LIGHT_TIERS) {
      const background = rgbOf(light, tier);
      expect(
        ratio(rgbOf(light, "--os-text"), background),
        `--os-text on ${tier}`,
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        ratio(rgbOf(light, "--os-muted"), background),
        `--os-muted on ${tier}`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("keeps the accent readable on its 14% tint in dark on every tier", () => {
    for (const tier of DARK_TIERS) {
      expect(
        ratio(
          rgbOf(dark, "--os-accent"),
          tintOver(dark, "--os-accent-tint", tier),
        ),
        `accent on tint over ${tier}`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("keeps the accent readable on its 10% tint in light, over background and white", () => {
    // The tightest light margins: 4.54 over background and 4.86 over white.
    for (const tier of ["--os-bg", "--os-surface"]) {
      expect(
        ratio(
          rgbOf(light, "--os-accent"),
          tintOver(light, "--os-accent-tint", tier),
        ),
        `accent on tint over ${tier}`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("keeps on-accent labels readable on the accent in both themes", () => {
    expect(
      ratio(rgbOf(dark, "--os-on-accent"), rgbOf(dark, "--os-accent")),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      ratio(rgbOf(light, "--os-on-accent"), rgbOf(light, "--os-accent")),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps text readable on dense glass over the artwork it covers", () => {
    const denseDark = colourOf(glassDark, "--os-glass-dense");
    const denseLight = colourOf(glassLight, "--os-glass-dense");
    // Dark dense glass over white artwork, and over the flat base.
    expect(
      ratio(rgbOf(dark, "--os-text"), flatten(denseDark, [255, 255, 255])),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      ratio(rgbOf(dark, "--os-muted"), flatten(denseDark, [255, 255, 255])),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      ratio(
        rgbOf(dark, "--os-text"),
        flatten(denseDark, rgbOf(dark, "--os-bg")),
      ),
    ).toBeGreaterThanOrEqual(4.5);
    // Light dense glass over black artwork.
    expect(
      ratio(rgbOf(light, "--os-text"), flatten(denseLight, BLACK)),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      ratio(rgbOf(light, "--os-muted"), flatten(denseLight, BLACK)),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps increased-contrast text and muted text at the floor", () => {
    for (const tier of DARK_TIERS) {
      expect(
        ratio(rgbOf(moreDark, "--os-muted"), rgbOf(moreDark, tier)),
        `increased muted on ${tier}`,
      ).toBeGreaterThanOrEqual(4.5);
    }
    for (const tier of LIGHT_TIERS) {
      expect(
        ratio(rgbOf(moreLight, "--os-muted"), rgbOf(moreLight, tier)),
        `increased light muted on ${tier}`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("keeps the increased-contrast accent readable as text and on its tint", () => {
    for (const tier of DARK_TIERS) {
      expect(
        ratio(rgbOf(moreDark, "--os-accent"), rgbOf(moreDark, tier)),
        `increased accent on ${tier}`,
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        ratio(
          rgbOf(moreDark, "--os-accent"),
          tintOver(moreDark, "--os-accent-tint", tier),
        ),
        `increased accent on tint over ${tier}`,
      ).toBeGreaterThanOrEqual(4.5);
    }
    for (const tier of ["--os-bg", "--os-surface", "--os-inset"]) {
      expect(
        ratio(rgbOf(moreLight, "--os-accent"), rgbOf(moreLight, tier)),
        `increased light accent on ${tier}`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe("control, focus and indicator contrast (3:1 non-text)", () => {
  it("keeps the dark control line visible on the base and surface tiers", () => {
    for (const tier of ["--os-bg", "--os-surface"]) {
      expect(
        ratio(rgbOf(dark, "--os-control-line"), rgbOf(dark, tier)),
        `dark control line on ${tier}`,
      ).toBeGreaterThanOrEqual(3);
    }
  });

  it("keeps the inset control line visible on surface, elevated and inset tiers", () => {
    for (const tier of ["--os-surface", "--os-elevated", "--os-inset"]) {
      expect(
        ratio(rgbOf(dark, "--os-control-line-inset"), rgbOf(dark, tier)),
        `dark inset control line on ${tier}`,
      ).toBeGreaterThanOrEqual(3);
    }
  });

  it("keeps the light control line visible on background, white and inset", () => {
    for (const tier of LIGHT_TIERS) {
      expect(
        ratio(rgbOf(light, "--os-control-line"), rgbOf(light, tier)),
        `light control line on ${tier}`,
      ).toBeGreaterThanOrEqual(3);
      expect(
        ratio(rgbOf(light, "--os-control-line-inset"), rgbOf(light, tier)),
        `light inset control line on ${tier}`,
      ).toBeGreaterThanOrEqual(3);
    }
  });

  it("keeps the increased-contrast control lines visible on every tier", () => {
    for (const tier of DARK_TIERS) {
      expect(
        ratio(
          rgbOf(moreDark, "--os-control-line-inset"),
          rgbOf(moreDark, tier),
        ),
        `increased dark control line on ${tier}`,
      ).toBeGreaterThanOrEqual(3);
    }
    for (const tier of LIGHT_TIERS) {
      expect(
        ratio(
          rgbOf(moreLight, "--os-control-line-inset"),
          rgbOf(moreLight, tier),
        ),
        `increased light control line on ${tier}`,
      ).toBeGreaterThanOrEqual(3);
    }
  });

  it("keeps the focus ring visible on the page and surface in both themes", () => {
    for (const tier of ["--os-bg", "--os-surface"]) {
      expect(
        ratio(rgbOf(dark, "--os-focus"), rgbOf(dark, tier)),
        `dark focus on ${tier}`,
      ).toBeGreaterThanOrEqual(3);
      expect(
        ratio(rgbOf(light, "--os-focus"), rgbOf(light, tier)),
        `light focus on ${tier}`,
      ).toBeGreaterThanOrEqual(3);
    }
  });

  it("keeps the accent indicator visible on the thin dock glass", () => {
    // The dock holds glyphs only, so its accent is a non-text indicator.
    const thinDark = flatten(colourOf(glassDark, "--os-glass"), BLACK);
    const thinLight = flatten(colourOf(glassLight, "--os-glass"), BLACK);
    expect(ratio(rgbOf(dark, "--os-accent"), thinDark)).toBeGreaterThanOrEqual(
      3,
    );
    expect(
      ratio(rgbOf(light, "--os-accent"), thinLight),
    ).toBeGreaterThanOrEqual(3);
  });
});

describe("pairs that must stay out of the design", () => {
  // Guard: light accent text on the tinted inset row measures 4.31, below the 4.5 text
  // floor. Such rows use the text colour, and the accent stays on the indicator.
  it("does not allow light accent text on the tinted inset row", () => {
    const ratioOnInset = ratio(
      [0, 105, 187],
      tintOver(light, "--os-accent-tint", "--os-inset"),
    );
    expect(ratioOnInset).toBeLessThan(4.5);
  });

  // Guard: #5b7593 measures 2.94 on inset, below the 3:1 floor, so inset rows use the
  // inset control line. On elevated it measures 3.26: that clears 3:1 but only by a thin
  // margin, so the dark control line is not used there as the sole boundary either.
  it("does not allow the dark control line on the inset tier, and keeps elevated margin thin", () => {
    const controlLine: RGB = [0x5b, 0x75, 0x93];
    expect(
      ratio(controlLine, rgbOf(dark, "--os-inset")),
      "dark control line on inset",
    ).toBeLessThan(3);
    expect(
      ratio(controlLine, rgbOf(dark, "--os-elevated")),
      "dark control line on elevated",
    ).toBeLessThan(3.5);
  });
});
