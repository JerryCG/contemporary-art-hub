"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Slide = { src: string; caption?: string; alt?: string };

const MIN = 1;
const MAX = 5;

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

export function SlideDesk({
  slides,
  label = "Slide",
  landscape = false,
}: {
  slides: Slide[];
  label?: string;
  landscape?: boolean;
}) {
  const [i, setI] = useState(0);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const pinch = useRef<{ dist: number; scale: number } | null>(null);
  const stage = useRef<HTMLDivElement>(null);

  const slide = slides[i];
  const go = useCallback(
    (n: number) => {
      setI((n + slides.length) % slides.length);
      setScale(1);
      setPos({ x: 0, y: 0 });
    },
    [slides.length],
  );

  const zoomBy = useCallback((delta: number, around?: { x: number; y: number }) => {
    setScale((s) => {
      const next = clamp(Number((s + delta).toFixed(2)), MIN, MAX);
      if (around && stage.current) {
        const r = stage.current.getBoundingClientRect();
        const cx = around.x - r.left - r.width / 2;
        const cy = around.y - r.top - r.height / 2;
        const k = next / s;
        setPos((p) => ({ x: cx - (cx - p.x) * k, y: cy - (cy - p.y) * k }));
      }
      if (next <= 1) setPos({ x: 0, y: 0 });
      return next;
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") go(i + 1);
      if (e.key === "ArrowLeft") go(i - 1);
      if (e.key === "+" || e.key === "=") zoomBy(0.25);
      if (e.key === "-" || e.key === "_") zoomBy(-0.25);
      if (e.key === "0") {
        setScale(1);
        setPos({ x: 0, y: 0 });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, i, zoomBy]);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const onWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      zoomBy(e.deltaY < 0 ? 0.2 : -0.2, { x: e.clientX, y: e.clientY });
    };
    el.addEventListener("wheel", onWheelNative, { passive: false });
    return () => el.removeEventListener("wheel", onWheelNative);
  }, [zoomBy]);

  if (!slides.length || !slide) return null;

  function onPointerDown(e: React.PointerEvent) {
    if (scale <= 1) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current || scale <= 1) return;
    setPos({
      x: drag.current.px + (e.clientX - drag.current.x),
      y: drag.current.py + (e.clientY - drag.current.y),
    });
  }
  function onPointerUp() {
    drag.current = null;
  }

  function onTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 2) {
      const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      pinch.current = { dist: d, scale };
    }
  }
  function onTouchMove(e: React.TouchEvent) {
    if (e.touches.length === 2 && pinch.current) {
      e.preventDefault();
      const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      const next = clamp(pinch.current.scale * (d / pinch.current.dist), MIN, MAX);
      setScale(next);
      if (next <= 1) setPos({ x: 0, y: 0 });
    }
  }

  const pct = Math.round(scale * 100);

  return (
    <div className="mt-8">
      <div
        ref={stage}
        className={`relative overflow-hidden bg-ink ${landscape ? "aspect-[16/9] max-h-[78svh]" : "min-h-[68svh] md:min-h-[78svh]"}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        style={{ touchAction: scale > 1 ? "none" : "pan-y" }}
      >
        <img
          src={slide.src}
          alt={slide.alt || slide.caption || `${label} ${i + 1}`}
          draggable={false}
          className="pointer-events-none absolute left-1/2 top-1/2 select-none object-contain"
          style={{
            transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
            transformOrigin: "center center",
            maxHeight: "100%",
            maxWidth: "100%",
          }}
        />
        {slides.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous"
              className="absolute left-3 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full border border-paper/30 bg-ink/40 text-lg text-paper"
              onClick={() => go(i - 1)}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next"
              className="absolute right-3 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full border border-paper/30 bg-ink/40 text-lg text-paper"
              onClick={() => go(i + 1)}
            >
              ›
            </button>
          </>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink/60">
          <span className="uppercase tracking-[0.16em] text-ink/40">{label}</span>{" "}
          {i + 1} / {slides.length}
          {slide.caption ? ` · ${slide.caption}` : ""}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full border border-ink/15 px-3 py-1 text-sm"
            onClick={() => zoomBy(-0.25)}
            aria-label="Zoom out"
          >
            −
          </button>
          <button
            type="button"
            className="min-w-14 rounded-full border border-ink/15 px-3 py-1 text-xs tracking-widest text-ink/55"
            onClick={() => {
              setScale(1);
              setPos({ x: 0, y: 0 });
            }}
          >
            {pct}%
          </button>
          <button
            type="button"
            className="rounded-full border border-ink/15 px-3 py-1 text-sm"
            onClick={() => zoomBy(0.25)}
            aria-label="Zoom in"
          >
            +
          </button>
        </div>
      </div>
      <p className="mt-2 text-xs text-ink/40">
        + and − zoom. Arrow keys turn the {label.toLowerCase()}. Drag when zoomed.
      </p>

      {slides.length > 1 && (
        <div className="nav-scroll mt-4 flex gap-2 overflow-x-auto pb-1">
          {slides.map((s, idx) => (
            <button
              key={s.src}
              type="button"
              onClick={() => go(idx)}
              className={`h-16 w-12 shrink-0 overflow-hidden border sm:h-20 sm:w-14 ${
                landscape ? "w-20 sm:w-24" : ""
              } ${idx === i ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              <img src={s.src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
