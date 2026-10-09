"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ExpeditionDTO } from "@/lib/types";

function project(lat: number, lng: number, hemisphere: "N" | "S") {
  const radius = hemisphere === "S" ? ((lat + 90) / 45) * 108 : ((90 - lat) / 32) * 108;
  const theta = ((lng - (hemisphere === "S" ? 90 : 0)) * Math.PI) / 180;
  const origin = hemisphere === "S" ? 150 : 470;
  return { x: origin + radius * Math.cos(theta), y: 150 + radius * Math.sin(theta) };
}

export function PolarMap({ expeditions }: { expeditions: ExpeditionDTO[] }) {
  const router = useRouter();
  const [active, setActive] = useState<string | null>(null);
  const southern = expeditions.filter((item) => item.lat < -45);
  const northern = expeditions.filter((item) => item.lat > 60);
  const plotted = [
    ...southern.map((item, index) => ({ ...item, ...offset(project(item.lat, item.lng, "S"), index) })),
    ...northern.map((item, index) => ({ ...item, ...offset(project(item.lat, item.lng, "N"), index) })),
  ];
  const current = plotted.find((item) => item.id === active) ?? plotted[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
      <div className="panel overflow-hidden p-4">
        <svg viewBox="0 0 620 300" className="h-auto w-full" aria-hidden="true">
          <circle cx="150" cy="150" r="112" fill="color-mix(in srgb, var(--aurora) 8%, transparent)" stroke="var(--line)" />
          <circle cx="470" cy="150" r="112" fill="color-mix(in srgb, var(--aurora) 8%, transparent)" stroke="var(--line)" />
          <circle cx="150" cy="150" r="70" fill="none" stroke="var(--line)" strokeDasharray="3 4" />
          <circle cx="470" cy="150" r="70" fill="none" stroke="var(--line)" strokeDasharray="3 4" />
          <text x="150" y="28" textAnchor="middle" fill="var(--muted)" fontSize="11">ANTARCTICA</text>
          <text x="470" y="28" textAnchor="middle" fill="var(--muted)" fontSize="11">ARCTIC</text>
          {plotted.map((item) => (
            <circle
              key={item.id}
              cx={item.x}
              cy={item.y}
              r={active === item.id ? 7 : 5}
              fill={active === item.id ? "var(--warm)" : "var(--accent)"}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setActive(item.id)}
              onClick={() => router.push(`/expeditions/${item.id}`)}
            />
          ))}
        </svg>
        {current ? (
          <div className="border-t border-line px-2 pt-3 text-sm">
            <p className="font-semibold">{current.code} · {current.station}</p>
            <p className="text-muted">{current.focus}</p>
          </div>
        ) : null}
      </div>
      <ul className="space-y-2">
        {expeditions.map((item) => (
          <li key={item.id}>
            <Link href={`/expeditions/${item.id}`} className="panel block px-4 py-3 hover:-translate-y-0.5 motion-safe:transition" onMouseEnter={() => setActive(item.id)}>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-aurora">{item.region} · {item.year}</span>
              <span className="mt-1 block font-medium">{item.station}</span>
              <span className="text-sm text-muted">{item.code}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function offset(point: { x: number; y: number }, index: number) {
  return { x: point.x + (index % 3) * 7 - 7, y: point.y + (index % 2) * 8 };
}
