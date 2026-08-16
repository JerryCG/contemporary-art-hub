import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FloorTabs } from "@/components/FloorTabs";
import { Prose } from "@/components/Prose";
import { WorkFrame } from "@/components/WorkFrame";
import { atmosphereFor } from "@/lib/atmospheres";
import { catalog, getArtist, getMovement, worksInMovement } from "@/lib/content";

export function generateStaticParams() {
  return catalog.movements.map((m) => ({ slug: m.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const m = getMovement(slug);
    return { title: m?.title ?? "Room" };
  });
}

export default async function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getMovement(slug);
  if (!m) notFound();
  const atm = atmosphereFor(m.slug);
  const artists = m.artistSlugs.map(getArtist).filter(Boolean);
  const works = worksInMovement(m.slug);

  return (
    <article className={atm.className}>
      <header className="page max-w-6xl">
        <p className="chip">
          {m.years} · {m.place}
        </p>
        <h1 className="display display-hero mt-4">{m.title}</h1>
        <p className="mt-4 max-w-xl text-lg text-ink/70">{atm.label}</p>
        {m.heroImage && (
          <div className="frame mt-10 max-w-3xl">
            <img src={m.heroImage} alt="" className="w-full" />
          </div>
        )}
      </header>

      <section className="mx-auto w-full max-w-3xl px-4 pb-10 sm:px-6">
        <FloorTabs
          primer={<Prose paragraphs={m.paragraphs} />}
          deeper={m.deeper ? <Prose paragraphs={m.deeper} /> : <p className="text-ink/50">More to come.</p>}
          theory={m.theory ? <Prose paragraphs={m.theory} /> : <p className="text-ink/50">More to come.</p>}
          looking={m.looking ? <ul className="list-disc space-y-3 pl-5 text-ink/80">{m.looking.map((l) => <li key={l}>{l}</li>)}</ul> : null}
        />
        {m.playHint && (
          <Link href={m.playHint.href} className="mt-8 inline-block rounded-full bg-ink px-5 py-2 text-sm text-paper">
            {m.playHint.label}
          </Link>
        )}
      </section>

      <section className="page max-w-6xl py-10 md:py-12">
        <h2 className="display display-section">Artists</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {artists.map((a) =>
            a ? (
              <Link key={a.slug} href={`/artists/${a.slug}`} className="group">
                <div className="aspect-[3/4] overflow-hidden bg-paper-deep">
                  {a.portrait ? (
                    <img src={a.portrait} alt="" className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-end p-4">
                      <span className="display text-5xl">{a.name.slice(0, 1)}</span>
                    </div>
                  )}
                </div>
                <p className="display mt-3 text-2xl group-hover:text-sky">{a.name}</p>
                <p className="text-sm text-ink/55">
                  {a.nationality}
                  {a.life ? `, ${a.life}` : ""}
                </p>
              </Link>
            ) : null,
          )}
        </div>
      </section>

      {works.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 md:pb-20">
          <h2 className="display display-section">Works</h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {works.map((w) => (
              <WorkFrame key={w.slug} work={w} artistName={getArtist(w.artist)?.name} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
