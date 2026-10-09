import { getAssetDetail } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const detail = await getAssetDetail(id);
  if (!detail || detail.asset.type !== "dataset") {
    return Response.json({ error: "Dataset not found." }, { status: 404 });
  }
  return Response.json({ asset: detail.asset, preview: detail.dataset });
}
