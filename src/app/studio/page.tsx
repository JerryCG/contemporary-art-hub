import type { Metadata } from "next";
import { StudioDesk } from "@/components/StudioDesk";
import { catalog } from "@/lib/content";

export const metadata: Metadata = { title: "Studio" };

export default function StudioPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <p className="chip">Make in a language, not a forgery</p>
      <h1 className="display mt-4 text-5xl">Studio</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/70">
        Describe a subject, or bring a photo. We wrap it in the grammar of a room — Fauvist color, Magritte deadpan, Malevich
        geometry — via SpaceXAI Imagine. Without a key, the local toys still work.
      </p>
      <StudioDesk movements={catalog.movements.map((m) => ({ slug: m.slug, title: m.title }))} />
    </div>
  );
}
