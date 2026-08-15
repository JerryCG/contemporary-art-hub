import type { Metadata } from "next";
import Link from "next/link";
import { catalog } from "@/lib/content";
import { atmosphereFor } from "@/lib/atmospheres";

export const metadata: Metadata = { title: "Rooms" };

export default function RoomsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
      <p className="chip">The building</p>
      <h1 className="display mt-4 text-5xl">Rooms</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/70">
        Each movement is a room with its own weather. Original essays stay on the primer floor. A second floor is there when you
        want more.
      </p>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {catalog.movements.map((m) => {
          const atm = atmosphereFor(m.slug);
          return (
            <Link key={m.slug} href={`/rooms/${m.slug}`} className={`group overflow-hidden border border-ink/10 ${atm.className}`}>
              <div className="aspect-[16/10] overflow-hidden">
                {m.heroImage ? (
                  <img src={m.heroImage} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-end p-5">
                    <span className="display text-4xl">{m.title.slice(0, 1)}</span>
                  </div>
                )}
              </div>
              <div className="bg-paper/90 p-5 backdrop-blur-sm">
                <p className="text-[10px] uppercase tracking-[0.2em] text-ink/45">
                  {m.years} · {atm.grain}
                </p>
                <h2 className="display mt-1 text-3xl group-hover:text-sky">{m.title}</h2>
                <p className="mt-2 text-sm text-ink/60">{atm.label}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
