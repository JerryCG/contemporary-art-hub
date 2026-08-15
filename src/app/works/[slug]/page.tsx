import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AskGrok } from "@/components/AskGrok";
import { LookCloser } from "@/components/LookCloser";
import { PinButton } from "@/components/PinButton";
import { Prose } from "@/components/Prose";
import { WorkFrame } from "@/components/WorkFrame";
import { catalog, getArtist, getMovement, getWork, relatedWorks } from "@/lib/content";

export function generateStaticParams() {
  return catalog.works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: getWork(slug)?.title ?? "Work" };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = getWork(slug);
  if (!w) notFound();
  const a = getArtist(w.artist);
  const m = getMovement(w.movement);
  const related = relatedWorks(w);

  return (
    <article className="mx-auto max-w-6xl px-4 py-14 md:px-6">
      <p className="text-sm text-ink/50">
        {m && (
          <Link href={`/rooms/${m.slug}`} className="hover:text-ink">
            {m.title}
          </Link>
        )}
        {a && (
          <>
            {" / "}
            <Link href={`/artists/${a.slug}`} className="hover:text-ink">
              {a.name}
            </Link>
          </>
        )}
      </p>
      <h1 className="display mt-4 text-5xl leading-[0.95]">{w.title}</h1>
      <p className="mt-2 text-ink/55">
        {a?.name}
        {m ? `, ${m.title}` : ""}
        {w.year ? `, ${w.year}` : ""}
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <LookCloser images={w.images.length ? w.images : w.image ? [w.image] : []} title={w.title} />
        <div>
          <Prose paragraphs={w.paragraphs} />
          {!w.origin && (
            <p className="mt-4 text-sm italic text-ink/50">
              Study image. The original work may still be in copyright.
            </p>
          )}
          {w.credit && <p className="mt-3 text-xs text-ink/45">{w.credit}</p>}
          <div className="mt-6 flex flex-wrap gap-3">
            <PinButton kind="work" slug={w.slug} title={w.title} />
            <Link href={`/play/compare?a=${w.slug}`} className="rounded-full border border-ink/20 px-4 py-1.5 text-[12px] uppercase tracking-[0.16em]">
              Compare
            </Link>
            {a && (
              <Link href={`/artists/${a.slug}`} className="rounded-full border border-ink/20 px-4 py-1.5 text-[12px] uppercase tracking-[0.16em]">
                Back to {a.name}
              </Link>
            )}
          </div>
          <AskGrok title={w.title} artist={a?.name ?? ""} movement={m?.title ?? ""} paragraphs={w.paragraphs} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="display text-3xl">Nearby</h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <WorkFrame key={r.slug} work={r} artistName={getArtist(r.artist)?.name} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
