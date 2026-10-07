import { readFileSync } from "node:fs";
import sharp from "sharp";

for (const f of [
  "public/images/parts/gunungan.webp",
  "public/images/parts/gunungan-raster.webp",
]) {
  const m = await sharp(f).metadata();
  // Find bottom-most non-transparent / non-white row
  const { data, info } = await sharp(f).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let top = info.height,
    bottom = 0,
    left = info.width,
    right = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * 4;
      const a = data[i + 3];
      const w = data[i] > 245 && data[i + 1] > 245 && data[i + 2] > 240;
      if (a > 20 && !w) {
        if (y < top) top = y;
        if (y > bottom) bottom = y;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
  }
  console.log(f, `${m.width}x${m.height}`, { top, bottom, left, right, contentH: bottom - top });
}

for (const f of ["public/asset/Frame 39.svg", "public/asset/Frame 44.svg"]) {
  const t = readFileSync(f, "utf8");
  console.log(f, "viewBox", t.match(/viewBox="([^"]+)"/)?.[1], "paths", (t.match(/<path /g) || []).length);
}

// Export Frame 39 / 44 to PNG preview via sharp (rasterize SVG)
for (const f of ["public/asset/Frame 39.svg", "public/asset/Frame 44.svg"]) {
  const out = f.includes("39") ? ".shots/gunungan-frame39.png" : ".shots/gunungan-frame44.png";
  try {
    await sharp(f).resize(800).png().toFile(out);
    const m = await sharp(out).metadata();
    console.log("rendered", out, `${m.width}x${m.height}`);
  } catch (e) {
    console.log("render fail", f, e.message);
  }
}
