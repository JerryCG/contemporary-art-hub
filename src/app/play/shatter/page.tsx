"use client";

import { useRef } from "react";

export default function ShatterPage() {
  const canvas = useRef<HTMLCanvasElement>(null);

  function onFile(file: File) {
    const img = new Image();
    img.onload = () => {
      const c = canvas.current;
      if (!c) return;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#1a1714";
      ctx.fillRect(0, 0, c.width, c.height);
      const cols = 8;
      const rows = 6;
      const sw = img.width / cols;
      const sh = img.height / rows;
      const dw = c.width / cols;
      const dh = c.height / rows;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          ctx.save();
          ctx.translate(x * dw + dw / 2 + (Math.random() - 0.5) * 18, y * dh + dh / 2 + (Math.random() - 0.5) * 18);
          ctx.rotate((Math.random() - 0.5) * 0.45);
          ctx.drawImage(img, x * sw, y * sh, sw, sh, -dw / 2, -dh / 2, dw * 0.95, dh * 0.95);
          ctx.restore();
        }
      }
    };
    img.src = URL.createObjectURL(file);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h1 className="display text-5xl">Shatter</h1>
      <p className="mt-4 text-ink/70">Upload a photo to break it into Cubist facets.</p>
      <input
        type="file"
        accept="image/*"
        className="mt-6"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
      <canvas ref={canvas} width={900} height={640} className="mt-6 w-full bg-ink" />
    </div>
  );
}
