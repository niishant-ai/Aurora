import type { Citation } from "@/lib/types";

export function CitedBody({ body, citations, className }: { body: string; citations: Citation[]; className?: string }) {
  const parts = body.split(/(\[\d+\])/g);
  return (
    <div className={className ?? "story-body text-ink"}>
      {parts.map((part, index) => {
        const match = part.match(/^\[(\d+)\]$/);
        if (!match) return <span key={index}>{part}</span>;
        const citation = citations.find((item) => item.n === Number(match[1]));
        if (!citation) return <sup key={index}>[{match[1]}]</sup>;
        return (
          <a key={index} className="citation-mark" href={`/documents/${citation.assetId}#p-${citation.passageId}`}>
            <sup>[{citation.n}]</sup>
          </a>
        );
      })}
    </div>
  );
}
