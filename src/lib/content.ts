import catalogJson from "../../content/catalog.json";
import { withBase } from "./base";
import {
  extraArtists,
  extraLinksToOriginalRooms,
  extraMovements,
  extraWorks,
  movementFloors,
} from "./expansion";
import type { Artist, Catalog, Movement, Work } from "./types";

const raw = catalogJson as Catalog;

function isAssetPath(value: string) {
  return /^\/(images|audio|video|docs)\//.test(value);
}

function prefixAssets<T>(value: T): T {
  if (typeof value === "string") return (isAssetPath(value) ? withBase(value) : value) as T;
  if (Array.isArray(value)) return value.map((item) => prefixAssets(item)) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = prefixAssets(v);
    return out as T;
  }
  return value;
}

const movementMap = new Map<string, Movement>();
for (const m of raw.movements) {
  const floors = movementFloors[m.slug];
  movementMap.set(m.slug, {
    ...m,
    deeper: floors?.deeper,
    theory: floors?.theory,
    looking: floors?.looking,
    playHint: floors?.playHint,
    artistSlugs: [...m.artistSlugs],
  });
}
for (const m of extraMovements) {
  const existing = movementMap.get(m.slug);
  if (existing) {
    movementMap.set(m.slug, {
      ...existing,
      ...m,
      paragraphs: existing.paragraphs.length ? existing.paragraphs : m.paragraphs,
      artistSlugs: Array.from(new Set([...existing.artistSlugs, ...m.artistSlugs])),
    });
  } else {
    movementMap.set(m.slug, { ...m });
  }
}

const artistMap = new Map<string, Artist>();
for (const a of raw.artists) artistMap.set(a.slug, { ...a, workSlugs: [...a.workSlugs] });
for (const a of extraArtists) {
  if (!artistMap.has(a.slug)) artistMap.set(a.slug, { ...a, workSlugs: [...a.workSlugs] });
}

const workMap = new Map<string, Work>();
for (const w of raw.works) workMap.set(w.slug, { ...w, images: [...w.images] });
for (const w of extraWorks) {
  if (!workMap.has(w.slug)) workMap.set(w.slug, w);
  const artist = artistMap.get(w.artist);
  if (artist && !artist.workSlugs.includes(w.slug)) artist.workSlugs.push(w.slug);
}

for (const [mslug, slugs] of Object.entries(extraLinksToOriginalRooms)) {
  const m = movementMap.get(mslug);
  if (!m) continue;
  for (const s of slugs) {
    if (!m.artistSlugs.includes(s)) m.artistSlugs.push(s);
  }
}

export const catalog: Catalog = prefixAssets({
  ...raw,
  movements: Array.from(movementMap.values()).sort((a, b) => a.order - b.order),
  artists: Array.from(artistMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
  works: Array.from(workMap.values()).sort(
    (a, b) => (a.featured || 99) - (b.featured || 99) || a.title.localeCompare(b.title),
  ),
});

export function getMovement(slug: string) {
  return catalog.movements.find((m) => m.slug === slug);
}
export function getArtist(slug: string) {
  return catalog.artists.find((a) => a.slug === slug);
}
export function getWork(slug: string) {
  return catalog.works.find((w) => w.slug === slug);
}
export function artistsIn(movement: string) {
  return catalog.artists.filter((a) => a.movement === movement);
}
export function worksByArtist(slug: string) {
  const a = getArtist(slug);
  if (!a) return [];
  return a.workSlugs.map((s) => workMap.get(s)).filter(Boolean) as Work[];
}
export function worksInMovement(slug: string) {
  return catalog.works.filter((w) => w.movement === slug);
}
export function featuredWorks() {
  return catalog.works.filter((w) => w.featured).sort((a, b) => (a.featured || 0) - (b.featured || 0));
}
export function relatedWorks(work: Work, limit = 6) {
  return catalog.works
    .filter((w) => w.slug !== work.slug && (w.artist === work.artist || w.movement === work.movement))
    .slice(0, limit);
}

export type SearchHit = {
  type: "movement" | "artist" | "work" | "glossary";
  slug: string;
  title: string;
  href: string;
  blurb: string;
};

export function searchAll(q: string, glossary: { slug: string; term: string; short: string }[]): SearchHit[] {
  const s = q.trim().toLowerCase();
  if (s.length < 2) return [];
  const hits: SearchHit[] = [];
  for (const m of catalog.movements) {
    if (`${m.title} ${m.paragraphs.join(" ")}`.toLowerCase().includes(s)) {
      hits.push({ type: "movement", slug: m.slug, title: m.title, href: `/rooms/${m.slug}`, blurb: m.years });
    }
  }
  for (const a of catalog.artists) {
    if (`${a.name} ${a.paragraphs.join(" ")}`.toLowerCase().includes(s)) {
      hits.push({
        type: "artist",
        slug: a.slug,
        title: a.name,
        href: `/artists/${a.slug}`,
        blurb: [a.nationality, a.life].filter(Boolean).join(", "),
      });
    }
  }
  for (const w of catalog.works) {
    if (`${w.title} ${w.paragraphs.join(" ")}`.toLowerCase().includes(s)) {
      hits.push({ type: "work", slug: w.slug, title: w.title, href: `/works/${w.slug}`, blurb: getArtist(w.artist)?.name || "" });
    }
  }
  for (const g of glossary) {
    if (`${g.term} ${g.short}`.toLowerCase().includes(s)) {
      hits.push({ type: "glossary", slug: g.slug, title: g.term, href: `/learn#${g.slug}`, blurb: g.short });
    }
  }
  return hits.slice(0, 24);
}

export const influence = [
  ["impressionism", "neo-impressionism"],
  ["impressionism", "post-impressionism"],
  ["post-impressionism", "fauvism"],
  ["post-impressionism", "cubism"],
  ["post-impressionism", "expressionism"],
  ["symbolism", "surrealism"],
  ["fauvism", "expressionism"],
  ["cubism", "futurism"],
  ["cubism", "purism"],
  ["cubism", "constructivism"],
  ["cubism", "suprematism"],
  ["dadaism", "surrealism"],
  ["dadaism", "conceptual-art"],
  ["suprematism", "de-stijl"],
  ["abstract-art", "de-stijl"],
  ["abstract-art", "abstract-expressionism"],
  ["abstract-expressionism", "minimalism"],
  ["abstract-expressionism", "pop-art"],
  ["dadaism", "pop-art"],
  ["minimalism", "conceptual-art"],
  ["conceptual-art", "after-1980"],
  ["pop-art", "after-1980"],
];
