"use client";

import { useState } from "react";

export function LookCloser({ images, title }: { images: string[]; title: string }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState(false);
  if (!images.length) {
    return (
      <div className="flex min-h-[50vh] items-end bg-ink p-8 text-paper">
        <p className="display text-4xl leading-tight">{title}</p>
      </div>
    );
  }
  const src = images[i];
  return (
    <div>
      <button type="button" className="frame w-full overflow-hidden" onClick={() => setZoom(true)}>
        <img src={src} alt={title} className="w-full cursor-zoom-in object-contain" />
      </button>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((im, idx) => (
            <button key={im} type="button" onClick={() => setI(idx)} className={`h-16 w-16 overflow-hidden border ${idx === i ? "border-ink" : "border-transparent"}`}>
              <img src={im} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
      <p className="mt-2 text-xs text-ink/45">Click the picture to look closer. Esc to leave.</p>
      {zoom && (
        <div
          className="fixed inset-0 z-50 overflow-auto bg-ink/95 p-6"
          onClick={() => setZoom(false)}
          onKeyDown={(e) => e.key === "Escape" && setZoom(false)}
        >
          <img src={src} alt={title} className="mx-auto max-w-none cursor-zoom-out" style={{ width: "min(1600px, 140%)" }} />
        </div>
      )}
    </div>
  );
}
