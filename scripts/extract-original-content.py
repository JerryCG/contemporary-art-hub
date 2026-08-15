#!/usr/bin/env python3
"""Extract original Hub HTML into content/catalog.json and copy images into public/."""

from __future__ import annotations

import json
import re
import shutil
import unicodedata
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "archive" / "original-site"
PUBLIC = ROOT / "public"
CONTENT = ROOT / "content"

MOVEMENT_META = {
    "impressionism": {"years": "c. 1870–1890", "place": "Paris", "order": 10, "accent": "#7eb6d9"},
    "neo-impressionism": {"years": "c. 1886–1906", "place": "France", "order": 20, "accent": "#6aa8c9"},
    "post-impressionism": {"years": "c. 1886–1905", "place": "France / the Pacific", "order": 30, "accent": "#2c4c8a"},
    "symbolism": {"years": "c. 1886–1910", "place": "Paris / Vienna", "order": 35, "accent": "#6b4c8a"},
    "fauvism": {"years": "1905–1908", "place": "Paris / Collioure", "order": 40, "accent": "#e85d04"},
    "expressionism": {"years": "c. 1905–1925", "place": "Germany / Austria / Norway", "order": 50, "accent": "#9b2226"},
    "cubism": {"years": "1907–1920s", "place": "Paris", "order": 60, "accent": "#b08968"},
    "futurism": {"years": "1909–1944", "place": "Italy", "order": 70, "accent": "#d00000"},
    "primitivism": {"years": "c. 1890–1930", "place": "France / Europe", "order": 75, "accent": "#2d6a4f"},
    "suprematism": {"years": "1915–1930s", "place": "Russia", "order": 80, "accent": "#111111"},
    "constructivism": {"years": "1915–1930s", "place": "Russia", "order": 90, "accent": "#c1121f"},
    "dadaism": {"years": "1916–1924", "place": "Zurich / New York / Paris", "order": 100, "accent": "#222222"},
    "purism": {"years": "1918–1925", "place": "Paris", "order": 105, "accent": "#778da9"},
    "surrealism": {"years": "1924–1960s", "place": "Paris / Belgium / Spain", "order": 110, "accent": "#3d348b"},
    "abstract-art": {"years": "c. 1911–", "place": "Europe / USA", "order": 115, "accent": "#4361ee"},
    "de-stijl": {"years": "1917–1931", "place": "the Netherlands", "order": 118, "accent": "#e9c46a"},
    "abstract-expressionism": {"years": "1940s–1960s", "place": "New York", "order": 130, "accent": "#264653"},
    "pop-art": {"years": "1950s–1970s", "place": "London / New York", "order": 140, "accent": "#ff006e"},
    "minimalism": {"years": "1960s–1970s", "place": "New York", "order": 150, "accent": "#111111"},
    "conceptual-art": {"years": "1960s–", "place": "USA / Europe", "order": 160, "accent": "#495057"},
    "after-1980": {"years": "1980–now", "place": "worldwide", "order": 180, "accent": "#00bbf9"},
}

FEATURED_WORKS = {
    "impression-sunrise": 1,
    "a-sunday-afternoon-on-the-island-of-la-grande-jatte": 2,
    "the-starry-night": 3,
    "the-persistence-of-memory": 4,
    "the-scream": 5,
    "guernica": 6,
}

SKIP_TITLES = {
    "back to the artist",
    "other works",
    "representative artists",
    "representative works of art",
}


def slugify(text: str) -> str:
    text = unescape(text)
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = text.lower()
    text = text.replace("&", " and ")
    text = re.sub(r"['’]", "", text)
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def strip_tags(html: str) -> str:
    html = re.sub(r"<br\s*/?>", "\n", html, flags=re.I)
    html = re.sub(r"</p>", "\n", html, flags=re.I)
    html = re.sub(r"<script[\s\S]*?</script>", " ", html, flags=re.I)
    html = re.sub(r"<style[\s\S]*?</style>", " ", html, flags=re.I)
    html = re.sub(r"<[^>]+>", " ", html)
    html = unescape(html)
    html = html.replace("\xa0", " ")
    html = re.sub(r"[ \t]+", " ", html)
    html = re.sub(r"\n\s*\n+", "\n\n", html)
    return html.strip()


def paragraphs_from_html(html: str) -> list[str]:
    body = re.search(r"<body[^>]*>([\s\S]*)</body>", html, re.I)
    chunk = body.group(1) if body else html
    chunk = re.sub(r"<script[\s\S]*?</script>", "", chunk, flags=re.I)
    chunk = re.sub(r"<style[\s\S]*?</style>", "", chunk, flags=re.I)
    # drop nav-ish lists of "other works" after the last real paragraph block
    found: list[str] = []
    for match in re.finditer(r"<p\b[^>]*>([\s\S]*?)</p>", chunk, re.I):
        text = strip_tags(match.group(1))
        text = re.sub(r"\s+", " ", text).strip()
        if len(text) < 40:
            continue
        low = text.lower()
        if low.startswith("back to") or low.startswith("click "):
            continue
        found.append(text)
    return found


def first_h1(html: str) -> tuple[str, str]:
    m = re.search(r"<h1[^>]*>([\s\S]*?)</h1>", html, re.I)
    if not m:
        t = re.search(r"<title>([\s\S]*?)</title>", html, re.I)
        return (strip_tags(t.group(1)) if t else "Untitled", "")
    inner = m.group(1)
    sub = re.search(r"<sub[^>]*>([\s\S]*?)</sub>", inner, re.I)
    subtitle = strip_tags(sub.group(1)) if sub else ""
    inner = re.sub(r"<sub[\s\S]*?</sub>", "", inner, flags=re.I)
    title = strip_tags(inner).strip(" -–—")
    title = title.replace("_", "").strip()
    return title, subtitle


def parse_artist_sub(sub: str) -> dict:
    # (French, 1840-1926, Impressionism)
    inner = sub.strip().strip("()")
    parts = [p.strip() for p in inner.split(",") if p.strip()]
    out = {"nationality": "", "life": "", "movementHint": ""}
    if not parts:
        return out
    out["nationality"] = parts[0]
    if len(parts) >= 2 and re.search(r"\d{3,4}", parts[1]):
        out["life"] = parts[1].replace(" ", "")
        if len(parts) >= 3:
            out["movementHint"] = ", ".join(parts[2:])
    elif len(parts) >= 2:
        out["movementHint"] = ", ".join(parts[1:])
    return out


def find_images(html: str) -> list[str]:
    srcs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html, flags=re.I)
    return [unescape(s).replace("\\", "/") for s in srcs]


def safe_copy(src: Path, dest: Path) -> str | None:
    if not src.exists() or not src.is_file():
        return None
    dest.parent.mkdir(parents=True, exist_ok=True)
    if not dest.exists():
        shutil.copy2(src, dest)
    return "/" + dest.relative_to(PUBLIC).as_posix()


def copy_media(rel_src: str, page_dir: Path, dest_dir: Path, dest_stem: str) -> str | None:
    rel_src = rel_src.split("?")[0]
    if rel_src.startswith("../"):
        candidate = (page_dir / rel_src).resolve()
    else:
        candidate = (page_dir / rel_src).resolve()
    if not candidate.exists():
        return None
    ext = candidate.suffix.lower() or ".jpg"
    dest = dest_dir / f"{dest_stem}{ext}"
    # avoid overwrite collisions
    n = 2
    while dest.exists() and dest.stat().st_size != candidate.stat().st_size:
        dest = dest_dir / f"{dest_stem}-{n}{ext}"
        n += 1
    return safe_copy(candidate, dest)


def extract_intro(html: str) -> dict:
    title, _ = first_h1(html)
    paras = paragraphs_from_html(html)
    return {"title": title, "paragraphs": paras, "timelineImage": "/images/heritage/timeline.jpg"}


def extract_quiz(html: str) -> dict:
    questions = []
    blocks = re.findall(r"<h2>([\s\S]*?)</h2>([\s\S]*?)(?=<h2>|</form>)", html, re.I)
    for qhtml, rest in blocks:
        prompt = strip_tags(qhtml)
        prompt = re.sub(r"\s+", " ", prompt).strip()
        options = []
        for m in re.finditer(
            r'<input[^>]+name="(question\d+)"[^>]+value="([^"]+)"[^>]*>\s*([^<]*)',
            rest,
            re.I,
        ):
            label = strip_tags(m.group(3)).strip()
            if not label:
                label = unescape(m.group(2))
            options.append({"value": unescape(m.group(2)), "label": label})
        img = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', rest, re.I)
        audio = re.search(r'<source[^>]+src=["\']([^"\']+)["\']', rest, re.I)
        questions.append(
            {
                "prompt": prompt,
                "options": options,
                "image": img.group(1) if img else None,
                "audio": audio.group(1) if audio else None,
            }
        )
    return {"title": "Contemporary Art Quiz", "questions": questions}


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"missing archive at {SRC}")

    for d in [
        PUBLIC / "images" / "works",
        PUBLIC / "images" / "portraits",
        PUBLIC / "images" / "movements",
        PUBLIC / "images" / "jerry",
        PUBLIC / "images" / "heritage",
        PUBLIC / "audio",
        PUBLIC / "video",
        PUBLIC / "docs",
        CONTENT,
    ]:
        d.mkdir(parents=True, exist_ok=True)

    movements: dict[str, dict] = {}
    artists: dict[str, dict] = {}
    works: dict[str, dict] = {}
    redirects: dict[str, str] = {}

    def add_redirect(orig: Path, dest: str) -> None:
        rel = orig.relative_to(SRC).as_posix()
        redirects["/archive/" + rel] = dest
        redirects["/" + rel] = dest

    # heritage root assets
    heritage_map = {
        "Logo.png": "logo.png",
        "Logo-removebg.png": "logo-mark.png",
        "Welcome.gif": "welcome.gif",
        "Hey.gif": "hey.gif",
        "bgm.mp3": None,  # audio
        "Timelines of Contemporary Art.jpg": "timeline.jpg",
        "Home page picture 1.jpg": "hall-1.jpg",
        "Home page picture 2.jpg": "hall-2.jpg",
        "Home page picture 1 Resize.jpg": "hall-1-wide.jpg",
        "Home page picture 2 Resize.jpg": "hall-2-wide.jpg",
    }
    for src_name, dest_name in heritage_map.items():
        src = SRC / src_name
        if not src.exists():
            continue
        if src.suffix.lower() == ".mp3":
            safe_copy(src, PUBLIC / "audio" / "hall-bgm.mp3")
        else:
            safe_copy(src, PUBLIC / "images" / "heritage" / dest_name)

    for img in SRC.glob("*with text.png"):
        safe_copy(img, PUBLIC / "images" / "heritage" / slugify(img.stem.replace(" with text", "")) + "-plate.png")
    for img in SRC.glob("*(Cartoon).*"):
        safe_copy(img, PUBLIC / "images" / "heritage" / slugify(img.stem.replace(" (Cartoon)", "")) + "-cartoon" + img.suffix.lower())
    for img in SRC.glob("*(index).*"):
        safe_copy(img, PUBLIC / "images" / "heritage" / slugify(re.sub(r"\s*\(index\)", "", img.stem)) + "-hall" + img.suffix.lower())

    # movements
    for folder in sorted([p for p in SRC.iterdir() if p.is_dir()]):
        name = folder.name
        if name.startswith("Jerry") or name == "Contemporary Art Quiz":
            continue
        mslug = slugify(name)
        page = folder / f"{name}.html"
        if not page.exists():
            # try case variants
            cands = list(folder.glob("*.html"))
            page = next((c for c in cands if slugify(c.stem) == mslug), None)
            if page is None:
                continue
        html = page.read_text(encoding="utf-8", errors="replace")
        title, _ = first_h1(html)
        paras = paragraphs_from_html(html)
        meta = MOVEMENT_META.get(mslug, {"years": "", "place": "", "order": 500, "accent": "#888"})
        hero = None
        for img in find_images(html):
            if any(x in img.lower() for x in [mslug.replace("-", ""), name.lower().split()[0].lower()]):
                hero = copy_media(img, folder, PUBLIC / "images" / "movements", mslug)
                if hero:
                    break
        if not hero:
            for ext in (".jpg", ".jpeg", ".png"):
                cand = folder / f"{name}{ext}"
                if cand.exists():
                    hero = safe_copy(cand, PUBLIC / "images" / "movements" / f"{mslug}{ext}")
                    break
        movements[mslug] = {
            "slug": mslug,
            "title": title or name,
            "years": meta["years"],
            "place": meta["place"],
            "order": meta["order"],
            "accent": meta["accent"],
            "origin": True,
            "heroImage": hero,
            "paragraphs": paras,
            "artistSlugs": [],
            "slideshow": [],
            "originalPath": page.relative_to(SRC).as_posix(),
        }
        add_redirect(page, f"/rooms/{mslug}")

        # artists
        for artist_dir in sorted([p for p in folder.iterdir() if p.is_dir()]):
            aslug = slugify(artist_dir.name)
            artist_page = artist_dir / f"{artist_dir.name}.html"
            if not artist_page.exists():
                cands = [c for c in artist_dir.glob("*.html") if slugify(c.stem) == aslug]
                artist_page = cands[0] if cands else None
            if artist_page and artist_page.exists():
                ahtml = artist_page.read_text(encoding="utf-8", errors="replace")
                atitle, asub = first_h1(ahtml)
                extra = parse_artist_sub(asub)
                paras_a = paragraphs_from_html(ahtml)
                portrait = None
                for img in find_images(ahtml)[:3]:
                    if "artwork" in img.lower():
                        continue
                    portrait = copy_media(img, artist_dir, PUBLIC / "images" / "portraits", aslug)
                    if portrait:
                        break
                if not portrait:
                    for ext in (".jpg", ".jpeg", ".png"):
                        cand = artist_dir / f"{artist_dir.name}{ext}"
                        if cand.exists():
                            portrait = safe_copy(cand, PUBLIC / "images" / "portraits" / f"{aslug}{ext}")
                            break
                artists[aslug] = {
                    "slug": aslug,
                    "name": atitle or artist_dir.name,
                    "nationality": extra["nationality"],
                    "life": extra["life"],
                    "movement": mslug,
                    "portrait": portrait,
                    "paragraphs": paras_a,
                    "workSlugs": [],
                    "origin": True,
                    "originalPath": artist_page.relative_to(SRC).as_posix(),
                }
                add_redirect(artist_page, f"/artists/{aslug}")
            else:
                artists[aslug] = {
                    "slug": aslug,
                    "name": artist_dir.name,
                    "nationality": "",
                    "life": "",
                    "movement": mslug,
                    "portrait": None,
                    "paragraphs": [],
                    "workSlugs": [],
                    "origin": True,
                    "originalPath": artist_dir.relative_to(SRC).as_posix(),
                }

            if aslug not in movements[mslug]["artistSlugs"]:
                movements[mslug]["artistSlugs"].append(aslug)

            # works / series / collections
            for wpage in sorted(artist_dir.glob("*.html")):
                if artist_page and wpage.resolve() == artist_page.resolve():
                    continue
                whtml = wpage.read_text(encoding="utf-8", errors="replace")
                wtitle, wsub = first_h1(whtml)
                wslug = slugify(wtitle) if wtitle else slugify(wpage.stem)
                if wslug in ("artworks-collection", "artworks-collection-and-bio"):
                    wslug = f"{aslug}-{wslug}"
                if wslug in works:
                    wslug = f"{aslug}-{wslug}"
                paras_w = paragraphs_from_html(whtml)
                kind = "work"
                low_title = (wtitle or "").lower()
                if "series" in low_title or "series" in wpage.stem.lower():
                    kind = "series"
                if "collection" in low_title:
                    kind = "collection"
                images: list[str] = []
                for i, img in enumerate(find_images(whtml)):
                    dest_stem = wslug if i == 0 else f"{wslug}-{i+1}"
                    copied = copy_media(img, artist_dir, PUBLIC / "images" / "works", dest_stem)
                    if copied:
                        images.append(copied)
                if not images:
                    # sibling image with similar name
                    for ext in (".jpg", ".jpeg", ".png"):
                        cand = artist_dir / f"{wpage.stem}{ext}"
                        if cand.exists():
                            copied = safe_copy(cand, PUBLIC / "images" / "works" / f"{wslug}{ext}")
                            if copied:
                                images.append(copied)
                            break
                works[wslug] = {
                    "slug": wslug,
                    "title": wtitle or wpage.stem,
                    "artist": aslug,
                    "movement": mslug,
                    "subtitle": wsub,
                    "kind": kind,
                    "image": images[0] if images else None,
                    "images": images,
                    "paragraphs": paras_w,
                    "featured": FEATURED_WORKS.get(wslug),
                    "origin": True,
                    "originalPath": wpage.relative_to(SRC).as_posix(),
                }
                add_redirect(wpage, f"/works/{wslug}")
                if aslug in artists and wslug not in artists[aslug]["workSlugs"]:
                    artists[aslug]["workSlugs"].append(wslug)
                if works[wslug]["image"] and works[wslug]["image"] not in movements[mslug]["slideshow"]:
                    if kind == "work":
                        movements[mslug]["slideshow"].append(works[wslug]["image"])

            # leftover images that belong to series (Monet haystacks etc.)
            for imgf in artist_dir.iterdir():
                if imgf.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
                    continue
                # already copied as portrait or a work hero? still copy extras into a bin for series pages
                pass

    # manifesto
    manifesto = SRC / "Futurism" / "Manifesto of Futurism.pdf"
    if manifesto.exists():
        safe_copy(manifesto, PUBLIC / "docs" / "manifesto-of-futurism.pdf")

    # quiz
    quiz_page = SRC / "Contemporary Art Quiz" / "Contemporary Art Quiz.html"
    quiz = {"title": "Contemporary Art Quiz", "questions": []}
    if quiz_page.exists():
        qhtml = quiz_page.read_text(encoding="utf-8", errors="replace")
        quiz = extract_quiz(qhtml)
        qdir = quiz_page.parent
        for q in quiz["questions"]:
            if q.get("image"):
                copied = copy_media(q["image"], qdir, PUBLIC / "images" / "heritage", slugify(Path(q["image"]).stem) + "-quiz")
                q["image"] = copied
            if q.get("audio"):
                copied = copy_media(q["audio"], qdir, PUBLIC / "audio", "minimalism-cue")
                q["audio"] = copied
        add_redirect(quiz_page, "/play/quiz")

    # atelier
    xerox_dir = SRC / "Jerry CG's Works"
    xerox_images = []
    if xerox_dir.exists():
        order = ["Original.jpg", "0.jpg", "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg"]
        for i, name in enumerate(order):
            p = xerox_dir / name
            if p.exists():
                copied = safe_copy(p, PUBLIC / "images" / "jerry" / f"xerox-{i}{p.suffix.lower()}")
                if copied:
                    xerox_images.append(copied)
        sm = xerox_dir / "Sound Map.jpg"
        sound_map = safe_copy(sm, PUBLIC / "images" / "jerry" / "sound-map.jpg") if sm.exists() else None
        xerox_html = xerox_dir / "Jerry CG's Contemporary Art.html"
        xerox_paras = paragraphs_from_html(xerox_html.read_text(encoding="utf-8", errors="replace")) if xerox_html.exists() else []
        if xerox_html.exists():
            add_redirect(xerox_html, "/atelier")
    else:
        sound_map = None
        xerox_paras = []

    appr_dir = SRC / "Jerry's Art Appreciation"
    field_photos = []
    e_photos = []
    if appr_dir.exists():
        for i in range(1, 40):
            p = appr_dir / f"{i}.jpg"
            if p.exists():
                copied = safe_copy(p, PUBLIC / "images" / "jerry" / f"field-{i:02d}.jpg")
                if copied:
                    field_photos.append(copied)
        for i in range(1, 10):
            p = appr_dir / f"E{i}.jpg"
            if p.exists():
                copied = safe_copy(p, PUBLIC / "images" / "jerry" / f"essay-{i}.jpg")
                if copied:
                    e_photos.append(copied)
        for vid, dest in [
            ("Atlas 3 Beginning.mp4", "atlas-3-beginning.mp4"),
            ("Atlas 3 Ending.mp4", "atlas-3-ending.mp4"),
        ]:
            vp = appr_dir / vid
            if vp.exists():
                safe_copy(vp, PUBLIC / "video" / dest)
        appr_html = appr_dir / "Jerry CG's Contemporary Art Appreciation.html"
        appr_paras = paragraphs_from_html(appr_html.read_text(encoding="utf-8", errors="replace")) if appr_html.exists() else []
        essay_html = appr_dir / "Appreciation Essay on visits at Tai Kwun and Art Basel HK 2019.html"
        essay_paras = paragraphs_from_html(essay_html.read_text(encoding="utf-8", errors="replace")) if essay_html.exists() else []
        if appr_html.exists():
            add_redirect(appr_html, "/atelier#atlas")
        if essay_html.exists():
            add_redirect(essay_html, "/atelier#taikwun")
    else:
        appr_paras = []
        essay_paras = []

    intro_page = SRC / "Introduction.html"
    introduction = extract_intro(intro_page.read_text(encoding="utf-8", errors="replace")) if intro_page.exists() else {"title": "Introduction", "paragraphs": []}
    if intro_page.exists():
        add_redirect(intro_page, "/introduction")

    # tidy artist work lists: series first after singles
    catalog = {
        "movements": sorted(movements.values(), key=lambda m: (m["order"], m["title"])),
        "artists": sorted(artists.values(), key=lambda a: a["name"]),
        "works": sorted(works.values(), key=lambda w: (w.get("featured") or 99, w["title"])),
        "introduction": introduction,
        "quiz": quiz,
        "atelier": {
            "xerox": {"paragraphs": xerox_paras, "images": xerox_images},
            "soundMap": {"image": sound_map},
            "atlas": {
                "paragraphs": appr_paras,
                "beginning": "/video/atlas-3-beginning.mp4",
                "ending": "/video/atlas-3-ending.mp4",
            },
            "taikwun": {"paragraphs": essay_paras, "images": e_photos},
            "fieldPhotos": field_photos,
        },
    }

    CONTENT.mkdir(parents=True, exist_ok=True)
    (CONTENT / "catalog.json").write_text(json.dumps(catalog, ensure_ascii=False, indent=2), encoding="utf-8")
    (CONTENT / "redirects.json").write_text(json.dumps(redirects, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"movements {len(movements)}")
    print(f"artists    {len(artists)}")
    print(f"works      {len(works)}")
    print(f"quiz Qs    {len(quiz.get('questions', []))}")
    print(f"xerox      {len(xerox_images)}")
    print(f"field      {len(field_photos)}")
    print(f"redirects  {len(redirects)}")
    print(f"wrote      {CONTENT / 'catalog.json'}")


if __name__ == "__main__":
    main()
