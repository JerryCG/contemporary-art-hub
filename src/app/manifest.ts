import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const dynamic = "force-static";
export const revalidate = false;

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Contemporary Art Hub",
    short_name: "Art Hub",
    description: "A simple guide to contemporary art: movements, artists, a quiz, and a studio.",
    id: `${base}/`,
    start_url: `${base}/`,
    scope: `${base}/`,
    display: "standalone",
    display_override: ["standalone", "minimal-ui", "browser"],
    background_color: "#f3eee4",
    theme_color: "#f3eee4",
    lang: "en",
    dir: "ltr",
    orientation: "any",
    categories: ["education", "entertainment"],
    icons: [
      { src: `${base}/icons/icon-192.png`, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: `${base}/icons/icon-512.png`, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: `${base}/icons/icon-512-maskable.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
