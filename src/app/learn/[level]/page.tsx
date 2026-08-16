import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { paths } from "@/lib/learn";

export function generateStaticParams() {
  return Object.keys(paths).map((level) => ({ level }));
}

export async function generateMetadata({ params }: { params: Promise<{ level: string }> }): Promise<Metadata> {
  const { level } = await params;
  const p = paths[level as keyof typeof paths];
  return { title: p?.title ?? "Path" };
}

export default async function PathPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  const p = paths[level as keyof typeof paths];
  if (!p) notFound();
  return (
    <article className="page max-w-3xl">
      <p className="chip">{p.duration}</p>
      <h1 className="display display-page mt-4">{p.title}</h1>
      <p className="mt-4 text-lg text-ink/70">{p.lede}</p>
      <ol className="mt-12 space-y-6">
        {p.steps.map((s, i) => (
          <li key={s.href} className="grid grid-cols-[3rem_1fr] gap-4">
            <span className="display text-3xl text-ink/30">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <Link href={s.href} className="display text-2xl hover:text-sky">
                {s.title}
              </Link>
              <p className="mt-1 text-ink/65">{s.why}</p>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}
