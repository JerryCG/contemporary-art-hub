import Link from "next/link";
import { catalog, featuredWorks, getArtist, getMovement } from "@/lib/content";
import { DailyHanging } from "@/components/DailyHanging";
import { HallSlideshow } from "@/components/HallSlideshow";
import { withBase } from "@/lib/base";

const plates = [
  { href: "/artists/vincent-van-gogh", src: withBase("/images/heritage/vincent-plate.png"), name: "van Gogh" },
  { href: "/artists/pablo-picasso", src: withBase("/images/heritage/picasso-plate.png"), name: "Picasso" },
  { href: "/artists/salvador-dali", src: withBase("/images/heritage/dali-plate.png"), name: "Dalí" },
  { href: "/artists/claude-monet", src: withBase("/images/heritage/monet-plate.png"), name: "Monet" },
  { href: "/artists/edvard-munch", src: withBase("/images/heritage/munch-plate.png"), name: "Munch" },
  { href: "/artists/rene-magritte", src: withBase("/images/heritage/magritte-plate.png"), name: "Magritte" },
  { href: "/artists/georges-seurat", src: withBase("/images/heritage/seurat-plate.png"), name: "Seurat" },
  { href: "/artists/paul-gauguin", src: withBase("/images/heritage/gauguin-plate.png"), name: "Gauguin" },
  { href: "/artists/paul-cezanne", src: withBase("/images/heritage/cezanne-plate.png"), name: "Cézanne" },
  { href: "/artists/henri-matisse", src: withBase("/images/heritage/matisse-plate.png"), name: "Matisse" },
];

const HOME_ROOMS = ["impressionism", "cubism", "surrealism", "expressionism", "pop-art", "minimalism"];

export default function HallPage() {
  const slides = featuredWorks()
    .filter((w) => w.image)
    .map((work) => ({ work, artist: getArtist(work.artist)?.name || "" }));
  const rooms = HOME_ROOMS.map(getMovement).filter(Boolean);

  return (
    <div>
      <HallSlideshow slides={slides} />

      <section className="page max-w-6xl py-12 md:py-20">
        <div className="grid items-start gap-8 md:grid-cols-3 md:gap-12">
          <div className="min-w-0 md:col-span-2">
            <h2 className="display display-page">A simple way into contemporary art.</h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/75 sm:mt-5 sm:text-lg">
              Read about major movements and artists, try a short quiz, or make a picture in a style you like.
            </p>
            <div className="mt-6 flex flex-wrap gap-5 text-sm">
              <Link href="/introduction" className="underline decoration-sky/40 underline-offset-4">
                Introduction
              </Link>
              <Link href="/play/quiz" className="underline decoration-sky/40 underline-offset-4">
                Quiz
              </Link>
              <Link href="/atelier" className="underline decoration-sky/40 underline-offset-4">
                Jerry’s atelier
              </Link>
            </div>
          </div>
          <DailyHanging />
        </div>
      </section>

      <section className="border-y border-ink/10 bg-paper-raised/50 py-12 md:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <h2 className="display display-section">Rooms</h2>
            <Link href="/rooms" className="text-sm text-ink/55">
              All {catalog.movements.length} rooms
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {rooms.map((m) =>
              m ? (
                <Link key={m.slug} href={`/rooms/${m.slug}`} className="group">
                  <div className="aspect-[4/3] overflow-hidden bg-paper-deep">
                    {m.heroImage && (
                      <img
                        src={m.heroImage}
                        alt=""
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                      />
                    )}
                  </div>
                  <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-ink/40">{m.years}</p>
                  <h3 className="display mt-1 text-2xl group-hover:text-sky">{m.title}</h3>
                </Link>
              ) : null,
            )}
          </div>
        </div>
      </section>

      <section className="page max-w-6xl py-12 md:py-20">
        <h2 className="display display-section">Artists</h2>
        <div className="nav-scroll mt-6 flex gap-4 overflow-x-auto pb-2 sm:mt-8 sm:gap-5">
          {plates.map((p) => (
            <Link key={p.name} href={p.href} className="w-28 shrink-0 sm:w-36">
              <div className="aspect-[2/3] overflow-hidden bg-paper-deep">
                <img src={p.src} alt={p.name} className="h-full w-full object-contain object-center" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-16 sm:px-6 md:grid-cols-2 md:pb-24">
        <Link href="/atelier" className="group min-w-0 overflow-hidden">
          <img src={withBase("/images/heritage/hall-1.jpg")} alt="" className="h-44 w-full object-cover sm:h-56" />
          <div className="pt-4 sm:pt-5">
            <h3 className="display display-section group-hover:text-sky">Works by JerryCG</h3>
            <p className="mt-2 text-ink/65">Xerox art and a sound map.</p>
          </div>
        </Link>
        <Link href="/atelier#atlas" className="group min-w-0 overflow-hidden">
          <img src={withBase("/images/heritage/hall-2.jpg")} alt="" className="h-44 w-full object-cover sm:h-56" />
          <div className="pt-4 sm:pt-5">
            <h3 className="display display-section group-hover:text-sky">Tai Kwun and Art Basel</h3>
            <p className="mt-2 text-ink/65">Notes from exhibitions in Hong Kong.</p>
          </div>
        </Link>
      </section>
    </div>
  );
}
