import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageIntro({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string;
  title: string;
  lede: string;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-4 py-14 sm:px-6 md:py-20 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div className="max-w-3xl">
          <p className="eyebrow">{kicker}</p>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.05] tracking-[-0.03em] text-balance">{title}</h1>
          <p className="measure mt-5 text-base leading-7 text-muted md:text-lg">{lede}</p>
        </div>
        {children}
      </div>
    </header>
  );
}

export function Shell({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto max-w-[1440px] px-4 py-10 sm:px-6 md:py-14 lg:px-8", className)}>{children}</div>;
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="panel px-6 py-14 text-center">
      <svg viewBox="0 0 160 72" className="mx-auto h-16 w-40" aria-hidden>
        <path d="M8 48c18-16 34-16 52 0s34 16 52 0 34-16 40 0" fill="none" stroke="var(--aurora)" strokeWidth="1.4" />
        <circle cx="118" cy="22" r="8" fill="none" stroke="var(--glow)" />
        <path d="M112 22h12M118 16v12" stroke="var(--glow)" strokeWidth="1.2" />
        <path d="M28 40l8 8 8-14" fill="none" stroke="var(--ink)" strokeWidth="1.2" />
      </svg>
      <p className="eyebrow mt-4">Empty ice</p>
      <h2 className="mt-3 font-display text-3xl tracking-[-0.03em]">{title}</h2>
      <p className="measure mx-auto mt-3 text-sm leading-6 text-muted">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorNote({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-ink" role="alert">
      <p>{message}</p>
      {onRetry ? (
        <button type="button" className="btn btn-ghost mt-3" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  );
}

export function Gate({ title, body }: { title: string; body: string }) {
  return (
    <div className="panel mb-6 px-5 py-4 text-sm leading-6">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-muted">{body}</p>
    </div>
  );
}

export function Sparkline({ values }: { values: number[] }) {
  if (!values.length) return null;
  const max = Math.max(...values.map((value) => Math.abs(value)), 0.01);
  return (
    <svg viewBox={`0 0 ${values.length} 28`} className="h-10 w-full" role="img" aria-label="Semantic fingerprint of this passage">
      {values.map((value, index) => {
        const height = Math.max(1.2, (Math.abs(value) / max) * 22);
        return <rect key={index} x={index + 0.15} y={14 - height / 2} width={0.7} height={height} rx={0.2} fill={value >= 0 ? "var(--aurora)" : "var(--warm)"} />;
      })}
    </svg>
  );
}
