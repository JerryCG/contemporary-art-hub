import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto min-h-[70vh] max-w-2xl px-4 py-24 md:px-6">
      <h1 className="display text-5xl leading-none">Page not found</h1>
      <p className="mt-6 text-lg text-ink/70">That address is not on this site.</p>
      <Link href="/" className="mt-8 inline-block rounded-full bg-ink px-5 py-2 text-paper">
        Back home
      </Link>
    </div>
  );
}
