import { readFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";

mkdirSync(".shots", { recursive: true });

async function dump(svg, label) {
  const text = readFileSync(svg, "utf8");
  const matches = [
    ...text.matchAll(/href="(data:image\/(?:png|jpeg|webp);base64,[^"]+)"/g),
  ];
  console.log(label, "embeds", matches.length);
  for (let i = 0; i < matches.length; i++) {
    const buf = Buffer.from(matches[i][1].split(",")[1], "base64");
    const m = await sharp(buf).metadata();
    const out = `.shots/raw-${label}-${i}.png`;
    await sharp(buf).png().toFile(out);
    console.log(
      " ",
      out,
      `${m.width}x${m.height}`,
      m.format,
      Math.round(buf.length / 1024) + "KB raw",
      m.hasAlpha ? "alpha" : "opaque",
    );
  }
}

await dump("public/asset/Clip path group-1.svg", "bf");
await dump("public/asset/Frame 40.svg", "lily");
await dump("public/asset/Clip path group-2.svg", "cp2");
await dump("public/asset/aset.svg", "aset");
await dump("public/asset/5 913261358.svg", "frame5");
await dump("public/asset/Frame 42.svg", "joglo");
await dump("public/asset/Frame 46.svg", "sidebf");
await dump("public/asset/Frame 41.svg", "vine41");
