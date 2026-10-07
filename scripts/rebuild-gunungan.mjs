/**
 * Frame 50.svg → transparent gunungan watermark (public/images/parts/gunungan.webp).
 * Source is pale ornament on black; we punch out black and tint to soft rose.
 */
import { mkdirSync } from "node:fs";
import sharp from "sharp";

mkdirSync("public/images/parts", { recursive: true });
mkdirSync(".shots", { recursive: true });

const W = 720;
const H = 974;

// Rasterize at native viewBox size for crisp paths
const { data, info } = await sharp("public/asset/Frame 50.svg")
  .resize(W, H, { fit: "fill" })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

// Soft rose ink matching the invite watermark
const ink = { r: 180, g: 120, b: 110 };
const out = Buffer.alloc(info.width * info.height * 4);

for (let i = 0; i < data.length; i += 4) {
  const luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  // Black plate → transparent; pale strokes → rose with alpha from brightness
  if (luma < 45) {
    out[i] = out[i + 1] = out[i + 2] = out[i + 3] = 0;
  } else {
    const t = Math.min(1, (luma - 45) / 180);
    out[i] = ink.r;
    out[i + 1] = ink.g;
    out[i + 2] = ink.b;
    out[i + 3] = Math.round(40 + t * 160);
  }
}

const raw = { raw: { width: info.width, height: info.height, channels: 4 } };
await sharp(out, raw).png().toFile(".shots/gunungan-frame50.png");
await sharp(out, raw)
  .webp({ quality: 90, alphaQuality: 95 })
  .toFile("public/images/parts/gunungan.webp");

const m = await sharp("public/images/parts/gunungan.webp").metadata();
console.log("gunungan.webp", `${m.width}x${m.height}`, "from Frame 50.svg");
