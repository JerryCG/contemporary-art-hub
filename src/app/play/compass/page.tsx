"use client";

import { useState } from "react";
import Link from "next/link";

const qs = [
  {
    q: "What mood do you want today?",
    opts: [
      { t: "Sun on water", r: "impressionism" },
      { t: "A storm in the chest", r: "expressionism" },
      { t: "A precise dream", r: "surrealism" },
      { t: "Almost nothing", r: "minimalism" },
    ],
  },
  {
    q: "A picture should…",
    opts: [
      { t: "Capture a moment", r: "impressionism" },
      { t: "Think from many sides", r: "cubism" },
      { t: "Refuse to behave", r: "dadaism" },
      { t: "Be an idea you can say", r: "conceptual-art" },
    ],
  },
  {
    q: "Your favorite material?",
    opts: [
      { t: "Broken color", r: "impressionism" },
      { t: "Loud unmixed paint", r: "fauvism" },
      { t: "A grocery can", r: "pop-art" },
      { t: "A fluorescent tube", r: "minimalism" },
    ],
  },
  {
    q: "Speed or stillness?",
    opts: [
      { t: "Force-lines, now", r: "futurism" },
      { t: "A long look at a square", r: "suprematism" },
      { t: "Optical dots, patient", r: "neo-impressionism" },
      { t: "A walk into land", r: "after-1980" },
    ],
  },
  {
    q: "If you had to drop one thing?",
    opts: [
      { t: "The object", r: "abstract-art" },
      { t: "The handmade", r: "conceptual-art" },
      { t: "Good taste", r: "dadaism" },
      { t: "The single viewpoint", r: "cubism" },
    ],
  },
  {
    q: "A last hunger.",
    opts: [
      { t: "Gold and myth", r: "symbolism" },
      { t: "The New York field", r: "abstract-expressionism" },
      { t: "A diagonal in red", r: "constructivism" },
      { t: "Night-blue and nerve", r: "post-impressionism" },
    ],
  },
];

export default function CompassPage() {
  const [i, setI] = useState(0);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const done = i >= qs.length;
  const winner = Object.entries(votes).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "impressionism";

  return (
    <div className="page max-w-xl">
      <h1 className="display display-page">Compass</h1>
      <p className="mt-3 text-ink/70">Six short questions. Then we suggest a room.</p>
      {!done ? (
        <div className="mt-10">
          <p className="text-xs uppercase tracking-widest text-ink/40">
            {i + 1} / {qs.length}
          </p>
          <h2 className="display display-section mt-3">{qs[i].q}</h2>
          <div className="mt-6 space-y-3">
            {qs[i].opts.map((o) => (
              <button
                key={o.t}
                type="button"
                className="block w-full border border-ink/15 px-4 py-3 text-left hover:bg-paper-deep"
                onClick={() => {
                  setVotes((v) => ({ ...v, [o.r]: (v[o.r] || 0) + 1 }));
                  setI((n) => n + 1);
                }}
              >
                {o.t}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-10">
          <p className="text-ink/60">A room that may fit:</p>
          <p className="display display-page mt-2 capitalize">{winner.replace(/-/g, " ")}</p>
          <Link href={`/rooms/${winner}`} className="mt-8 inline-block rounded-full bg-ink px-5 py-2 text-paper">
            Open
          </Link>
        </div>
      )}
    </div>
  );
}
