"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CitedBody } from "@/components/cited-body";
import { ErrorNote, Gate, PageIntro, Shell } from "@/components/ui";
import { api } from "@/lib/api-client";
import { canApprove, canReview, canSubmit } from "@/lib/roles";
import type { DraftDTO, DraftStatus } from "@/lib/types";
import { audienceLabel, cn, statusLabel } from "@/lib/utils";
import { useUi } from "@/store/ui-store";

const COLUMNS: DraftStatus[] = ["draft", "review", "approved", "published"];

export function ReviewDesk() {
  const role = useUi((state) => state.role);
  const pushToast = useUi((state) => state.pushToast);
  const params = useSearchParams();
  const focus = params.get("focus");
  const client = useQueryClient();
  const [note, setNote] = useState("Keep the source numbers. Do not widen the claim.");
  const query = useQuery({
    queryKey: ["drafts"],
    queryFn: () => api<{ drafts: DraftDTO[] }>("/api/drafts", role),
  });

  useEffect(() => {
    if (!focus) return;
    document.getElementById(`draft-${focus}`)?.scrollIntoView({ block: "center" });
  }, [focus, query.data]);

  const mutation = useMutation({
    mutationFn: (input: { id: string; action: string; note?: string }) =>
      api<DraftDTO>(`/api/drafts/${input.id}`, role, { method: "PATCH", body: JSON.stringify(input) }),
    onSuccess: (draft) => {
      pushToast(`${statusLabel(draft.status)} · ${draft.title}`);
      void client.invalidateQueries({ queryKey: ["drafts"] });
    },
  });

  const drafts = query.data?.drafts ?? [];

  return (
    <main>
      <PageIntro kicker="Editorial queue" title="Nothing publishes without a hand on it." lede="Researchers can submit. Editors can return a draft with a note. Only the admin can approve and publish. The role switcher is the mock gate." />
      <Shell>
        {role === "public" ? <Gate title="The queue is an editorial desk." body="You can still read published stories. Switch to editor or admin to move cards." /> : null}
        {query.isError ? <ErrorNote message={query.error instanceof Error ? query.error.message : "The queue failed to load."} onRetry={() => query.refetch()} /> : null}
        {mutation.isError ? <ErrorNote message={mutation.error instanceof Error ? mutation.error.message : "That move was refused."} /> : null}
        <label className="mb-4 block text-sm" htmlFor="return-note">Note used when returning a draft</label>
        <textarea id="return-note" className="field mb-6 min-h-20" value={note} onChange={(event) => setNote(event.target.value)} />
        <div className="grid gap-4 xl:grid-cols-4">
          {COLUMNS.map((status) => (
            <section key={status} aria-label={statusLabel(status)}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-muted">{statusLabel(status)} · {drafts.filter((draft) => draft.status === status).length}</h2>
              <div className="space-y-3">
                {drafts.filter((draft) => draft.status === status).map((draft) => (
                  <article key={draft.id} id={`draft-${draft.id}`} className={cn("panel p-4", focus === draft.id && "ring-2 ring-accent")}>
                    <p className="text-xs uppercase tracking-[0.14em] text-aurora">{draft.channel} · {audienceLabel(draft.audience)}</p>
                    <h3 className="mt-2 font-display text-2xl leading-tight">{draft.title}</h3>
                    <p className="mt-2 text-xs text-muted">{draft.authorName} · {draft.citations.length} citations</p>
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm font-semibold">Read and check</summary>
                      <CitedBody body={draft.body} citations={draft.citations} className="mt-3 whitespace-pre-wrap text-sm leading-6" />
                      {draft.reviewerNote ? <p className="mt-3 text-sm text-warm">Note: {draft.reviewerNote}</p> : null}
                      <Link className="mt-3 inline-block text-sm text-aurora" href={`/documents/${draft.assetId}`}>Source record</Link>
                    </details>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {status === "draft" && canSubmit(role) ? <button type="button" className="btn btn-primary" onClick={() => mutation.mutate({ id: draft.id, action: "submit" })}>Submit</button> : null}
                      {status === "review" && canReview(role) ? <button type="button" className="btn btn-ghost" onClick={() => mutation.mutate({ id: draft.id, action: "return", note })}>Return</button> : null}
                      {status === "review" && canApprove(role) ? <button type="button" className="btn btn-primary" onClick={() => mutation.mutate({ id: draft.id, action: "approve" })}>Approve</button> : null}
                      {status === "approved" && canApprove(role) ? <button type="button" className="btn btn-primary" onClick={() => mutation.mutate({ id: draft.id, action: "publish" })}>Publish</button> : null}
                      {status === "published" ? <Link className="btn btn-ghost" href={`/stories/${draft.id}`}>Open story</Link> : null}
                    </div>
                  </article>
                ))}
                {!drafts.filter((draft) => draft.status === status).length ? <p className="text-sm text-muted">Nothing in this column.</p> : null}
              </div>
            </section>
          ))}
        </div>
      </Shell>
    </main>
  );
}
