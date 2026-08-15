"use client";

import { useEffect, useState } from "react";
import { curatedShows, type Show } from "@/lib/exhibitions";

const filters = ["all", "hong-kong", "asia", "world", "online"] as const;

export function ExhibitionBoard() {
  const [shows, setShows] = useState<Show[]>(curatedShows);
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [note, setNote] = useState("Curated calendar");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/exhibitions`)
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.shows) && d.shows.length) {
          setShows(d.shows);
          setNote(d.source || "Calendar");
        }
      })
      .catch(() => {});
  }, []);

  const visible = shows.filter((s) => filter === "all" || s.region === filter);

  return (
    <div className="mt-10">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-[12px] uppercase tracking-[0.16em] ${filter === f ? "bg-ink text-paper" : "border border-ink/15"}`}
          >
            {f}
          </button>
        ))}
      </div>
      <p className="mt-4 text-xs uppercase tracking-widest text-ink/40">{note}</p>
      <ul className="mt-6 space-y-6">
        {visible.map((s) => (
          <li key={s.title + s.venue} className="border-b border-ink/10 pb-6">
            <p className="text-[11px] uppercase tracking-[0.18em] text-ink/45">
              {s.city} · {s.dates}
            </p>
            <a href={s.href} target="_blank" rel="noreferrer" className="display mt-1 block text-3xl hover:text-sky">
              {s.title}
            </a>
            <p className="mt-1 text-sm text-ink/55">{s.venue}</p>
            <p className="mt-2 max-w-2xl text-ink/75">{s.why}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
