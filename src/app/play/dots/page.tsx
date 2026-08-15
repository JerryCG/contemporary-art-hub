"use client";

import { useRef, useState } from "react";

const palette = ["#2a6f97", "#e9c46a", "#e76f51", "#264653", "#f4a261", "#83c5be", "#ffffff"];

export default function DotsPage() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState(palette[0]);

  function stamp(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = ref.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(((e.clientX - r.left) / r.width) * c.width, ((e.clientY - r.top) / r.height) * c.height, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h1 className="display text-5xl">Dots</h1>
      <p className="mt-4 text-ink/70">Place dots of color. Step back and they mix in your eye.</p>
      <div className="mt-6 flex gap-2">
        {palette.map((p) => (
          <button key={p} type="button" onClick={() => setColor(p)} className="h-8 w-8 rounded-full border border-ink/20" style={{ background: p }} />
        ))}
        <button
          type="button"
          className="ml-auto text-sm underline"
          onClick={() => ref.current?.getContext("2d")?.clearRect(0, 0, 900, 600)}
        >
          Clear
        </button>
      </div>
      <canvas
        ref={ref}
        width={900}
        height={600}
        className="mt-4 w-full cursor-crosshair border border-ink/10 bg-[#e9edf0]"
        onPointerDown={stamp}
        onPointerMove={(e) => e.buttons === 1 && stamp(e)}
      />
    </div>
  );
}
