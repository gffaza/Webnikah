/**
 * Rasterize the design-reference SVGs into phone-friendly WebP backdrops.
 * Sources: public/bg.svg (floral), public/bg 2.svg (arch).
 * Requires Chrome/Edge. Run: node scripts/render-ref-bgs.mjs
 */
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].filter(Boolean);

const chrome = chromeCandidates.find((p) => existsSync(p));
if (!chrome) {
  console.error("Chrome/Edge not found. Set CHROME_PATH.");
  process.exit(1);
}

mkdirSync(path.join(root, ".shots"), { recursive: true });
mkdirSync(path.join(root, "public/images"), { recursive: true });

function render(htmlPath, outPng, w, h) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      chrome,
      [
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        `--window-size=${w},${h}`,
        "--virtual-time-budget=60000",
        `--screenshot=${outPng}`,
        `file:///${htmlPath.replace(/\\/g, "/")}`,
      ],
      { stdio: "ignore" },
    );
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`chrome exit ${code}`))));
  });
}

const jobs = [
  {
    svg: "public/bg.svg",
    html: ".shots/ref-floral.html",
    out: "public/images/bg-floral",
    label: "floral",
  },
  {
    svg: "public/bg 2.svg",
    html: ".shots/ref-arch.html",
    out: "public/images/bg-arch",
    label: "arch",
  },
];

const W = 1080;
const H = 1920;

for (const job of jobs) {
  const absSvg = path.join(root, job.svg).replace(/\\/g, "/");
  const html = `<!doctype html><html><head><meta charset="utf-8"></head>
<body style="margin:0;background:#f5f2f2">
  <img src="file:///${absSvg}" width="${W}" height="${H}" style="display:block;width:${W}px;height:${H}px;object-fit:cover"/>
</body></html>`;
  const htmlAbs = path.join(root, job.html);
  writeFileSync(htmlAbs, html);

  const pngAbs = path.join(root, `${job.out}-src.png`);
  console.log("rendering", job.svg, "…");
  await render(htmlAbs, pngAbs, W, H);

  const meta = await sharp(pngAbs).metadata();
  // Full invite column quality
  await sharp(pngAbs)
    .resize(1080, 1920, { fit: "cover" })
    .webp({ quality: 82, alphaQuality: 90 })
    .toFile(path.join(root, `${job.out}.webp`));
  // Extra-light mobile decode (~half pixels)
  await sharp(pngAbs)
    .resize(720, 1280, { fit: "cover" })
    .webp({ quality: 78, alphaQuality: 88 })
    .toFile(path.join(root, `${job.out}-sm.webp`));

  const full = await sharp(path.join(root, `${job.out}.webp`)).metadata();
  const sm = await sharp(path.join(root, `${job.out}-sm.webp`)).metadata();
  console.log(
    job.label,
    `chrome ${meta.width}x${meta.height} →`,
    `webp ${full.width}x${full.height}`,
    `sm ${sm.width}x${sm.height}`,
  );
}

console.log("done");
