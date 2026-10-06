import { mkdirSync, readFileSync } from "node:fs";
import sharp from "sharp";

mkdirSync("public/images/parts", { recursive: true });

/** Image 0 = white-on-black luminance mask, image 1 = color on black (Figma export). */
async function unmask(svgPath, outName) {
  const text = readFileSync(svgPath, "utf8");
  const matches = [...text.matchAll(/href="(data:image\/(?:png|jpeg|webp);base64,[^"]+)"/g)];
  if (matches.length < 2) {
    console.log(outName, "skip", matches.length);
    return null;
  }

  const maskBuf = Buffer.from(matches[0][1].split(",")[1], "base64");
  const colorBuf = Buffer.from(matches[1][1].split(",")[1], "base64");
  const colorMeta = await sharp(colorBuf).metadata();

  const maskRaw = await sharp(maskBuf)
    .resize(colorMeta.width, colorMeta.height, { fit: "fill" })
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

  const png = `public/images/parts/${outName}.png`;
  const webp = `public/images/parts/${outName}.webp`;
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile(png);
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ quality: 95 })
    .toFile(webp);
  console.log(outName, `${info.width}x${info.height}`);
  return png;
}

const map = [
  ["public/asset/Frame 46.svg", "side-butterfly"],
  ["public/asset/Frame 40.svg", "side-butterfly-alt"],
  ["public/asset/Clip path group-2.svg", "side-butterfly-2"],
  ["public/asset/Clip path group-1.svg", "pink-butterfly"],
  ["public/asset/Frame 47.svg", "pink-butterfly-2"],
  ["public/asset/Frame 38.svg", "lily-corner"],
  ["public/asset/Frame 42.svg", "lily-bottom"],
  ["public/asset/aset.svg", "joglo"],
];

for (const [src, name] of map) await unmask(src, name);

// Full-frame texture already has alpha — just convert
{
  const text = readFileSync("public/asset/5 913261358.svg", "utf8");
  const matches = [...text.matchAll(/href="(data:image\/(?:png|jpeg|webp);base64,[^"]+)"/g)];
  // Prefer the larger (higher quality) of the two if sizes differ in bytes
  const bufs = matches.map((m) => Buffer.from(m[1].split(",")[1], "base64"));
  let best = bufs[0];
  for (const b of bufs) if (b.length > best.length) best = b;
  await sharp(best).webp({ quality: 92 }).toFile("public/images/parts/bg-wash.webp");
  await sharp(best).png().toFile("public/images/parts/bg-wash.png");
  const m = await sharp(best).metadata();
  console.log("bg-wash", `${m.width}x${m.height}`, m.hasAlpha ? "alpha" : "no-alpha");
}
