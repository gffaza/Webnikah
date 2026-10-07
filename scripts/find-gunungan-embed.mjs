import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";

mkdirSync(".shots/embeds", { recursive: true });

async function dumpEmbeds(svgPath, prefix) {
  const text = readFileSync(svgPath, "utf8");
  const matches = [...text.matchAll(/href="(data:image\/(?:png|jpeg|webp);base64,[^"]+)"/g)];
  console.log(svgPath, "embeds", matches.length);
  const seen = new Set();
  for (let i = 0; i < matches.length; i++) {
    const buf = Buffer.from(matches[i][1].split(",")[1], "base64");
    const key = `${buf.length}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const meta = await sharp(buf).metadata();
    const ratio = (meta.height || 1) / (meta.width || 1);
    const out = `.shots/embeds/${prefix}-${i}-${meta.width}x${meta.height}.png`;
    // Tall-ish candidates for gunungan
    if (ratio > 0.9 && (meta.width || 0) > 400) {
      await sharp(buf).png().toFile(out);
      console.log("  candidate", out, "ratio", ratio.toFixed(2), Math.round(buf.length / 1024) + "KB");
    } else {
      console.log("  skip", `${meta.width}x${meta.height}`, "ratio", ratio.toFixed(2));
    }
  }
}

for (const [p, prefix] of [
  ["public/bg.svg", "bg"],
  ["public/bg 2.svg", "bg2"],
  ["public/5.svg", "five"],
  ["public/7.svg", "seven"],
]) {
  await dumpEmbeds(p, prefix);
}
