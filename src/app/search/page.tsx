import { Suspense } from "react";
import { SearchDesk } from "@/components/search-desk";

export const metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="px-8 py-16 text-sm text-muted">Preparing search…</div>}>
      <SearchDesk />
    </Suspense>
  );
}
