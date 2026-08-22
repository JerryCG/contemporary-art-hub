"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export type NetNode = {
  slug: string;
  title: string;
  years: string;
  place: string;
  accent: string;
  heroImage: string | null;
};

export type NetEdge = { from: string; to: string };

type Sim = {
  slug: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  pin: boolean;
};

function startYear(years: string) {
  const decade = years.match(/(\d{4})s/);
  if (decade) return Number(decade[1]);
  const y = years.match(/(\d{4})/);
  return y ? Number(y[1]) : 1900;
}

function shortName(title: string) {
  if (title === "Abstract Expressionism") return "AbEx";
  if (title === "Neo-impressionism") return "Neo-imp.";
  if (title === "Post-impressionism") return "Post-imp.";
  if (title === "Conceptual Art") return "Conceptual";
  if (title === "Abstract art") return "Abstract";
  if (title === "After 1980") return "After 1980";
  return title;
}

export function InfluenceNet({ nodes, edges }: { nodes: NetNode[]; edges: NetEdge[] }) {
  const router = useRouter();
  const wrap = useRef<HTMLDivElement>(null);
  const sim = useRef<Sim[]>([]);
  const drag = useRef<{ slug: string; dx: number; dy: number } | null>(null);
  const [size, setSize] = useState({ w: 800, h: 560 });
  const [tick, setTick] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const [sel, setSel] = useState<string | null>(null);
  const [t, setT] = useState(0);

  const bySlug = useMemo(() => new Map(nodes.map((n) => [n.slug, n])), [nodes]);
  const degree = useMemo(() => {
    const d = new Map<string, number>();
    for (const n of nodes) d.set(n.slug, 0);
    for (const e of edges) {
      d.set(e.from, (d.get(e.from) || 0) + 1);
      d.set(e.to, (d.get(e.to) || 0) + 1);
    }
    return d;
  }, [nodes, edges]);

  const years = useMemo(() => new Map(nodes.map((n) => [n.slug, startYear(n.years)])), [nodes]);
  const ymin = Math.min(...[...years.values()]);
  const ymax = Math.max(...[...years.values()]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      const w = Math.round(Math.max(320, r.width));
      const h = Math.round(Math.max(420, r.height));
      setSize((s) => (s.w === w && s.h === h ? s : { w, h }));
    });
    ro.observe(el);
    const r = el.getBoundingClientRect();
    setSize({ w: Math.max(320, r.width), h: Math.max(420, r.height) });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const { w, h } = size;
    const pad = 72;
    sim.current = nodes.map((n, i) => {
      const u = ((years.get(n.slug) || ymin) - ymin) / Math.max(1, ymax - ymin);
      const existing = sim.current.find((s) => s.slug === n.slug);
      if (existing) return existing;
      return {
        slug: n.slug,
        x: pad + u * (w - pad * 2) + ((i % 5) - 2) * 12,
        y: h / 2 + Math.sin(i * 1.7) * (h * 0.22),
        vx: 0,
        vy: 0,
        pin: false,
      };
    });
  }, [nodes, size, ymin, ymax, years]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let frames = 0;
    const step = () => {
      const { w, h } = size;
      const pad = 56;
      const list = sim.current;
      const idx = new Map(list.map((s, i) => [s.slug, i]));
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const a = list[i];
          const b = list[j];
          let dx = a.x - b.x;
          let dy = a.y - b.y;
          let d2 = dx * dx + dy * dy || 0.01;
          const f = 2800 / d2;
          const fx = dx * f;
          const fy = dy * f;
          if (!a.pin) {
            a.vx += fx;
            a.vy += fy;
          }
          if (!b.pin) {
            b.vx -= fx;
            b.vy -= fy;
          }
        }
      }
      for (const e of edges) {
        const a = list[idx.get(e.from)!];
        const b = list[idx.get(e.to)!];
        if (!a || !b) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.01;
        const rest = 108;
        const f = (dist - rest) * 0.012;
        const fx = (dx / dist) * f;
        const fy = (dy / dist) * f;
        if (!a.pin) {
          a.vx += fx;
          a.vy += fy;
        }
        if (!b.pin) {
          b.vx -= fx;
          b.vy -= fy;
        }
      }
      for (const s of list) {
        const n = bySlug.get(s.slug);
        if (!n || s.pin) continue;
        const u = ((years.get(s.slug) || ymin) - ymin) / Math.max(1, ymax - ymin);
        const tx = pad + u * (w - pad * 2);
        s.vx += (tx - s.x) * 0.018;
        s.vy += (h / 2 - s.y) * 0.006;
        s.vx *= 0.82;
        s.vy *= 0.82;
        s.x = Math.min(w - 40, Math.max(40, s.x + s.vx));
        s.y = Math.min(h - 36, Math.max(36, s.y + s.vy));
      }
      frames++;
      setTick(frames);
      if (!reduce) setT(performance.now() / 1000);
      if (!reduce || frames < 90) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [size, edges, bySlug, ymin, ymax, years]);

  function pos(slug: string) {
    return sim.current.find((s) => s.slug === slug);
  }

  function onPointerDown(e: React.PointerEvent, slug: string) {
    const p = pos(slug);
    if (!p) return;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    p.pin = true;
    drag.current = { slug, dx: e.clientX - r.left - p.x, dy: e.clientY - r.top - p.y };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    const p = pos(drag.current.slug);
    if (!p) return;
    p.x = e.clientX - r.left - drag.current.dx;
    p.y = e.clientY - r.top - drag.current.dy;
    p.vx = 0;
    p.vy = 0;
  }
  function onPointerUp() {
    if (drag.current) {
      const p = pos(drag.current.slug);
      if (p) p.pin = false;
    }
    drag.current = null;
  }

  function stir() {
    for (const s of sim.current) {
      s.vx += (Math.random() - 0.5) * 28;
      s.vy += (Math.random() - 0.5) * 28;
    }
  }

  const focus = sel || hover;
  const neighbors = new Set<string>();
  if (focus) {
    neighbors.add(focus);
    for (const e of edges) {
      if (e.from === focus || e.to === focus) {
        neighbors.add(e.from);
        neighbors.add(e.to);
      }
    }
  }
  const picked = sel ? bySlug.get(sel) : null;
  const fromHere = edges.filter((e) => e.from === sel).map((e) => bySlug.get(e.to)?.title).filter(Boolean) as string[];
  const intoHere = edges.filter((e) => e.to === sel).map((e) => bySlug.get(e.from)?.title).filter(Boolean) as string[];
  const { w, h } = size;
  void tick;

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="max-w-xl text-ink/70">
          Drag a room. Follow a line. Influence runs left to right, older forms opening later ones.
        </p>
        <button type="button" onClick={stir} className="rounded-full border border-ink/15 px-4 py-1.5 text-[12px] uppercase tracking-[0.16em] text-ink/55 hover:text-ink">
          Stir
        </button>
      </div>

      <div
        ref={wrap}
        className="relative mt-5 h-[68svh] min-h-[420px] overflow-hidden bg-paper-deep md:h-[74svh]"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={(e) => {
          if (e.target === wrap.current || (e.target as Element).tagName === "svg") setSel(null);
        }}
      >
        <svg width={w} height={h} className="absolute inset-0 h-full w-full" role="img" aria-label="Network of art movements">
          <defs>
            <clipPath id="node-clip" clipPathUnits="objectBoundingBox">
              <circle cx="0.5" cy="0.5" r="0.5" />
            </clipPath>
            {edges.map((e) => {
              const a = bySlug.get(e.from);
              const b = bySlug.get(e.to);
              if (!a || !b) return null;
              return (
                <linearGradient key={`g-${e.from}-${e.to}`} id={`g-${e.from}-${e.to}`}>
                  <stop offset="0%" stopColor={a.accent} />
                  <stop offset="100%" stopColor={b.accent} />
                </linearGradient>
              );
            })}
            <marker id="arr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <polygon points="0 0, 7 3.5, 0 7" fill="#1a1714" fillOpacity="0.45" />
            </marker>
          </defs>

          {edges.map((e) => {
            const a = pos(e.from);
            const b = pos(e.to);
            if (!a || !b) return null;
            const lit =
              !focus || (neighbors.has(e.from) && neighbors.has(e.to) && (e.from === focus || e.to === focus));
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.hypot(dx, dy) || 1;
            const ux = dx / dist;
            const uy = dy / dist;
            const x1 = a.x + ux * 18;
            const y1 = a.y + uy * 18;
            const x2 = b.x - ux * 18;
            const y2 = b.y - uy * 18;
            const mx = (x1 + x2) / 2 + -uy * 18;
            const my = (y1 + y2) / 2 + ux * 18;
            const d = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
            const dash = 8 + ((t * 28) % 24);
            return (
              <g key={e.from + e.to} opacity={lit ? 1 : 0.12}>
                <path d={d} fill="none" stroke={`url(#g-${e.from}-${e.to})`} strokeWidth={lit ? 1.8 : 1} strokeOpacity={0.7} markerEnd="url(#arr)" />
                <path d={d} fill="none" stroke="#faf6ee" strokeWidth={1.2} strokeDasharray="4 14" strokeDashoffset={-dash} strokeOpacity={lit ? 0.85 : 0} />
              </g>
            );
          })}

          {sim.current.map((s) => {
            const n = bySlug.get(s.slug);
            if (!n) return null;
            const r = 11 + (degree.get(s.slug) || 0) * 1.1;
            const lit = !focus || neighbors.has(s.slug);
            const on = sel === s.slug;
            const hot = hover === s.slug;
            return (
              <g
                key={s.slug}
                transform={`translate(${s.x} ${s.y})`}
                opacity={lit ? 1 : 0.18}
                className="cursor-grab"
                onPointerDown={(e) => onPointerDown(e, s.slug)}
                onPointerEnter={() => setHover(s.slug)}
                onPointerLeave={() => setHover((h) => (h === s.slug ? null : h))}
                onClick={(ev) => {
                  ev.stopPropagation();
                  setSel(s.slug);
                }}
                onDoubleClick={() => router.push(`/rooms/${s.slug}`)}
              >
                {on && <circle r={r + 10} fill={n.accent} fillOpacity={0.18} />}
                <circle r={r + 3} fill="#faf6ee" />
                <circle r={r + 1.5} fill={n.accent} fillOpacity={0.9} />
                {n.heroImage ? (
                  <image
                    href={n.heroImage}
                    x={-r}
                    y={-r}
                    width={r * 2}
                    height={r * 2}
                    clipPath="url(#node-clip)"
                    preserveAspectRatio="xMidYMid slice"
                  />
                ) : (
                  <circle r={r} fill={n.accent} />
                )}
                {(hot || on || size.w > 720) && (
                  <text
                    y={r + 16}
                    textAnchor="middle"
                    fill="#1a1714"
                    fillOpacity={0.82}
                    style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: hot || on ? 13 : 11 }}
                  >
                    {size.w < 640 && !(hot || on) ? "" : shortName(n.title)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        <div className="pointer-events-none absolute bottom-3 left-4 text-[10px] uppercase tracking-[0.18em] text-ink/35">
          {ymin} → {ymax}
        </div>
      </div>

      {picked && (
        <div className="mt-5 border border-ink/10 bg-paper-raised p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink/45">
            {picked.years} · {picked.place}
          </p>
          <h3 className="display display-section mt-1">{picked.title}</h3>
          {intoHere.length > 0 && (
            <p className="mt-3 text-sm text-ink/65">
              From {intoHere.join(", ")}.
            </p>
          )}
          {fromHere.length > 0 && (
            <p className="mt-1 text-sm text-ink/65">
              Opens {fromHere.join(", ")}.
            </p>
          )}
          <Link href={`/rooms/${picked.slug}`} className="mt-4 inline-block text-sm text-sky hover:underline">
            Enter the room →
          </Link>
        </div>
      )}
    </div>
  );
}


