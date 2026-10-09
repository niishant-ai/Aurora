export default function Loading() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8" aria-busy="true" aria-live="polite">
      <div className="aurora-mesh mb-8 h-24 rounded-[1.5rem]" />
      <div className="skeleton h-4 w-32" />
      <div className="skeleton mt-4 h-14 w-2/3 max-w-xl" />
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="skeleton h-48" />
        <div className="skeleton h-48" />
        <div className="skeleton h-48" />
      </div>
    </div>
  );
}
