import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { db } from "@/db";
import { assets, passages } from "@/db/schema";
import { invalidateCorpus, logActivity } from "@/lib/data";
import { embed } from "@/lib/embeddings";
import { extractMetadata, passagesFromText } from "@/lib/extract";
import { expeditionSeeds } from "@/lib/seed-data";
import { ensureSeeded } from "@/lib/seed";
import type { AssetType } from "@/lib/types";
import { safeSlug } from "@/lib/utils";

function isAssetType(value: string): value is AssetType {
  return value === "report" || value === "image" || value === "video" || value === "dataset";
}

function citation(authors: string, year: number, title: string, expeditionId: string) {
  const code = expeditionSeeds.find((item) => item.id === expeditionId)?.code ?? "AURORA";
  return `${authors} (${year}). ${title}. AURORA Polar Archive, NCPOR / MoES. ${code}. Intake record — not an official publication.`;
}

export async function createIntake(input: {
  filename: string;
  mime: string;
  notes: string;
  title?: string;
  year?: number;
  type?: string;
  expeditionId?: string;
  tags?: string[];
  abstract?: string;
  authors?: string;
  file?: { name: string; type: string; bytes: Buffer } | null;
  actor: string;
}) {
  await ensureSeeded();
  const extracted = extractMetadata(input.filename, input.mime, input.notes);
  const type = input.type && isAssetType(input.type) ? input.type : extracted.type;
  const expeditionId = expeditionSeeds.some((item) => item.id === input.expeditionId)
    ? input.expeditionId ?? extracted.expeditionId
    : extracted.expeditionId;
  const year = input.year && input.year > 1900 && input.year < 2100 ? input.year : extracted.year;
  const title = input.title?.trim() || extracted.title;
  const authors = input.authors?.trim() || "Intake desk";
  const tags = input.tags?.length ? input.tags : extracted.tags;
  const abstract = input.abstract?.trim() || extracted.abstract;
  const id = `asset-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

  let fileUrl = `/documents/${id}`;
  let mimeType = input.mime || "application/octet-stream";
  if (input.file && input.file.bytes.length) {
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    const filename = `${id}-${safeSlug(input.file.name) || "upload"}`;
    await writeFile(path.join(dir, filename), input.file.bytes);
    fileUrl = `/uploads/${filename}`;
    mimeType = input.file.type || mimeType;
  }

  let text = input.notes.trim();
  if (input.file && /text|json|csv|markdown/.test(mimeType)) {
    text = `${text}\n\n${input.file.bytes.toString("utf8")}`.trim();
  }
  const blocks = passagesFromText(text);
  const sections = blocks.length
    ? blocks
    : [{ heading: "Intake abstract", body: abstract }];

  await db.insert(assets).values({
    id,
    title,
    type,
    expeditionId,
    year,
    abstract,
    tags,
    authors,
    fileUrl,
    thumbnailUrl: type === "image" ? fileUrl : null,
    mimeType,
    sizeLabel: input.file ? `${Math.max(1, Math.round(input.file.bytes.length / 1024))} KB` : "Intake note",
    citation: citation(authors, year, title, expeditionId),
    status: "catalogued",
    provenance: "intake",
    credit: null,
    duration: null,
    pages: type === "report" ? Math.max(1, sections.length) : null,
    createdAt: new Date(),
  });

  await db.insert(passages).values(
    sections.map((section, index) => ({
      id: `${id}-p${index + 1}`,
      assetId: id,
      ord: index + 1,
      heading: section.heading,
      body: section.body,
      page: index + 1,
      embedding: embed(`${section.heading} ${section.body}`),
    })),
  );

  await logActivity(input.actor, `Catalogued ${title}`, id);
  invalidateCorpus();
  return {
    id,
    title,
    type,
    expeditionId,
    year,
    tags,
    abstract,
    confidence: extracted.confidence,
    passages: sections.length,
  };
}

export async function createDemoPacket(actor: string) {
  const samplePath = path.join(process.cwd(), "public", "samples", "isea44-black-carbon-note.txt");
  const text = await readFile(samplePath, "utf8");
  return createIntake({
    filename: "ISEA-44-bharati-black-carbon-2025.txt",
    mime: "text/plain",
    notes: text,
    authors: "Intake desk",
    actor,
  });
}
