"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { catalog } from "@/lib/content";

function CompareInner() {
  const withImage = useMemo(() => catalog.works.filter((w) => w.image), []);
  const sp = useSearchParams();
  const [a, setA] = useState(sp.get("a") || withImage[0]?.slug || "");
  const [b, setB] = useState(withImage[1]?.slug || "");
  const [split, setSplit] = useState(50);
  const A = withImage.find((w) => w.slug === a);
  const B = withImage.find((w) => w.slug === b);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <p className="chip">Series thinking</p>
      <h1 className="display mt-4 text-5xl">Two at Once</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <select value={a} onChange={(e) => setA(e.target.value)} className="border border-ink/15 bg-paper px-3 py-2">
          {withImage.map((w) => (
            <option key={w.slug} value={w.slug}>
              {w.title}
            </option>
          ))}
        </select>
        <select value={b} onChange={(e) => setB(e.target.value)} className="border border-ink/15 bg-paper px-3 py-2">
          {withImage.map((w) => (
            <option key={w.slug} value={w.slug}>
              {w.title}
            </option>
          ))}
        </select>
      </div>
      <div className="relative mt-8 aspect-[16/9] overflow-hidden bg-ink">
        {B?.image && <img src={B.image} alt={B.title} className="absolute inset-0 h-full w-full object-contain" />}
        {A?.image && (
          <div className="absolute inset-0 overflow-hidden" style={{ width: `${split}%` }}>
            <img src={A.image} alt={A.title} className="h-full w-[100vw] max-w-none object-contain object-left" />
          </div>
        )}
        <div className="absolute inset-y-0 w-px bg-paper" style={{ left: `${split}%` }} />
      </div>
      <input type="range" min={0} max={100} value={split} onChange={(e) => setSplit(Number(e.target.value))} className="mt-4 w-full" />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense>
      <CompareInner />
    </Suspense>
  );
}
