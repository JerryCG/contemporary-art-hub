#!/usr/bin/env node
/** Pull current exhibitions from public museum APIs into public/data/exhibitions.json */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "data", "exhibitions.json");
const UA = "ContemporaryArtHub/2.0 (https://github.com/JerryCG/contemporary-art-hub)";

const venueBoards = [
  {
    title: "Current exhibitions",
    venue: "M+",
    city: "Hong Kong",
    region: "hong-kong",
    dates: "See the official list",
    why: "Hong Kong’s museum of visual culture.",
    href: "https://www.mplus.org.hk/en/exhibitions/",
  },
  {
    title: "Art programme",
    venue: "Tai Kwun Contemporary",
    city: "Hong Kong",
    region: "hong-kong",
    dates: "See the official list",
    why: "Exhibitions in the former Central Police Station.",
    href: "https://www.taikwun.hk/en/programme/index/art",
  },
  {
    title: "Current programme",
    venue: "Para Site",
    city: "Hong Kong",
    region: "hong-kong",
    dates: "See the official list",
    why: "Independent contemporary space.",
    href: "https://www.para-site.art/",
  },
  {
    title: "Current exhibitions",
    venue: "CHAT",
    city: "Hong Kong",
    region: "hong-kong",
    dates: "See the official list",
    why: "Heritage, arts and textile at The Mills.",
    href: "https://www.mill6chat.org/",
  },
  {
    title: "Exhibitions",
    venue: "National Gallery Singapore",
    city: "Singapore",
    region: "asia",
    dates: "See the official list",
    why: "Modern art in Southeast Asia.",
    href: "https://www.nationalgallery.sg/see-do/exhibitions",
  },
  {
    title: "What’s on",
    venue: "MoMA",
    city: "New York",
    region: "world",
    dates: "See the official list",
    why: "The Museum of Modern Art calendar.",
    href: "https://www.moma.org/calendar/exhibitions",
  },
  {
    title: "What’s on",
    venue: "Tate Modern",
    city: "London",
    region: "world",
    dates: "See the official list",
    why: "Current exhibitions and the Turbine Hall.",
    href: "https://www.tate.org.uk/whats-on",
  },
  {
    title: "Exhibitions",
    venue: "Musée d’Orsay",
    city: "Paris",
    region: "world",
    dates: "See the official list",
    why: "Impressionism and the late nineteenth century.",
    href: "https://www.musee-orsay.fr/en/whats-on/exhibitions",
  },
  {
    title: "Explore online",
    venue: "Google Arts & Culture",
    city: "Online",
    region: "online",
    dates: "Always open",
    why: "Zoom into museum collections from anywhere.",
    href: "https://artsandculture.google.com/",
  },
];

function fmtRange(start, end) {
  const opts = { day: "numeric", month: "short", year: "numeric" };
  const a = start ? new Date(start) : null;
  const b = end ? new Date(end) : null;
  if (a && Number.isNaN(a.getTime())) return "";
  if (b && Number.isNaN(b.getTime())) return a ? a.toLocaleDateString("en-GB", opts) : "";
  if (a && b) return `${a.toLocaleDateString("en-GB", opts)} – ${b.toLocaleDateString("en-GB", opts)}`;
  if (a) return `From ${a.toLocaleDateString("en-GB", opts)}`;
  return "";
}

function isCurrent(start, end, now = new Date()) {
  const s = start ? new Date(start) : null;
  const e = end ? new Date(end) : null;
  if (s && Number.isNaN(s.getTime())) return false;
  if (e && Number.isNaN(e.getTime())) return false;
  if (e && e < now) return false;
  if (s && s > new Date(now.getTime() + 21 * 86400000)) return false;
  return true;
}

async function getJson(url, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: { "User-Agent": UA, Accept: "application/json", ...(init.headers || {}) },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function fetchAic() {
  const body = {
    query: {
      bool: {
        must: [{ term: { status: "Confirmed" } }, { range: { aic_end_at: { gte: "now" } } }],
      },
    },
    limit: 24,
    fields: ["id", "title", "short_description", "web_url", "aic_start_at", "aic_end_at", "status"],
  };
  const data = await getJson("https://api.artic.edu/api/v1/exhibitions/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (data.data || [])
    .filter((x) => isCurrent(x.aic_start_at, x.aic_end_at))
    .slice(0, 10)
    .map((x) => ({
      title: x.title,
      venue: "Art Institute of Chicago",
      city: "Chicago",
      region: "world",
      dates: fmtRange(x.aic_start_at, x.aic_end_at),
      why: (x.short_description || "Now at the Art Institute of Chicago.").replace(/<[^>]+>/g, "").slice(0, 220),
      href: x.web_url || "https://www.artic.edu/exhibitions",
      live: true,
    }));
}

function artBaselCard(now = new Date()) {
  const year = now.getMonth() >= 5 ? now.getFullYear() + 1 : now.getFullYear();
  const month = now.getMonth();
  const soon = month <= 3;
  return {
    title: `Art Basel Hong Kong ${year}`,
    venue: "HKCEC",
    city: "Hong Kong",
    region: "hong-kong",
    dates: soon ? `Spring ${year}` : `Next edition spring ${year}`,
    why: "Hong Kong’s main international art fair.",
    href: "https://www.artbasel.com/hong-kong",
    live: true,
  };
}

async function main() {
  const shows = [...venueBoards, artBaselCard()];
  const errors = [];
  try {
    const aic = await fetchAic();
    shows.push(...aic);
  } catch (e) {
    errors.push(String(e.message || e));
  }

  const order = { "hong-kong": 0, asia: 1, world: 2, online: 3 };
  shows.sort((a, b) => (order[a.region] ?? 9) - (order[b.region] ?? 9) || a.venue.localeCompare(b.venue));

  const payload = {
    fetchedAt: new Date().toISOString(),
    source: errors.length ? "Partial update" : "Updated automatically",
    errors,
    shows,
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log("wrote", OUT, "shows", shows.length, "errors", errors);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
