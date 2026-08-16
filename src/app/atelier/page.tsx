import type { Metadata } from "next";
import Link from "next/link";
import { Prose } from "@/components/Prose";
import { catalog } from "@/lib/content";

export const metadata: Metadata = { title: "Atelier" };

export default function AtelierPage() {
  const { xerox, soundMap, atlas, taikwun, fieldPhotos } = catalog.atelier;
  return (
    <div className="page max-w-5xl">
      <h1 className="display display-page">Atelier</h1>
      <p className="mt-4 max-w-2xl text-base text-ink/70 sm:text-lg">Works and notes by JerryCG.</p>

      <section id="xerox" className="mt-16">
        <h2 className="display display-page">Xerox Art</h2>
        <div className="mt-6 max-w-3xl">
          <Prose paragraphs={xerox.paragraphs} />
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
          {xerox.images.map((src, i) => (
            <figure key={src} className="frame">
              <img src={src} alt={i === 0 ? "Original photograph" : `Copy ${i}`} className="w-full" />
              <figcaption className="px-1 pt-2 text-xs uppercase tracking-widest text-ink/45">
                {i === 0 ? "Original" : `Copy ${i}`}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-6">
          <Link href="/play/xerox" className="underline decoration-sky/50 underline-offset-4">
            Try degeneration on your own photo →
          </Link>
        </p>
      </section>

      <section id="sound" className="mt-20">
        <h2 className="display display-page">Sound Map</h2>
        {soundMap.image && (
          <div className="frame mt-6">
            <img src={soundMap.image} alt="Sound map from Festival Walk to Olympia City" className="w-full" />
          </div>
        )}
      </section>

      <section id="atlas" className="mt-20">
        <h2 className="display display-page">Atlas 3</h2>
        <div className="mt-6 max-w-3xl">
          <Prose paragraphs={atlas.paragraphs} />
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <video controls className="w-full" src={atlas.beginning} />
          <video controls className="w-full" src={atlas.ending} />
        </div>
      </section>

      <section id="taikwun" className="mt-20">
        <h2 className="display display-page">Tai Kwun and Art Basel HK 2019</h2>
        <div className="mt-6 max-w-3xl">
          <Prose paragraphs={taikwun.paragraphs} />
        </div>
        {taikwun.images.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
            {taikwun.images.map((src) => (
              <img key={src} src={src} alt="" className="w-full" />
            ))}
          </div>
        )}
      </section>

      {fieldPhotos.length > 0 && (
        <section className="mt-20">
          <h2 className="display display-page">Field photographs</h2>
          <div className="mt-8 columns-2 gap-3 md:columns-3">
            {fieldPhotos.map((src) => (
              <img key={src} src={src} alt="" className="mb-3 w-full" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
