import type { Metadata } from "next";
import { ExhibitionBoard } from "@/components/ExhibitionBoard";

export const metadata: Metadata = { title: "Now showing" };

export default function NowPage() {
  return (
    <div className="page max-w-5xl">
      <h1 className="display display-page">Now showing</h1>
      <p className="mt-4 max-w-2xl text-base text-ink/70 sm:text-lg">
        Current shows, refreshed automatically. Hong Kong venues first, then a live list from the Art Institute of Chicago.
      </p>
      <ExhibitionBoard />
    </div>
  );
}
