/**
 * Rebuild HD composed backgrounds from public/5.svg and public/7.svg.
 * Requires Chrome/Edge. Run: node scripts/render-composed-bgs.mjs
 */
import { writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const chrome =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

function render(htmlPath, outPng) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      chrome,
      [
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--window-size=1080,1920",
        "--virtual-time-budget=30000",
        `--screenshot=${outPng}`,
        `file:///${htmlPath.replace(/\\/g, "/")}`,
      ],
      { stdio: "ignore" },
    );
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`chrome ${code}`))));
  });
}

const jobs = [
  { svg: "public/5.svg", html: ".shots/r5.html", png: "public/images/parts/composed-floral.png", webp: "public/images/parts/composed-floral.webp", aliases: ["public/images/bg-floral"] },
  { svg: "public/7.svg", html: ".shots/r7.html", png: "public/images/parts/composed-arch.png", webp: "public/images/parts/composed-arch.webp", aliases: ["public/images/bg-arch"] },
];

for (const job of jobs) {
  const absSvg = path.join(root, job.svg).replace(/\\/g, "/");
  const html = `<html><body style="margin:0;background:#f7f1ec"><img src="file:///${absSvg}" width="1080" height="1920" style="display:block"/></body></html>`;
  writeFileSync(path.join(root, job.html), html);
  const pngAbs = path.join(root, job.png);
  await render(path.join(root, job.html), pngAbs);
  await sharp(pngAbs).webp({ quality: 92 }).toFile(path.join(root, job.webp));
  for (const alias of job.aliases) {
    await sharp(pngAbs).png().toFile(path.join(root, `${alias}.png`));
    await sharp(pngAbs).webp({ quality: 92 }).toFile(path.join(root, `${alias}.webp`));
  }
  const m = await sharp(pngAbs).metadata();
  console.log(job.svg, "→", `${m.width}x${m.height}`);
}
