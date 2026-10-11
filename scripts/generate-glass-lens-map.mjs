import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const WIDTH = 768;
const HEIGHT = 128;
const RADIUS = 40;
const EDGE_DEPTH = 14;

/**
 * Encode the inward gradient of a rounded rectangle in red and green. Only its
 * inner rim displaces the backdrop; a sinusoidal envelope returns smoothly to
 * neutral at both boundaries so the center never ripples or shifts text.
 */
function createLensMap(width, height, radius, edgeDepth) {
  if (
    ![width, height, radius, edgeDepth].every(Number.isInteger) ||
    width < 16 ||
    height < 16 ||
    width * height > 1_048_576 ||
    radius <= 0 ||
    radius > Math.min(width, height) / 2 ||
    edgeDepth <= 0 ||
    edgeDepth >= radius
  ) {
    throw new RangeError("Invalid bounded lens-map geometry");
  }

  const pixels = Buffer.alloc(width * height * 3, 128);
  const innerHalfWidth = width / 2 - radius;
  const innerHalfHeight = height / 2 - radius;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const px = x + 0.5 - width / 2;
      const py = y + 0.5 - height / 2;
      const qx = Math.abs(px) - innerHalfWidth;
      const qy = Math.abs(py) - innerHalfHeight;
      const cornerX = Math.max(qx, 0);
      const cornerY = Math.max(qy, 0);
      const cornerLength = Math.hypot(cornerX, cornerY);
      const signedDistance =
        cornerLength + Math.min(Math.max(qx, qy), 0) - radius;
      const depth = -signedDistance;

      if (depth <= 0 || depth >= edgeDepth) continue;

      let outwardX = 0;
      let outwardY = 0;
      if (cornerLength > 0) {
        outwardX = (cornerX / cornerLength) * Math.sign(px);
        outwardY = (cornerY / cornerLength) * Math.sign(py);
      } else if (qx > qy) {
        outwardX = Math.sign(px);
      } else {
        outwardY = Math.sign(py);
      }

      const strength = Math.sin((Math.PI * depth) / edgeDepth) ** 2;
      const offset = (y * width + x) * 3;
      pixels[offset] = Math.round(127.5 - outwardX * strength * 127.5);
      pixels[offset + 1] = Math.round(127.5 - outwardY * strength * 127.5);
    }
  }

  return pixels;
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(name, payload) {
  const type = Buffer.from(name, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(payload.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([type, payload])));
  return Buffer.concat([length, type, payload, checksum]);
}

function encodePng(pixels, width, height) {
  const stride = width * 3;
  const scanlines = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const start = y * (stride + 1);
    scanlines[start] = 1; // PNG Sub makes long neutral regions highly compressible.
    for (let x = 0; x < stride; x += 1) {
      const current = pixels[y * stride + x];
      const previous = x >= 3 ? pixels[y * stride + x - 3] : 0;
      scanlines[start + x + 1] = (current - previous + 256) % 256;
    }
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 2; // RGB; opaque normals avoid alpha affecting displacement sampling.

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(scanlines, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

async function main() {
  const destination = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "../public/brand/glass-lens-map.png",
  );
  const pixels = createLensMap(WIDTH, HEIGHT, RADIUS, EDGE_DEPTH);
  const png = encodePng(pixels, WIDTH, HEIGHT);
  if (png.length > 8192) throw new Error("Lens map exceeds its 8 KiB budget");
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, png);
  console.log(`Generated ${WIDTH}×${HEIGHT} lens map (${png.length} bytes)`);
}

main().catch((error) => {
  console.error("Lens-map generation failed:", error.message);
  process.exitCode = 1;
});
