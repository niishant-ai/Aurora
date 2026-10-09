import { db, pool } from "@/db";
import { activities, assets, drafts, expeditions, meta, passages } from "@/db/schema";
import { embed } from "@/lib/embeddings";
import { generateCitationLocked, type PassageSource } from "@/lib/generate";
import {
  clipSeeds,
  expeditionSeeds,
  reportSeeds,
  SEED_VERSION,
  stillSeeds,
  tableSeeds,
} from "@/lib/seed-data";
import type { DraftStatus } from "@/lib/types";
import { istDate } from "@/lib/utils";
import { eq } from "drizzle-orm";

const SEED_KEY = "seed_version";

let pending: Promise<void> | null = null;

export function ensureSeeded() {
  if (!pending) {
    pending = runSeed().catch((error: unknown) => {
      pending = null;
      throw error;
    });
  }
  return pending;
}

function citationFor(authors: string, year: number, title: string, code: string) {
  return `${authors} (${year}). ${title}. AURORA Polar Archive, NCPOR / MoES. ${code}. Prototype record — not an official publication.`;
}

function codeFor(expeditionId: string) {
  return expeditionSeeds.find((item) => item.id === expeditionId)?.code ?? "AURORA";
}

async function insertChunks<T>(rows: T[], write: (slice: T[]) => Promise<void>) {
  const size = 40;
  for (let index = 0; index < rows.length; index += size) {
    await write(rows.slice(index, index + size));
  }
}

export async function runSeed() {
  await pool.query("select pg_advisory_lock(26063)");
  try {
    const existing = await db.select().from(meta).where(eq(meta.key, SEED_KEY)).limit(1);
    if (existing[0]?.value === SEED_VERSION) return;

    const expeditionRows = expeditionSeeds.map((item) => ({ ...item }));
    const assetRows: (typeof assets.$inferInsert)[] = [];
    const passageRows: (typeof passages.$inferInsert)[] = [];

    reportSeeds.forEach((report, index) => {
      assetRows.push({
        id: report.id,
        title: report.title,
        type: "report",
        expeditionId: report.expeditionId,
        year: report.year,
        abstract: report.abstract,
        tags: report.tags,
        authors: report.authors,
        fileUrl: `/documents/${report.id}`,
        thumbnailUrl: report.thumb,
        mimeType: "text/html",
        sizeLabel: `${report.pages} pp`,
        citation: citationFor(report.authors, report.year, report.title, codeFor(report.expeditionId)),
        status: "catalogued",
        provenance: "mock-report",
        credit: null,
        duration: null,
        pages: report.pages,
        createdAt: new Date(Date.UTC(report.year, index % 12, (index % 27) + 1, 4, 30)),
      });
      report.sections.forEach((section, sectionIndex) => {
        passageRows.push({
          id: `${report.id}-p${sectionIndex + 1}`,
          assetId: report.id,
          ord: sectionIndex + 1,
          heading: section.heading,
          body: section.body,
          page: section.page,
          embedding: embed(`${section.heading} ${section.body}`),
        });
      });
    });

    stillSeeds.forEach((still, index) => {
      assetRows.push({
        id: still.id,
        title: still.title,
        type: "image",
        expeditionId: still.expeditionId,
        year: codeYear(still.expeditionId),
        abstract: still.caption,
        tags: still.tags,
        authors: "AURORA outreach desk",
        fileUrl: still.url,
        thumbnailUrl: still.url,
        mimeType: "image/jpeg",
        sizeLabel: "Illustrative still",
        citation: citationFor("AURORA outreach desk", codeYear(still.expeditionId), still.title, codeFor(still.expeditionId)),
        status: "catalogued",
        provenance: "illustrative",
        credit: still.credit,
        duration: null,
        pages: null,
        createdAt: new Date(Date.UTC(codeYear(still.expeditionId), (index % 12), (index % 27) + 1, 5, 0)),
      });
      passageRows.push({
        id: `${still.id}-p1`,
        assetId: still.id,
        ord: 1,
        heading: "Caption",
        body: still.caption,
        page: null,
        embedding: embed(`${still.title} ${still.caption}`),
      });
    });

    clipSeeds.forEach((clip, index) => {
      assetRows.push({
        id: clip.id,
        title: clip.title,
        type: "video",
        expeditionId: clip.expeditionId,
        year: codeYear(clip.expeditionId),
        abstract: clip.caption,
        tags: clip.tags,
        authors: "AURORA outreach desk",
        fileUrl: clip.url,
        thumbnailUrl: clip.poster,
        mimeType: "video/mp4",
        sizeLabel: clip.duration,
        citation: citationFor("AURORA outreach desk", codeYear(clip.expeditionId), clip.title, codeFor(clip.expeditionId)),
        status: "catalogued",
        provenance: "illustrative",
        credit: clip.credit,
        duration: clip.duration,
        pages: null,
        createdAt: new Date(Date.UTC(codeYear(clip.expeditionId), (index % 12), (index % 20) + 1, 6, 0)),
      });
      passageRows.push({
        id: `${clip.id}-p1`,
        assetId: clip.id,
        ord: 1,
        heading: "Caption",
        body: clip.caption,
        page: null,
        embedding: embed(`${clip.title} ${clip.caption}`),
      });
    });

    tableSeeds.forEach((table, index) => {
      assetRows.push({
        id: table.id,
        title: table.title,
        type: "dataset",
        expeditionId: table.expeditionId,
        year: table.year,
        abstract: table.abstract,
        tags: table.tags,
        authors: table.authors,
        fileUrl: table.fileUrl,
        thumbnailUrl: null,
        mimeType: "text/csv",
        sizeLabel: "CSV extract",
        citation: citationFor(table.authors, table.year, table.title, codeFor(table.expeditionId)),
        status: "catalogued",
        provenance: "mock-dataset",
        credit: null,
        duration: null,
        pages: null,
        createdAt: new Date(Date.UTC(table.year, 5, index + 3, 4, 0)),
      });
      table.sections.forEach((section, sectionIndex) => {
        passageRows.push({
          id: `${table.id}-p${sectionIndex + 1}`,
          assetId: table.id,
          ord: sectionIndex + 1,
          heading: section.heading,
          body: section.body,
          page: section.page,
          embedding: embed(`${section.heading} ${section.body}`),
        });
      });
    });

    const draftPlan: {
      id: string;
      assetId: string;
      passageIds: string[];
      audience: "public" | "student" | "researcher";
      kind: "web" | "social";
      status: DraftStatus;
      channel: string;
      day: number | null;
      authorName: string;
      reviewerNote: string | null;
    }[] = [
      { id: "draft-bharati-web", assetId: "rpt-bharati-aod", passageIds: ["rpt-bharati-aod-p1", "rpt-bharati-aod-p2", "rpt-bharati-aod-p3"], audience: "public", kind: "web", status: "published", channel: "Web feature", day: 8, authorName: "Imran Desai", reviewerNote: "Numbers checked against the January log." },
      { id: "draft-indarc-social", assetId: "rpt-indarc-winter", passageIds: ["rpt-indarc-winter-p1", "rpt-indarc-winter-p2"], audience: "student", kind: "social", status: "published", channel: "Instagram", day: 15, authorName: "Imran Desai", reviewerNote: null },
      { id: "draft-neutron-web", assetId: "rpt-neutron", passageIds: ["rpt-neutron-p1", "rpt-neutron-p2", "rpt-neutron-p4"], audience: "researcher", kind: "web", status: "published", channel: "Researcher note", day: 21, authorName: "Dr. N. Chawla", reviewerNote: null },
      { id: "draft-thaw-review", assetId: "rpt-thaw", passageIds: ["rpt-thaw-p1", "rpt-thaw-p3"], audience: "public", kind: "web", status: "review", channel: "School briefing", day: 12, authorName: "Imran Desai", reviewerNote: "Keep the permafrost sentence. Do not say the ground has thawed away." },
      { id: "draft-dms-draft", assetId: "rpt-so-dms", passageIds: ["rpt-so-dms-p1", "rpt-so-dms-p2"], audience: "public", kind: "social", status: "draft", channel: "Instagram", day: null, authorName: "Dr. Ananya Rao", reviewerNote: null },
      { id: "draft-lake-approved", assetId: "rpt-lakes-cond", passageIds: ["rpt-lakes-cond-p1", "rpt-lakes-cond-p2"], audience: "student", kind: "web", status: "approved", channel: "Web feature", day: 18, authorName: "Imran Desai", reviewerNote: "Approved for the February school page." },
      { id: "draft-wind-review", assetId: "rpt-madice-wind", passageIds: ["rpt-madice-wind-p1", "rpt-madice-wind-p2"], audience: "public", kind: "social", status: "review", channel: "X", day: 4, authorName: "Imran Desai", reviewerNote: null },
      { id: "draft-heritage-approved", assetId: "rpt-heritage", passageIds: ["rpt-heritage-p2", "rpt-heritage-p4"], audience: "public", kind: "web", status: "approved", channel: "Web feature", day: 26, authorName: "Desk admin", reviewerNote: "Do not turn the station offset into a trend." },
    ];

    const draftRows = draftPlan.map((plan) => {
      const asset = assetRows.find((item) => item.id === plan.assetId);
      const selected: PassageSource[] = passageRows
        .filter((passage) => plan.passageIds.includes(passage.id))
        .map((passage) => ({
          id: passage.id,
          heading: passage.heading,
          body: passage.body,
          page: passage.page ?? null,
          assetId: passage.assetId,
          assetTitle: asset?.title ?? plan.assetId,
        }));
      const generated = generateCitationLocked({
        passages: selected,
        audience: plan.audience,
        kind: plan.kind,
        assetTitle: asset?.title ?? plan.assetId,
        tags: asset?.tags ?? [],
      });
      const now = new Date();
      return {
        id: plan.id,
        assetId: plan.assetId,
        passageIds: plan.passageIds,
        kind: plan.kind,
        audience: plan.audience,
        title: generated.title,
        body: generated.body,
        citations: generated.citations,
        grounding: generated.grounding,
        glossary: generated.glossary,
        status: plan.status,
        channel: plan.channel,
        scheduledAt: plan.day ? istDate(plan.day, 10) : null,
        authorName: plan.authorName,
        reviewerNote: plan.reviewerNote,
        createdAt: now,
        updatedAt: now,
      };
    });

    const activityRows = [
      ["Desk admin", "Published the Bharati aerosol feature", "draft-bharati-web"],
      ["Imran Desai", "Moved the thaw briefing into review", "draft-thaw-review"],
      ["Dr. Ananya Rao", "Saved a dimethyl sulfide social draft", "draft-dms-draft"],
      ["Dr. Meera Krishnan", "Filed the IndARC-9 winter note", "rpt-indarc-winter"],
      ["Desk admin", "Approved the lake conductivity study note", "draft-lake-approved"],
      ["Imran Desai", "Scheduled the neutron-monitor note", "draft-neutron-web"],
    ].map((item, index) => ({
      id: `act-seed-${index + 1}`,
      actor: item[0],
      action: item[1],
      target: item[2],
      createdAt: new Date(Date.now() - (index + 1) * 1000 * 60 * 60 * 6),
    }));

    await db.transaction(async (tx) => {
      await tx.delete(activities);
      await tx.delete(drafts);
      await tx.delete(passages);
      await tx.delete(assets);
      await tx.delete(expeditions);
      await tx.delete(meta);
      await insertChunks(expeditionRows, async (slice) => {
        await tx.insert(expeditions).values(slice);
      });
      await insertChunks(assetRows, async (slice) => {
        await tx.insert(assets).values(slice);
      });
      await insertChunks(passageRows, async (slice) => {
        await tx.insert(passages).values(slice);
      });
      await tx.insert(drafts).values(draftRows);
      await tx.insert(activities).values(activityRows);
      await tx.insert(meta).values({ key: SEED_KEY, value: SEED_VERSION });
    });
  } finally {
    await pool.query("select pg_advisory_unlock(26063)");
  }
}

function codeYear(expeditionId: string) {
  return expeditionSeeds.find((item) => item.id === expeditionId)?.year ?? 2024;
}
