/** Dependency-free PNG metrics for Chromium's 8-bit RGB/RGBA screenshots.
 * Images are aligned by the capture origin, never rescaled. A differing image
 * extent counts as differing pixels; it must not hide geometry discrepancies.
 */
import { inflateSync, deflateSync } from "node:zlib";
import { readFile, writeFile } from "node:fs/promises";
const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
function decode(buffer) {
  if (!buffer.subarray(0, 8).equals(signature)) throw new Error("Not a PNG");
  let width, height, channels;
  const compressed = [];
  for (let offset = 8; offset < buffer.length; ) {
    const length = buffer.readUInt32BE(offset),
      type = buffer.toString("ascii", offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      if (data[8] !== 8 || ![2, 6].includes(data[9]) || data[12] !== 0)
        throw new Error(
          "Only non-interlaced 8-bit RGB/RGBA screenshots supported",
        );
      channels = data[9] === 2 ? 3 : 4;
    }
    if (type === "IDAT") compressed.push(data);
    offset += length + 12;
  }
  const raw = inflateSync(Buffer.concat(compressed));
  const stride = width * channels,
    pixels = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? pixels[y * stride + x - channels] : 0;
      const b = y ? pixels[(y - 1) * stride + x] : 0;
      const c =
        y && x >= channels ? pixels[(y - 1) * stride + x - channels] : 0;
      const p = a + b - c,
        pa = Math.abs(p - a),
        pb = Math.abs(p - b),
        pc = Math.abs(p - c);
      const predictor = [
        0,
        a,
        b,
        Math.floor((a + b) / 2),
        pa <= pb && pa <= pc ? a : pb <= pc ? b : c,
      ][filter];
      if (predictor === undefined)
        throw new Error(`Unsupported filter ${filter}`);
      pixels[y * stride + x] =
        (raw[y * (stride + 1) + x + 1] + predictor) & 255;
    }
  }
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    for (let c = 0; c < 3; c++) rgba[i * 4 + c] = pixels[i * channels + c];
    rgba[i * 4 + 3] = channels === 4 ? pixels[i * channels + 3] : 255;
  }
  return { width, height, pixels: rgba };
}
function crc32(data) {
  let value = 0xffffffff;
  for (const byte of data) {
    value ^= byte;
    for (let bit = 0; bit < 8; bit++)
      value = (value >>> 1) ^ (value & 1 ? 0xedb88320 : 0);
  }
  return (value ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const name = Buffer.from(type),
    size = Buffer.alloc(4),
    crc = Buffer.alloc(4);
  size.writeUInt32BE(data.length);
  crc.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([size, name, data, crc]);
}
function encode({ width, height, pixels }) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++)
    pixels.copy(
      raw,
      y * (width * 4 + 1) + 1,
      y * width * 4,
      (y + 1) * width * 4,
    );
  return Buffer.concat([
    signature,
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
export async function comparePNGs(
  referencePath,
  candidatePath,
  outputStem,
  mask = null,
) {
  const a = decode(await readFile(referencePath)),
    b = decode(await readFile(candidatePath));
  const width = Math.max(a.width, b.width),
    height = Math.max(a.height, b.height);
  const overlay = Buffer.alloc(width * height * 4),
    difference = Buffer.alloc(width * height * 4);
  let changed = 0,
    exactChanged = 0,
    totalAbsolute = 0;
  let maskedPixels = 0,
    maskedChanged = 0,
    maskedAbsolute = 0;
  const threshold = 16; // 16/255 channel delta is a reporting band, NOT a pass threshold.
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4,
        insideA = x < a.width && y < a.height,
        insideB = x < b.width && y < b.height;
      let max = 0,
        pixelAbsolute = 0;
      for (let c = 0; c < 3; c++) {
        const av = insideA ? a.pixels[(y * a.width + x) * 4 + c] : 255,
          bv = insideB ? b.pixels[(y * b.width + x) * 4 + c] : 255;
        const delta = Math.abs(av - bv);
        max = Math.max(max, delta);
        totalAbsolute += delta;
        pixelAbsolute += delta;
        overlay[index + c] = Math.round((av + bv) / 2);
      }
      if (max || insideA !== insideB) exactChanged++;
      const substantial = max > threshold || insideA !== insideB;
      if (substantial) changed++;
      if (mask) {
        const r = mask.outer,
          l = mask.labelExclusion;
        const inside =
          x >= r.x && y >= r.y && x < r.x + r.width && y < r.y + r.height;
        const edge =
          x < r.x + mask.edge ||
          x >= r.x + r.width - mask.edge ||
          y < r.y + mask.titleHeight ||
          y >= r.y + r.height - mask.edge;
        const label =
          x >= l.x && x < l.x + l.width && y >= l.y && y < l.y + l.height;
        if (inside && edge && !label) {
          maskedPixels++;
          if (substantial) maskedChanged++;
          maskedAbsolute += pixelAbsolute;
        }
      }
      difference[index] = substantial ? 255 : overlay[index];
      difference[index + 1] = substantial ? 0 : overlay[index + 1];
      difference[index + 2] = substantial ? 180 : overlay[index + 2];
      overlay[index + 3] = difference[index + 3] = 255;
    }
  await writeFile(
    `${outputStem}-overlay.png`,
    encode({ width, height, pixels: overlay }),
  );
  await writeFile(
    `${outputStem}-diff.png`,
    encode({ width, height, pixels: difference }),
  );
  return {
    width,
    height,
    pixels: width * height,
    exactDifferentPixels: exactChanged,
    differentPixelsAbove16: changed,
    meanAbsoluteChannelDelta: totalAbsolute / (width * height * 3),
    channelReportingBand: threshold,
    chromeMask: mask
      ? {
          definition: mask,
          pixels: maskedPixels,
          differentPixelsAbove16: maskedChanged,
          meanAbsoluteChannelDelta: maskedAbsolute / (maskedPixels * 3),
          excludes:
            "reading body, title label/icon, exterior shadow; separately inspect raw images and control crops",
        }
      : null,
    verdict: "measurement-only; inspect geometry and documented adaptations",
  };
}
