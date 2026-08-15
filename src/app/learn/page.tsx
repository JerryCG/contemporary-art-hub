import type { Metadata } from "next";
import Link from "next/link";
import { glossary } from "@/lib/glossary";
import { outbound, paths } from "@/lib/learn";

export const metadata: Metadata = { title: "Learn" };

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <h1 className="display text-5xl">Learn</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/70">Guided paths, a short glossary, and links to go further.</p>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {Object.values(paths).map((p) => (
          <Link key={p.slug} href={`/learn/${p.slug}`} className="border border-ink/10 p-6 hover:shadow-card">
            <p className="text-[10px] uppercase tracking-[0.2em] text-ink/45">{p.duration}</p>
            <h2 className="display mt-2 text-3xl">{p.title}</h2>
            <p className="mt-3 text-sm text-ink/65">{p.lede}</p>
          </Link>
        ))}
      </div>

      <section className="mt-20">
        <h2 className="display text-3xl">Glossary</h2>
        <dl className="mt-8 space-y-8">
          {glossary.map((g) => (
            <div key={g.slug} id={g.slug}>
              <dt className="display text-2xl">{g.term}</dt>
              <dd className="mt-2 max-w-2xl text-ink/75">{g.long}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-20">
        <h2 className="display text-3xl">More to read</h2>
        {outbound.map((g) => (
          <div key={g.group} className="mt-8">
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-ink/45">{g.group}</h3>
            <ul className="mt-3 space-y-3">
              {g.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="display text-xl hover:text-sky" target="_blank" rel="noreferrer">
                    {l.name}
                  </a>
                  <p className="text-sm text-ink/60">{l.note}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
