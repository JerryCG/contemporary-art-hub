#!/usr/bin/env node
/** Extract original Hub HTML into content/catalog.json and copy images into public/. */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "archive", "original-site");
const PUBLIC = path.join(ROOT, "public");
const CONTENT = path.join(ROOT, "content");

const MOVEMENT_META = {
  impressionism: { years: "c. 1870–1890", place: "Paris", order: 10, accent: "#7eb6d9" },
  "neo-impressionism": { years: "c. 1886–1906", place: "France", order: 20, accent: "#6aa8c9" },
  "post-impressionism": { years: "c. 1886–1905", place: "France / the Pacific", order: 30, accent: "#2c4c8a" },
  symbolism: { years: "c. 1886–1910", place: "Paris / Vienna", order: 35, accent: "#6b4c8a" },
  fauvism: { years: "1905–1908", place: "Paris / Collioure", order: 40, accent: "#e85d04" },
  expressionism: { years: "c. 1905–1925", place: "Germany / Austria / Norway", order: 50, accent: "#9b2226" },
  cubism: { years: "1907–1920s", place: "Paris", order: 60, accent: "#b08968" },
  futurism: { years: "1909–1944", place: "Italy", order: 70, accent: "#d00000" },
  primitivism: { years: "c. 1890–1930", place: "France / Europe", order: 75, accent: "#2d6a4f" },
  suprematism: { years: "1915–1930s", place: "Russia", order: 80, accent: "#111111" },
  constructivism: { years: "1915–1930s", place: "Russia", order: 90, accent: "#c1121f" },
  dadaism: { years: "1916–1924", place: "Zurich / New York / Paris", order: 100, accent: "#222222" },
  purism: { years: "1918–1925", place: "Paris", order: 105, accent: "#778da9" },
  surrealism: { years: "1924–1960s", place: "Paris / Belgium / Spain", order: 110, accent: "#3d348b" },
  "abstract-art": { years: "c. 1911–", place: "Europe / USA", order: 115, accent: "#4361ee" },
  "de-stijl": { years: "1917–1931", place: "the Netherlands", order: 118, accent: "#e9c46a" },
  "abstract-expressionism": { years: "1940s–1960s", place: "New York", order: 130, accent: "#264653" },
  "pop-art": { years: "1950s–1970s", place: "London / New York", order: 140, accent: "#ff006e" },
  minimalism: { years: "1960s–1970s", place: "New York", order: 150, accent: "#111111" },
  "conceptual-art": { years: "1960s–", place: "USA / Europe", order: 160, accent: "#495057" },
  "after-1980": { years: "1980–now", place: "worldwide", order: 180, accent: "#00bbf9" },
};

const FEATURED_WORKS = {
  "impression-sunrise": 1,
  "a-sunday-afternoon-on-the-island-of-la-grande-jatte": 2,
  "the-starry-night": 3,
  "the-persistence-of-memory": 4,
  "the-scream": 5,
  guernica: 6,
};

function slugify(text) {
  return String(text)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function decode(html) {
  return html
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&eacute;/g, "é")
    .replace(/&egrave;/g, "è")
    .replace(/&aacute;/g, "á")
    .replace(/&iacute;/g, "í")
    .replace(/&oacute;/g, "ó")
    .replace(/&uacute;/g, "ú")
    .replace(/&ccedil;/g, "ç")
    .replace(/&uuml;/g, "ü")
    .replace(/&ouml;/g, "ö")
    .replace(/&auml;/g, "ä")
    .replace(/&ntilde;/g, "ñ");
}

function stripTags(html) {
  return decode(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\u00a0/g, " "),
  )
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n\n")
    .trim();
}

function paragraphsFromHtml(html) {
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? html;
  const chunk = body.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
  const found = [];
  for (const match of chunk.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
    let text = stripTags(match[1]).replace(/\s+/g, " ").trim();
    if (text.length < 40) continue;
    const low = text.toLowerCase();
    if (low.startsWith("back to") || low.startsWith("click ")) continue;
    found.push(text);
  }
  return found;
}

function firstH1(html) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!m) {
    const t = html.match(/<title>([\s\S]*?)<\/title>/i);
    return { title: t ? stripTags(t[1]) : "Untitled", subtitle: "" };
  }
  let inner = m[1];
  const sub = inner.match(/<sub[^>]*>([\s\S]*?)<\/sub>/i);
  const subtitle = sub ? stripTags(sub[1]) : "";
  inner = inner.replace(/<sub[\s\S]*?<\/sub>/gi, "");
  return { title: stripTags(inner).replace(/^[-–—\s]+|[-–—\s]+$/g, ""), subtitle };
}

function parseArtistSub(sub) {
  const inner = sub.replace(/^\(|\)$/g, "").trim();
  const parts = inner.split(",").map((p) => p.trim()).filter(Boolean);
  const out = { nationality: "", life: "", movementHint: "" };
  if (!parts.length) return out;
  out.nationality = parts[0];
  if (parts[1] && /\d{3,4}/.test(parts[1])) {
    out.life = parts[1].replace(/\s+/g, "");
    if (parts.length >= 3) out.movementHint = parts.slice(2).join(", ");
  } else if (parts.length >= 2) {
    out.movementHint = parts.slice(1).join(", ");
  }
  return out;
}

function findImages(html) {
  return [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map((m) => decode(m[1]).replace(/\\/g, "/"));
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function safeCopy(src, dest) {
  if (!fs.existsSync(src) || !fs.statSync(src).isFile()) return null;
  ensureDir(path.dirname(dest));
  if (!fs.existsSync(dest)) fs.copyFileSync(src, dest);
  return "/" + path.relative(PUBLIC, dest).split(path.sep).join("/");
}

function copyMedia(relSrc, pageDir, destDir, destStem) {
  const clean = relSrc.split("?")[0];
  const candidate = path.resolve(pageDir, clean);
  if (!fs.existsSync(candidate)) return null;
  const ext = path.extname(candidate).toLowerCase() || ".jpg";
  let dest = path.join(destDir, destStem + ext);
  let n = 2;
  while (fs.existsSync(dest) && fs.statSync(dest).size !== fs.statSync(candidate).size) {
    dest = path.join(destDir, `${destStem}-${n}${ext}`);
    n += 1;
  }
  return safeCopy(candidate, dest);
}

function listDirs(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(dir, d.name))
    .sort();
}

function listFiles(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((n) => n.toLowerCase().endsWith(ext))
    .map((n) => path.join(dir, n))
    .sort();
}

function main() {
  if (!fs.existsSync(SRC)) throw new Error("missing archive at " + SRC);

  for (const d of [
    path.join(PUBLIC, "images", "works"),
    path.join(PUBLIC, "images", "portraits"),
    path.join(PUBLIC, "images", "movements"),
    path.join(PUBLIC, "images", "jerry"),
    path.join(PUBLIC, "images", "heritage"),
    path.join(PUBLIC, "audio"),
    path.join(PUBLIC, "video"),
    path.join(PUBLIC, "docs"),
    CONTENT,
  ]) {
    ensureDir(d);
  }

  const movements = {};
  const artists = {};
  const works = {};
  const redirects = {};

  const addRedirect = (orig, dest) => {
    const rel = path.relative(SRC, orig).split(path.sep).join("/");
    redirects["/archive/" + rel] = dest;
    redirects["/" + rel] = dest;
  };

  const heritageMap = {
    "Logo.png": "logo.png",
    "Logo-removebg.png": "logo-mark.png",
    "Welcome.gif": "welcome.gif",
    "Hey.gif": "hey.gif",
    "Timelines of Contemporary Art.jpg": "timeline.jpg",
    "Home page picture 1.jpg": "hall-1.jpg",
    "Home page picture 2.jpg": "hall-2.jpg",
    "Home page picture 1 Resize.jpg": "hall-1-wide.jpg",
    "Home page picture 2 Resize.jpg": "hall-2-wide.jpg",
  };
  for (const [srcName, destName] of Object.entries(heritageMap)) {
    const src = path.join(SRC, srcName);
    if (fs.existsSync(src)) safeCopy(src, path.join(PUBLIC, "images", "heritage", destName));
  }
  const bgm = path.join(SRC, "bgm.mp3");
  if (fs.existsSync(bgm)) safeCopy(bgm, path.join(PUBLIC, "audio", "hall-bgm.mp3"));

  for (const name of fs.readdirSync(SRC)) {
    const full = path.join(SRC, name);
    if (!fs.statSync(full).isFile()) continue;
    if (name.includes("with text.png")) {
      safeCopy(full, path.join(PUBLIC, "images", "heritage", slugify(name.replace(" with text.png", "")) + "-plate.png"));
    } else if (name.includes("(Cartoon)")) {
      safeCopy(full, path.join(PUBLIC, "images", "heritage", slugify(name.replace(/\s*\(Cartoon\).*/, "")) + "-cartoon" + path.extname(name).toLowerCase()));
    } else if (name.includes("(index)")) {
      safeCopy(full, path.join(PUBLIC, "images", "heritage", slugify(name.replace(/\s*\(index\).*/, "")) + "-hall" + path.extname(name).toLowerCase()));
    }
  }

  for (const folder of listDirs(SRC)) {
    const name = path.basename(folder);
    if (name.startsWith("Jerry") || name === "Contemporary Art Quiz") continue;
    const mslug = slugify(name);
    let page = path.join(folder, `${name}.html`);
    if (!fs.existsSync(page)) {
      page = listFiles(folder, ".html").find((c) => slugify(path.basename(c, ".html")) === mslug);
      if (!page) continue;
    }
    const html = fs.readFileSync(page, "utf8");
    const { title } = firstH1(html);
    const paras = paragraphsFromHtml(html);
    const meta = MOVEMENT_META[mslug] ?? { years: "", place: "", order: 500, accent: "#888" };
    let hero = null;
    for (const img of findImages(html)) {
      if (img.toLowerCase().includes(name.toLowerCase().split(" ")[0].toLowerCase()) || img.toLowerCase().includes(mslug.replace(/-/g, ""))) {
        hero = copyMedia(img, folder, path.join(PUBLIC, "images", "movements"), mslug);
        if (hero) break;
      }
    }
    if (!hero) {
      for (const ext of [".jpg", ".jpeg", ".png"]) {
        const cand = path.join(folder, name + ext);
        if (fs.existsSync(cand)) {
          hero = safeCopy(cand, path.join(PUBLIC, "images", "movements", mslug + ext));
          break;
        }
      }
    }
    movements[mslug] = {
      slug: mslug,
      title: title || name,
      years: meta.years,
      place: meta.place,
      order: meta.order,
      accent: meta.accent,
      origin: true,
      heroImage: hero,
      paragraphs: paras,
      artistSlugs: [],
      slideshow: [],
      originalPath: path.relative(SRC, page).split(path.sep).join("/"),
    };
    addRedirect(page, `/rooms/${mslug}`);

    for (const artistDir of listDirs(folder)) {
      const aslug = slugify(path.basename(artistDir));
      let artistPage = path.join(artistDir, `${path.basename(artistDir)}.html`);
      if (!fs.existsSync(artistPage)) {
        const cands = listFiles(artistDir, ".html").filter((c) => slugify(path.basename(c, ".html")) === aslug);
        artistPage = cands[0];
      }
      if (artistPage && fs.existsSync(artistPage)) {
        const ahtml = fs.readFileSync(artistPage, "utf8");
        const { title: atitle, subtitle: asub } = firstH1(ahtml);
        const extra = parseArtistSub(asub);
        const parasA = paragraphsFromHtml(ahtml);
        let portrait = null;
        for (const img of findImages(ahtml).slice(0, 3)) {
          if (img.toLowerCase().includes("artwork")) continue;
          portrait = copyMedia(img, artistDir, path.join(PUBLIC, "images", "portraits"), aslug);
          if (portrait) break;
        }
        if (!portrait) {
          for (const ext of [".jpg", ".jpeg", ".png"]) {
            const cand = path.join(artistDir, path.basename(artistDir) + ext);
            if (fs.existsSync(cand)) {
              portrait = safeCopy(cand, path.join(PUBLIC, "images", "portraits", aslug + ext));
              break;
            }
          }
        }
        artists[aslug] = {
          slug: aslug,
          name: atitle || path.basename(artistDir),
          nationality: extra.nationality,
          life: extra.life,
          movement: mslug,
          portrait,
          paragraphs: parasA,
          workSlugs: [],
          origin: true,
          originalPath: path.relative(SRC, artistPage).split(path.sep).join("/"),
        };
        addRedirect(artistPage, `/artists/${aslug}`);
      } else {
        artists[aslug] = {
          slug: aslug,
          name: path.basename(artistDir),
          nationality: "",
          life: "",
          movement: mslug,
          portrait: null,
          paragraphs: [],
          workSlugs: [],
          origin: true,
          originalPath: path.relative(SRC, artistDir).split(path.sep).join("/"),
        };
      }
      if (!movements[mslug].artistSlugs.includes(aslug)) movements[mslug].artistSlugs.push(aslug);

      for (const wpage of listFiles(artistDir, ".html")) {
        if (artistPage && path.resolve(wpage) === path.resolve(artistPage)) continue;
        const whtml = fs.readFileSync(wpage, "utf8");
        const { title: wtitle, subtitle: wsub } = firstH1(whtml);
        let wslug = slugify(wtitle || path.basename(wpage, ".html"));
        if (wslug === "artworks-collection" || wslug === "artworks-collection-and-bio") wslug = `${aslug}-${wslug}`;
        if (works[wslug]) wslug = `${aslug}-${wslug}`;
        const parasW = paragraphsFromHtml(whtml);
        const lowTitle = (wtitle || "").toLowerCase();
        let kind = "work";
        if (lowTitle.includes("series") || path.basename(wpage).toLowerCase().includes("series")) kind = "series";
        if (lowTitle.includes("collection")) kind = "collection";
        const images = [];
        findImages(whtml).forEach((img, i) => {
          const copied = copyMedia(img, artistDir, path.join(PUBLIC, "images", "works"), i === 0 ? wslug : `${wslug}-${i + 1}`);
          if (copied) images.push(copied);
        });
        if (!images.length) {
          for (const ext of [".jpg", ".jpeg", ".png"]) {
            const cand = path.join(artistDir, path.basename(wpage, ".html") + ext);
            if (fs.existsSync(cand)) {
              const copied = safeCopy(cand, path.join(PUBLIC, "images", "works", wslug + ext));
              if (copied) images.push(copied);
              break;
            }
          }
        }
        works[wslug] = {
          slug: wslug,
          title: wtitle || path.basename(wpage, ".html"),
          artist: aslug,
          movement: mslug,
          subtitle: wsub,
          kind,
          image: images[0] || null,
          images,
          paragraphs: parasW,
          featured: FEATURED_WORKS[wslug] || null,
          origin: true,
          originalPath: path.relative(SRC, wpage).split(path.sep).join("/"),
        };
        addRedirect(wpage, `/works/${wslug}`);
        if (artists[aslug] && !artists[aslug].workSlugs.includes(wslug)) artists[aslug].workSlugs.push(wslug);
        if (works[wslug].image && kind === "work" && !movements[mslug].slideshow.includes(works[wslug].image)) {
          movements[mslug].slideshow.push(works[wslug].image);
        }
      }
    }
  }

  const manifesto = path.join(SRC, "Futurism", "Manifesto of Futurism.pdf");
  if (fs.existsSync(manifesto)) safeCopy(manifesto, path.join(PUBLIC, "docs", "manifesto-of-futurism.pdf"));

  const quizPage = path.join(SRC, "Contemporary Art Quiz", "Contemporary Art Quiz.html");
  let quiz = { title: "Contemporary Art Quiz", questions: [] };
  if (fs.existsSync(quizPage)) {
    const qhtml = fs.readFileSync(quizPage, "utf8");
    const questions = [];
    const blocks = [...qhtml.matchAll(/<h2>([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2>|<\/form>)/gi)];
    for (const [, qhtmlInner, rest] of blocks) {
      const prompt = stripTags(qhtmlInner).replace(/\s+/g, " ").trim();
      const options = [];
      for (const om of rest.matchAll(/<input[^>]+name="(question\d+)"[^>]+value="([^"]+)"[^>]*>\s*([^<]*)/gi)) {
        let label = stripTags(om[3]).trim();
        if (!label) label = decode(om[2]);
        options.push({ value: decode(om[2]), label });
      }
      const img = rest.match(/<img[^>]+src=["']([^"']+)["']/i);
      const audio = rest.match(/<source[^>]+src=["']([^"']+)["']/i);
      questions.push({
        prompt,
        options,
        image: img?.[1] || null,
        audio: audio?.[1] || null,
      });
    }
    const qdir = path.dirname(quizPage);
    for (const q of questions) {
      if (q.image) q.image = copyMedia(q.image, qdir, path.join(PUBLIC, "images", "heritage"), slugify(path.parse(q.image).name) + "-quiz");
      if (q.audio) q.audio = copyMedia(q.audio, qdir, path.join(PUBLIC, "audio"), "minimalism-cue");
    }
    quiz = { title: "Contemporary Art Quiz", questions };
    addRedirect(quizPage, "/play/quiz");
  }

  const xeroxDir = path.join(SRC, "Jerry CG's Works");
  const xeroxImages = [];
  let soundMap = null;
  let xeroxParas = [];
  if (fs.existsSync(xeroxDir)) {
    ["Original.jpg", "0.jpg", "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg"].forEach((name, i) => {
      const p = path.join(xeroxDir, name);
      if (fs.existsSync(p)) {
        const copied = safeCopy(p, path.join(PUBLIC, "images", "jerry", `xerox-${i}${path.extname(p).toLowerCase()}`));
        if (copied) xeroxImages.push(copied);
      }
    });
    const sm = path.join(xeroxDir, "Sound Map.jpg");
    if (fs.existsSync(sm)) soundMap = safeCopy(sm, path.join(PUBLIC, "images", "jerry", "sound-map.jpg"));
    const xeroxHtml = path.join(xeroxDir, "Jerry CG's Contemporary Art.html");
    if (fs.existsSync(xeroxHtml)) {
      xeroxParas = paragraphsFromHtml(fs.readFileSync(xeroxHtml, "utf8"));
      addRedirect(xeroxHtml, "/atelier");
    }
  }

  const apprDir = path.join(SRC, "Jerry's Art Appreciation");
  const fieldPhotos = [];
  const ePhotos = [];
  let apprParas = [];
  let essayParas = [];
  if (fs.existsSync(apprDir)) {
    for (let i = 1; i <= 39; i++) {
      const p = path.join(apprDir, `${i}.jpg`);
      if (fs.existsSync(p)) {
        const copied = safeCopy(p, path.join(PUBLIC, "images", "jerry", `field-${String(i).padStart(2, "0")}.jpg`));
        if (copied) fieldPhotos.push(copied);
      }
    }
    for (let i = 1; i <= 9; i++) {
      const p = path.join(apprDir, `E${i}.jpg`);
      if (fs.existsSync(p)) {
        const copied = safeCopy(p, path.join(PUBLIC, "images", "jerry", `essay-${i}.jpg`));
        if (copied) ePhotos.push(copied);
      }
    }
    for (const [vid, dest] of [
      ["Atlas 3 Beginning.mp4", "atlas-3-beginning.mp4"],
      ["Atlas 3 Ending.mp4", "atlas-3-ending.mp4"],
    ]) {
      const vp = path.join(apprDir, vid);
      if (fs.existsSync(vp)) safeCopy(vp, path.join(PUBLIC, "video", dest));
    }
    const apprHtml = path.join(apprDir, "Jerry CG's Contemporary Art Appreciation.html");
    if (fs.existsSync(apprHtml)) {
      apprParas = paragraphsFromHtml(fs.readFileSync(apprHtml, "utf8"));
      addRedirect(apprHtml, "/atelier#atlas");
    }
    const essayHtml = path.join(apprDir, "Appreciation Essay on visits at Tai Kwun and Art Basel HK 2019.html");
    if (fs.existsSync(essayHtml)) {
      essayParas = paragraphsFromHtml(fs.readFileSync(essayHtml, "utf8"));
      addRedirect(essayHtml, "/atelier#taikwun");
    }
  }

  const introPage = path.join(SRC, "Introduction.html");
  let introduction = { title: "Introduction", paragraphs: [], timelineImage: "/images/heritage/timeline.jpg" };
  if (fs.existsSync(introPage)) {
    const html = fs.readFileSync(introPage, "utf8");
    const { title } = firstH1(html);
    introduction = { title, paragraphs: paragraphsFromHtml(html), timelineImage: "/images/heritage/timeline.jpg" };
    addRedirect(introPage, "/introduction");
  }

  const catalog = {
    movements: Object.values(movements).sort((a, b) => a.order - b.order || a.title.localeCompare(b.title)),
    artists: Object.values(artists).sort((a, b) => a.name.localeCompare(b.name)),
    works: Object.values(works).sort((a, b) => (a.featured || 99) - (b.featured || 99) || a.title.localeCompare(b.title)),
    introduction,
    quiz,
    atelier: {
      xerox: { paragraphs: xeroxParas, images: xeroxImages },
      soundMap: { image: soundMap },
      atlas: {
        paragraphs: apprParas,
        beginning: "/video/atlas-3-beginning.mp4",
        ending: "/video/atlas-3-ending.mp4",
      },
      taikwun: { paragraphs: essayParas, images: ePhotos },
      fieldPhotos,
    },
  };

  ensureDir(CONTENT);
  fs.writeFileSync(path.join(CONTENT, "catalog.json"), JSON.stringify(catalog, null, 2), "utf8");
  fs.writeFileSync(path.join(CONTENT, "redirects.json"), JSON.stringify(redirects, null, 2), "utf8");

  console.log("movements", catalog.movements.length);
  console.log("artists   ", catalog.artists.length);
  console.log("works     ", catalog.works.length);
  console.log("quiz Qs   ", quiz.questions.length);
  console.log("xerox     ", xeroxImages.length);
  console.log("field     ", fieldPhotos.length);
  console.log("redirects ", Object.keys(redirects).length);
}

main();
