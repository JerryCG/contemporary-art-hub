import type { Metadata } from "next";
import { StudioDesk } from "@/components/StudioDesk";
import { catalog } from "@/lib/content";

export const metadata: Metadata = { title: "Studio" };

export default function StudioPage() {
  return (
    <div className="page max-w-4xl">
      <h1 className="display display-page">Studio</h1>
      <p className="mt-4 max-w-2xl text-base text-ink/70 sm:text-lg">
        Describe a scene or upload a photo, then choose a style. Play games need no key; this page needs an API key.
      </p>
      <StudioDesk movements={catalog.movements.map((m) => ({ slug: m.slug, title: m.title }))} />
    </div>
  );
}
