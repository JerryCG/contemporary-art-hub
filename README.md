# Contemporary Art Hub

A personal museum for looking, making, and remembering.

## How to open it

There is **no new `index.html` at the project root** to double-click. The rebuilt Hub is an app (Next.js). A browser cannot run it from `file://` the way the old site could.

| What you want | What to open |
|---|---|
| **Original site** (offline, double-click) | `archive/original-site/index.html` or `start-here.html` |
| **New museum, on this PC** | Double-click `dev.cmd`, then visit http://localhost:3000 |
| **New museum, on the internet** | Push to GitHub → GitHub Pages → https://jerrycg.github.io/contemporary-art-hub/ |

`dev.cmd` is **not** a Python virtual environment. It only starts a small local web server so the new pages, images, and (optional) Studio can load. Close the window when you are done.

## GitHub Pages

Yes — this repo is set up to host the **new** museum on GitHub Pages as a static site.

1. Push `master` to `https://github.com/JerryCG/contemporary-art-hub`
2. Repo **Settings → Pages → Source: GitHub Actions**
3. After the workflow finishes, open  
   **https://jerrycg.github.io/contemporary-art-hub/**

What works on GitHub Pages: rooms, artists, works, atelier, play toys, quiz, journal, learn, the curated exhibition list, the original archive at `/archive/`.

What needs a local server (or a host like Vercel) plus `XAI_API_KEY`: the AI Studio and the “looking companion.” GitHub Pages cannot keep a secret API key.

## Local museum

Node 20+ (or the portable copy in `.tools` used by `dev.cmd`):

```bash
npm install
npm run dev
```

Then http://localhost:3000

Optional Studio:

1. Copy `.env.example` to `.env.local`
2. Add `XAI_API_KEY` from [console.x.ai](https://console.x.ai)
3. Restart `npm run dev`

## Archive

Frozen original website: `archive/original-site/`

- Double-click `archive/original-site/index.html`
- Or, in the new app, `/archive`

Do not “clean” that folder.

## Content

- Original writing: `content/catalog.json`
- New rooms and deeper floors: `src/lib/expansion.ts`
- Re-extract after editing the archive: `npm run extract`

## Scripts

| Command | What |
|---|---|
| `npm run dev` | Local museum (full app, including Studio APIs) |
| `npm run build:pages` | Static files in `out/` for GitHub Pages |
| `npm run extract` | Rebuild catalog from the archive |
