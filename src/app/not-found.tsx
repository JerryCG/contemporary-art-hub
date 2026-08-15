import Link from "next/link";

export default function NotFound() {
  return (
    <div className="atm-dada mx-auto min-h-[70vh] max-w-2xl px-4 py-24 md:px-6">
      <p className="text-[11px] uppercase tracking-[0.25em]">404 · anti-page</p>
      <h1 className="display mt-4 text-6xl leading-none">This is not a room.</h1>
      <p className="mt-6 text-lg text-ink/70">
        Either the work walked off the wall, or the URL is a Dada poem. The Hub still has a Hall.
      </p>
      <Link href="/" className="mt-8 inline-block rounded-full bg-ink px-5 py-2 text-paper">
        Back to the Hall
      </Link>
    </div>
  );
}
