import Link from "next/link";
import type { Work } from "@/lib/types";

export function WorkFrame({
  work,
  artistName,
  priority = false,
}: {
  work: Work;
  artistName?: string;
  priority?: boolean;
}) {
  return (
    <Link href={`/works/${work.slug}`} className="group block min-w-0">
      <div className="frame">
        {work.image ? (
          <img
            src={work.image}
            alt={work.title}
            className="aspect-[4/3] w-full object-cover object-center transition duration-700 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex aspect-[4/3] items-end bg-ink p-4 text-paper">
            <p className="display text-2xl leading-tight">{work.title}</p>
          </div>
        )}
      </div>
      <p className="mt-3 display text-xl leading-tight group-hover:text-sky">{work.title}</p>
      <p className="text-sm text-ink/55">
        {artistName}
        {work.year ? ` · ${work.year}` : ""}
        {work.kind !== "work" ? ` · ${work.kind}` : ""}
      </p>
    </Link>
  );
}
