"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CitedBody } from "@/components/cited-body";
import { ErrorNote, Gate, PageIntro, Shell } from "@/components/ui";
import { api } from "@/lib/api-client";
import { canGenerate } from "@/lib/roles";
import type { AssetDTO, Audience, DraftKind, GenerationResult, PassageDTO } from "@/lib/types";
import { audienceLabel, cn } from "@/lib/utils";
import { useUi } from "@/store/ui-store";

type Detail = { asset: AssetDTO; passages: PassageDTO[] };

export function GenerateDesk() {
  const role = useUi((state) => state.role);
  const pushToast = useUi((state) => state.pushToast);
  const params = useSearchParams();
  const router = useRouter();
  const [assetId, setAssetId] = useState(params.get("asset") ?? "");
  const [selected, setSelected] = useState<string[]>((params.get("passages") ?? "").split(",").filter(Boolean));
  const [audience, setAudience] = useState<Audience>("public");
  const [kind, setKind] = useState<DraftKind>(params.get("kind") === "social" ? "social" : "web");
  const [channel, setChannel] = useState(params.get("kind") === "social" ? "Instagram" : "Web feature");
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState<"preview" | "save" | "submit" | null>(null);

  const catalog = useQuery({
    queryKey: ["catalog"],
    queryFn: () => api<{ assets: AssetDTO[] }>("/api/catalog", role),
  });
  const detail = useQuery({
    queryKey: ["asset", assetId],
    enabled: Boolean(assetId),
    queryFn: () => api<Detail>(`/api/assets/${assetId}`, role),
  });

  useEffect(() => {
    if (!assetId && catalog.data?.assets.length) {
      const first = catalog.data.assets.find((asset) => asset.type === "report") ?? catalog.data.assets[0];
      setAssetId(first.id);
    }
  }, [assetId, catalog.data]);

  useEffect(() => {
    if (!detail.data) return;
    setSelected((current) => current.filter((id) => detail.data.passages.some((passage) => passage.id === id)));
  }, [detail.data]);

  const reports = useMemo(() => catalog.data?.assets ?? [], [catalog.data]);

  async function run(save: boolean, submit: boolean) {
    setError("");
    setPending(save ? (submit ? "submit" : "save") : "preview");
    try {
      const generated = await api<GenerationResult & { draftId?: string }>("/api/generate", role, {
        method: "POST",
        body: JSON.stringify({ assetId, passageIds: selected, audience, kind, channel, save, submit }),
      });
      setResult(generated);
      if (generated.draftId) {
        pushToast(submit ? "Sent to review." : "Draft saved.");
        router.push(`/review?focus=${generated.draftId}`);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Generation failed.");
    } finally {
      setPending(null);
    }
  }

  return (
    <main>
      <PageIntro kicker="Citation-locked generation" title="Rewrite only what the passage already said." lede="Public, student, or researcher. Website copy or a social post. Every numeral has to survive a lock check against the selected span." />
      <Shell>
        {!canGenerate(role) ? <Gate title="The reading room does not generate." body="Switch the header role to researcher, editor, or admin. Public visitors can still open published stories and follow citations." /> : null}
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="space-y-4">
            <label className="block text-sm font-semibold" htmlFor="source-asset">Source record</label>
            <select id="source-asset" className="field" value={assetId} onChange={(event) => { setAssetId(event.target.value); setSelected([]); setResult(null); }}>
              {reports.map((asset) => <option key={asset.id} value={asset.id}>{asset.title}</option>)}
            </select>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Reading level">
              {(["public", "student", "researcher"] as const).map((item) => (
                <button key={item} type="button" className={cn("btn btn-ghost", audience === item && "bg-accent text-accent-ink")} aria-pressed={audience === item} onClick={() => setAudience(item)}>
                  {audienceLabel(item)}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Format">
              {(["web", "social"] as const).map((item) => (
                <button key={item} type="button" className={cn("btn btn-ghost", kind === item && "bg-accent text-accent-ink")} aria-pressed={kind === item} onClick={() => { setKind(item); setChannel(item === "social" ? "Instagram" : "Web feature"); }}>
                  {item === "web" ? "Website copy" : "Social post"}
                </button>
              ))}
            </div>
            <label className="block text-sm font-semibold" htmlFor="channel">Channel</label>
            <select id="channel" className="field" value={channel} onChange={(event) => setChannel(event.target.value)}>
              {["Web feature", "Instagram", "X", "School briefing", "Researcher note"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <div className="space-y-2">
              {detail.data?.passages.map((passage) => (
                <label key={passage.id} className="panel flex gap-3 p-4">
                  <input type="checkbox" className="mt-1" checked={selected.includes(passage.id)} onChange={() => setSelected((current) => current.includes(passage.id) ? current.filter((id) => id !== passage.id) : [...current, passage.id])} />
                  <span>
                    <span className="font-semibold">{passage.heading}</span>
                    <span className="mt-1 block text-sm leading-6 text-muted">{passage.body}</span>
                  </span>
                </label>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn btn-primary" disabled={!canGenerate(role) || !selected.length || pending !== null} onClick={() => run(false, false)}>
                {pending === "preview" ? "Generating…" : "Generate"}
              </button>
              <button type="button" className="btn btn-ghost" disabled={!canGenerate(role) || !selected.length || pending !== null} onClick={() => run(true, false)}>Save draft</button>
              <button type="button" className="btn btn-ghost" disabled={!canGenerate(role) || !selected.length || pending !== null} onClick={() => run(true, true)}>Submit for review</button>
            </div>
            {error ? <ErrorNote message={error} /> : null}
          </section>
          <section className="panel p-5 lg:sticky lg:top-28 lg:self-start">
            {result ? (
              <>
                <p className="badge badge-warm">Adapter · {result.adapter}</p>
                <h2 className="mt-4 font-display text-3xl leading-tight">{result.title}</h2>
                <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted">{result.charCount} characters · {audienceLabel(result.audience)} · {result.kind}</p>
                <CitedBody body={result.body} citations={result.citations} className="mt-5 whitespace-pre-wrap text-[1.02rem] leading-7" />
                {result.glossary.length ? (
                  <div className="mt-6 border-t border-line pt-4">
                    <p className="eyebrow">Terms, not findings</p>
                    <ul className="mt-3 space-y-2 text-sm">
                      {result.glossary.map((entry) => <li key={entry.term}><strong>{entry.term}.</strong> {entry.definition}</li>)}
                    </ul>
                  </div>
                ) : null}
                <div className="mt-6 border-t border-line pt-4">
                  <p className="eyebrow">Lock check</p>
                  <ul className="mt-3 space-y-3">
                    {result.grounding.map((item) => (
                      <li key={`${item.passageId}-${item.citation}`} className="text-sm leading-6">
                        <p>{item.sentence} <sup className="text-warm">[{item.citation}]</sup></p>
                        <p className="mt-1 text-muted">Source span: {item.sourceExcerpt}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div>
                <p className="eyebrow">Waiting</p>
                <h2 className="mt-3 font-display text-3xl">Select a passage, then generate.</h2>
                <p className="mt-3 text-sm leading-6 text-muted">Nothing is written until you ask. The preview is not saved until you choose Save draft or Submit for review.</p>
                {assetId ? <Link className="mt-4 inline-block text-sm font-semibold text-aurora" href={`/documents/${assetId}`}>Open the full viewer</Link> : null}
              </div>
            )}
          </section>
        </div>
      </Shell>
    </main>
  );
}
