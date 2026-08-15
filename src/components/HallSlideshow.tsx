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
      className="relative min-h-[78vh] overflow-hidden bg-ink md:min-h-[88vh]"
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
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-ink/25" />
        </div>
      ))}

      <div className="relative z-10 flex min-h-[78vh] flex-col items-center justify-center px-4 py-24 text-center md:min-h-[88vh]">
        <div className="max-w-3xl">
          <h1 className="display text-5xl leading-[0.92] text-paper drop-shadow md:text-7xl">Contemporary Art Hub</h1>
          <p className="mx-auto mt-5 max-w-lg text-lg text-paper/85">Learn, look, and make contemporary art.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/rooms" className="rounded-full bg-paper px-6 py-2.5 text-sm text-ink">
              Browse rooms
            </Link>
            <Link href="/play/quiz" className="rounded-full border border-paper/40 px-6 py-2.5 text-sm text-paper">
              Take a quiz
            </Link>
          </div>
        </div>
      </div>

      <Link
        href={`/works/${current.work.slug}`}
        className="absolute bottom-8 left-6 z-10 max-w-xs text-left text-paper/90 md:left-10"
      >
        <span className="display text-xl leading-tight">{current.work.title}</span>
        <span className="mt-1 block text-xs uppercase tracking-[0.16em] text-paper/60">{current.artist}</span>
      </Link>

      <div className="absolute bottom-8 right-6 z-10 flex items-center gap-3 md:right-10">
        <button
          type="button"
          aria-label="Previous work"
          className="h-10 w-10 rounded-full border border-paper/40 text-paper"
          onClick={() => setI((n) => (n - 1 + slides.length) % slides.length)}
        >
          ‹
        </button>
        <div className="flex gap-1.5">
          {slides.map((s, idx) => (
            <button
              key={s.work.slug}
              type="button"
              aria-label={s.work.title}
              onClick={() => setI(idx)}
              className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-paper" : "w-1.5 bg-paper/40"}`}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next work"
          className="h-10 w-10 rounded-full border border-paper/40 text-paper"
          onClick={() => setI((n) => (n + 1) % slides.length)}
        >
          ›
        </button>
      </div>
    </section>
  );
}
