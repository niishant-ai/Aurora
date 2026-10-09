"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ErrorNote, Gate, PageIntro, Shell } from "@/components/ui";
import { api } from "@/lib/api-client";
import { extractMetadata } from "@/lib/extract";
import { canIngest } from "@/lib/roles";
import type { AssetType, ExpeditionDTO } from "@/lib/types";
import { useUi } from "@/store/ui-store";

type Created = { id: string; title: string; passages: number; confidence: string[] };

export function IngestDesk() {
  const role = useUi((state) => state.role);
  const pushToast = useUi((state) => state.pushToast);
  const catalog = useQuery({
    queryKey: ["catalog"],
    queryFn: () => api<{ expeditions: ExpeditionDTO[] }>("/api/catalog", role),
  });
  const [file, setFile] = useState<File | null>(null);
  const [queue, setQueue] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [type, setType] = useState<AssetType>("report");
  const [expeditionId, setExpeditionId] = useState("exp-isea44");
  const [tags, setTags] = useState("");
  const [abstract, setAbstract] = useState("");
  const [notes, setNotes] = useState("");
  const [authors, setAuthors] = useState("Intake desk");
  const [confidence, setConfidence] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [created, setCreated] = useState<Created | null>(null);
  const [over, setOver] = useState(false);

  const expeditions = catalog.data?.expeditions ?? [];
  const ready = useMemo(() => title.trim().length > 3, [title]);

  function applyFile(next: File) {
    const extracted = extractMetadata(next.name, next.type, notes);
    setFile(next);
    setTitle(extracted.title);
    setYear(String(extracted.year));
    setType(extracted.type);
    setExpeditionId(extracted.expeditionId);
    setTags(extracted.tags.join(", "));
    setAbstract(extracted.abstract);
    setConfidence(extracted.confidence);
  }

  function takeFiles(list: FileList | File[]) {
    const files = [...list];
    if (!files.length) return;
    const [first, ...rest] = files;
    applyFile(first);
    setQueue(rest);
  }

  async function submit(demo = false) {
    setError("");
    setPending(true);
    try {
      const form = new FormData();
      if (demo) form.set("demo", "1");
      else {
        if (file) form.set("file", file);
        form.set("filename", file?.name || "intake-note.txt");
        form.set("title", title);
        form.set("year", year);
        form.set("type", type);
        form.set("expeditionId", expeditionId);
        form.set("tags", tags);
        form.set("abstract", abstract);
        form.set("notes", notes);
        form.set("authors", authors);
        form.set("mime", file?.type || "text/plain");
      }
      const result = await api<Created>("/api/assets", role, { method: "POST", body: form });
      setCreated(result);
      pushToast(`Catalogued ${result.title}`);
      if (queue.length) {
        const [next, ...rest] = queue;
        setQueue(rest);
        applyFile(next);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Ingest failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main>
      <PageIntro kicker="Ingest" title="Drop the file. Correct the guess. File it." lede="Year, type, expedition, and tags are inferred from the filename, the MIME type, and a small expedition dictionary. You confirm before anything is written." />
      <Shell>
        {!canIngest(role) ? <Gate title="Intake is an editorial action." body="Switch to editor or admin. Researchers can search and generate, but filing a new record stays with the desk." /> : null}
        <div
          className={`panel border-dashed p-8 text-center ${over ? "ring-2 ring-accent" : ""}`}
          onDragOver={(event) => { event.preventDefault(); setOver(true); }}
          onDragLeave={() => setOver(false)}
          onDrop={(event) => { event.preventDefault(); setOver(false); takeFiles(event.dataTransfer.files); }}
        >
          <p className="font-display text-3xl">Drop a PDF, image, video, CSV, or text note</p>
          <p className="mt-2 text-sm text-muted">Or choose a file. A second and third file wait in the queue.</p>
          <label className="btn btn-primary mt-5 cursor-pointer">
            Choose file
            <input className="sr-only" type="file" accept=".pdf,.txt,.md,.csv,image/*,video/*" onChange={(event) => event.target.files && takeFiles(event.target.files)} />
          </label>
          <button type="button" className="btn btn-ghost ml-2" disabled={!canIngest(role) || pending} onClick={() => submit(true)}>Load demo packet</button>
          {file ? <p className="mt-4 text-sm">Ready: {file.name}{queue.length ? ` · ${queue.length} waiting` : ""}</p> : null}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold">Title<input className="field mt-2 font-normal" value={title} onChange={(event) => setTitle(event.target.value)} /></label>
          <label className="text-sm font-semibold">Year<input className="field mt-2 font-normal" value={year} onChange={(event) => setYear(event.target.value)} inputMode="numeric" /></label>
          <label className="text-sm font-semibold">Type
            <select className="field mt-2 font-normal" value={type} onChange={(event) => setType(event.target.value as AssetType)}>
              <option value="report">Report</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="dataset">Dataset</option>
            </select>
          </label>
          <label className="text-sm font-semibold">Expedition
            <select className="field mt-2 font-normal" value={expeditionId} onChange={(event) => setExpeditionId(event.target.value)}>
              {expeditions.map((item) => <option key={item.id} value={item.id}>{item.code} · {item.station}</option>)}
              {!expeditions.length ? <option value="exp-isea44">ISEA-44</option> : null}
            </select>
          </label>
          <label className="text-sm font-semibold md:col-span-2">Tags<input className="field mt-2 font-normal" value={tags} onChange={(event) => setTags(event.target.value)} /></label>
          <label className="text-sm font-semibold md:col-span-2">Authors<input className="field mt-2 font-normal" value={authors} onChange={(event) => setAuthors(event.target.value)} /></label>
          <label className="text-sm font-semibold md:col-span-2">Abstract<textarea className="field mt-2 min-h-24 font-normal" value={abstract} onChange={(event) => setAbstract(event.target.value)} /></label>
          <label className="text-sm font-semibold md:col-span-2">Notes to extract as passages<textarea className="field mt-2 min-h-28 font-normal" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Paste a paragraph if the file is a binary PDF." /></label>
        </div>
        {confidence.length ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {confidence.map((item) => <li key={item} className="badge badge-accent">{item}</li>)}
          </ul>
        ) : null}
        <button type="button" className="btn btn-primary mt-5" disabled={!canIngest(role) || pending || (!file && !ready)} onClick={() => submit(false)}>
          {pending ? "Filing…" : "File in the catalogue"}
        </button>
        {error ? <div className="mt-4"><ErrorNote message={error} /></div> : null}
        {created ? (
          <div className="panel mt-6 p-5">
            <p className="eyebrow">Catalogued</p>
            <h2 className="mt-2 font-display text-3xl">{created.title}</h2>
            <p className="mt-2 text-sm text-muted">{created.passages} passage{created.passages === 1 ? "" : "s"} embedded for search.</p>
            <Link className="btn btn-primary mt-4" href={`/documents/${created.id}`}>Open the record</Link>
          </div>
        ) : null}
      </Shell>
    </main>
  );
}
