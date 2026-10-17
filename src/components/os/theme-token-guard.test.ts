import { readdirSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Token guard for the OS theme (audit finding TC-06). win7-theme.css is the one place that
// defines a colour role. Every other sheet must read colour through a token, so a raw
// colour literal (#hex, rgb(), hsl()) is a regression.
//
// Two checks:
// 1. `color:` declarations. Sheets owned by lanes that have not yet cleared their literals
//    are listed with their exact current count. The count must match, so clearing a literal
//    means lowering the number in the same change; a lane drops its entry at zero. Every
//    other sheet must have no `color:` literal at all.
// 2. Every colour-bearing property (background, border, outline, shadow, fill, stroke, any
//    `*color`). Sheets in tokenOnlySheets have none. Custom-property definitions are not
//    checked: the per-appearance palettes still live in research-os.css until TC-06 is done.

const root = process.cwd();
const osDir = resolve(root, "src/components/os");
const themeSheet = "win7-theme.css";

const legacyRawColour: Readonly<Record<string, number>> = {
  "evidence-story-invisible.css": 3,
  "terminal.css": 4,
  "theme-switch.css": 7,
  "welcome-enter.css": 1,
  "win7-desktop.css": 11,
  "win7-logon.css": 8,
  "win7-pages.css": 4,
  "win7-taskbar.css": 26,
  "win7-windows.css": 3,
};

const tokenOnlySheets = [
  "controls.css",
  "globals.css",
  "liquid-glass.css",
  "win7-polish.css",
];

const rawColour = /(^|[^-\w])color\s*:\s*(#[\da-f]{3,8}\b|rgba?\(|hsla?\()/gi;
const rawLiteral = /#[\da-f]{3,8}\b|rgba?\(|hsla?\(/i;
const colourProperty =
  /color$|^(background|border|outline|box-shadow|text-shadow|fill|stroke)/i;

function sheets(): { name: string; path: string }[] {
  const osSheets = readdirSync(osDir)
    .filter((file) => file.endsWith(".css"))
    .map((file) => ({ name: file, path: join(osDir, file) }));
  const globals = resolve(root, "src/app/globals.css");
  return [...osSheets, { name: basename(globals), path: globals }];
}

function rawColourCount(path: string): number {
  const css = readFileSync(path, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  return [...css.matchAll(rawColour)].length;
}

function rawColourDeclarationCount(path: string): number {
  const css = readFileSync(path, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  let count = 0;
  for (const [, , property, value] of css.matchAll(
    /(^|[;{\s])([a-z-]+)\s*:\s*([^;{}]+)/gi,
  )) {
    if (property.startsWith("--")) continue;
    if (colourProperty.test(property) && rawLiteral.test(value)) count += 1;
  }
  return count;
}

describe("theme token guard", () => {
  it("keeps raw colour literals out of every sheet except win7-theme.css", () => {
    const offenders = sheets()
      .filter((sheet) => sheet.name !== themeSheet)
      .map((sheet) => ({
        name: sheet.name,
        count: rawColourCount(sheet.path),
        allowed: legacyRawColour[sheet.name] ?? 0,
      }))
      .filter((sheet) => sheet.count > sheet.allowed);
    expect(offenders).toEqual([]);
  });

  it("keeps the legacy list exact, so a cleared or renamed sheet leaves it", () => {
    const sheetList = new Map(
      sheets().map((sheet) => [sheet.name, sheet.path]),
    );
    for (const [name, allowed] of Object.entries(legacyRawColour)) {
      const path = sheetList.get(name);
      expect(path, `${name} is not a sheet`).toBeDefined();
      expect(rawColourCount(path!), `update the count for ${name}`).toBe(
        allowed,
      );
    }
  });

  it("keeps every colour property token-only in the cleared sheets", () => {
    const sheetList = new Map(
      sheets().map((sheet) => [sheet.name, sheet.path]),
    );
    for (const name of tokenOnlySheets) {
      const path = sheetList.get(name);
      expect(path, `${name} is not a sheet`).toBeDefined();
      expect(
        rawColourDeclarationCount(path!),
        `${name} has a raw colour literal in a colour property`,
      ).toBe(0);
    }
  });

  it("defines the shared radius scale and keylines once, in win7-theme.css", () => {
    const theme = readFileSync(join(osDir, themeSheet), "utf8");
    expect(theme).toMatch(/--win7-radius-control:\s*3px;/);
    expect(theme).toMatch(/--win7-radius:\s*6px;/);
    expect(theme).toMatch(/--win7-keyline:\s*#d5dfe5;/);
    expect(theme).toMatch(/--win7-font-zh:[^;]*"Microsoft YaHei"/);
  });
});
