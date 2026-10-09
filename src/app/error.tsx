"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="eyebrow">Desk interrupted</p>
      <h1 className="mt-3 font-display text-4xl">The archive could not finish that request.</h1>
      <p className="mt-3 text-sm text-muted">{error.message || "An unexpected error occurred."}</p>
      <button type="button" className="btn btn-primary mt-6" onClick={reset}>
        Retry
      </button>
    </main>
  );
}
