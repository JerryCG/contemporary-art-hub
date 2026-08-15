import type { Metadata } from "next";
import { StudioDesk } from "@/components/StudioDesk";
import { catalog } from "@/lib/content";

export const metadata: Metadata = { title: "Studio" };

export default function StudioPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <h1 className="display text-5xl">Studio</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/70">
        Describe a scene or upload a photo, then choose a style. Play games need no key; this page needs an API key.
      </p>
      <StudioDesk movements={catalog.movements.map((m) => ({ slug: m.slug, title: m.title }))} />
    </div>
  );
}
