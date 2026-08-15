#!/usr/bin/env node
/** Build a static museum for GitHub Pages (no Node server required on the host). */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP = path.join(ROOT, "src", "app");
const HIDE_DIR = path.join(ROOT, ".static-hide");
const HIDE = ["api", "archive"];

const basePath = process.env.BASE_PATH ?? process.env.NEXT_PUBLIC_BASE_PATH ?? "/contemporary-art-hub";

function hideServerOnlyRoutes() {
  fs.mkdirSync(HIDE_DIR, { recursive: true });
  for (const name of HIDE) {
    const from = path.join(APP, name);
    const to = path.join(HIDE_DIR, name);
    if (fs.existsSync(from)) {
      if (fs.existsSync(to)) fs.rmSync(to, { recursive: true, force: true });
      fs.renameSync(from, to);
    }
  }
}

function restore() {
  for (const name of HIDE) {
    const from = path.join(HIDE_DIR, name);
    const to = path.join(APP, name);
    if (!fs.existsSync(from)) continue;
    if (fs.existsSync(to)) fs.rmSync(to, { recursive: true, force: true });
    fs.renameSync(from, to);
  }
  if (fs.existsSync(HIDE_DIR) && fs.readdirSync(HIDE_DIR).length === 0) {
    fs.rmdirSync(HIDE_DIR);
  }
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
}

hideServerOnlyRoutes();
try {
  const env = {
    ...process.env,
    STATIC_EXPORT: "1",
    BASE_PATH: basePath,
    NEXT_PUBLIC_BASE_PATH: basePath,
  };
  const npmCmd = process.platform === "win32" ? "npx.cmd" : "npx";
  const result = spawnSync(npmCmd, ["next", "build"], { cwd: ROOT, stdio: "inherit", env, shell: process.platform === "win32" });
  if (result.status !== 0) process.exit(result.status ?? 1);

  const out = path.join(ROOT, "out");
  copyDir(path.join(ROOT, "archive", "original-site"), path.join(out, "archive"));
  fs.writeFileSync(path.join(out, ".nojekyll"), "");
  const notFound = path.join(out, "404", "index.html");
  if (fs.existsSync(notFound)) fs.copyFileSync(notFound, path.join(out, "404.html"));
  console.log("Static museum written to out/");
  console.log("GitHub Pages URL: https://jerrycg.github.io" + (basePath || "") + "/");
} finally {
  restore();
}
