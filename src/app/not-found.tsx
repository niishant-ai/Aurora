import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="eyebrow">Not in the catalogue</p>
      <h1 className="mt-3 font-display text-4xl">That record is not on this desk.</h1>
      <p className="mt-3 text-sm text-muted">It may never have been filed, or the link is from an older seed.</p>
      <Link href="/search" className="btn btn-primary mt-6">Search the archive</Link>
    </main>
  );
}
