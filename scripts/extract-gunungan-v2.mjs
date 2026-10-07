/**
 * Build a clean full-height gunungan watermark from Frame 31.
 * Strategy: take center crop, punch out near-peach + dark text, keep mid-tone ornament.
 */
import { mkdirSync } from "node:fs";
import sharp from "sharp";

mkdirSync(".shots", { recursive: true });

const src = await sharp("public/Frame 31.png").ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { data, info } = src;
const W = info.width;
const H = info.height;

// Focus on peach pill interior
const x0 = Math.round(W * 0.16);
const x1 = Math.round(W * 0.84);
const y0 = Math.round(H * 0.14);
const y1 = Math.round(H * 0.78);
const cw = x1 - x0;
const ch = y1 - y0;
const out = Buffer.alloc(cw * ch * 4);

const peach = [239, 179, 166];

for (let y = y0; y < y1; y++) {
  for (let x = x0; x < x1; x++) {
    const si = (y * W + x) * 4;
    const di = ((y - y0) * cw + (x - x0)) * 4;
    const r = data[si],
      g = data[si + 1],
      b = data[si + 2];
    const distPeach = Math.hypot(r - peach[0], g - peach[1], b - peach[2]);
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    // Drop peach fill + cream + dark text/icons
    const isPeach = distPeach < 32;
    const isDarkText = luma < 120;
    const isWhiteish = luma > 245;
    // Keep ornamental mid-tones (gunungan scrollwork is slightly darker than peach)
    const isOrnament = !isPeach && !isDarkText && !isWhiteish && distPeach > 18 && distPeach < 90 && luma > 130;

    if (isOrnament) {
      out[di] = r;
      out[di + 1] = g;
      out[di + 2] = b;
      // Alpha by how different from peach
      out[di + 3] = Math.min(200, Math.round((distPeach - 18) * 4));
    } else {
      out[di] = out[di + 1] = out[di + 2] = out[di + 3] = 0;
    }
  }
}

const raw = { raw: { width: cw, height: ch, channels: 4 } };
await sharp(out, raw).png().toFile(".shots/gunungan-v2.png");

// Trim transparent edges, then export webp
await sharp(out, raw)
  .trim({ threshold: 5 })
  .resize({ width: 780, withoutEnlargement: true })
  .webp({ quality: 88, alphaQuality: 95 })
  .toFile("public/images/parts/gunungan.webp");

const m = await sharp("public/images/parts/gunungan.webp").metadata();
console.log("gunungan.webp", `${m.width}x${m.height}`);
