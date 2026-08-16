import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Play" };

const toys = [
  { href: "/play/compass", title: "Compass", note: "Find a style that fits you." },
  { href: "/play/quiz", title: "Quiz", note: "Ten questions, plus a harder set." },
  { href: "/play/compare", title: "Compare", note: "Look at two works side by side." },
  { href: "/play/dots", title: "Dots", note: "Mix color the way Seurat did." },
  { href: "/play/shatter", title: "Shatter", note: "Turn a photo into Cubist facets." },
  { href: "/play/cutup", title: "Cut-up", note: "Shuffle words at random." },
  { href: "/play/xerox", title: "Xerox", note: "Copy a picture until it changes." },
  { href: "/play/readymade", title: "Readymade", note: "Give an everyday object a title." },
];

export default function PlayPage() {
  return (
    <div className="page max-w-5xl">
      <h1 className="display display-page">Play</h1>
      <p className="mt-4 max-w-2xl text-base text-ink/70 sm:text-lg">Short games to help you look. No account needed.</p>
      <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2">
        {toys.map((t) => (
          <Link key={t.href} href={t.href} className="border border-ink/10 p-6 hover:shadow-card">
            <h2 className="display display-section">{t.title}</h2>
            <p className="mt-2 text-ink/60">{t.note}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
