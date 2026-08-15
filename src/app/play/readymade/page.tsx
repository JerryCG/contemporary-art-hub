"use client";

import { useMemo, useState } from "react";

const objects = ["a bicycle wheel", "a bottle rack", "a snow shovel", "a comb", "a coat rack", "a urinal", "a typewriter cover", "a kitchen knife", "an umbrella", "a fluorescent tube"];
const verbs = ["Fountain", "In Advance of the Broken Arm", "Trap", "Gift", "Why Not Sneeze", "The Bride", "Untitled (Specific)", "Declaration"];

export default function ReadymadePage() {
  const [obj, setObj] = useState(objects[0]);
  const [n, setN] = useState(0);
  const title = useMemo(() => {
    const t = verbs[n % verbs.length];
    return `${t} (${obj})`;
  }, [obj, n]);

  return (
    <div className="mx-auto max-w-xl px-4 py-16 md:px-6">
      <h1 className="display text-5xl">Readymade</h1>
      <p className="mt-4 text-ink/70">Pick an everyday object and give it a title.</p>
      <select value={obj} onChange={(e) => setObj(e.target.value)} className="mt-8 w-full border border-ink/15 bg-paper px-3 py-2">
        {objects.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <button type="button" onClick={() => setN((x) => x + 1)} className="mt-4 text-sm underline">
        Another title
      </button>
      <p className="display mt-10 text-4xl leading-tight">{title}</p>
    </div>
  );
}
