"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { addNote, listNotes, listPins, listStudio, type Note, type Pin, type StudioSave } from "@/lib/journal";

export default function JournalPage() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [studio, setStudio] = useState<StudioSave[]>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setPins(listPins());
    setNotes(listNotes());
    setStudio(listStudio());
  }, []);

  const hrefFor = (p: Pin) =>
    p.kind === "work" ? `/works/${p.slug}` : p.kind === "artist" ? `/artists/${p.slug}` : `/rooms/${p.slug}`;

  return (
    <div className="page max-w-3xl">
      <h1 className="display display-page">Journal</h1>
      <p className="mt-4 text-ink/70">Your pins and notes stay in this browser.</p>

      <section className="mt-12">
        <h2 className="display display-section">Pinned</h2>
        {pins.length === 0 && <p className="mt-3 text-ink/50">Nothing pinned yet.</p>}
        <ul className="mt-4 space-y-2">
          {pins.map((p) => (
            <li key={p.kind + p.slug}>
              <Link href={hrefFor(p)} className="hover:text-sky">
                {p.title} <span className="text-xs uppercase tracking-widest text-ink/40">{p.kind}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="display display-section">Notes</h2>
        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.trim()) return;
            setNotes(addNote(draft.trim()));
            setDraft("");
          }}
        >
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} className="min-h-24 w-full border border-ink/15 bg-paper-raised p-3" placeholder="A note…" />
          <button type="submit" className="mt-3 rounded-full bg-ink px-5 py-2 text-sm text-paper">
            Keep
          </button>
        </form>
        <ul className="mt-6 space-y-4">
          {notes.map((n) => (
            <li key={n.id} className="border-l border-ink/15 pl-4">
              <p>{n.body}</p>
              <p className="mt-1 text-xs text-ink/40">{new Date(n.at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </section>

      {studio.length > 0 && (
        <section className="mt-12">
          <h2 className="display display-section">Studio saves</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {studio.map((s) => (
              <figure key={s.id}>
                <img src={s.url} alt="" className="w-full" />
                <figcaption className="mt-1 text-xs text-ink/50">
                  {s.movement} · {s.prompt}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
