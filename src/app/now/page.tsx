import type { Metadata } from "next";
import { ExhibitionBoard } from "@/components/ExhibitionBoard";

export const metadata: Metadata = { title: "Now showing" };

export default function NowPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <h1 className="display text-5xl">Now showing</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/70">Selected exhibitions, starting with Hong Kong.</p>
      <ExhibitionBoard />
    </div>
  );
}
