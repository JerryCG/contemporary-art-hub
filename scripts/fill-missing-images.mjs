#!/usr/bin/env node
/** Download Wikimedia Commons study images into public/. Skip files that are too small. */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const UA = "ContemporaryArtHub/2.0 (https://github.com/JerryCG/contemporary-art-hub; educational museum)";

const jobs = [
  // works — public-domain / Commons
  { dest: "public/images/works/the-cradle.jpg", file: "Berthe Morisot The Cradle.jpg" },
  { dest: "public/images/works/boulevard-montmartre.jpg", file: "Camille Pissarro, 1897, Boulevard Montmartre, matin, temps gris, oil on canvas, 73.6 x 92.8 cm, Metropolitan Museum of Art.jpg" },
  { dest: "public/images/works/boulevard-montmartre.jpg", file: "Pissarro Boulevard Montmartre.jpg", fallback: true },
  { dest: "public/images/works/houses-at-estaque.jpg", file: "Georges Braque, 1908, Maisons et arbre, oil on canvas, 40.5 x 32.5 cm, Lille Métropole Museum of Modern, Contemporary and Outsider Art.jpg" },
  { dest: "public/images/works/houses-at-estaque.jpg", file: "Georges Braque, 1908, Houses at L'Estaque.jpg", fallback: true },
  { dest: "public/images/works/violin-and-palette.jpg", file: "Georges Braque, 1909-10, Violin and Palette (Violon et palette), Solomon R. Guggenheim Museum.jpg" },
  { dest: "public/images/works/street-dresden.jpg", file: "Ernst Ludwig Kirchner - Street, Dresden - Google Art Project.jpg" },
  { dest: "public/images/works/potsdamer-platz.jpg", file: "Ernst Ludwig Kirchner - Potsdamer Platz.jpg" },
  { dest: "public/images/works/the-elephant-celebes.jpg", file: "Max Ernst, 1921, The Elephant Celebes.jpg" },
  { dest: "public/images/works/cut-with-the-kitchen-knife.jpg", file: "Hoch-Cut With the Kitchen Knife.jpg" },
  { dest: "public/images/works/monument-to-the-third-international.jpg", file: "Tatlin's Tower maket 1919.jpg" },
  { dest: "public/images/works/monument-to-the-third-international.jpg", file: "Tatlin monument.jpg", fallback: true },
  { dest: "public/images/works/jupiter-and-semele.jpg", file: "MoreauJupiterandSemele.jpg" },
  { dest: "public/images/works/the-cyclops.jpg", file: "Odilon Redon - The Cyclops - Google Art Project.jpg" },
  { dest: "public/images/works/the-kiss.jpg", file: "The Kiss - Gustav Klimt - Google Cultural Institute.jpg" },
  { dest: "public/images/works/composition-vii.jpg", file: "Vassily Kandinsky, 1913 - Composition 7.jpg" },
  { dest: "public/images/works/twittering-machine.jpg", file: "Twittering Machine.jpg" },
  { dest: "public/images/works/composition-with-red-blue-and-yellow.jpg", file: "Piet Mondriaan, 1930 - Mondrian Composition II in Red, Blue, and Yellow.jpg" },
  { dest: "public/images/works/counter-composition.jpg", file: "Theo van Doesburg Counter-Composition V.jpg" },
  { dest: "public/images/works/guitar-and-bottles.jpg", file: "Amédée Ozenfant, 1920, Nature morte (Still Life).jpg" },
  { dest: "public/images/works/still-life-1920.jpg", file: "Le Corbusier, 1920, Nature morte.jpg" },
  { dest: "public/images/works/sunflowers.jpg", file: "Vincent Willem van Gogh 127.jpg" },
  { dest: "public/images/works/self-portrait-inn-of-the-dawn-horse.jpg", file: "Leonora Carrington Self-Portrait 1937-38.jpg" },
  { dest: "public/images/works/spiral-jetty.jpg", file: "Robert Smithson, Spiral Jetty from atop Rozel Point, 2005.jpg" },
  { dest: "public/images/works/tv-buddha.jpg", file: "Nam June Paik, TV Buddha, 1974.jpg" },

  // portraits
  { dest: "public/images/portraits/georges-braque.jpg", file: "Georges Braque, 1908, photograph published in Gelett Burgess, The Wild Men of Paris, Architectural Record, May 1910.jpg" },
  { dest: "public/images/portraits/georges-braque.jpg", file: "Georges Braque, 1915, photograph.jpg", fallback: true },
  { dest: "public/images/portraits/berthe-morisot.jpg", file: "Berthe Morisot.jpg" },
  { dest: "public/images/portraits/camille-pissarro.jpg", file: "Camille Pissarro 1900.jpg" },
  { dest: "public/images/portraits/ernst-ludwig-kirchner.jpg", file: "Ernst Ludwig Kirchner photograph.jpg" },
  { dest: "public/images/portraits/max-ernst.jpg", file: "Max Ernst 1909.jpg" },
  { dest: "public/images/portraits/hannah-hoch.jpg", file: "Hannah Höch, c. 1926.jpg" },
  { dest: "public/images/portraits/vladimir-tatlin.jpg", file: "Vladimir Tatlin.jpg" },
  { dest: "public/images/portraits/gustave-moreau.jpg", file: "Gustave Moreau.jpg" },
  { dest: "public/images/portraits/odilon-redon.jpg", file: "Odilon Redon 1898.jpg" },
  { dest: "public/images/portraits/gustav-klimt.jpg", file: "Klimt.jpg" },
  { dest: "public/images/portraits/amedee-ozenfant.jpg", file: "Amédée Ozenfant.jpg" },
  { dest: "public/images/portraits/le-corbusier.jpg", file: "Le Corbusier 1933.JPG" },
  { dest: "public/images/portraits/wassily-kandinsky.jpg", file: "Vassily-Kandinsky.jpeg" },
  { dest: "public/images/portraits/paul-klee.jpg", file: "Paul Klee 1911.jpg" },
  { dest: "public/images/portraits/piet-mondrian.jpg", file: "Piet Mondrian.jpg" },
  { dest: "public/images/portraits/theo-van-doesburg.jpg", file: "Theo van Doesburg in De Stijl uniform.jpg" },
  { dest: "public/images/portraits/leonora-carrington.jpg", file: "Leonora Carrington.jpg" },
  { dest: "public/images/movements/symbolism.jpg", file: "The Kiss - Gustav Klimt - Google Cultural Institute.jpg" },
  { dest: "public/images/movements/abstract-art.jpg", file: "Vassily Kandinsky, 1913 - Composition 7.jpg" },
  { dest: "public/images/movements/de-stijl.jpg", file: "Piet Mondriaan, 1930 - Mondrian Composition II in Red, Blue, and Yellow.jpg" },
  { dest: "public/images/movements/purism.jpg", file: "Amédée Ozenfant, 1920, Nature morte (Still Life).jpg" },
];

async function commonsUrl(title) {
  const api =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=1600&titles=" +
    encodeURIComponent("File:" + title);
  const res = await fetch(api, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) throw new Error("api " + res.status);
  const data = await res.json();
  const page = Object.values(data.query?.pages || {})[0];
  if (!page || page.missing || !page.imageinfo?.[0]) return null;
  return page.imageinfo[0].thumburl || page.imageinfo[0].url;
}

async function searchFile(query) {
  const api =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&list=search&srnamespace=6&srlimit=5&srsearch=" +
    encodeURIComponent(query);
  const res = await fetch(api, { headers: { "User-Agent": UA } });
  if (!res.ok) return null;
  const data = await res.json();
  const hit = data.query?.search?.[0];
  if (!hit) return null;
  return String(hit.title || "").replace(/^File:/, "");
}

function isRealImage(buf) {
  if (!buf || buf.length < 20000) return false;
  const a = buf[0],
    b = buf[1],
    c = buf[2];
  const jpeg = a === 0xff && b === 0xd8;
  const png = a === 0x89 && b === 0x50 && c === 0x4e;
  const gif = a === 0x47 && b === 0x49;
  const webp = buf.slice(8, 12).toString() === "WEBP";
  return jpeg || png || gif || webp;
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Referer: "https://commons.wikimedia.org/" } });
  if (!res.ok) return false;
  const buf = Buffer.from(await res.arrayBuffer());
  if (!isRealImage(buf)) {
    console.log("  skip small/not-image", dest, buf.length);
    return false;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  console.log("  ok", dest, buf.length);
  return true;
}

async function main() {
  const done = new Set();
  for (const job of jobs) {
    const abs = path.join(ROOT, job.dest);
    if (done.has(job.dest) && fs.existsSync(abs) && fs.statSync(abs).size > 20000) continue;
    if (job.fallback && fs.existsSync(abs) && fs.statSync(abs).size > 20000) continue;
    try {
      let file = job.file;
      let url = await commonsUrl(file);
      if (!url) {
        const found = await searchFile(file.replace(/\.[a-z]+$/i, ""));
        if (found) {
          file = found;
          url = await commonsUrl(found);
        }
      }
      if (!url) {
        console.log("  miss", job.dest, job.file);
        continue;
      }
      const ok = await download(url, abs);
      if (ok) done.add(job.dest);
    } catch (e) {
      console.log("  fail", job.dest, e.message);
    }
  }
}

main();
