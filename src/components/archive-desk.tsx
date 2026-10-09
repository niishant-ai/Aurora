"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MediaImage } from "@/components/media-image";
import { PolarMap } from "@/components/polar-map";
import { PageIntro, Shell } from "@/components/ui";
import type { getCatalog } from "@/lib/data";
import type { AssetType } from "@/lib/types";
import { cn, provenanceLabel, typeLabel } from "@/lib/utils";

type Catalog = Awaited<ReturnType<typeof getCatalog>>;

const TYPES: Array<AssetType | "all"> = ["all", "report", "image", "video", "dataset"];

export function ArchiveDesk({ catalog }: { catalog: Catalog }) {
  const params = useSearchParams();
  const initialView = params.get("view") === "map" || params.get("view") === "timeline" ? params.get("view") : "grid";
  const [view, setView] = useState<"grid" | "timeline" | "map">(initialView === "map" || initialView === "timeline" ? initialView : "grid");
  const [type, setType] = useState<AssetType | "all">("all");
  const [region, setRegion] = useState("all");
  const [q, setQ] = useState("");

  const assets = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return catalog.assets.filter((asset) => {
      if (type !== "all" && asset.type !== type) return false;
      if (region !== "all" && asset.region !== region) return false;
      if (!needle) return true;
      return `${asset.title} ${asset.abstract} ${asset.tags.join(" ")} ${asset.expeditionName ?? ""}`.toLowerCase().includes(needle);
    });
  }, [catalog.assets, q, region, type]);

  const years = [...new Set(catalog.expeditions.map((item) => item.year))].sort((a, b) => b - a);

  return (
    <main>
      <PageIntro
        kicker="Catalogue"
        title="The polar record, filed by station and season."
        lede={`${catalog.counts.assets} records across ${catalog.counts.expeditions} expeditions. Reports are mock field logs. Stills and clips are labeled illustrative.`}
      >
        <div className="flex flex-wrap gap-2">
          {(["grid", "timeline", "map"] as const).map((item) => (
            <button key={item} type="button" className={cn("btn btn-ghost capitalize", view === item && "bg-accent text-accent-ink")} aria-pressed={view === item} onClick={() => setView(item)}>
              {item}
            </button>
          ))}
        </div>
      </PageIntro>
      <Shell>
        {view === "grid" ? (
          <>
            <div className="mb-6 grid gap-3 md:grid-cols-[1fr_auto_auto]">
              <label className="sr-only" htmlFor="archive-filter">Filter catalogue</label>
              <input id="archive-filter" className="field" value={q} onChange={(event) => setQ(event.target.value)} placeholder="Filter by title, tag, or station" />
              <select className="field md:w-44" aria-label="Type" value={type} onChange={(event) => setType(event.target.value as AssetType | "all")}>
                {TYPES.map((item) => <option key={item} value={item}>{item === "all" ? "All types" : typeLabel(item)}</option>)}
              </select>
              <select className="field md:w-48" aria-label="Region" value={region} onChange={(event) => setRegion(event.target.value)}>
                <option value="all">All regions</option>
                {["Antarctic", "Arctic", "Southern Ocean", "Himalaya"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <p className="mb-4 text-sm text-muted" aria-live="polite">{assets.length} showing</p>
            {assets.length ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {assets.map((asset) => (
                  <Link key={asset.id} href={`/documents/${asset.id}`} className="panel overflow-hidden hover:-translate-y-0.5 motion-safe:transition">
                    <MediaImage src={asset.thumbnailUrl} alt="" className="h-40 w-full object-cover" />
                    <div className="p-5">
                      <div className="flex flex-wrap gap-2">
                        <span className="badge badge-accent">{typeLabel(asset.type)}</span>
                        <span className="badge">{provenanceLabel(asset.provenance)}</span>
                      </div>
                      <h2 className="mt-3 font-display text-2xl leading-tight">{asset.title}</h2>
                      <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted">{asset.expeditionCode} · {asset.year}</p>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{asset.abstract}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="panel px-6 py-12 text-center text-sm text-muted">Nothing matches those filters. Clear them, or try Search for a passage-level hit.</div>
            )}
          </>
        ) : null}
        {view === "timeline" ? (
          <ol className="relative space-y-8 border-l border-line pl-6">
            {years.map((year) => (
              <li key={year}>
                <span className="absolute -left-1.5 mt-2 size-3 rounded-full bg-accent" aria-hidden />
                <p className="font-display text-3xl">{year}</p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {catalog.expeditions.filter((item) => item.year === year).map((item) => (
                    <Link key={item.id} href={`/expeditions/${item.id}`} className="panel p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-aurora">{item.code} · {item.region}</p>
                      <h2 className="mt-1 text-lg font-semibold">{item.name}</h2>
                      <p className="mt-2 text-sm text-muted">{item.startDate} to {item.endDate} · {item.lead}</p>
                    </Link>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        ) : null}
        {view === "map" ? <PolarMap expeditions={catalog.expeditions} /> : null}
      </Shell>
    </main>
  );
}
