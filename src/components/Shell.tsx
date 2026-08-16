"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { withBase } from "@/lib/base";
import { SearchDialog } from "./SearchDialog";
import { SoundToggle } from "./SoundToggle";

const links = [
  { href: "/", label: "Home" },
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
    <div>
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/85 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <img src={withBase("/images/heritage/logo-mark.png")} alt="" className="h-7 w-7 shrink-0 sm:h-8 sm:w-8" />
            <span className="display truncate text-[15px] leading-none tracking-tight sm:text-lg">
              <span className="sm:hidden">Art Hub</span>
              <span className="hidden sm:inline">Contemporary Art Hub</span>
            </span>
          </Link>
          <nav className="ml-auto hidden items-center gap-3 xl:flex">
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
          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2 xl:ml-4">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-full border border-ink/15 px-2.5 py-1 text-[12px] text-ink/60 sm:px-3"
            >
              Search <kbd className="ml-1 hidden opacity-60 sm:inline">/</kbd>
            </button>
            <SoundToggle />
          </div>
        </div>
        <nav className="nav-scroll flex gap-4 overflow-x-auto border-t border-ink/5 px-3 py-2 sm:px-6 xl:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-link shrink-0 whitespace-nowrap ${path === l.href || (l.href !== "/" && path.startsWith(l.href)) ? "text-ink" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </header>
      <main id="content">{children}</main>
      <footer className="mt-14 border-t border-ink/10 pb-[env(safe-area-inset-bottom)] sm:mt-20 md:mt-24">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-ink/60 sm:px-6 sm:py-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="display text-lg text-ink sm:text-xl">Contemporary Art Hub</p>
            <p className="mt-2 max-w-xl">
              Collected and written by JerryCG.{" "}
              <Link href="/archive" className="underline decoration-sky/40 underline-offset-4">
                Original site
              </Link>
            </p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
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
