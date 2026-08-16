import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const ROOT = path.join(process.cwd(), "archive", "original-site");
const PREFIX = (process.env.NEXT_PUBLIC_BASE_PATH || process.env.BASE_PATH || "") + "/archive";

const types: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8",
};

/** Original homepage used JerryCG without the space that the folders actually have. */
const ALIASES: Record<string, string> = {
  "JerryCG's Works/JerryCG's Contemporary Art.html": "Jerry CG's Works/Jerry CG's Contemporary Art.html",
  "JerryCG's Works/Jerry CG's Contemporary Art.html": "Jerry CG's Works/Jerry CG's Contemporary Art.html",
  "Jerry's Art Appreciation/JerryCG's Contemporary Art Appreciation.html":
    "Jerry's Art Appreciation/Jerry CG's Contemporary Art Appreciation.html",
};

function decodeRel(raw: string) {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function candidates(rel: string) {
  const trimmed = rel.replace(/\\/g, "/").replace(/\/+$/, "") || "index.html";
  const decoded = decodeRel(trimmed);
  const out = [decoded];
  if (ALIASES[decoded]) out.push(ALIASES[decoded]);
  if (decoded.includes("JerryCG")) out.push(decoded.replaceAll("JerryCG", "Jerry CG"));
  if (!path.extname(decoded)) out.push(decoded + "/index.html", decoded + ".html");
  return [...new Set(out)];
}

function rewriteArchiveHtml(html: string) {
  return html
    .replaceAll("JerryCG's Works/JerryCG's Contemporary Art.html", "Jerry CG's Works/Jerry CG's Contemporary Art.html")
    .replaceAll(
      "Jerry's Art Appreciation/JerryCG's Contemporary Art Appreciation.html",
      "Jerry's Art Appreciation/Jerry CG's Contemporary Art Appreciation.html",
    )
    .replaceAll('href="/.html"', 'href="#"')
    .replaceAll('href=".html"', 'href="#"')
    .replaceAll('href="..//.html"', 'href="#"');
}

export async function GET(_req: Request, ctx: { params: Promise<{ path?: string[] }> }) {
  const { path: parts } = await ctx.params;
  const joined = (parts && parts.length ? parts.filter(Boolean).join("/") : "index.html").replace(/\\/g, "/");
  if (joined.split("/").some((p) => p === "..")) {
    return new NextResponse("Not found", { status: 404 });
  }

  for (const rel of candidates(joined)) {
    const file = path.join(ROOT, rel);
    try {
      let data: Buffer | string = await readFile(file);
      const ext = path.extname(file).toLowerCase();
      if (ext === ".html") {
        const dir = path.posix.dirname(`${PREFIX}/${rel.replace(/\\/g, "/")}`);
        const base = (dir.endsWith("/") ? dir : `${dir}/`).replace(/\/archive\/\.\//, "/archive/");
        let html = rewriteArchiveHtml(data.toString("utf8"));
        if (!html.includes("<base ")) {
          html = html.replace(/<head([^>]*)>/i, `<head$1><base href="${base}">`);
        }
        data = html;
      }
      return new NextResponse(data, {
        headers: { "Content-Type": types[ext] || "application/octet-stream" },
      });
    } catch {
      /* try the next candidate */
    }
  }

  return new NextResponse("Not found in the original archive.", { status: 404 });
}
