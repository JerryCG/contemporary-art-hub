"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { withBase } from "@/lib/base";
import { SearchDialog } from "./SearchDialog";
import { SoundToggle } from "./SoundToggle";

const links = [
  { href: "/", label: "Hall" },
  { href: "/rooms", label: "Rooms" },
  { href: "/timeline", label: "Timeline" },
  { href: "/play", label: "Play" },
  { href: "/studio", label: "Studio" },
  { href: "/atelier", label: "Atelier" },
  { href: "/now", label: "Now" },
  { href: "/learn", label: "Learn" },
  { href: "/journal", label: "Journal" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [classic, setClassic] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "/" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={classic ? "classic-hub outline outline-[14px] outline-[#d4af37]" : ""}>
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={withBase("/images/heritage/logo-mark.png")} alt="" className="h-8 w-8" />
            <span className="display text-lg leading-none tracking-tight">
              Contemporary Art Hub
            </span>
          </Link>
          <nav className="ml-auto hidden items-center gap-4 lg:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`nav-link ${path === l.href || (l.href !== "/" && path.startsWith(l.href)) ? "text-ink" : ""}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 lg:ml-4">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-full border border-ink/15 px-3 py-1 text-[12px] text-ink/60"
            >
              Search <kbd className="ml-1 opacity-60">/</kbd>
            </button>
            <SoundToggle />
            <button
              type="button"
              title="Classic Hub wink"
              onClick={() => setClassic((v) => !v)}
              className="hidden h-8 w-8 items-center justify-center rounded-full border border-ink/15 text-[11px] text-ink/50 sm:flex"
            >
              JG
            </button>
          </div>
        </div>
        <nav className="flex gap-3 overflow-x-auto border-t border-ink/5 px-4 py-2 lg:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link whitespace-nowrap">
              {l.label}
            </Link>
          ))}
        </nav>
      </header>
      <main id="content">{children}</main>
      <footer className="mt-24 border-t border-ink/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-ink/60 md:flex-row md:items-end md:justify-between md:px-6">
          <div>
            <p className="display text-xl text-ink">A personal museum for looking, making, and remembering.</p>
            <p className="mt-2 max-w-xl">
              Original writing, works, and field notes by JerryCG. The 2026 rebuild keeps every original page in{" "}
              <Link href="/archive" className="underline decoration-sky/50 underline-offset-4">
                the archive
              </Link>
              .
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/introduction">Introduction</Link>
            <Link href="/atelier">Atelier</Link>
            <Link href="/learn">Library</Link>
          </div>
        </div>
      </footer>
      <SearchDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
