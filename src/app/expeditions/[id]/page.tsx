import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaImage } from "@/components/media-image";
import { getCatalog } from "@/lib/data";
import { provenanceLabel, typeLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const catalog = await getCatalog();
  const expedition = catalog.expeditions.find((item) => item.id === id);
  return { title: expedition?.code ?? "Expedition" };
}

export default async function ExpeditionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const catalog = await getCatalog();
  const expedition = catalog.expeditions.find((item) => item.id === id);
  if (!expedition) notFound();
  const related = catalog.assets.filter((asset) => asset.expeditionId === id);
  return (
    <main className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <p className="eyebrow">{expedition.region} · {expedition.year}</p>
      <h1 className="mt-3 max-w-4xl font-display text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.04em]">{expedition.name}</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{expedition.summary}</p>
      <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div className="panel p-4"><dt className="text-muted">Station</dt><dd className="mt-1 font-semibold">{expedition.station}</dd></div>
        <div className="panel p-4"><dt className="text-muted">Lead</dt><dd className="mt-1 font-semibold">{expedition.lead}</dd></div>
        <div className="panel p-4"><dt className="text-muted">Vessel</dt><dd className="mt-1 font-semibold">{expedition.vessel}</dd></div>
        <div className="panel p-4"><dt className="text-muted">Dates</dt><dd className="mt-1 font-semibold">{expedition.startDate} – {expedition.endDate}</dd></div>
      </dl>
      <h2 className="mt-10 font-display text-3xl">Filed under this expedition</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {related.map((asset) => (
          <Link key={asset.id} href={`/documents/${asset.id}`} className="panel overflow-hidden">
            <MediaImage src={asset.thumbnailUrl} alt="" className="h-36 w-full object-cover" />
            <div className="p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-aurora">{typeLabel(asset.type)} · {provenanceLabel(asset.provenance)}</p>
              <h3 className="mt-2 font-display text-2xl leading-tight">{asset.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
