import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page min-h-[70svh] max-w-2xl py-16 md:py-24">
      <h1 className="display display-page leading-none">Page not found</h1>
      <p className="mt-6 text-lg text-ink/70">That address is not on this site.</p>
      <Link href="/" className="mt-8 inline-block rounded-full bg-ink px-5 py-2 text-paper">
        Back home
      </Link>
    </div>
  );
}
