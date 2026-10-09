"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ErrorNote, Gate, PageIntro, Shell } from "@/components/ui";
import { api } from "@/lib/api-client";
import { canSchedule } from "@/lib/roles";
import type { DraftDTO } from "@/lib/types";
import { cn, istParts, monthLabel, sameIstDay } from "@/lib/utils";
import { useUi } from "@/store/ui-store";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function ScheduleDesk() {
  const role = useUi((state) => state.role);
  const pushToast = useUi((state) => state.pushToast);
  const client = useQueryClient();
  const now = istParts();
  const [cursor, setCursor] = useState({ year: now.year, monthIndex: now.month - 1 });
  const query = useQuery({
    queryKey: ["drafts"],
    queryFn: () => api<{ drafts: DraftDTO[] }>("/api/drafts", role),
  });
  const mutation = useMutation({
    mutationFn: (input: { id: string; scheduledAt: string | null }) =>
      api<DraftDTO>(`/api/drafts/${input.id}`, role, {
        method: "PATCH",
        body: JSON.stringify({ action: "schedule", scheduledAt: input.scheduledAt }),
      }),
    onSuccess: () => {
      pushToast("Calendar updated.");
      void client.invalidateQueries({ queryKey: ["drafts"] });
    },
  });

  const cells = useMemo(() => monthCells(cursor.year, cursor.monthIndex), [cursor]);
  const drafts = query.data?.drafts ?? [];
  const unscheduled = drafts.filter((draft) => !draft.scheduledAt);

  function place(id: string, day: number) {
    const scheduledAt = new Date(Date.UTC(cursor.year, cursor.monthIndex, day, 4, 30)).toISOString();
    mutation.mutate({ id, scheduledAt });
  }

  return (
    <main>
      <PageIntro kicker="Calendar" title="Put the checked line on a day." lede="Drag a card onto a date, or use the date field if you are on a keyboard. Editors and admins can move items. Everyone else can read the plan." />
      <Shell>
        {!canSchedule(role) ? <Gate title="This month is read-only for your role." body="Switch to editor or admin to reschedule. The dates already filed stay visible." /> : null}
        {query.isError ? <ErrorNote message="The calendar could not load." onRetry={() => query.refetch()} /> : null}
        {mutation.isError ? <ErrorNote message={mutation.error instanceof Error ? mutation.error.message : "Could not reschedule."} /> : null}
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-3xl">{monthLabel(cursor.year, cursor.monthIndex)}</h2>
          <div className="flex gap-2">
            <button type="button" className="btn btn-ghost" onClick={() => setCursor((value) => shiftMonth(value, -1))}>Previous</button>
            <button type="button" className="btn btn-ghost" onClick={() => setCursor((value) => shiftMonth(value, 1))}>Next</button>
          </div>
        </div>
        <div className="overflow-x-auto" data-lenis-prevent>
          <div className="min-w-[760px]">
            <div className="grid grid-cols-7 gap-2 text-xs uppercase tracking-[0.14em] text-muted">
              {WEEKDAYS.map((day) => <div key={day} className="px-2">{day}</div>)}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-2">
              {cells.map((day, index) => (
                <div
                  key={index}
                  className={cn("min-h-32 rounded-2xl border border-line bg-panel/70 p-2", day && "hover:border-accent")}
                  onDragOver={(event) => {
                    if (day && canSchedule(role)) event.preventDefault();
                  }}
                  onDrop={(event) => {
                    if (!day || !canSchedule(role)) return;
                    event.preventDefault();
                    const id = event.dataTransfer.getData("text/plain");
                    if (id) place(id, day);
                  }}
                >
                  {day ? <p className="text-sm font-semibold">{day}</p> : null}
                  <div className="mt-2 space-y-2">
                    {day ? drafts.filter((draft) => draft.scheduledAt && sameIstDay(draft.scheduledAt, cursor.year, cursor.monthIndex, day)).map((draft) => (
                      <article key={draft.id} draggable={canSchedule(role)} onDragStart={(event) => event.dataTransfer.setData("text/plain", draft.id)} className="rounded-xl bg-soft px-2 py-2 text-xs">
                        <p className="font-semibold">{draft.channel}</p>
                        <p className="line-clamp-3">{draft.title}</p>
                      </article>
                    )) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <section className="mt-8">
          <h2 className="font-display text-3xl">Not yet on a day</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {unscheduled.map((draft) => (
              <article key={draft.id} className="panel p-4" draggable={canSchedule(role)} onDragStart={(event) => event.dataTransfer.setData("text/plain", draft.id)}>
                <p className="text-xs uppercase tracking-[0.14em] text-aurora">{draft.status} · {draft.channel}</p>
                <h3 className="mt-2 font-semibold">{draft.title}</h3>
                <label className="mt-3 block text-xs text-muted" htmlFor={`date-${draft.id}`}>Reschedule without dragging</label>
                <input
                  id={`date-${draft.id}`}
                  type="date"
                  className="field mt-1"
                  disabled={!canSchedule(role)}
                  onChange={(event) => {
                    if (!event.target.value) {
                      mutation.mutate({ id: draft.id, scheduledAt: null });
                      return;
                    }
                    const [year, month, day] = event.target.value.split("-").map(Number);
                    mutation.mutate({ id: draft.id, scheduledAt: new Date(Date.UTC(year, month - 1, day, 4, 30)).toISOString() });
                  }}
                />
              </article>
            ))}
            {!unscheduled.length ? <p className="text-sm text-muted">Every item currently has a date.</p> : null}
          </div>
        </section>
      </Shell>
    </main>
  );
}

function monthCells(year: number, monthIndex: number) {
  const first = new Date(Date.UTC(year, monthIndex, 1, 6, 30));
  const weekday = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", weekday: "short" }).format(first);
  const map: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
  const offset = map[weekday] ?? 0;
  const days = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const cells: Array<number | null> = Array.from({ length: offset }, () => null);
  for (let day = 1; day <= days; day += 1) cells.push(day);
  while (cells.length % 7) cells.push(null);
  return cells;
}

function shiftMonth(value: { year: number; monthIndex: number }, delta: number) {
  const date = new Date(Date.UTC(value.year, value.monthIndex + delta, 1));
  return { year: date.getUTCFullYear(), monthIndex: date.getUTCMonth() };
}
