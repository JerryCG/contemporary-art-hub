import type { Metadata } from "next";
import Link from "next/link";
import { catalog } from "@/lib/content";

export const metadata: Metadata = { title: "Rooms" };

export default function RoomsPage() {
  return (
    <div className="page max-w-6xl">
      <h1 className="display display-page">Rooms</h1>
      <p className="mt-4 max-w-2xl text-base text-ink/70 sm:text-lg">Art movements, from Impressionism to today.</p>
      <div className="mt-8 grid gap-8 sm:mt-12 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
        {catalog.movements.map((m) => {
          return (
            <Link key={m.slug} href={`/rooms/${m.slug}`} className="group overflow-hidden">
              <div className="aspect-[16/10] overflow-hidden">
                {m.heroImage ? (
                  <img src={m.heroImage} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-end p-5">
                    <span className="display text-4xl">{m.title.slice(0, 1)}</span>
                  </div>
                )}
              </div>
              <div className="pt-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-ink/45">{m.years}</p>
                <h2 className="display display-section mt-1 group-hover:text-sky">{m.title}</h2>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
