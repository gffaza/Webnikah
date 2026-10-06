import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

function summarize(file) {
  const text = readFileSync(file, "utf8");
  console.log("\n====", file, "len", text.length);

  const viewBox = text.match(/viewBox="([^"]+)"/)?.[1];
  const width = text.match(/<svg[^>]*\bwidth="([^"]+)"/)?.[1];
  const height = text.match(/<svg[^>]*\bheight="([^"]+)"/)?.[1];
  console.log({ viewBox, width, height });

  // Extract image elements with positioning attrs (before the huge href)
  const images = [];
  const re =
    /<image\b([^>]*?)(?:\/>|>)/g;
  let m;
  while ((m = re.exec(text))) {
    const attrs = m[1];
    const get = (name) => attrs.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
    images.push({
      id: get("id"),
      x: get("x"),
      y: get("y"),
      width: get("width"),
      height: get("height"),
      hrefLen: (attrs.match(/href="([^"]*)"/)?.[1] || "").length,
      hrefStart: (attrs.match(/href="([^"]{0,40})/)?.[1] || "").slice(0, 40),
    });
  }
  console.log("images", images.length);
  console.log(JSON.stringify(images.slice(0, 40), null, 2));

  // Groups with transform/id near start of file (first 50k of non-base64)
  const stripped = text.replace(/href="data:[^"]+"/g, 'href="DATA"');
  writeFileSync(file.replace(".svg", ".structure.xml"), stripped.slice(0, 200_000));
  console.log("wrote structure preview");

  // Count tags
  for (const tag of ["g", "image", "path", "rect", "use", "mask", "clipPath", "pattern"]) {
    const count = (stripped.match(new RegExp(`<${tag}[\\s>/]`, "g")) || []).length;
    console.log(tag, count);
  }
}

summarize("public/5.svg");
summarize("public/7.svg");
