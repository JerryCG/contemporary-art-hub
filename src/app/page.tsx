import Link from "next/link";
import { catalog, featuredWorks, getArtist } from "@/lib/content";
import { DailyHanging } from "@/components/DailyHanging";
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

export default function HallPage() {
  const featured = featuredWorks();
  const rooms = catalog.movements;

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {featured.map((w) => (
            <Link key={w.slug} href={`/works/${w.slug}`} className="group relative min-h-[42vh] overflow-hidden bg-ink">
              {w.image && (
                <img
                  src={w.image}
                  alt={w.title}
                  className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                />
              )}
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-3 text-paper">
                <span className="display block text-lg leading-tight">{w.title}</span>
                <span className="text-[11px] uppercase tracking-widest opacity-80">{getArtist(w.artist)?.name}</span>
              </span>
            </Link>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="pointer-events-auto mx-4 max-w-2xl bg-paper/85 px-6 py-8 text-center shadow-frame backdrop-blur-sm md:px-10">
            <p className="text-[11px] uppercase tracking-[0.28em] text-ink/50">JerryCG’s museum-atelier</p>
            <h1 className="display mt-3 text-4xl leading-[0.95] md:text-6xl">Contemporary Art Hub</h1>
            <p className="mt-4 text-ink/70">A personal museum for looking, making, and remembering.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/rooms" className="rounded-full bg-ink px-5 py-2 text-sm text-paper">
                Enter the rooms
              </Link>
              <Link href="/play/compass" className="rounded-full border border-ink/20 px-5 py-2 text-sm">
                Find your weather
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <p className="chip">Welcome</p>
            <h2 className="display mt-4 text-3xl md:text-4xl">The world is stranger, and kinder, once you learn how to look.</h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/75">
              Welcome to the amazing world of contemporary art. Here you can learn and enjoy artworks and artists that hold
              important positions in history — and, if you stay, make something of your own in their languages.
            </p>
            <p className="mt-3 max-w-2xl text-ink/70">
              Before the walk, you may want a test. The original quiz still has Jerry CG [Doge] answers. The rooms now have a
              second floor for people who already know <em>The Scream</em>.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/play/quiz" className="underline decoration-sky/50 underline-offset-4">
                Take the quiz
              </Link>
              <Link href="/introduction" className="underline decoration-sky/50 underline-offset-4">
                Read the introduction
              </Link>
              <Link href="/atelier" className="underline decoration-sky/50 underline-offset-4">
                Jerry’s atelier
              </Link>
            </div>
          </div>
          <DailyHanging />
        </div>
      </section>

      <section className="border-y border-ink/10 bg-paper-raised/60 py-14">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex items-end justify-between">
            <h2 className="display text-3xl">Rooms</h2>
            <Link href="/rooms" className="text-sm text-ink/60">
              All {rooms.length} doors →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {rooms.map((m) => (
              <Link
                key={m.slug}
                href={`/rooms/${m.slug}`}
                className="group border border-ink/10 bg-paper p-4 transition hover:-translate-y-0.5 hover:shadow-card"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-ink/40">{m.years}</p>
                <p className="display mt-2 text-2xl leading-tight group-hover:text-sky">{m.title}</p>
                <p className="mt-2 text-xs text-ink/50">{m.place}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className="display text-3xl">The old plates still hang here</h2>
        <p className="mt-2 max-w-xl text-ink/60">
          Heritage portraits from the original homepage — not discarded, just given a better wall.
        </p>
        <div className="mt-8 flex gap-4 overflow-x-auto pb-4">
          {plates.map((p) => (
            <Link key={p.name} href={p.href} className="w-36 shrink-0">
              <img src={p.src} alt={p.name} className="w-full bg-paper-deep object-contain" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-20 md:grid-cols-2 md:px-6">
        <Link href="/atelier" className="group overflow-hidden border border-ink/10">
          <img src={withBase("/images/heritage/hall-1.jpg")} alt="" className="h-56 w-full object-cover" />
          <div className="p-6">
            <p className="chip">Atelier</p>
            <h3 className="display mt-3 text-3xl group-hover:text-sky">Works by JerryCG</h3>
            <p className="mt-2 text-ink/65">Xerox degeneration, a sound map from Festival Walk to Olympia City, and the making-of a looking life.</p>
          </div>
        </Link>
        <Link href="/atelier#atlas" className="group overflow-hidden border border-ink/10">
          <img src={withBase("/images/heritage/hall-2.jpg")} alt="" className="h-56 w-full object-cover" />
          <div className="p-6">
            <p className="chip">Field notes</p>
            <h3 className="display mt-3 text-3xl group-hover:text-sky">Tai Kwun, Art Basel, Atlas 3</h3>
            <p className="mt-2 text-ink/65">Learning to appreciate is better than memorizing. Jerry’s own comments, still in his voice.</p>
          </div>
        </Link>
      </section>
    </div>
  );
}
