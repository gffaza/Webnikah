import { execSync } from "node:child_process";

const h = execSync("curl.exe -s http://localhost:3000/?v=hd1", { encoding: "utf8" });
const m = [...h.matchAll(/src="([^"]+)"/g)]
  .map((x) => x[1])
  .filter((s) => /asset|parts|images/.test(s));
console.log([...new Set(m)].sort().join("\n"));
