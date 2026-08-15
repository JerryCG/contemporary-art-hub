#!/usr/bin/env node
/** Replace selected public-domain study images with Wikimedia Commons large files. */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEST = path.join(ROOT, "public", "images", "works");

const jobs = [
  {
    file: "Claude Monet, Impression, soleil levant.jpg",
    dest: "impression-sunrise.jpg",
  },
  {
    file: "Georges Seurat - A Sunday on La Grande Jatte -- 1884 - Google Art Project.jpg",
    dest: "a-sunday-afternoon-on-the-island-of-la-grande-jatte.jpg",
  },
  {
    file: "Van Gogh - Starry Night - Google Art Project.jpg",
    dest: "the-starry-night.jpg",
  },
  {
    file: "Edvard Munch, 1893, The Scream, oil, tempera and pastel on cardboard, 91 x 73 cm, National Gallery of Norway.jpg",
    dest: "the-scream.jpg",
  },
  {
    file: "Edouard Manet - Olympia - Google Art Project.jpg",
    dest: "olympia.jpg",
  },
  {
    file: "Edouard Manet - Luncheon on the Grass - Google Art Project.jpg",
    dest: "the-luncheon-on-the-grass.jpg",
  },
  {
    file: "Vincent van Gogh - Wheatfield with crows - Google Art Project.jpg",
    dest: "wheatfield-with-crows.jpg",
  },
  {
    file: "Vincent Willem van Gogh 128.jpg",
    dest: "sunflowers.jpg",
  },
  {
    file: "Paul Cézanne, The Card Players, Barnes.jpg",
    dest: "the-card-players.jpg",
  },
  {
    file: "Henri Matisse, 1905-06, Le Bonheur de Vivre, oil on canvas, 175 x 241 cm, Barnes Foundation.jpg",
    dest: "joy-of-life.jpg",
  },
];

async function fetchThumb(title) {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&iiurlwidth=1800&titles=" +
    encodeURIComponent("File:" + title);
  const res = await fetch(url, { headers: { "User-Agent": "ContemporaryArtHub/2.0 (personal museum rebuild)" } });
  const data = await res.json();
  const page = Object.values(data.query.pages)[0];
  return page.imageinfo?.[0]?.thumburl || page.imageinfo?.[0]?.url;
}

async function main() {
  fs.mkdirSync(DEST, { recursive: true });
  for (const job of jobs) {
    try {
      const src = await fetchThumb(job.file);
      if (!src) {
        console.log("skip (no url)", job.dest);
        continue;
      }
      const img = await fetch(src, { headers: { "User-Agent": "ContemporaryArtHub/2.0 (personal museum rebuild)" } });
      if (!img.ok) {
        console.log("skip (http)", job.dest, img.status);
        continue;
      }
      const buf = Buffer.from(await img.arrayBuffer());
      const dest = path.join(DEST, job.dest);
      fs.writeFileSync(dest, buf);
      console.log("ok", job.dest, buf.length);
    } catch (e) {
      console.log("fail", job.dest, e.message);
    }
  }
}

main();
