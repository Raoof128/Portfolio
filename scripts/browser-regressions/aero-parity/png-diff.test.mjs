import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { inflateSync } from "node:zlib";
import { comparePNGs } from "./png-diff.mjs";
// Independently encoded by Pillow, not this module's encoder. All screenshots
// use an opaque background; alpha compositing is deliberately outside this tool.
const samples = {
  black:
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNgYGD4DwABBAEAX+XDSwAAAABJRU5ErkJggg==",
  white:
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4////fwAJ+wP9KobjigAAAABJRU5ErkJggg==",
  wide: "iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAYAAAD0In+KAAAAEUlEQVR4nGP8////fwYGBgYAGfgD/g/eHX8AAAAASUVORK5CYII=",
};
async function fixture(run) {
  const dir = await mkdtemp(path.join(tmpdir(), "aero-png-"));
  try {
    for (const [name, data] of Object.entries(samples))
      await writeFile(
        path.join(dir, `${name}.png`),
        Buffer.from(data, "base64"),
      );
    await run(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
test("identical pixels have zero difference", () =>
  fixture(async (d) => {
    const m = await comparePNGs(
      path.join(d, "black.png"),
      path.join(d, "black.png"),
      path.join(d, "same"),
    );
    assert.equal(m.exactDifferentPixels, 0);
    assert.equal(m.differentPixelsAbove16, 0);
    assert.equal(m.meanAbsoluteChannelDelta, 0);
  }));
test("black versus white reports exact255 channel delta and valid overlays", () =>
  fixture(async (d) => {
    const stem = path.join(d, "opposite");
    const m = await comparePNGs(
      path.join(d, "black.png"),
      path.join(d, "white.png"),
      stem,
    );
    assert.equal(m.exactDifferentPixels, 1);
    assert.equal(m.differentPixelsAbove16, 1);
    assert.equal(m.meanAbsoluteChannelDelta, 255);
    for (const [suffix, expected] of [
      ["overlay", [0, 128, 128, 128, 255]],
      ["diff", [0, 255, 0, 180, 255]],
    ]) {
      const b = await readFile(`${stem}-${suffix}.png`);
      assert.equal(b.toString("hex", 0, 8), "89504e470d0a1a0a");
      assert.equal(b.readUInt32BE(16), 1);
      assert.equal(b.readUInt32BE(20), 1);
      const chunks = [];
      for (let p = 8; p < b.length; ) {
        const n = b.readUInt32BE(p);
        if (b.toString("ascii", p + 4, p + 8) === "IDAT")
          chunks.push(b.subarray(p + 8, p + 8 + n));
        p += n + 12;
      }
      assert.deepEqual([...inflateSync(Buffer.concat(chunks))], expected);
    }
  }));
test("unequal geometry counts missing pixels even when padded RGB matches", () =>
  fixture(async (d) => {
    const m = await comparePNGs(
      path.join(d, "white.png"),
      path.join(d, "wide.png"),
      path.join(d, "geometry"),
    );
    assert.equal(m.pixels, 2);
    assert.equal(m.exactDifferentPixels, 1);
    assert.equal(m.differentPixelsAbove16, 1);
    assert.equal(m.meanAbsoluteChannelDelta, 0);
  }));
test("explicit chrome mask scopes metrics without changing raw comparison", () =>
  fixture(async (d) => {
    const m = await comparePNGs(
      path.join(d, "black.png"),
      path.join(d, "white.png"),
      path.join(d, "mask"),
      {
        kind: "window-chrome",
        outer: { x: 0, y: 0, width: 1, height: 1 },
        edge: 1,
        titleHeight: 1,
        labelExclusion: { x: 3, y: 3, width: 1, height: 1 },
      },
    );
    assert.equal(m.differentPixelsAbove16, 1);
    assert.equal(m.chromeMask.pixels, 1);
    assert.equal(m.chromeMask.meanAbsoluteChannelDelta, 255);
  }));
