import type { Metadata } from "next";
import { ExhibitionBoard } from "@/components/ExhibitionBoard";

export const metadata: Metadata = { title: "Now showing" };

export default function NowPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <p className="chip">Hong Kong first, then the world</p>
      <h1 className="display mt-4 text-5xl">Now showing</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/70">
        A curated calendar that always works, with a live layer when museum APIs answer. Take looking back into the city.
      </p>
      <ExhibitionBoard />
    </div>
  );
}
