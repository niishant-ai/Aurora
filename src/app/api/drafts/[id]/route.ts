import { db } from "@/db";
import { drafts } from "@/db/schema";
import { getDraft, logActivity } from "@/lib/data";
import { actorName, canApprove, canSchedule, canSubmit, roleFromRequest } from "@/lib/roles";
import type { DraftStatus } from "@/lib/types";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const ACTIONS = ["submit", "return", "approve", "publish", "schedule"] as const;
type Action = (typeof ACTIONS)[number];

function isAction(value: unknown): value is Action {
  return ACTIONS.some((action) => action === value);
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const draft = await getDraft(id);
  if (!draft) return Response.json({ error: "Draft not found." }, { status: 404 });
  return Response.json(draft);
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const role = roleFromRequest(request);
  const { id } = await context.params;
  const current = await getDraft(id);
  if (!current) return Response.json({ error: "Draft not found." }, { status: 404 });
  const body = (await request.json()) as { action?: string; note?: string; scheduledAt?: string | null };
  if (!isAction(body.action)) return Response.json({ error: "Unknown queue action." }, { status: 400 });

  let status: DraftStatus = current.status;
  let reviewerNote = current.reviewerNote;
  let scheduledAt = current.scheduledAt ? new Date(current.scheduledAt) : null;
  let actionLabel = "";

  if (body.action === "submit") {
    if (!canSubmit(role)) return Response.json({ error: "You cannot submit drafts from this role." }, { status: 403 });
    if (current.status !== "draft") return Response.json({ error: "Only drafts can be submitted." }, { status: 400 });
    status = "review";
    actionLabel = "Submitted a draft for review";
  }
  if (body.action === "return") {
    if (role !== "editor" && role !== "admin") return Response.json({ error: "Only the editorial desk can return a draft." }, { status: 403 });
    if (current.status !== "review") return Response.json({ error: "Only items in review can be returned." }, { status: 400 });
    status = "draft";
    reviewerNote = body.note?.trim() || "Returned without a note.";
    actionLabel = "Returned a draft with a note";
  }
  if (body.action === "approve") {
    if (!canApprove(role)) return Response.json({ error: "Only an admin can approve." }, { status: 403 });
    if (current.status !== "review") return Response.json({ error: "Approve from the review column." }, { status: 400 });
    status = "approved";
    actionLabel = "Approved a draft";
  }
  if (body.action === "publish") {
    if (!canApprove(role)) return Response.json({ error: "Only an admin can publish." }, { status: 403 });
    if (current.status !== "approved") return Response.json({ error: "Publish from the approved column." }, { status: 400 });
    status = "published";
    actionLabel = "Published a story";
  }
  if (body.action === "schedule") {
    if (!canSchedule(role)) return Response.json({ error: "Scheduling is open to editors and admins." }, { status: 403 });
    if (body.scheduledAt === null || body.scheduledAt === "") {
      scheduledAt = null;
      actionLabel = "Cleared a schedule date";
    } else {
      const next = new Date(body.scheduledAt ?? "");
      if (Number.isNaN(next.getTime())) return Response.json({ error: "That date could not be read." }, { status: 400 });
      scheduledAt = next;
      actionLabel = "Rescheduled a dissemination item";
    }
  }

  await db
    .update(drafts)
    .set({ status, reviewerNote, scheduledAt, updatedAt: new Date() })
    .where(eq(drafts.id, id));
  await logActivity(actorName(role), actionLabel, id);
  const updated = await getDraft(id);
  return Response.json(updated);
}
