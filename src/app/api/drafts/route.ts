import { listDrafts } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const drafts = await listDrafts();
  return Response.json({ drafts });
}
