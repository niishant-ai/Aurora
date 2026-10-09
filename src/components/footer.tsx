import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-8 border-t border-line">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <p className="font-display text-3xl tracking-[-0.03em]">AURORA</p>
          <p className="measure mt-3 text-sm leading-7 text-muted">
            Archive for Unified Research, Outreach & Repository Access. A SIH26063 prototype for the Ministry of Earth Sciences and NCPOR. Mock records, not official publications.
          </p>
        </div>
        <div>
          <p className="eyebrow">Desks</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link className="link-draw" href="/archive">Archive</Link></li>
            <li><Link className="link-draw" href="/search">Search</Link></li>
            <li><Link className="link-draw" href="/review">Review queue</Link></li>
            <li><Link className="link-draw" href="/stories">Published stories</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow">Institution</p>
          <p className="mt-4 text-sm leading-7 text-muted">National Centre for Polar and Ocean Research, Vasco da Gama, Goa. Times on this desk are shown in IST.</p>
        </div>
      </div>
    </footer>
  );
}
