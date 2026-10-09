"use client";

import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { api } from "@/lib/api-client";
import type { SearchHit } from "@/lib/types";
import { useUi } from "@/store/ui-store";

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const role = useUi((state) => state.role);
  const router = useRouter();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const query = useQuery({
    queryKey: ["palette", q],
    enabled: open,
    queryFn: () => api<{ results: SearchHit[] }>(`/api/search?q=${encodeURIComponent(q)}&mode=hybrid&limit=6`, role),
  });

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [onClose, open]);

  if (!open) return null;
  const results = query.data?.results ?? [];

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-[#061018]/55 px-4 pt-[12vh] backdrop-blur-sm" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-lenis-prevent
        className="panel w-full max-w-2xl overflow-hidden shadow-[0_24px_80px_rgba(5,8,16,0.28)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="sr-only">Search the polar archive</h2>
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="size-4 text-muted" aria-hidden />
          <input
            ref={inputRef}
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Search passages, stations, datasets"
            className="h-14 w-full bg-transparent text-base outline-none"
            aria-label="Archive search"
          />
          <button type="button" className="btn btn-ghost h-9 px-3" onClick={onClose} aria-label="Close search">
            <X className="size-4" />
          </button>
        </div>
        <ul className="max-h-80 overflow-auto p-2">
          {results.map((hit) => (
            <li key={`${hit.asset.id}-${hit.passage?.id ?? "asset"}`}>
              <button
                type="button"
                className="w-full rounded-xl px-3 py-3 text-left hover:bg-soft"
                onClick={() => {
                  const hash = hit.passage ? `#p-${hit.passage.id}` : "";
                  router.push(`/documents/${hit.asset.id}${hash}`);
                  onClose();
                }}
              >
                <span className="badge">{hit.asset.type}</span>
                <span className="mt-2 block font-medium">{hit.asset.title}</span>
                <span className="mt-1 block line-clamp-2 text-sm text-muted">{hit.snippet}</span>
              </button>
            </li>
          ))}
          {!results.length ? <li className="px-3 py-6 text-sm text-muted">Type a station, a method, or a number you remember.</li> : null}
        </ul>
      </div>
    </div>
  );
}
