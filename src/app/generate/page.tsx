import { Suspense } from "react";
import { GenerateDesk } from "@/components/generate-desk";

export const metadata = { title: "Generate" };

export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="px-8 py-16 text-sm text-muted">Opening the generation desk…</div>}>
      <GenerateDesk />
    </Suspense>
  );
}
