import type { Metadata } from "next";
import Link from "next/link";
import { InfluenceNet } from "@/components/InfluenceNet";
import { catalog, influence } from "@/lib/content";

export const metadata: Metadata = { title: "Timeline" };

export default function TimelinePage() {
  const nodes = catalog.movements.map((m) => ({
    slug: m.slug,
    title: m.title,
    years: m.years,
    place: m.place,
    accent: m.accent,
    heroImage: m.heroImage,
  }));
  const edges = influence
    .map(([from, to]) => ({ from, to }))
    .filter((e) => nodes.some((n) => n.slug === e.from) && nodes.some((n) => n.slug === e.to));

  return (
    <div className="page max-w-6xl">
      <h1 className="display display-page">Timeline</h1>
      <p className="mt-4 max-w-2xl text-base text-ink/70 sm:text-lg">Major movements, in order.</p>
      <ol className="mt-8 space-y-0 sm:mt-14">
        {catalog.movements.map((m, i) => (
          <li key={m.slug} className="grid gap-2 border-l border-ink/15 py-6 pl-5 sm:grid-cols-[6.5rem_1fr] sm:gap-6 sm:py-8 sm:pl-8">
            <span className="display text-sm text-ink/45">{m.years.replace("c. ", "")}</span>
            <div className="min-w-0">
              <Link href={`/rooms/${m.slug}`} className="display display-section hover:text-sky">
                {m.title}
              </Link>
              <p className="mt-1 text-sm text-ink/55">{m.place}</p>
              {m.paragraphs[0] && <p className="mt-3 max-w-xl text-ink/75">{m.paragraphs[0]}</p>}
              {i < catalog.movements.length - 1 && (
                <p className="mt-3 text-xs uppercase tracking-widest text-ink/35">↓</p>
              )}
            </div>
          </li>
        ))}
      </ol>
      <section className="mt-10 border-t border-ink/10 pt-10">
        <h2 className="display display-section">How they connect</h2>
        <InfluenceNet nodes={nodes} edges={edges} />
      </section>
    </div>
  );
}
