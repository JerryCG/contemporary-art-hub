import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PinButton } from "@/components/PinButton";
import { Prose } from "@/components/Prose";
import { WorkFrame } from "@/components/WorkFrame";
import { catalog, getArtist, getMovement, worksByArtist } from "@/lib/content";

export function generateStaticParams() {
  return catalog.artists.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: getArtist(slug)?.name ?? "Artist" };
}

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArtist(slug);
  if (!a) notFound();
  const m = getMovement(a.movement);
  const works = worksByArtist(a.slug);

  return (
    <article className="page max-w-6xl">
      <p className="text-sm text-ink/50">
        <Link href="/rooms">Rooms</Link>
        {m && (
          <>
            {" / "}
            <Link href={`/rooms/${m.slug}`}>{m.title}</Link>
          </>
        )}
      </p>
      <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,240px)_1fr] md:gap-10 lg:grid-cols-[minmax(0,280px)_1fr]">
        <div className="mx-auto w-full max-w-xs md:mx-0">
          <div className="frame">
            {a.portrait ? (
              <img src={a.portrait} alt={a.name} className="w-full object-cover" />
            ) : (
              <div className="flex aspect-[3/4] items-end bg-ink p-4 text-paper">
                <span className="display text-5xl">{a.name}</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <p className="chip">
            {a.nationality}
            {a.life ? ` · ${a.life}` : ""}
            {m ? ` · ${m.title}` : ""}
          </p>
          <h1 className="display display-page mt-4">{a.name}</h1>
          <div className="mt-6 max-w-2xl">
            <Prose paragraphs={a.paragraphs} />
          </div>
          <div className="mt-6">
            <PinButton kind="artist" slug={a.slug} title={a.name} />
          </div>
        </div>
      </div>
      <section className="mt-16">
        <h2 className="display display-section">Works</h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((w) => (
            <WorkFrame key={w.slug} work={w} artistName={a.name} />
          ))}
        </div>
      </section>
    </article>
  );
}
