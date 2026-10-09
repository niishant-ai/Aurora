import { db } from "@/db";
import { drafts } from "@/db/schema";
import { getAssetDetail, logActivity } from "@/lib/data";
import { generateCitationLocked } from "@/lib/generate";
import { actorName, canGenerate, canSubmit, roleFromRequest } from "@/lib/roles";
import type { Audience, DraftKind } from "@/lib/types";

export const dynamic = "force-dynamic";

function isAudience(value: unknown): value is Audience {
  return value === "public" || value === "student" || value === "researcher";
}

function isKind(value: unknown): value is DraftKind {
  return value === "web" || value === "social";
}

export async function POST(request: Request) {
  const role = roleFromRequest(request);
  if (!canGenerate(role)) {
    return Response.json({ error: "Public readers can follow citations, not generate new copy." }, { status: 403 });
  }
  const body = (await request.json()) as {
    assetId?: string;
    passageIds?: string[];
    audience?: string;
    kind?: string;
    channel?: string;
    save?: boolean;
    submit?: boolean;
  };
  if (!body.assetId || !Array.isArray(body.passageIds) || !body.passageIds.length) {
    return Response.json({ error: "Choose an asset and at least one passage." }, { status: 400 });
  }
  if (!isAudience(body.audience) || !isKind(body.kind)) {
    return Response.json({ error: "Reading level or format is not recognised." }, { status: 400 });
  }
  const detail = await getAssetDetail(body.assetId);
  if (!detail) return Response.json({ error: "Source record not found." }, { status: 404 });
  const selected = detail.passages.filter((passage) => body.passageIds?.includes(passage.id));
  if (!selected.length) return Response.json({ error: "None of the selected passages belong to that record." }, { status: 400 });

  try {
    const generated = generateCitationLocked({
      passages: selected.map((passage) => ({
        id: passage.id,
        heading: passage.heading,
        body: passage.body,
        page: passage.page,
        assetId: detail.asset.id,
        assetTitle: detail.asset.title,
      })),
      audience: body.audience,
      kind: body.kind,
      assetTitle: detail.asset.title,
      tags: detail.asset.tags,
    });
    if (!body.save) return Response.json(generated);

    const status = body.submit ? (canSubmit(role) ? "review" : "draft") : "draft";
    const id = `draft-${Date.now().toString(36)}`;
    const now = new Date();
    await db.insert(drafts).values({
      id,
      assetId: detail.asset.id,
      passageIds: selected.map((passage) => passage.id),
      kind: body.kind,
      audience: body.audience,
      title: generated.title,
      body: generated.body,
      citations: generated.citations,
      grounding: generated.grounding,
      glossary: generated.glossary,
      status,
      channel: body.channel?.trim() || (body.kind === "social" ? "Instagram" : "Web feature"),
      scheduledAt: null,
      authorName: actorName(role),
      reviewerNote: null,
      createdAt: now,
      updatedAt: now,
    });
    await logActivity(actorName(role), status === "review" ? "Submitted a draft for review" : "Saved a citation-locked draft", id);
    return Response.json({ ...generated, draftId: id, status }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generation failed.";
    return Response.json({ error: message }, { status: 400 });
  }
}
