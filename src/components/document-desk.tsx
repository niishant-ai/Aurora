"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MediaImage } from "@/components/media-image";
import { Sparkline } from "@/components/ui";
import type { getAssetDetail } from "@/lib/data";
import { canGenerate } from "@/lib/roles";
import { provenanceLabel, typeLabel } from "@/lib/utils";
import { useUi } from "@/store/ui-store";

type Detail = NonNullable<Awaited<ReturnType<typeof getAssetDetail>>>;

export function DocumentDesk({ detail }: { detail: Detail }) {
  const role = useUi((state) => state.role);
  const [selected, setSelected] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const { asset, expedition, passages, dataset } = detail;

  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id) return;
    document.getElementById(id)?.scrollIntoView({ block: "start" });
  }, []);

  function toggle(id: string) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  async function copyCitation() {
    await navigator.clipboard.writeText(asset.citation);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  const passageQuery = selected.join(",");

  return (
    <main className="mx-auto grid max-w-[1440px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8 lg:py-14">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <p className="eyebrow">{typeLabel(asset.type)} · {asset.year}</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.02] tracking-[-0.03em]">{asset.title}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="badge badge-accent">{provenanceLabel(asset.provenance)}</span>
          <span className="badge">{asset.sizeLabel}</span>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted">{asset.abstract}</p>
        <dl className="mt-5 space-y-2 text-sm">
          <div><dt className="text-muted">Authors</dt><dd>{asset.authors}</dd></div>
          <div><dt className="text-muted">Expedition</dt><dd>{expedition ? <Link className="text-aurora" href={`/expeditions/${expedition.id}`}>{expedition.code} · {expedition.station}</Link> : asset.expeditionId}</dd></div>
          {asset.credit ? <div><dt className="text-muted">Credit</dt><dd>{asset.credit}</dd></div> : null}
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          {asset.tags.map((tag) => <span key={tag} className="badge">{tag}</span>)}
        </div>
        <button type="button" className="btn btn-ghost mt-5 w-full" onClick={copyCitation}>{copied ? "Citation copied" : "Copy citation"}</button>
        {asset.type !== "report" ? (
          <a className="btn btn-primary mt-2 w-full" href={asset.fileUrl} target="_blank" rel="noreferrer">Open file</a>
        ) : null}
      </aside>
      <section>
        {asset.type === "image" ? <MediaImage src={asset.fileUrl} alt={asset.title} className="mb-6 max-h-[28rem] w-full rounded-[1.3rem] object-cover" /> : null}
        {asset.type === "video" ? (
          <video className="mb-6 w-full rounded-[1.3rem] bg-black" controls preload="metadata" poster={asset.thumbnailUrl ?? undefined}>
            <source src={asset.fileUrl} type="video/mp4" />
          </video>
        ) : null}
        {dataset ? (
          <div className="panel mb-6 overflow-auto p-4">
            <p className="eyebrow">Table preview</p>
            <table className="mt-3 w-full text-left text-sm">
              <thead>
                <tr>{dataset.headers.map((header) => <th key={header} className="border-b border-line px-2 py-2 font-semibold">{header}</th>)}</tr>
              </thead>
              <tbody>
                {dataset.rows.map((row, index) => (
                  <tr key={index}>{row.map((cell, cellIndex) => <td key={`${index}-${cellIndex}`} className="border-b border-line px-2 py-2">{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        <div className="space-y-4">
          {passages.map((passage) => {
            const checked = selected.includes(passage.id);
            return (
              <article key={passage.id} id={`p-${passage.id}`} className={`passage panel p-5 ${checked ? "ring-2 ring-accent" : ""}`}>
                <label className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 size-4" checked={checked} onChange={() => toggle(passage.id)} />
                  <span>
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-aurora">Passage {passage.ord}{passage.page ? ` · p. ${passage.page}` : ""}</span>
                    <span className="mt-1 block font-display text-2xl">{passage.heading}</span>
                  </span>
                </label>
                <p className="mt-3 text-[0.98rem] leading-7">{passage.body}</p>
                {role === "researcher" || role === "admin" ? (
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted">Semantic fingerprint</p>
                    <Sparkline values={passage.embedding} />
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>
      {selected.length ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-canvas/90 px-5 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3">
            <p className="text-sm">{selected.length} passage{selected.length === 1 ? "" : "s"} selected</p>
            {canGenerate(role) ? (
              <div className="flex flex-wrap gap-2">
                <Link className="btn btn-primary" href={`/generate?asset=${asset.id}&passages=${passageQuery}&kind=web`}>Website copy</Link>
                <Link className="btn btn-ghost" href={`/generate?asset=${asset.id}&passages=${passageQuery}&kind=social`}>Social post</Link>
              </div>
            ) : (
              <p className="text-sm text-muted">Switch to researcher, editor, or admin to generate from this selection.</p>
            )}
          </div>
        </div>
      ) : null}
    </main>
  );
}
