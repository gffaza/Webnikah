import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";

mkdirSync("public/images/parts", { recursive: true });
mkdirSync(".shots", { recursive: true });

function embeds(svgPath) {
  const text = readFileSync(svgPath, "utf8");
  return [...text.matchAll(/href="(data:image\/(?:png|jpeg|webp);base64,[^"]+)"/g)].map(
    (m) => Buffer.from(m[1].split(",")[1], "base64"),
  );
}

/** Figma: image0 = luminance mask, image1 = color on black → RGBA */
async function unmaskPair(maskBuf, colorBuf, outBase) {
  const colorMeta = await sharp(colorBuf).metadata();
  const maskRaw = await sharp(maskBuf)
    .resize(colorMeta.width, colorMeta.height, { fit: "fill", kernel: sharp.kernel.lanczos3 })
    .extractChannel(0)
    .raw()
    .toBuffer();

  const { data: colorRaw, info } = await sharp(colorBuf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, p = 0; i < info.width * info.height; i++, p += 4) {
    out[p] = colorRaw[p];
    out[p + 1] = colorRaw[p + 1];
    out[p + 2] = colorRaw[p + 2];
    out[p + 3] = maskRaw[i];
  }

  const raw = { raw: { width: info.width, height: info.height, channels: 4 } };
  // Prefer PNG for decorative cutouts — no chroma bleed on soft watercolor edges
  await sharp(out, raw).png({ compressionLevel: 6 }).toFile(`public/images/parts/${outBase}.png`);
  await sharp(out, raw)
    .webp({ quality: 100, alphaQuality: 100, nearLossless: true })
    .toFile(`public/images/parts/${outBase}.webp`);
  console.log("unmask", outBase, `${info.width}x${info.height}`);
}

async function bestAlphaOrKnockout(bufs, outBase, threshold = 28) {
  // Prefer buffer that already has useful alpha
  let best = null;
  for (const b of bufs) {
    const m = await sharp(b).metadata();
    const size = b.length;
    if (!best || size > best.size) best = { b, m, size };
  }
  const { data, info } = await sharp(best.b).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  // If mean alpha is already low (has transparency), keep it; else knock out black
  let sumA = 0;
  for (let i = 3; i < data.length; i += 4) sumA += data[i];
  const meanA = sumA / (data.length / 4);
  console.log(outBase, "src", `${info.width}x${info.height}`, "meanA", meanA.toFixed(1), "bytes", best.size);

  if (meanA > 250) {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] <= threshold && data[i + 1] <= threshold && data[i + 2] <= threshold) {
        data[i + 3] = 0;
      }
    }
  }

  const raw = { raw: { width: info.width, height: info.height, channels: 4 } };
  await sharp(data, raw).png({ compressionLevel: 6 }).toFile(`public/images/parts/${outBase}.png`);
  await sharp(data, raw)
    .webp({ quality: 100, alphaQuality: 100, nearLossless: true })
    .toFile(`public/images/parts/${outBase}.webp`);
}

// --- From public/asset (individual layers) ---
const assetMap = [
  ["public/asset/Clip path group-1.svg", "pink-butterfly"],
  ["public/asset/Frame 47.svg", "top-vines"], // same butterfly family / top ornament
  ["public/asset/Frame 40.svg", "lilies"],
  ["public/asset/Clip path group-2.svg", "lilies-alt"],
  ["public/asset/Frame 46.svg", "side-butterfly"],
  ["public/asset/Frame 42.svg", "joglo-house"],
  ["public/asset/aset.svg", "flower-vine"],
  ["public/asset/Frame 38.svg", "faint-vine"],
];

for (const [src, name] of assetMap) {
  const e = embeds(src);
  if (e.length >= 2) await unmaskPair(e[0], e[1], name);
  else console.log("skip", name, e.length);
}

// Floral frame: take HIGHEST-RES embed from 5.svg (often 3598×4971), not half-res asset copy
{
  const from5 = embeds("public/5.svg");
  let best = from5[0];
  let bestMeta = await sharp(best).metadata();
  for (const b of from5) {
    const m = await sharp(b).metadata();
    const area = (m.width || 0) * (m.height || 0);
    const bestArea = (bestMeta.width || 0) * (bestMeta.height || 0);
    if (area > bestArea || (area === bestArea && b.length > best.length)) {
      best = b;
      bestMeta = m;
    }
  }
  console.log("5.svg best embed", `${bestMeta.width}x${bestMeta.height}`, best.length);
  await sharp(best).png().toFile("public/images/parts/floral-frame-src.png");
  await bestAlphaOrKnockout([best], "floral-frame", 30);
}

// Also pull largest unique layers from 5.svg for comparison log
{
  const from5 = embeds("public/5.svg");
  const seen = new Map();
  for (let i = 0; i < from5.length; i++) {
    const m = await sharp(from5[i]).metadata();
    const key = `${m.width}x${m.height}`;
    if (!seen.has(key) || from5[i].length > seen.get(key).len) {
      seen.set(key, { i, len: from5[i].length, m });
    }
  }
  console.log("5.svg unique sizes:");
  for (const [k, v] of seen) console.log(" ", k, "idx", v.i, Math.round(v.len / 1024) + "KB", v.m.hasAlpha ? "A" : "opaque");
}

console.log("done");
