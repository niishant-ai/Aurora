import { getCatalog } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const catalog = await getCatalog();
  return Response.json(catalog);
}
