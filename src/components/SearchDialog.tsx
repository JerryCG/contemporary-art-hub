"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { catalog, searchAll } from "@/lib/content";
import { glossary } from "@/lib/glossary";

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const router = useRouter();
  const hits = useMemo(() => searchAll(q, glossary.map((g) => ({ slug: g.slug, term: g.term, short: g.short }))), [q]);

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 p-4 pt-[12vh]" onClick={onClose}>
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl bg-paper-raised shadow-frame"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${catalog.works.length} works, ${catalog.artists.length} artists, rooms…`}
          className="w-full border-b border-ink/10 bg-transparent px-4 py-4 outline-none"
        />
        <ul className="max-h-[50vh] overflow-auto py-2">
          {hits.length === 0 && q.length >= 2 && (
            <li className="px-4 py-6 text-sm text-ink/50">Nothing in the Hub matches yet.</li>
          )}
          {hits.map((h) => (
            <li key={h.type + h.slug}>
              <button
                type="button"
                className="flex w-full items-baseline justify-between gap-4 px-4 py-2 text-left hover:bg-paper-deep"
                onClick={() => {
                  router.push(h.href);
                  onClose();
                }}
              >
                <span>
                  <span className="display text-lg">{h.title}</span>
                  <span className="ml-2 text-xs uppercase tracking-widest text-ink/40">{h.type}</span>
                </span>
                <span className="text-xs text-ink/50">{h.blurb}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
