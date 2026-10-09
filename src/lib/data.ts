import { readFile } from "node:fs/promises";
import path from "node:path";
import { db } from "@/db";
import { activities, assets, drafts, expeditions, passages } from "@/db/schema";
import { cosine, embed, highlightRanges, keywordScore, makeSnippet, queryTerms } from "@/lib/embeddings";
import { ensureSeeded } from "@/lib/seed";
import type {
  ActivityDTO,
  AssetDTO,
  AssetType,
  Audience,
  DatasetPreview,
  DraftDTO,
  DraftKind,
  DraftStatus,
  ExpeditionDTO,
  PassageDTO,
  SearchHit,
  SearchMode,
} from "@/lib/types";
import { desc, eq } from "drizzle-orm";

type AssetRow = typeof assets.$inferSelect;
type ExpeditionRow = typeof expeditions.$inferSelect;
type PassageRow = typeof passages.$inferSelect;
type DraftRow = typeof drafts.$inferSelect;

export type Corpus = {
  expeditions: ExpeditionDTO[];
  assets: AssetDTO[];
  passages: PassageDTO[];
};

let corpusCache: { at: number; data: Corpus } | null = null;

export function invalidateCorpus() {
  corpusCache = null;
}

function asAssetType(value: string): AssetType {
  if (value === "image" || value === "video" || value === "dataset" || value === "report") return value;
  return "report";
}

function asAudience(value: string): Audience {
  if (value === "student" || value === "researcher") return value;
  return "public";
}

function asKind(value: string): DraftKind {
  return value === "social" ? "social" : "web";
}

function asStatus(value: string): DraftStatus {
  if (value === "review" || value === "approved" || value === "published" || value === "draft") return value;
  return "draft";
}

export function toExpedition(row: ExpeditionRow): ExpeditionDTO {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    region: row.region,
    station: row.station,
    vessel: row.vessel,
    lead: row.lead,
    year: row.year,
    startDate: row.startDate,
    endDate: row.endDate,
    summary: row.summary,
    lat: row.lat,
    lng: row.lng,
    focus: row.focus,
  };
}

export function toAsset(row: AssetRow, expedition?: ExpeditionRow | ExpeditionDTO): AssetDTO {
  return {
    id: row.id,
    title: row.title,
    type: asAssetType(row.type),
    expeditionId: row.expeditionId,
    expeditionCode: expedition && "code" in expedition ? expedition.code : undefined,
    expeditionName: expedition?.name,
    region: expedition?.region,
    year: row.year,
    abstract: row.abstract,
    tags: row.tags,
    authors: row.authors,
    fileUrl: row.fileUrl,
    thumbnailUrl: row.thumbnailUrl,
    mimeType: row.mimeType,
    sizeLabel: row.sizeLabel,
    citation: row.citation,
    status: row.status,
    provenance: row.provenance,
    credit: row.credit,
    duration: row.duration,
    pages: row.pages,
    createdAt: row.createdAt.toISOString(),
  };
}

export function toPassage(row: PassageRow): PassageDTO {
  return {
    id: row.id,
    assetId: row.assetId,
    ord: row.ord,
    heading: row.heading,
    body: row.body,
    page: row.page,
    embedding: row.embedding,
  };
}

export function toDraft(row: DraftRow, assetTitle?: string): DraftDTO {
  return {
    id: row.id,
    assetId: row.assetId,
    assetTitle,
    passageIds: row.passageIds,
    kind: asKind(row.kind),
    audience: asAudience(row.audience),
    title: row.title,
    body: row.body,
    citations: row.citations,
    grounding: row.grounding,
    glossary: row.glossary,
    status: asStatus(row.status),
    channel: row.channel,
    scheduledAt: row.scheduledAt ? row.scheduledAt.toISOString() : null,
    authorName: row.authorName,
    reviewerNote: row.reviewerNote,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function toActivity(row: typeof activities.$inferSelect): ActivityDTO {
  return {
    id: row.id,
    actor: row.actor,
    action: row.action,
    target: row.target,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function loadCorpus() {
  if (corpusCache && Date.now() - corpusCache.at < 8000) return corpusCache.data;
  await ensureSeeded();
  const [expeditionRows, assetRows, passageRows] = await Promise.all([
    db.select().from(expeditions),
    db.select().from(assets),
    db.select().from(passages),
  ]);
  const expeditionById = new Map(expeditionRows.map((row) => [row.id, row]));
  const data: Corpus = {
    expeditions: expeditionRows.map(toExpedition).sort((a, b) => b.year - a.year || a.code.localeCompare(b.code)),
    assets: assetRows
      .map((row) => toAsset(row, expeditionById.get(row.expeditionId)))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    passages: passageRows.map(toPassage),
  };
  corpusCache = { at: Date.now(), data };
  return data;
}

export async function getCatalog() {
  const corpus = await loadCorpus();
  const counts = {
    assets: corpus.assets.length,
    expeditions: corpus.expeditions.length,
    reports: corpus.assets.filter((asset) => asset.type === "report").length,
    images: corpus.assets.filter((asset) => asset.type === "image").length,
    videos: corpus.assets.filter((asset) => asset.type === "video").length,
    datasets: corpus.assets.filter((asset) => asset.type === "dataset").length,
    passages: corpus.passages.length,
  };
  return { expeditions: corpus.expeditions, assets: corpus.assets, counts };
}

export async function getAssetDetail(id: string) {
  const corpus = await loadCorpus();
  const asset = corpus.assets.find((item) => item.id === id);
  if (!asset) return null;
  const expedition = corpus.expeditions.find((item) => item.id === asset.expeditionId) ?? null;
  const related = corpus.passages
    .filter((passage) => passage.assetId === id)
    .sort((a, b) => a.ord - b.ord)
    .map((passage) => ({ ...passage, embedding: passage.embedding }));
  const dataset = asset.type === "dataset" ? await readDatasetPreview(asset.fileUrl) : null;
  return { asset, expedition, passages: related, dataset };
}

export async function readDatasetPreview(fileUrl: string): Promise<DatasetPreview | null> {
  if (!fileUrl.startsWith("/data/") || fileUrl.includes("..")) return null;
  try {
    const text = await readFile(path.join(process.cwd(), "public", fileUrl), "utf8");
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (!lines.length) return null;
    const split = (line: string) => line.split(",").map((cell) => cell.trim());
    return { headers: split(lines[0]), rows: lines.slice(1, 13).map(split) };
  } catch {
    return null;
  }
}

export async function searchArchive(options: {
  q: string;
  mode: SearchMode;
  types: AssetType[];
  expeditionId?: string;
  limit: number;
}): Promise<SearchHit[]> {
  const corpus = await loadCorpus();
  const terms = queryTerms(options.q);
  const queryVector = terms.length ? embed(options.q) : [];
  const allowed = new Set(options.types);
  const assets = corpus.assets.filter((asset) => {
    if (allowed.size && !allowed.has(asset.type)) return false;
    if (options.expeditionId && asset.expeditionId !== options.expeditionId) return false;
    return true;
  });
  const assetById = new Map(assets.map((asset) => [asset.id, asset]));

  if (terms.length < 1) {
    return assets.slice(0, options.limit).map((asset) => ({
      asset,
      passage: corpus.passages.find((passage) => passage.assetId === asset.id) ?? null,
      score: 0,
      snippet: asset.abstract,
      highlights: [],
      mode: options.mode,
    }));
  }

  const hits: SearchHit[] = [];
  for (const passage of corpus.passages) {
    const asset = assetById.get(passage.assetId);
    if (!asset) continue;
    const passageText = `${passage.heading} ${passage.body}`;
    const assetText = `${asset.title} ${asset.abstract} ${asset.tags.join(" ")} ${asset.authors} ${asset.expeditionName ?? ""}`;
    const lexical = Math.max(keywordScore(passageText, terms), keywordScore(assetText, terms) * 0.92);
    const semantic = queryVector.length ? cosine(queryVector, passage.embedding) : 0;
    let score = semantic;
    if (options.mode === "keyword") score = lexical;
    if (options.mode === "hybrid") score = 0.62 * Math.max(semantic, 0) + 0.38 * lexical;
    if (options.mode === "keyword" && lexical <= 0) continue;
    if (options.mode !== "keyword" && score <= 0) continue;
    const snippetSource = lexical > 0 && keywordScore(passageText, terms) > 0 ? passageText : passage.body;
    const snippet = makeSnippet(snippetSource, terms);
    hits.push({
      asset,
      passage: { ...passage, embedding: [] },
      score: Number(score.toFixed(4)),
      snippet: snippet.snippet,
      highlights: options.mode === "semantic" && lexical === 0 ? [] : snippet.highlights,
      mode: options.mode,
    });
  }

  hits.sort((a, b) => b.score - a.score);
  const best = hits[0]?.score ?? 0;
  const cutoff = options.mode === "keyword" ? 0.01 : Math.max(0.08, best * 0.62);
  const perAsset = new Map<string, number>();
  const filtered: SearchHit[] = [];
  for (const hit of hits) {
    if (hit.score < cutoff) continue;
    const seen = perAsset.get(hit.asset.id) ?? 0;
    if (seen >= 2) continue;
    perAsset.set(hit.asset.id, seen + 1);
    filtered.push(hit);
    if (filtered.length >= options.limit) break;
  }
  return filtered;
}

export function passageHighlights(text: string, query: string) {
  return highlightRanges(text, queryTerms(query));
}

export async function listDrafts() {
  await ensureSeeded();
  const corpus = await loadCorpus();
  const rows = await db.select().from(drafts).orderBy(desc(drafts.updatedAt));
  const titles = new Map(corpus.assets.map((asset) => [asset.id, asset.title]));
  return rows.map((row) => toDraft(row, titles.get(row.assetId)));
}

export async function getDraft(id: string) {
  await ensureSeeded();
  const rows = await db.select().from(drafts).where(eq(drafts.id, id)).limit(1);
  const row = rows[0];
  if (!row) return null;
  const corpus = await loadCorpus();
  return toDraft(row, corpus.assets.find((asset) => asset.id === row.assetId)?.title);
}

export async function listStories() {
  const all = await listDrafts();
  return all.filter((draft) => draft.status === "published");
}

export async function logActivity(actor: string, action: string, target: string) {
  await db.insert(activities).values({
    id: crypto.randomUUID(),
    actor,
    action,
    target,
    createdAt: new Date(),
  });
}

export async function getDashboard() {
  const corpus = await loadCorpus();
  const [draftRows, activityRows] = await Promise.all([
    db.select().from(drafts).orderBy(desc(drafts.updatedAt)),
    db.select().from(activities).orderBy(desc(activities.createdAt)).limit(10),
  ]);
  const titles = new Map(corpus.assets.map((asset) => [asset.id, asset.title]));
  const draftDtos = draftRows.map((row) => toDraft(row, titles.get(row.assetId)));
  const byType = ["report", "image", "video", "dataset"].map((type) => ({
    type,
    count: corpus.assets.filter((asset) => asset.type === type).length,
  }));
  const byRegion = ["Antarctic", "Arctic", "Southern Ocean", "Himalaya"].map((region) => ({
    region,
    count: corpus.assets.filter((asset) => asset.region === region).length,
  }));
  const funnel = ["draft", "review", "approved", "published"].map((status) => ({
    status,
    count: draftDtos.filter((draft) => draft.status === status).length,
  }));
  return {
    counts: {
      assets: corpus.assets.length,
      expeditions: corpus.expeditions.length,
      passages: corpus.passages.length,
      pending: draftDtos.filter((draft) => draft.status === "review" || draft.status === "draft").length,
      published: draftDtos.filter((draft) => draft.status === "published").length,
    },
    byType,
    byRegion,
    funnel,
    activities: activityRows.map(toActivity),
    pending: draftDtos.filter((draft) => draft.status === "review" || draft.status === "draft").slice(0, 5),
    upcoming: draftDtos
      .filter((draft) => draft.scheduledAt)
      .sort((a, b) => (a.scheduledAt ?? "").localeCompare(b.scheduledAt ?? ""))
      .slice(0, 6),
    expeditions: corpus.expeditions.slice(0, 4),
    latest: corpus.assets.filter((asset) => asset.type === "report").slice(0, 4),
  };
}

export async function getHome() {
  const corpus = await loadCorpus();
  const stories = await listStories();
  return {
    expeditions: corpus.expeditions,
    latest: corpus.assets.slice(0, 6),
    stories: stories.slice(0, 3),
    counts: {
      assets: corpus.assets.length,
      expeditions: corpus.expeditions.length,
      reports: corpus.assets.filter((asset) => asset.type === "report").length,
      images: corpus.assets.filter((asset) => asset.type === "image").length,
      videos: corpus.assets.filter((asset) => asset.type === "video").length,
      datasets: corpus.assets.filter((asset) => asset.type === "dataset").length,
    },
  };
}
