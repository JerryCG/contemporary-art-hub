import Link from "next/link";

const rooms = [
  { href: "/atelier/works", label: "Works" },
  { href: "/atelier/appreciation", label: "Art appreciation" },
];

export function AtelierNav({ current }: { current?: string }) {
  return (
    <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
      <Link href="/atelier" className={!current ? "text-ink underline decoration-sky/40 underline-offset-4" : "text-ink/50 hover:text-ink"}>
        Atelier
      </Link>
      {rooms.map((r) => (
        <Link
          key={r.href}
          href={r.href}
          className={
            current === r.href
              ? "text-ink underline decoration-sky/40 underline-offset-4"
              : "text-ink/50 hover:text-ink"
          }
        >
          {r.label}
        </Link>
      ))}
    </nav>
  );
}
