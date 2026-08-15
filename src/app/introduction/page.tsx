import type { Metadata } from "next";
import Link from "next/link";
import { Prose } from "@/components/Prose";
import { catalog } from "@/lib/content";

export const metadata: Metadata = { title: "Introduction" };

export default function IntroductionPage() {
  const intro = catalog.introduction;
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <p className="chip">How the house is built</p>
      <h1 className="display mt-4 text-5xl">{intro.title}</h1>
      <div className="mt-8">
        <Prose paragraphs={intro.paragraphs} />
      </div>
      <aside className="mt-10 border border-ink/10 bg-paper-raised p-6">
        <h2 className="display text-2xl">A note on the word contemporary</h2>
        <p className="mt-3 leading-relaxed text-ink/75">
          Art historians often reserve <em>modern</em> for roughly 1860–1960 and <em>contemporary</em> for living practice after
          that. Jerry’s original Hub uses contemporary more generously — from late-nineteenth-century Paris to now. We keep that
          hospitality. New rooms (Pop, Abstract Expressionism, Conceptual Art, After 1980) make the later clock audible.
        </p>
      </aside>
      {intro.timelineImage && (
        <figure className="mt-12">
          <p className="text-[11px] uppercase tracking-[0.2em] text-ink/45">Original timeline (archive scan)</p>
          <img src={intro.timelineImage} alt="Timeline of major contemporary art movements" className="mt-3 w-full" />
          <figcaption className="mt-2 text-sm text-ink/50">
            The walkable version lives on the{" "}
            <Link href="/timeline" className="underline underline-offset-4">
              Timeline
            </Link>{" "}
            corridor.
          </figcaption>
        </figure>
      )}
    </article>
  );
}
