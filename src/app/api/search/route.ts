import { searchArchive } from "@/lib/data";
import type { AssetType, SearchMode } from "@/lib/types";

export const dynamic = "force-dynamic";

function isType(value: string): value is AssetType {
  return value === "report" || value === "image" || value === "video" || value === "dataset";
}

function isMode(value: string | null): value is SearchMode {
  return value === "keyword" || value === "semantic" || value === "hybrid";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const types = (url.searchParams.get("types") ?? "report,image,video,dataset")
    .split(",")
    .map((item) => item.trim())
    .filter(isType);
  const limit = Math.min(40, Math.max(1, Number(url.searchParams.get("limit") ?? "16") || 16));
  const results = await searchArchive({
    q: url.searchParams.get("q") ?? "",
    mode: isMode(url.searchParams.get("mode")) ? (url.searchParams.get("mode") as SearchMode) : "hybrid",
    types: types.length ? types : ["report", "image", "video", "dataset"],
    expeditionId: url.searchParams.get("expedition") || undefined,
    limit,
  });
  return Response.json({
    results,
    q: url.searchParams.get("q") ?? "",
    mode: isMode(url.searchParams.get("mode")) ? url.searchParams.get("mode") : "hybrid",
  });
}
