import type { Metadata } from "next";
import Link from "next/link";
import { Prose } from "@/components/Prose";
import { catalog } from "@/lib/content";

export const metadata: Metadata = { title: "Introduction" };

export default function IntroductionPage() {
  const intro = catalog.introduction;
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h1 className="display text-5xl">{intro.title}</h1>
      <div className="mt-8">
        <Prose paragraphs={intro.paragraphs} />
      </div>
      <aside className="mt-10 border border-ink/10 bg-paper-raised p-6">
        <h2 className="display text-2xl">Modern and contemporary</h2>
        <p className="mt-3 leading-relaxed text-ink/75">
          Many books use <em>modern</em> for about 1860–1960 and <em>contemporary</em> for art after that. This site uses
          contemporary more broadly: from late-nineteenth-century Paris to now.
        </p>
      </aside>
      {intro.timelineImage && (
        <figure className="mt-12">
          <img src={intro.timelineImage} alt="Timeline of major contemporary art movements" className="mt-3 w-full" />
          <figcaption className="mt-2 text-sm text-ink/50">
            See also the{" "}
            <Link href="/timeline" className="underline underline-offset-4">
              Timeline
            </Link>
            .
          </figcaption>
        </figure>
      )}
    </article>
  );
}
