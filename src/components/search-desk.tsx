"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { HighlightedText } from "@/components/highlight";
import { EmptyState, ErrorNote, PageIntro, Shell } from "@/components/ui";
import { api } from "@/lib/api-client";
import type { AssetType, SearchHit, SearchMode } from "@/lib/types";
import { cn, typeLabel } from "@/lib/utils";
import { useUi } from "@/store/ui-store";

const EXAMPLES = ["black carbon albedo", "IndARC mixed layer", "neutron monitor", "dimethyl sulfide", "active layer thaw", "δ18O"];
const TYPES: AssetType[] = ["report", "image", "video", "dataset"];

export function SearchDesk() {
  const role = useUi((state) => state.role);
  const params = useSearchParams();
  const router = useRouter();
  const initialQ = params.get("q") ?? "";
  const initialMode = (params.get("mode") as SearchMode) || "hybrid";
  const [q, setQ] = useState(initialQ);
  const [mode, setMode] = useState<SearchMode>(initialMode === "keyword" || initialMode === "semantic" ? initialMode : "hybrid");
  const [types, setTypes] = useState<AssetType[]>(TYPES);
  const [expedition, setExpedition] = useState(params.get("expedition") ?? "");
  const [debounced, setDebounced] = useState(initialQ);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(q), 180);
    return () => window.clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    const next = new URLSearchParams();
    if (debounced) next.set("q", debounced);
    next.set("mode", mode);
    if (expedition) next.set("expedition", expedition);
    router.replace(`/search?${next.toString()}`, { scroll: false });
  }, [debounced, expedition, mode, router]);

  const catalog = useQuery({
    queryKey: ["catalog"],
    queryFn: () => api<{ expeditions: { id: string; code: string }[] }>("/api/catalog", role),
  });

  const search = useQuery({
    queryKey: ["search", debounced, mode, types, expedition],
    queryFn: () => {
      const query = new URLSearchParams({ q: debounced, mode, types: types.join(","), limit: "18" });
      if (expedition) query.set("expedition", expedition);
      return api<{ results: SearchHit[] }>(`/api/search?${query.toString()}`, role);
    },
  });

  const results = search.data?.results ?? [];
  const hint = useMemo(() => (debounced.trim().length < 2 ? "Add at least two characters, or pick an example." : ""), [debounced]);

  function toggleType(type: AssetType) {
    setTypes((current) => {
      if (current.includes(type) && current.length === 1) return current;
      return current.includes(type) ? current.filter((item) => item !== type) : [...current, type];
    });
  }

  return (
    <main>
      <PageIntro kicker="Search" title="Find the sentence, not just the file." lede="Keyword search highlights the span. Semantic search ranks passage embeddings. Hybrid does both, and never invents a snippet the words did not touch." />
      <Shell>
        <form className="panel p-4" onSubmit={(event) => event.preventDefault()}>
          <label className="sr-only" htmlFor="desk-search">Query</label>
          <input id="desk-search" className="field text-lg" value={q} onChange={(event) => setQ(event.target.value)} placeholder="black carbon, Kongsfjorden, δ18O" />
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Search mode">
            {(["hybrid", "keyword", "semantic"] as const).map((item) => (
              <button key={item} type="button" className={cn("btn btn-ghost capitalize", mode === item && "bg-accent text-accent-ink")} aria-pressed={mode === item} onClick={() => setMode(item)}>
                {item}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Media type">
            {TYPES.map((type) => (
              <button key={type} type="button" className={cn("btn btn-ghost", types.includes(type) && "bg-accent text-accent-ink")} aria-pressed={types.includes(type)} onClick={() => toggleType(type)}>
                {typeLabel(type)}
              </button>
            ))}
          </div>
          <label className="mt-3 block text-xs font-semibold uppercase tracking-[0.14em] text-muted" htmlFor="expedition-filter">Expedition</label>
          <select id="expedition-filter" className="field mt-2 md:max-w-sm" value={expedition} onChange={(event) => setExpedition(event.target.value)}>
            <option value="">All expeditions</option>
            {catalog.data?.expeditions.map((item) => <option key={item.id} value={item.id}>{item.code}</option>)}
          </select>
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLES.map((example) => (
              <button key={example} type="button" className="badge" onClick={() => setQ(example)}>{example}</button>
            ))}
          </div>
        </form>

        <p className="mt-5 text-sm text-muted" aria-live="polite">
          {search.isFetching ? "Searching…" : hint || `${results.length} passage hits`}
        </p>
        {search.isError ? <ErrorNote message={search.error instanceof Error ? search.error.message : "Search failed."} onRetry={() => search.refetch()} /> : null}
        <div className="mt-4 space-y-3">
          {results.map((hit) => (
            <article key={`${hit.asset.id}-${hit.passage?.id ?? "asset"}`} className="panel p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge badge-accent">{typeLabel(hit.asset.type)}</span>
                <span className="badge">{hit.asset.expeditionCode}</span>
                <span className="badge">{mode === "keyword" ? "Keyword" : mode === "semantic" ? "Semantic" : "Hybrid"} {Math.round(hit.score * 100)}</span>
              </div>
              <h2 className="mt-3 font-display text-2xl leading-tight">
                <Link href={`/documents/${hit.asset.id}${hit.passage ? `#p-${hit.passage.id}` : ""}`}>{hit.asset.title}</Link>
              </h2>
              {hit.passage ? <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">{hit.passage.heading}{hit.passage.page ? ` · p. ${hit.passage.page}` : ""}</p> : null}
              <p className="mt-3 text-sm leading-7">
                <HighlightedText text={hit.snippet} highlights={hit.highlights} />
              </p>
            </article>
          ))}
        </div>
        {!search.isFetching && debounced.trim().length > 1 && !results.length ? (
          <div className="mt-4">
            <EmptyState title="No locked span for that query." body="Try black carbon, IndARC, neutron monitor, or dimethyl sulfide. Semantic search still needs a topical neighbour in the archive." />
          </div>
        ) : null}
      </Shell>
    </main>
  );
}
