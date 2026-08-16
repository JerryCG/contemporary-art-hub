"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Work } from "@/lib/types";

export function HallSlideshow({
  slides,
}: {
  slides: { work: Work; artist: string }[];
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % slides.length), 6500);
    return () => window.clearInterval(t);
  }, [paused, slides.length]);

  if (!slides.length) return null;
  const current = slides[i];

  return (
    <section
      className="relative min-h-[68svh] overflow-hidden bg-ink sm:min-h-[76svh] md:min-h-[88vh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, idx) => (
        <div
          key={s.work.slug}
          className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}
        >
          {s.work.image && (
            <img src={s.work.image} alt="" className="h-full w-full object-cover object-center" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/30" />
        </div>
      ))}

      <div className="relative z-10 flex min-h-[68svh] flex-col items-center justify-center px-4 pb-36 pt-16 text-center sm:min-h-[76svh] sm:pb-32 md:min-h-[88vh] md:pb-28">
        <div className="max-w-3xl">
          <h1 className="display display-hero text-paper drop-shadow">Contemporary Art Hub</h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-paper/85 sm:mt-5 sm:text-lg">
            Learn, look, and make contemporary art.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 sm:mt-8">
            <Link href="/rooms" className="rounded-full bg-paper px-5 py-2.5 text-sm text-ink sm:px-6">
              Browse rooms
            </Link>
            <Link href="/play/quiz" className="rounded-full border border-paper/40 px-5 py-2.5 text-sm text-paper sm:px-6">
              Take a quiz
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-3 bg-gradient-to-t from-ink/85 to-transparent px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-10 sm:flex-row sm:items-end sm:justify-between sm:px-8 md:px-10">
        <Link href={`/works/${current.work.slug}`} className="min-w-0 text-left text-paper/90">
          <span className="display block text-lg leading-tight sm:text-xl">{current.work.title}</span>
          <span className="mt-1 block text-[11px] uppercase tracking-[0.16em] text-paper/60">{current.artist}</span>
        </Link>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            aria-label="Previous work"
            className="h-9 w-9 shrink-0 rounded-full border border-paper/40 text-paper sm:h-10 sm:w-10"
            onClick={() => setI((n) => (n - 1 + slides.length) % slides.length)}
          >
            ‹
          </button>
          <div className="nav-scroll flex max-w-[42vw] gap-1.5 overflow-x-auto sm:max-w-none">
            {slides.map((s, idx) => (
              <button
                key={s.work.slug}
                type="button"
                aria-label={s.work.title}
                onClick={() => setI(idx)}
                className={`h-1.5 shrink-0 rounded-full transition-all ${idx === i ? "w-5 bg-paper sm:w-6" : "w-1.5 bg-paper/40"}`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next work"
            className="h-9 w-9 shrink-0 rounded-full border border-paper/40 text-paper sm:h-10 sm:w-10"
            onClick={() => setI((n) => (n + 1) % slides.length)}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
