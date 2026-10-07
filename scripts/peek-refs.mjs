import { readFileSync, statSync } from "node:fs";

for (const f of ["public/bg.svg", "public/bg 2.svg", "public/5.svg", "public/7.svg"]) {
  const t = readFileSync(f, "utf8");
  const mb = (statSync(f).size / 1e6).toFixed(1);
  const rx = (t.match(/\brx="/g) || []).length;
  const ellipse = (t.match(/<ellipse /g) || []).length;
  const image = (t.match(/<image /g) || []).length;
  const pattern = (t.match(/<pattern /g) || []).length;
  // peach-ish fills used on arch pill
  const peach = (t.match(/#f0c9b8|#F0C9B8|#f6ede8|#F6EDE8|#e8a597/gi) || []).length;
  console.log({ f, mb, rx, ellipse, image, pattern, peach });
}
