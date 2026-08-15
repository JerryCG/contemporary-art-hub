import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Play" };

const toys = [
  { href: "/play/compass", title: "Compass", note: "Which room is your weather today?" },
  { href: "/play/quiz", title: "Quiz Theater", note: "Jerry’s original ten, plus a harder set." },
  { href: "/play/compare", title: "Two at Once", note: "Split two works. Series thinking." },
  { href: "/play/dots", title: "Seurat’s dots", note: "Color mixed in the eye." },
  { href: "/play/shatter", title: "Shatter", note: "A photo, several sides at once." },
  { href: "/play/cutup", title: "Cut-up", note: "Chance is a collaborator." },
  { href: "/play/xerox", title: "Xerox", note: "Jerry’s degeneration method." },
  { href: "/play/readymade", title: "Readymade", note: "Title an everyday object." },
];

export default function PlayPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <p className="chip">Toys that teach</p>
      <h1 className="display mt-4 text-5xl">Play</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/70">
        None of these need an API key. The Studio next door is for when you want oil paint.
      </p>
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {toys.map((t) => (
          <Link key={t.href} href={t.href} className="border border-ink/10 p-6 hover:shadow-card">
            <h2 className="display text-3xl">{t.title}</h2>
            <p className="mt-2 text-ink/60">{t.note}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
