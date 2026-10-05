// Generates low-res placeholder images from the Figma reference screenshots in design-ref/.
// Replace the files in public/images/ with full-resolution exports from Figma when available.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const ref = (file) => path.join("design-ref", file);
const out = (file) => path.join("public", "images", file);

const crops = [
  { src: "02-intro.png", dest: "intro.webp", box: [64, 70, 232, 250] },
  { src: "03-bride.png", dest: "bride.webp", box: [58, 172, 264, 252] },
  { src: "04-groom.png", dest: "groom.webp", box: [58, 172, 264, 252] },
  { src: "07-story.png", dest: "story.webp", box: [97, 132, 137, 170] },
  { src: "08-gallery.png", dest: "gallery-1.webp", box: [52, 109, 121, 111] },
  { src: "08-gallery.png", dest: "gallery-2.webp", box: [187, 109, 121, 157] },
  { src: "08-gallery.png", dest: "gallery-3.webp", box: [52, 243, 121, 157] },
  { src: "08-gallery.png", dest: "gallery-4.webp", box: [187, 286, 121, 114] },
  { src: "08-gallery.png", dest: "gallery-5.webp", box: [52, 417, 256, 159] },
  { src: "10-closing.png", dest: "closing.webp", box: [42, 62, 276, 316] },
  { src: "09-gift.png", dest: "qris.webp", box: [90, 191, 181, 184] },
  { src: "09-gift.png", dest: "bank-mandiri.webp", box: [60, 426, 133, 43] },
  { src: "09-gift.png", dest: "bank-bsi.webp", box: [60, 482, 133, 43] },
  { src: "bg-floral.png", dest: "butterfly.webp", box: [140, 26, 152, 120] },
];

await mkdir(path.join("public", "images"), { recursive: true });

for (const { src, dest, box } of crops) {
  const [left, top, width, height] = box;
  await sharp(ref(src))
    .extract({ left, top, width, height })
    .webp({ quality: 90 })
    .toFile(out(dest));
}

await sharp(ref("bg-floral.png")).webp({ quality: 88 }).toFile(out("bg-floral.webp"));

// Open Graph preview (1200x630): the cover frame centred on a blurred floral backdrop.
const cover = await sharp(ref("01-cover.png")).resize({ height: 630 }).toBuffer();
await sharp(ref("bg-floral.png"))
  .resize(1200, 630, { fit: "cover" })
  .blur(18)
  .composite([{ input: cover, gravity: "center" }])
  .jpeg({ quality: 85 })
  .toFile(out("og.jpg"));

console.log(`Generated ${crops.length + 2} placeholder images in public/images`);
