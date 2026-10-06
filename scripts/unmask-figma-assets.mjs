import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";

mkdirSync("public/images/parts", { recursive: true });

/**
 * Figma mask-group exports often embed two PNGs in a pattern:
 * - image 0: luminance mask (white = visible)
 * - image 1: color artwork (often on black / no alpha)
 * Applying the mask as alpha recovers a transparent HD asset.
 */
async function unmaskPair(svgPath, outName) {
  const text = readFileSync(svgPath, "utf8");
  const matches = [...text.matchAll(/href="(data:image\/(?:png|jpeg|webp);base64,[^"]+)"/g)];
  if (matches.length < 2) {
    console.log(outName, "skip: need 2 images, got", matches.length);
    return;
  }

  // Prefer the larger pair if duplicates (Figma sometimes duplicates for pattern tiles)
  const buffers = matches.map((m) => Buffer.from(m[1].split(",")[1], "base64"));
  const metas = await Promise.all(buffers.map((b) => sharp(b).metadata()));

  // Pick two distinct sizes or just first two unique by size string
  let maskBuf = buffers[0];
  let colorBuf = buffers[1];
  // Heuristic: mask is often smaller file / more sparse; color is larger.
  // In Figma exports inspected: first is often mask-ish, second color — but sizes matched.
  // Compare mean brightness of first channel — masks tend to be mostly black/white.
  const stats0 = await sharp(buffers[0]).stats();
  const stats1 = await sharp(buffers[1]).stats();
  const contrast = (s) => s.channels[0].stdev;
  if (contrast(stats1) > contrast(stats0) && stats0.channels[0].mean < 40) {
    // first is dark mask-like, second is color — keep
  } else if (contrast(stats0) > contrast(stats1) && stats1.channels[0].mean < 40) {
    maskBuf = buffers[1];
    colorBuf = buffers[0];
  }

  const maskMeta = await sharp(maskBuf).metadata();
  const colorMeta = await sharp(colorBuf).metadata();

  // Resize mask to color size if needed
  let maskRaw = await sharp(maskBuf)
    .resize(colorMeta.width, colorMeta.height, { fit: "fill" })
    .extractChannel(0)
    .toColourspace("b-w")
    .raw()
    .toBuffer();

  const { data: colorRaw, info } = await sharp(colorBuf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Apply mask as alpha
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, p = 0; i < info.width * info.height; i++, p += 4) {
    out[p] = colorRaw[p];
    out[p + 1] = colorRaw[p + 1];
    out[p + 2] = colorRaw[p + 2];
    out[p + 3] = maskRaw[i];
  }

  const webp = `public/images/parts/${outName}.webp`;
  const png = `public/images/parts/${outName}.png`;
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ quality: 95 })
    .toFile(webp);
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(png);

  console.log(
    outName,
    `${info.width}x${info.height}`,
    "maskMean",
    +(await sharp(maskBuf).stats()).channels[0].mean.toFixed(1),
    "colorMean",
    +(await sharp(colorBuf).stats()).channels[0].mean.toFixed(1),
  );
}

const jobs = [
  ["public/asset/Frame 46.svg", "butterfly"],
  ["public/asset/Frame 40.svg", "butterfly-side"],
  ["public/asset/Clip path group-2.svg", "butterfly-side-2"],
  ["public/asset/Frame 38.svg", "lily-left"],
  ["public/asset/Frame 42.svg", "lily-bottom"],
  ["public/asset/Clip path group-1.svg", "top-vines"],
  ["public/asset/Frame 47.svg", "top-vines-2"],
  ["public/asset/aset.svg", "joglo"],
  ["public/asset/5 913261358.svg", "bg-texture"],
];

for (const [src, name] of jobs) {
  await unmaskPair(src, name);
}
