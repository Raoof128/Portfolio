import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";

// Preserve the complete real consumer chain in rejection diagnostics.
Error.stackTraceLimit = 50;
const require = createRequire(import.meta.url);
const pluginEntry = require.resolve("@next/eslint-plugin-next");
const pluginRequire = createRequire(pluginEntry);
const fastGlobEntry = pluginRequire.resolve("fast-glob");
const micromatchEntry = createRequire(fastGlobEntry).resolve("micromatch");
const bracesEntry = createRequire(micromatchEntry).resolve("braces");
const fillRangeEntry = createRequire(bracesEntry).resolve("fill-range");
const braces = require(bracesEntry);
const micromatch = require(micromatchEntry);
const deep = "{".repeat(4500) + "x" + "}".repeat(4500);
const scenario = process.argv[2];

const nestedValue = () => {
  let value = ["x"];
  for (let index = 0; index < 4000; index++) value = [value];
  return value;
};

const withNextRule = (hostile) => {
  const fixture = mkdtempSync(join(tmpdir(), "researchos-next-braces-"));
  try {
    for (const name of ["one", "two"]) {
      const pages = join(fixture, name, "pages");
      mkdirSync(pages, { recursive: true });
      writeFileSync(join(pages, "index.js"), "export default function Page() {}\n");
      writeFileSync(join(pages, "about.js"), "export default function About() {}\n");
    }
    const { Linter } = require("eslint");
    const plugin = require(pluginEntry);
    const rootDir = hostile ? join(fixture, deep) : join(fixture, "{one,two}");
    let matchedRootDirs;
    if (!hostile) {
      const { getRootDirs } = require(join(dirname(pluginEntry), "utils/get-root-dirs.js"));
      matchedRootDirs = getRootDirs({ cwd: fixture, settings: { next: { rootDir } } });
      assert.deepEqual(matchedRootDirs.map((path) => realpathSync(path)).sort(), [
        realpathSync(join(fixture, "one")), realpathSync(join(fixture, "two")),
      ].sort());
    }
    const messages = new Linter().verify(
      'const page = <><a href="/about/">About</a><a href="https://example.com/">External</a></>;',
      {
        files: ["**/*.jsx"],
        languageOptions: {
          ecmaVersion: 2022,
          sourceType: "module",
          parserOptions: { ecmaFeatures: { jsx: true } },
        },
        plugins: { "@next/next": plugin },
        settings: { next: { rootDir } },
        rules: { "@next/next/no-html-link-for-pages": "error" },
      },
      { filename: "fixture.jsx" },
    );
    assert.equal(messages.length, 1);
    assert.equal(messages[0].ruleId, "@next/next/no-html-link-for-pages");
    assert.equal(messages[0].severity, 2);
    assert.match(messages[0].message, /Do not use an `<a>` element/);
    return { messages, ruleEnabled: "error", braceRootDirs: matchedRootDirs.length, matchedRootDirs };
  } finally {
    // Each worker owns only its fresh temporary tree, including failure paths.
    rmSync(fixture, { recursive: true, force: true });
  }
};

const actions = {
  "positive-consumers": () => {
    assert.deepEqual(micromatch(["a.js", "b.ts", "c.txt"], "*.{js,ts}"), ["a.js", "b.ts"]);
    assert.deepEqual(micromatch.braceExpand("file{01..03}.js"), ["file01.js", "file02.js", "file03.js"]);
    assert.deepEqual(braces.expand("{9..1..2}"), ["9", "7", "5", "3", "1"]);
    assert.deepEqual(braces.expand("{1..9}", { step: "2" }), ["1", "3", "5", "7", "9"]);
    assert.deepEqual(braces.expand("{1..3}", { transform: (value) => `v${value}` }), ["v1", "v2", "v3"]);
    assert.ok(braces.compile("{1..1000000000}").length < 500);
    const leaf = { type: "text", value: "x" };
    assert.equal(braces.compile({ type: "root", nodes: [leaf, leaf] }), "xx");
    return withNextRule(false);
  },
  "next-rule-hostile-root": () => withNextRule(true),
  "compile-depth": () => braces.compile(deep),
  "expand-depth": () => micromatch.braceExpand(deep),
  "stringify-depth": () => braces.stringify(deep),
  "create-depth": () => braces.create(deep),
  "top-array-depth": () => braces(["ok", deep]),
  "direct-ast-cycle": () => {
    const ast = { type: "root", nodes: [] };
    ast.nodes.push(ast);
    return braces.compile(ast);
  },
  "parent-cycle": () => {
    const node = { type: "paren", nodes: [] };
    node.parent = node;
    return braces.expand({ type: "root", nodes: [node] });
  },
  "ast-coercion": () => braces.stringify({ type: "text", value: nestedValue() }),
  "option-coercion": () => braces.expand("{1..9}", { step: nestedValue() }),
  "unsafe-range": () => braces.expand("{100000000000000000000..100000000000000000001}"),
  "stepped-regex-range": () => braces.compile("{1..1000000000..2}"),
  "padded-stepped-regex": () => braces.compile("{" + String(1).padStart(4990, "0") + ".." + String(9999).padStart(4990, "0") + "..2}", { rangeLimit: false }),
  "cartesian-output": () => braces.expand("{1..9000}{1..9000}", { rangeLimit: false }),
  "composed-output": () => {
    const input = "x".repeat(9500) + "{1..80}{1..80}";
    return braces([input, input], { expand: true, nodupes: true });
  },
  "input-nan-ceiling": () => braces.parse("x".repeat(10001), { maxLength: NaN }),
};

const started = performance.now();
try {
  if (!Object.hasOwn(actions, scenario)) throw new Error("Unknown guard regression scenario");
  const result = actions[scenario]();
  process.stdout.write(JSON.stringify({
    scenario, outcome: "returned", result, elapsedMs: performance.now() - started,
    node: process.version, modules: { pluginEntry, fastGlobEntry, micromatchEntry, bracesEntry, fillRangeEntry },
  }));
} catch (error) {
  process.stdout.write(JSON.stringify({
    scenario, outcome: "threw", name: error.name, code: error.code ?? null,
    message: error.message, stack: error.stack?.slice(0, 8000),
    elapsedMs: performance.now() - started, node: process.version,
    modules: { pluginEntry, fastGlobEntry, micromatchEntry, bracesEntry, fillRangeEntry },
    bracesDirectory: dirname(bracesEntry),
  }));
}
