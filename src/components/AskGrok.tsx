"use client";

import { useState } from "react";

export function AskGrok({
  title,
  artist,
  movement,
  paragraphs,
}: {
  title: string;
  artist: string;
  movement: string;
  paragraphs: string[];
}) {
  const [q, setQ] = useState("What should I notice first?");
  const [a, setA] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function ask() {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, title, artist, movement, text: paragraphs.join("\n\n") }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not ask");
      setA(data.text);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not ask");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-10 border-t border-ink/10 pt-6">
      <p className="text-[11px] uppercase tracking-[0.2em] text-ink/45">Ask the looking companion</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="min-w-0 flex-1 border border-ink/15 bg-paper-raised px-3 py-2 text-sm outline-none"
        />
        <button type="button" onClick={ask} disabled={busy} className="bg-ink px-4 py-2 text-sm text-paper disabled:opacity-50 sm:shrink-0">
          {busy ? "…" : "Ask"}
        </button>
      </div>
      {err && <p className="mt-3 text-sm text-ink/60">{err}</p>}
      {a && <p className="mt-4 text-[1.02rem] leading-relaxed text-ink/85">{a}</p>}
    </div>
  );
}
