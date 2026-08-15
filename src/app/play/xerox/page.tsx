"use client";

import { useRef } from "react";

export default function XeroxPage() {
  const ref = useRef<HTMLCanvasElement>(null);

  function onFile(file: File) {
    const img = new Image();
    img.onload = () => {
      const c = ref.current;
      if (!c) return;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      const w = 280;
      const h = Math.round((img.height / img.width) * w);
      c.width = w * 3 + 16;
      c.height = h * 3 + 16;
      ctx.fillStyle = "#f3eee4";
      ctx.fillRect(0, 0, c.width, c.height);
      const tmp = document.createElement("canvas");
      tmp.width = w;
      tmp.height = h;
      const tctx = tmp.getContext("2d")!;
      tctx.drawImage(img, 0, 0, w, h);
      for (let i = 0; i < 9; i++) {
        const data = tctx.getImageData(0, 0, w, h);
        const d = data.data;
        for (let p = 0; p < d.length; p += 4) {
          const g = d[p] * 0.3 + d[p + 1] * 0.5 + d[p + 2] * 0.2;
          const n = (Math.random() - 0.5) * (18 + i * 10);
          const v = Math.max(0, Math.min(255, g + n + i * 6));
          const bw = v > 140 - i * 4 ? 255 : v < 80 + i * 3 ? 0 : v;
          d[p] = d[p + 1] = d[p + 2] = bw;
        }
        tctx.putImageData(data, 0, 0);
        const x = (i % 3) * (w + 8);
        const y = Math.floor(i / 3) * (h + 8);
        ctx.drawImage(tmp, x, y);
      }
    };
    img.src = URL.createObjectURL(file);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h1 className="display text-5xl">Xerox</h1>
      <p className="mt-4 text-ink/70">Upload a photo and watch each copy lose detail.</p>
      <input type="file" accept="image/*" className="mt-6" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      <canvas ref={ref} className="mt-6 w-full bg-paper-deep" />
    </div>
  );
}
