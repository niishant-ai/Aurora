import { Suspense } from "react";
import { ArchiveDesk } from "@/components/archive-desk";
import { getCatalog } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Archive" };

export default async function ArchivePage() {
  const catalog = await getCatalog();
  return (
    <Suspense fallback={<div className="px-8 py-16 text-sm text-muted">Opening the catalogue…</div>}>
      <ArchiveDesk catalog={catalog} />
    </Suspense>
  );
}
