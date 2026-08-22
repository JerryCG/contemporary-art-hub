import type { Metadata } from "next";
import Link from "next/link";
import { catalog } from "@/lib/content";
import { AtelierNav } from "@/components/AtelierNav";

export const metadata: Metadata = { title: "Atelier" };

export default function AtelierPage() {
  const { xerox, fieldPhotos } = catalog.atelier;
  const rooms = [
    {
      href: "/atelier/works",
      title: "Works",
      note: "Xerox art and a sound map.",
      image: xerox.images[0],
    },
    {
      href: "/atelier/appreciation",
      title: "Art Appreciation",
      note: "Atlas 3, Tai Kwun, and Art Basel HK 2019.",
      image: fieldPhotos[0],
    },
  ];

  return (
    <div className="page max-w-5xl">
      <h1 className="display display-page">Atelier</h1>
      <p className="mt-4 max-w-2xl text-base text-ink/70 sm:text-lg">Work and looking notes by JerryCG.</p>
      <AtelierNav />

      <div className="mt-12 grid gap-10">
        {rooms.map((r) => (
          <Link key={r.href} href={r.href} className="group grid items-center gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="frame overflow-hidden">
              {r.image && (
                <img
                  src={r.image}
                  alt=""
                  className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="display display-section group-hover:text-sky">{r.title}</h2>
              <p className="mt-3 max-w-md text-ink/70">{r.note}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
