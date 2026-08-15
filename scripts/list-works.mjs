import fs from "node:fs";
const c = JSON.parse(fs.readFileSync("content/catalog.json", "utf8"));
const artists = Object.fromEntries(c.artists.map((a) => [a.slug, a.name]));
const rows = [];
for (const w of c.works) {
  if (!w.image) continue;
  rows.push({
    slug: w.slug,
    title: w.title,
    artist: artists[w.artist] || w.artist,
    artistSlug: w.artist,
    image: w.image,
    kind: w.kind,
  });
}
fs.writeFileSync("scripts/works-index.json", JSON.stringify(rows, null, 2));
console.log(rows.length);
