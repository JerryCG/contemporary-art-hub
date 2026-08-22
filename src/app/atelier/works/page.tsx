import type { Metadata } from "next";
import Link from "next/link";
import { AtelierNav } from "@/components/AtelierNav";
import { Prose } from "@/components/Prose";
import { SlideDesk } from "@/components/SlideDesk";
import { catalog } from "@/lib/content";

export const metadata: Metadata = { title: "Works" };

export default function AtelierWorksPage() {
  const { xerox, soundMap } = catalog.atelier;
  const xeroxCopy = xerox.paragraphs.slice(0, 2);
  const soundCopy = xerox.paragraphs.slice(2);
  const xeroxSlides = xerox.images.map((src, i) => ({
    src,
    caption: i === 0 ? "Original photograph" : `Copy ${i}`,
    alt: i === 0 ? "Original watery scene" : `Xerox degeneration, copy ${i}`,
  }));

  return (
    <article className="page max-w-5xl">
      <h1 className="display display-page">Works</h1>
      <p className="mt-4 max-w-2xl text-base text-ink/70 sm:text-lg">Xerox art and a sound map by JerryCG.</p>
      <AtelierNav current="/atelier/works" />

      <section className="mt-14">
        <h2 className="display display-section">Xerox Art</h2>
        <div className="mt-6 max-w-3xl">
          <Prose paragraphs={xeroxCopy} />
        </div>
        <SlideDesk slides={xeroxSlides} label="Plate" />
        <p className="mt-6">
          <Link href="/play/xerox" className="underline decoration-sky/50 underline-offset-4">
            Try degeneration on your own photo →
          </Link>
        </p>
      </section>

      <section className="mt-20">
        <h2 className="display display-section">Sound Map</h2>
        <div className="mt-6 max-w-3xl">
          <Prose paragraphs={soundCopy} />
        </div>
        {soundMap.image && (
          <SlideDesk
            slides={[
              {
                src: soundMap.image,
                caption: "Festival Walk to Olympia City",
                alt: "Sound map from Festival Walk to Olympia City",
              },
            ]}
            label="Map"
            landscape
          />
        )}
      </section>
    </article>
  );
}
