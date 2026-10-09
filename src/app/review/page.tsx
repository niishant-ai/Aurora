import { Suspense } from "react";
import { ReviewDesk } from "@/components/review-desk";

export const metadata = { title: "Review" };

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="px-8 py-16 text-sm text-muted">Opening the queue…</div>}>
      <ReviewDesk />
    </Suspense>
  );
}
