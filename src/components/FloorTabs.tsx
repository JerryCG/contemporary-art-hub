"use client";

import { useState } from "react";

const tabs = [
  { id: "primer", label: "Primer" },
  { id: "deeper", label: "Deeper" },
  { id: "theory", label: "Theory" },
  { id: "looking", label: "How to look" },
] as const;

export function FloorTabs({
  primer,
  deeper,
  theory,
  looking,
}: {
  primer: React.ReactNode;
  deeper: React.ReactNode;
  theory: React.ReactNode;
  looking: React.ReactNode;
}) {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("primer");
  const panel = { primer, deeper, theory, looking }[tab];
  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-1.5 text-[12px] uppercase tracking-[0.16em] ${
              tab === t.id ? "bg-ink text-paper" : "border border-ink/15 text-ink/60"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-6" role="tabpanel">
        {panel}
      </div>
    </div>
  );
}
