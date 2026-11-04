import assert from "node:assert/strict";
import test from "node:test";
import { execFileSync, spawnSync } from "node:child_process";
import {
  mkdtemp,
  mkdir,
  readFile,
  writeFile,
  readdir,
  rm,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { exportIdentity, writeFrozenCapture } from "./snapshot-integrity.mjs";

const runner = fileURLToPath(new URL("./snapshot.mjs", import.meta.url));
// Exercise the real CLI and real capture writes with a synthetic browser facade.
// No actual browser/network runs and no visual result is claimed by these tests.
const browserFixture = `
import { readFile } from 'node:fs/promises';
const locator = { waitFor: async()=>{}, click: async()=>{}, fill: async()=>{}, isVisible: async()=>false };
const page = {
  request: { get: async()=>({ json: async()=>JSON.parse(await readFile('out/version.json','utf8')) }) },
  on(){}, off(){}, locator:()=>locator, keyboard:{press:async()=>{}},
  goto: async(url)=>{page.url=url;return {status:()=>url.endsWith('/not-a-portfolio-route')?404:200}},
  evaluate: async(fn)=>fn.toString().includes('document.documentElement.outerHTML')
    ? {html:'<html>'+process.env.CAPTURE_FIXTURE_RUN+'</html>',interactiveElements:[],styleURLs:[],inlineStyles:[]}:null,
  screenshot: async()=>Buffer.from('synthetic capture '+process.env.CAPTURE_FIXTURE_RUN+' '+page.url),
};
const context={addInitScript:async()=>{},newPage:async()=>page,close:async()=>{}};
export const chromium={launch:async()=>({newContext:async()=>context,
version:async()=>process.env.CAPTURE_FIXTURE_BROWSER||'fixture-browser-1',close:async()=>{}})};
`;

async function fixture(run) {
  const root = await mkdtemp(path.join(tmpdir(), "aero-snapshot-integrity-"));
  try {
    await mkdir(path.join(root, "out"));
    await writeFile(
      path.join(root, "client.tsx"),
      "export const fixture = true;\n",
    );
    await writeFile(
      path.join(root, "out/version.json"),
      JSON.stringify({ commit: "a".repeat(40), builtAt: "fixture" }),
    );
    execFileSync("git", ["init", "--quiet"], { cwd: root });
    execFileSync("git", ["add", "client.tsx"], { cwd: root });
    execFileSync(
      "git",
      [
        "-c",
        "user.name=Fixture",
        "-c",
        "user.email=fixture@example.invalid",
        "commit",
        "--quiet",
        "--no-gpg-sign",
        "--no-verify",
        "-m",
        "fixture",
      ],
      { cwd: root },
    );
    await mkdir(path.join(root, "src"));
    await writeFile(
      path.join(root, "src/untracked.tsx"),
      "export const added = true;\n",
    );
    const stub = path.join(root, "browser.mjs");
    await writeFile(stub, browserFixture);
    const loader = path.join(root, "loader.mjs");
    await writeFile(
      loader,
      `export async function resolve(specifier, context, next) { return specifier === 'playwright' ? {url:${JSON.stringify(pathToFileURL(stub).href)},shortCircuit:true} : next(specifier, context); }`,
    );
    const capture = (flags = [], env = {}) =>
      spawnSync(
        process.execPath,
        [
          "--no-warnings",
          "--experimental-loader",
          loader,
          runner,
          "fixture",
          ...flags,
        ],
        {
          cwd: root,
          encoding: "utf8",
          timeout: 15_000,
          maxBuffer: 64 * 1024,
          env: { ...process.env, CAPTURE_FIXTURE_RUN: "initial", ...env },
        },
      );
    await run({
      root,
      capture,
      phase: path.join(root, "artifacts/aero-parity/fixture"),
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

async function bytes(directory) {
  const files = {};
  for (const name of (await readdir(directory)).sort())
    files[name] = (await readFile(path.join(directory, name))).toString(
      "base64",
    );
  return files;
}

const success = (result) => {
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
};

test("real CLI extension keeps all original JSON/PNG bytes and adds only new scenes", () =>
  fixture(async ({ capture, phase }) => {
    success(capture());
    const original = await bytes(phase);
    const before = JSON.parse(
      await readFile(path.join(phase, "snapshot-manifest.json"), "utf8"),
    );
    success(
      capture(["--extend", "--expanded"], { CAPTURE_FIXTURE_RUN: "extended" }),
    );
    const after = JSON.parse(
      await readFile(path.join(phase, "snapshot-manifest.json"), "utf8"),
    );
    for (const [name, data] of Object.entries(original)) {
      if (name === "snapshot-manifest.json") continue;
      assert.equal(
        (await readFile(path.join(phase, name))).toString("base64"),
        data,
        name,
      );
    }
    assert.ok(
      before.sourceHashes["src/untracked.tsx"],
      "new application source must be included before it is committed",
    );
    assert.equal(before.pages.length, 4);
    assert.equal(after.pages.length, 15);
    assert.deepEqual(after.pages.slice(0, 4), before.pages);
    assert.deepEqual(after.sourceHashes, before.sourceHashes);
    for (const [name, hash] of Object.entries(before.captureHashes))
      assert.equal(after.captureHashes[name], hash);
    assert.match(
      await readFile(path.join(phase, "resume.json"), "utf8"),
      /extended/,
    );
    const extended = await bytes(phase);
    const downgrade = capture(["--extend"]);
    assert.notEqual(downgrade.status, 0);
    assert.match(downgrade.stderr, /Cannot downgrade/);
    assert.deepEqual(await bytes(phase), extended);
  }));

test("browser/export/version/capture mismatch rejects before changing any evidence", () =>
  fixture(async ({ root, capture, phase }) => {
    success(capture());
    const frozen = await bytes(phase);
    const changedBrowser = capture(["--extend", "--expanded"], {
      CAPTURE_FIXTURE_BROWSER: "fixture-browser-2",
    });
    assert.notEqual(changedBrowser.status, 0);
    assert.match(
      changedBrowser.stderr,
      /different capture conditions: browser/,
    );
    assert.deepEqual(await bytes(phase), frozen);
    await writeFile(
      path.join(root, "out/changed.txt"),
      "different exported bytes",
    );
    const changedExport = capture(["--extend", "--expanded"]);
    assert.notEqual(changedExport.status, 0);
    assert.match(changedExport.stderr, /export-byte identity/);
    assert.deepEqual(await bytes(phase), frozen);
    await rm(path.join(root, "out/changed.txt"));
    const versionPath = path.join(root, "out/version.json");
    const version = await readFile(versionPath);
    await writeFile(versionPath, JSON.stringify({ commit: "b".repeat(40) }));
    const changedVersion = capture(["--extend", "--expanded"]);
    assert.notEqual(changedVersion.status, 0);
    assert.match(changedVersion.stderr, /different export/);
    assert.deepEqual(await bytes(phase), frozen);
    await writeFile(versionPath, version);
    await writeFile(
      path.join(phase, "projects.json"),
      "changed frozen capture",
    );
    const changedCapture = await bytes(phase);
    const mismatch = capture(["--extend", "--expanded"]);
    assert.notEqual(mismatch.status, 0);
    assert.match(mismatch.stderr, /Frozen capture identity missing or changed/);
    assert.deepEqual(await bytes(phase), changedCapture);
  }));

test("exclusive scene writes protect partial captures even without a manifest", () =>
  fixture(async ({ root }) => {
    const directory = path.join(root, "partial");
    await mkdir(directory);
    await writeFile(path.join(directory, "projects.json"), "first capture");
    await assert.rejects(
      writeFrozenCapture(
        directory,
        "projects",
        "replacement",
        Buffer.from("new"),
      ),
      { code: "EEXIST" },
    );
    assert.equal(
      await readFile(path.join(directory, "projects.json"), "utf8"),
      "first capture",
    );
  }));

test("export identity includes file names and bytes deterministically", () =>
  fixture(async ({ root }) => {
    const directory = path.join(root, "out");
    const original = await exportIdentity(directory);
    assert.deepEqual(await exportIdentity(directory), original);
    await writeFile(path.join(directory, "added.txt"), "new bytes");
    assert.notEqual((await exportIdentity(directory)).sha256, original.sha256);
  }));
