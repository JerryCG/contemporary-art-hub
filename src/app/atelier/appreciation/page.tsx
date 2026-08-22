import type { Metadata } from "next";
import { AtelierNav } from "@/components/AtelierNav";
import { Prose } from "@/components/Prose";
import { SlideDesk } from "@/components/SlideDesk";
import { catalog } from "@/lib/content";

export const metadata: Metadata = { title: "Art Appreciation" };

export default function AppreciationPage() {
  const { atlas, fieldPhotos, taikwun } = catalog.atelier;
  const deck = fieldPhotos.map((src, i) => ({
    src,
    caption: `Slide ${i + 1}`,
    alt: `Atlas 3 presentation, slide ${i + 1}`,
  }));
  const paper = taikwun.images.map((src, i) => ({
    src,
    caption: `Page ${i + 1}`,
    alt: `Essay page ${i + 1}: Tai Kwun and Art Basel HK 2019`,
  }));

  return (
    <article className="page max-w-5xl">
      <h1 className="display display-page">Art Appreciation</h1>
      <p className="mt-4 max-w-2xl text-base text-ink/70 sm:text-lg">Notes by JerryCG on Atlas 3, Tai Kwun, and Art Basel HK 2019.</p>
      <AtelierNav current="/atelier/appreciation" />

      <section id="atlas" className="mt-14">
        <h2 className="display display-section">Atlas 3</h2>
        <p className="mt-3 max-w-2xl text-ink/70">Contemporary music concert and sound-collecting workshop.</p>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <figure>
            <video controls className="w-full bg-ink" src={atlas.beginning} />
            <figcaption className="mt-2 text-xs uppercase tracking-[0.16em] text-ink/45">Beginning</figcaption>
          </figure>
          <figure>
            <video controls className="w-full bg-ink" src={atlas.ending} />
            <figcaption className="mt-2 text-xs uppercase tracking-[0.16em] text-ink/45">Ending</figcaption>
          </figure>
        </div>
        <div className="mt-10 max-w-3xl">
          <Prose paragraphs={atlas.paragraphs} />
        </div>
        <SlideDesk slides={deck} label="Slide" landscape />
      </section>

      <section id="taikwun" className="mt-20">
        <h2 className="display display-section">Tai Kwun and Art Basel HK 2019</h2>
        <p className="mt-3 max-w-2xl text-ink/70">Research paper. Zoom to read; arrows turn the page.</p>
        <SlideDesk slides={paper} label="Page" />
      </section>
    </article>
  );
}
