import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const ROOT = path.join(process.cwd(), "archive", "original-site");

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

export async function GET(_req: Request, ctx: { params: Promise<{ path?: string[] }> }) {
  const { path: parts } = await ctx.params;
  const rel = (parts && parts.length ? parts.join("/") : "index.html").replace(/\\/g, "/");
  if (rel.includes("..")) return new NextResponse("Not found", { status: 404 });
  let file = path.join(ROOT, rel);
  try {
    let data: Buffer | string = await readFile(file);
    const ext = path.extname(file).toLowerCase();
    if (ext === ".html") {
      const dir = path.posix.dirname("/archive/" + rel.replace(/\\/g, "/"));
      const base = (dir.endsWith("/") ? dir : dir + "/").replace("/archive/.", "/archive/");
      let html = data.toString("utf8");
      if (!html.includes("<base ")) {
        html = html.replace(/<head([^>]*)>/i, `<head$1><base href="${base}">`);
      }
      data = html;
    }
    return new NextResponse(data, {
      headers: { "Content-Type": types[ext] || "application/octet-stream" },
    });
  } catch {
    try {
      file = path.join(ROOT, rel, "index.html");
      const data = await readFile(file);
      return new NextResponse(data, { headers: { "Content-Type": types[".html"] } });
    } catch {
      return new NextResponse("Not found in the original archive.", { status: 404 });
    }
  }
}
