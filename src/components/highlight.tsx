import type { ReactNode } from "react";
import type { HighlightRange } from "@/lib/types";

export function HighlightedText({ text, highlights }: { text: string; highlights: HighlightRange[] }) {
  if (!highlights.length) return <>{text}</>;
  const nodes: ReactNode[] = [];
  let cursor = 0;
  highlights.forEach((range, index) => {
    const start = Math.max(cursor, Math.min(range.start, text.length));
    const end = Math.max(start, Math.min(range.end, text.length));
    if (start > cursor) nodes.push(text.slice(cursor, start));
    if (end > start) {
      nodes.push(
        <mark key={`${start}-${index}`} className="rounded bg-warm/20 px-0.5 text-ink">
          {text.slice(start, end)}
        </mark>,
      );
    }
    cursor = end;
  });
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return <>{nodes}</>;
}
