"use client";

import { useMemo, useState } from "react";

const seed = `A roaring motorcar is more beautiful than the Winged Victory. Pure psychic automatism. What you see is what you see. I desire to express my feelings before the light disappears. The idea becomes a machine that makes the art. Color is a liberation. The street enters the house.`;

function shuffle(words: string[]) {
  const a = [...words];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function CutupPage() {
  const [text, setText] = useState(seed);
  const [n, setN] = useState(0);
  const cut = useMemo(() => shuffle(text.split(/\s+/).filter(Boolean)).join(" "), [text, n]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h1 className="display text-5xl">Cut-up</h1>
      <p className="mt-3 text-ink/70">Shuffle a text the Dada way.</p>
      <textarea value={text} onChange={(e) => setText(e.target.value)} className="mt-6 min-h-32 w-full border border-ink/15 bg-paper-raised p-3" />
      <button type="button" onClick={() => setN((x) => x + 1)} className="mt-4 rounded-full bg-ink px-5 py-2 text-paper">
        Tear it up
      </button>
      <p className="display mt-8 text-3xl leading-snug">{cut}</p>
    </div>
  );
}
