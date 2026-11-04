/** Preserve frozen scene bytes while extending a controlled capture cohort. */
import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const captureName = (name) => {
  if (!/^[a-z0-9-]+$/.test(name)) throw new Error("Invalid frozen scene name");
  return name;
};

export async function exportIdentity(directory) {
  const entries = [];
  async function visit(relative = "", depth = 0) {
    if (depth > 16 || entries.length > 10_000)
      throw new Error("Export identity inventory limit exceeded");
    for (const entry of await readdir(path.join(directory, relative), {
      withFileTypes: true,
    })) {
      const name = relative ? `${relative}/${entry.name}` : entry.name;
      if (entry.isDirectory()) await visit(name, depth + 1);
      else if (entry.isFile()) {
        if (entries.length >= 10_000)
          throw new Error("Export identity inventory limit exceeded");
        entries.push([
          name,
          sha256(await readFile(path.join(directory, name))),
        ]);
      } else
        throw new Error(
          "Export identity requires regular files and directories",
        );
    }
  }
  await visit();
  entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return { sha256: sha256(JSON.stringify(entries)), files: entries.length };
}

export function assertCaptureCompatibility(original, current) {
  if (JSON.stringify(original.version) !== JSON.stringify(current.version))
    throw new Error("Cannot extend a snapshot from a different export");
  if (
    !original.exportIdentity ||
    JSON.stringify(original.exportIdentity) !==
      JSON.stringify(current.exportIdentity)
  )
    throw new Error(
      "Cannot extend without the same frozen export-byte identity; choose a new phase",
    );
  for (const key of [
    "origin",
    "browser",
    "viewport",
    "deviceScaleFactor",
    "locale",
    "timeZone",
    "reducedMotion",
    "colourScheme",
    "appearance",
  ])
    if (JSON.stringify(original[key]) !== JSON.stringify(current[key]))
      throw new Error(
        `Cannot extend with different capture conditions: ${key}`,
      );
}

export function extensionRoutes(routes, original) {
  const frozen = new Map(
    original.pages.map((page) => [captureName(page.name), page]),
  );
  if (frozen.size !== original.pages.length)
    throw new Error("Duplicate frozen scene names");
  return routes.filter(([name, route, state]) => {
    const prior = frozen.get(captureName(name));
    if (!prior) return true;
    if (prior.route !== route || prior.state !== (state ?? "default"))
      throw new Error(
        `Frozen scene ${name} has a different route/state; choose a new phase`,
      );
    return false;
  });
}

export async function verifyFrozenCaptures(directory, original) {
  for (const page of original.pages) {
    const name = captureName(page.name);
    for (const filename of [`${name}.json`, `${name}-live.png`]) {
      const expected = original.captureHashes?.[filename];
      if (
        !expected ||
        sha256(await readFile(path.join(directory, filename))) !== expected
      )
        throw new Error(
          `Frozen capture identity missing or changed: ${filename}; choose a new phase`,
        );
    }
  }
}

export async function writeFrozenCapture(
  directory,
  name,
  json,
  png,
  { replace = false } = {},
) {
  captureName(name);
  const files = [
    [`${name}.json`, json],
    [`${name}-live.png`, png],
  ];
  const hashes = {};
  for (const [filename, bytes] of files) {
    // Exclusive writes protect a partial/previous capture even without a manifest.
    await writeFile(path.join(directory, filename), bytes, {
      flag: replace ? "w" : "wx",
    });
    hashes[filename] = sha256(bytes);
  }
  return hashes;
}
