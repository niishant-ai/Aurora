"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function MediaImage({ src, alt, className }: { src?: string | null; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const remote = Boolean(src && /^https?:/.test(src));
  return (
    <span className={cn("relative block overflow-hidden bg-soft", className)}>
      {!src || failed ? <span className="aurora-fallback absolute inset-0" role="img" aria-label={alt || "Polar still unavailable"} /> : null}
      {src && !failed && remote ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : null}
      {src && !failed && !remote ? (
        <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" onError={() => setFailed(true)} />
      ) : null}
    </span>
  );
}
