import fs from "node:fs";
const t = fs.readFileSync("src/lib/image-fills.ts", "utf8");
const paths = [...t.matchAll(/"(\/images\/[^"]+)"/g)].map((m) => m[1]);
let n = 0;
for (const p of paths) {
  if (!fs.existsSync("public" + p)) {
    console.log("MISSING", p);
    n += 1;
  }
}
console.log("checked", paths.length, "missing", n);
