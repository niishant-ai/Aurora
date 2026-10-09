import { createDemoPacket, createIntake } from "@/lib/intake";
import { actorName, canIngest, roleFromRequest } from "@/lib/roles";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const role = roleFromRequest(request);
  if (!canIngest(role)) {
    return Response.json({ error: "Ingest is open to the editor and admin desks." }, { status: 403 });
  }
  const form = await request.formData();
  if (form.get("demo") === "1") {
    const created = await createDemoPacket(actorName(role));
    return Response.json(created, { status: 201 });
  }

  const fileValue = form.get("file");
  const file = fileValue instanceof File && fileValue.size > 0
    ? { name: fileValue.name, type: fileValue.type, bytes: Buffer.from(await fileValue.arrayBuffer()) }
    : null;
  const filename = file?.name || String(form.get("filename") ?? "intake-note.txt");
  const tags = String(form.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const yearRaw = Number(form.get("year"));
  const created = await createIntake({
    filename,
    mime: file?.type || String(form.get("mime") ?? "text/plain"),
    notes: String(form.get("notes") ?? ""),
    title: String(form.get("title") ?? ""),
    year: Number.isFinite(yearRaw) ? yearRaw : undefined,
    type: String(form.get("type") ?? ""),
    expeditionId: String(form.get("expeditionId") ?? ""),
    tags,
    abstract: String(form.get("abstract") ?? ""),
    authors: String(form.get("authors") ?? ""),
    file,
    actor: actorName(role),
  });
  return Response.json(created, { status: 201 });
}
