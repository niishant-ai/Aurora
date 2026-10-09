"use client";

import Link from "next/link";
import { PageIntro, Shell } from "@/components/ui";
import type { getDashboard } from "@/lib/data";
import { ROLE_NOTE } from "@/lib/roles";
import { formatWhen, statusLabel, typeLabel } from "@/lib/utils";
import { useUi } from "@/store/ui-store";

type DashboardData = Awaited<ReturnType<typeof getDashboard>>;

export function DashboardView({ data }: { data: DashboardData }) {
  const role = useUi((state) => state.role);
  const maxType = Math.max(...data.byType.map((item) => item.count), 1);
  const maxRegion = Math.max(...data.byRegion.map((item) => item.count), 1);

  return (
    <main>
      <PageIntro kicker={ROLE_NOTE[role].split(".")[0]} title="The desk, this morning." lede={ROLE_NOTE[role]} />
      <Shell>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            [data.counts.assets, "Records"],
            [data.counts.expeditions, "Expeditions"],
            [data.counts.passages, "Passages"],
            [data.counts.pending, "Waiting"],
            [data.counts.published, "Published"],
          ].map(([value, label]) => (
            <div key={String(label)} className="panel p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">{label}</p>
              <p className="mt-2 font-display text-4xl">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <section className="panel p-5">
            <h2 className="font-display text-3xl">Dissemination funnel</h2>
            <div className="mt-4 space-y-3">
              {data.funnel.map((item) => (
                <div key={item.status}>
                  <div className="mb-1 flex justify-between text-sm"><span>{statusLabel(item.status)}</span><span>{item.count}</span></div>
                  <div className="h-2 rounded-full bg-line"><div className="h-2 rounded-full bg-accent" style={{ width: `${Math.max(8, item.count * 18)}%` }} /></div>
                </div>
              ))}
            </div>
            <Link href="/review" className="mt-4 inline-block text-sm font-semibold text-aurora">Open the queue</Link>
          </section>
          <section className="panel p-5">
            <h2 className="font-display text-3xl">Archive shape</h2>
            <div className="mt-4 space-y-3">
              {data.byType.map((item) => (
                <div key={item.type} className="grid grid-cols-[6rem_1fr_2rem] items-center gap-2 text-sm">
                  <span>{typeLabel(item.type)}</span>
                  <div className="h-2 rounded-full bg-line"><div className="h-2 rounded-full bg-aurora" style={{ width: `${(item.count / maxType) * 100}%` }} /></div>
                  <span>{item.count}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-2">
              {data.byRegion.map((item) => (
                <p key={item.region} className="flex justify-between text-sm"><span>{item.region}</span><span>{item.count} records · bar {Math.round((item.count / maxRegion) * 100)}%</span></p>
              ))}
            </div>
          </section>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <section>
            <h2 className="mb-3 font-display text-3xl">Waiting on a person</h2>
            <div className="space-y-3">
              {data.pending.map((draft) => (
                <Link key={draft.id} href="/review" className="panel block p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-aurora">{statusLabel(draft.status)}</p>
                  <p className="mt-1 font-semibold">{draft.title}</p>
                </Link>
              ))}
              {!data.pending.length ? <p className="text-sm text-muted">The queue is clear.</p> : null}
            </div>
          </section>
          <section>
            <h2 className="mb-3 font-display text-3xl">On the calendar</h2>
            <div className="space-y-3">
              {data.upcoming.map((draft) => (
                <Link key={draft.id} href="/schedule" className="panel block p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-aurora">{draft.scheduledAt ? formatWhen(draft.scheduledAt, true) : "Unscheduled"} · {draft.channel}</p>
                  <p className="mt-1 font-semibold">{draft.title}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
        <section className="mt-8">
          <h2 className="mb-3 font-display text-3xl">Recent activity</h2>
          <ol className="space-y-2">
            {data.activities.map((item) => (
              <li key={item.id} className="panel flex flex-wrap items-baseline justify-between gap-2 px-4 py-3 text-sm">
                <span><strong>{item.actor}</strong> {item.action}</span>
                <time className="text-muted" dateTime={item.createdAt}>{formatWhen(item.createdAt, true)}</time>
              </li>
            ))}
          </ol>
        </section>
      </Shell>
    </main>
  );
}
