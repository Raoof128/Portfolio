import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, realpathSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";
import test from "node:test";

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const vendor = join(root, "vendor");
const source = join(vendor, "braces-guard");
const release = JSON.parse(readFileSync(join(vendor, "braces-guard-release.json"), "utf8"));
const pluginEntry = require.resolve("@next/eslint-plugin-next");
const fastGlobEntry = createRequire(pluginEntry).resolve("fast-glob");
const micromatchEntry = createRequire(fastGlobEntry).resolve("micromatch");
const bracesEntry = createRequire(micromatchEntry).resolve("braces");
const fillRangeEntry = createRequire(bracesEntry).resolve("fill-range");
const installed = dirname(bracesEntry);
const sha256 = (buffer) => createHash("sha256").update(buffer).digest("hex");

// npm tarballs use ordinary ustar headers for this fixed, short-name package.
// Bound decompression and reject unexpected layouts rather than accepting an
// unchecked archive or extracting files into the filesystem.
const readPackedFiles = (gzip) => {
  const tar = gunzipSync(gzip, { maxOutputLength: 256 * 1024 });
  const files = new Map();
  for (let offset = 0; offset + 512 <= tar.length;) {
    const header = tar.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) break;
    const name = header.subarray(0, 100).toString("utf8").replace(/\0.*$/, "");
    const size = Number.parseInt(header.subarray(124, 136).toString("ascii").replace(/\0.*$/, "").trim(), 8);
    const type = String.fromCharCode(header[156]);
    assert.ok(name.startsWith("package/") && !name.includes(".."));
    assert.ok(type === "0" || type === "\0", `Unexpected tar entry type: ${type}`);
    assert.ok(Number.isSafeInteger(size) && size >= 0 && size <= 128 * 1024);
    assert.ok(offset + 512 + size <= tar.length);
    assert.ok(!files.has(name.slice(8)), "Duplicate tar entry");
    files.set(name.slice(8), tar.subarray(offset + 512, offset + 512 + size));
    offset += 512 + Math.ceil(size / 512) * 512;
  }
  return files;
};

const worker = (scenario) => {
  const run = spawnSync(process.execPath, [
    "--max-old-space-size=128", "--stack_size=512",
    fileURLToPath(new URL("./braces-guard.worker.mjs", import.meta.url)), scenario,
  ], { cwd: root, encoding: "utf8", timeout: 5000, maxBuffer: 64 * 1024 });
  assert.ifError(run.error);
  assert.equal(run.signal, null, run.stderr);
  assert.equal(run.status, 0, run.stderr);
  return JSON.parse(run.stdout);
};

test("installed Next consumer uses the attributed fork with exact source/tarball parity", () => {
  for (const entry of [pluginEntry, fastGlobEntry, micromatchEntry, bracesEntry, fillRangeEntry]) {
    const path = relative(realpathSync(join(root, "node_modules")), realpathSync(entry));
    assert.ok(path && !path.startsWith("..") && !path.startsWith("/"), `Dependency escaped this install: ${entry}`);
  }
  const pkg = JSON.parse(readFileSync(join(installed, "package.json"), "utf8"));
  assert.equal(pkg.name, "@researchos/braces-guard");
  assert.equal(pkg.version, "0.1.0");
  assert.equal(pkg.private, true);
  const provenance = JSON.parse(readFileSync(join(installed, "PROVENANCE.json"), "utf8"));
  assert.equal(provenance.upstreamName, "braces");
  assert.equal(provenance.upstreamVersion, "3.0.3");
  assert.equal(provenance.upstreamCommit, "74b2db2938fad48a2ea54a9c8bf27a37a62c350d");
  assert.equal(provenance.advisory, "GHSA-vfj7-8cjw-p6xm");
  assert.equal(provenance.officialPatchedRelease, null);
  const gzip = readFileSync(join(vendor, release.tarball));
  assert.equal(sha256(gzip), release.tarballSha256);
  const lock = JSON.parse(readFileSync(join(root, "package-lock.json"), "utf8"));
  const config = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  const spec = "file:vendor/researchos-braces-guard-0.1.0.tgz";
  const integrity = "sha512-" + createHash("sha512").update(gzip).digest("base64");
  assert.equal(config.devDependencies["@researchos/braces-guard"], spec);
  assert.equal(config.overrides.braces, "$@researchos/braces-guard");
  assert.equal(lock.packages[""].devDependencies["@researchos/braces-guard"], spec);
  const aliases = Object.entries(lock.packages).filter(([path]) => path.endsWith("/braces") || path.endsWith("/braces-guard"));
  assert.ok(aliases.length >= 2);
  for (const [, entry] of aliases) {
    assert.equal(entry.version, "0.1.0");
    assert.equal(entry.resolved, spec);
    assert.equal(entry.integrity, integrity);
    assert.equal(entry.dev, true);
  }
  const packed = readPackedFiles(gzip);
  assert.equal(packed.size, release.sourceFiles.length);
  for (const { path, sha256: expected } of release.sourceFiles) {
    assert.equal(sha256(readFileSync(join(source, path))), expected);
    assert.equal(sha256(readFileSync(join(installed, path))), expected);
    assert.equal(sha256(packed.get(path)), expected);
  }
  assert.equal(sha256(readFileSync(join(installed, "LICENSE"))), provenance.baselineSourceHashes.LICENSE);
  const guards = require(join(installed, "lib/guards.js"));
  assert.deepEqual([guards.MAX_DEPTH, guards.MAX_VISITS, guards.MAX_OUTPUT_UNITS], [128, 20000, 1048576]);
});

test("ordinary globs and the real enabled Next internal-link rule remain correct", () => {
  const result = worker("positive-consumers");
  assert.equal(result.outcome, "returned", result.stack);
  assert.equal(result.result.ruleEnabled, "error");
  assert.equal(result.result.braceRootDirs, 2);
  assert.equal(new Set(result.result.matchedRootDirs).size, 2);
  assert.equal(result.result.messages[0].ruleId, "@next/next/no-html-link-for-pages");
});

test("bounded installed-consumer subprocesses reject recursive/coercion/resource inputs", () => {
  const cases = {
    "next-rule-hostile-root": "ERR_BRACES_DEPTH",
    "compile-depth": "ERR_BRACES_DEPTH", "expand-depth": "ERR_BRACES_DEPTH",
    "stringify-depth": "ERR_BRACES_DEPTH", "create-depth": "ERR_BRACES_DEPTH",
    "top-array-depth": "ERR_BRACES_DEPTH", "direct-ast-cycle": "ERR_BRACES_CYCLE",
    "parent-cycle": "ERR_BRACES_CYCLE", "ast-coercion": "ERR_BRACES_AST_FIELD",
    "option-coercion": "ERR_BRACES_OPTION", "unsafe-range": "ERR_BRACES_RANGE",
    "stepped-regex-range": "ERR_BRACES_RANGE", "padded-stepped-regex": "ERR_BRACES_OUTPUT", "cartesian-output": "ERR_BRACES_OUTPUT",
    "composed-output": "ERR_BRACES_OUTPUT",
  };
  for (const [scenario, expected] of Object.entries(cases)) {
    const result = worker(scenario);
    assert.equal(result.outcome, "threw", scenario);
    assert.equal(result.code, expected, `${scenario}: ${result.stack}`);
    assert.doesNotMatch(result.message, /Maximum call stack size exceeded/);
    if (scenario === "next-rule-hostile-root") {
      assert.match(result.stack, /getRootDirs|processRootDir/);
      assert.match(result.stack, /fast-glob/);
    }
  }
  const input = worker("input-nan-ceiling");
  assert.equal(input.outcome, "threw");
  assert.equal(input.name, "SyntaxError");
  assert.match(input.message, /exceeds max characters/);
});
