import Link from "next/link";
import { catalog } from "@/lib/content";

export function DailyHanging() {
  const withImage = catalog.works.filter((w) => w.image);
  const day = Math.floor(Date.now() / 86_400_000);
  const work = withImage[day % Math.max(withImage.length, 1)];
  if (!work) return null;
  return (
    <aside className="border border-ink/10 bg-paper-raised p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-ink/45">Today</p>
      <Link href={`/works/${work.slug}`} className="mt-3 block">
        <img src={work.image!} alt={work.title} className="aspect-[4/3] w-full object-cover" />
        <p className="display mt-3 text-xl leading-tight">{work.title}</p>
      </Link>
    </aside>
  );
}
