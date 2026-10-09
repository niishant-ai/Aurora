import { getAssetDetail } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const detail = await getAssetDetail(id);
  if (!detail) return Response.json({ error: "Record not found." }, { status: 404 });
  return Response.json(detail);
}
