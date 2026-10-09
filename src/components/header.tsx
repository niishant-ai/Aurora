"use client";

import { motion } from "framer-motion";
import { Menu, Monitor, Moon, Search, Sun, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CommandPalette } from "@/components/command-palette";
import { ROLE_LABEL } from "@/lib/roles";
import type { Role, ThemeMode } from "@/lib/types";
import { cn, formatIstClock } from "@/lib/utils";
import { useUi } from "@/store/ui-store";

const NAV = [
  { href: "/archive", label: "Archive" },
  { href: "/search", label: "Search" },
  { href: "/ingest", label: "Ingest" },
  { href: "/generate", label: "Generate" },
  { href: "/review", label: "Review" },
  { href: "/schedule", label: "Schedule" },
  { href: "/stories", label: "Stories" },
  { href: "/dashboard", label: "Dashboard" },
];

const THEMES: { id: ThemeMode; label: string; icon: typeof Sun }[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const role = useUi((state) => state.role);
  const theme = useUi((state) => state.theme);
  const hydrated = useUi((state) => state.hydrated);
  const setRole = useUi((state) => state.setRole);
  const setTheme = useUi((state) => state.setTheme);
  const [open, setOpen] = useState(false);
  const [palette, setPalette] = useState(false);
  const [query, setQuery] = useState("");
  const [clock, setClock] = useState("--:--");

  useEffect(() => {
    const tick = () => setClock(formatIstClock());
    tick();
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPalette(true);
      }
      if (event.key === "/" && !typing) {
        event.preventDefault();
        document.getElementById("header-search")?.focus();
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-40">
        <div className="absolute inset-0 border-b border-line bg-canvas/75 backdrop-blur-xl" aria-hidden />
        <div className="aurora-bar relative" />
        <div className="relative mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="group flex min-h-11 items-center gap-3" aria-label="AURORA home">
            <span className="grid size-10 place-items-center rounded-full border border-line bg-panel text-aurora" aria-hidden>
              <svg viewBox="0 0 24 24" className="size-5">
                <path d="M12 2.5 13.6 9.2 20.5 12 13.6 14.8 12 21.5 10.4 14.8 3.5 12 10.4 9.2Z" fill="currentColor" />
              </svg>
            </span>
            <span>
              <span className="block font-display text-xl leading-none tracking-[-0.03em]">AURORA</span>
              <span className="mt-1 hidden font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted sm:block">MoES · NCPOR</span>
            </span>
          </Link>

          <form
            className="ml-auto hidden min-w-0 flex-1 items-center md:flex md:max-w-sm lg:max-w-md"
            action="/search"
            onSubmit={(event) => {
              event.preventDefault();
              router.push(`/search?q=${encodeURIComponent(query)}&mode=hybrid`);
            }}
          >
            <label className="sr-only" htmlFor="header-search">Search the archive</label>
            <div className="flex w-full items-center gap-2 rounded-full border border-line bg-panel/80 px-3 shadow-[0_1px_2px_rgba(10,14,26,0.04)]">
              <Search className="size-4 text-muted" aria-hidden />
              <input
                id="header-search"
                name="q"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search the ice record"
                className="h-11 w-full bg-transparent text-sm outline-none"
              />
              <button type="button" className="hidden rounded-full border border-line px-2 py-1 font-mono text-[0.65rem] text-muted lg:inline" onClick={() => setPalette(true)}>
                ⌘K
              </button>
            </div>
          </form>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <p className="hidden font-mono text-[0.7rem] text-muted xl:block" suppressHydrationWarning>
              <span className="font-semibold text-ink">{clock}</span> IST
            </p>
            <label className="sr-only" htmlFor="role-switch">Prototype role</label>
            <select
              id="role-switch"
              className="field hidden h-11 w-40 py-0 text-sm md:block"
              value={hydrated ? role : "editor"}
              aria-label="Prototype role"
              onChange={(event) => setRole(event.target.value as Role)}
            >
              {(Object.keys(ROLE_LABEL) as Role[]).map((item) => (
                <option key={item} value={item}>{ROLE_LABEL[item]}</option>
              ))}
            </select>
            <div className="relative hidden items-center rounded-full border border-line bg-panel/70 p-1 lg:flex" role="group" aria-label="Theme">
              {THEMES.map((item) => {
                const Icon = item.icon;
                const active = theme === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={active}
                    aria-label={`${item.label} theme`}
                    className="relative grid size-9 place-items-center rounded-full"
                    onClick={() => setTheme(item.id)}
                  >
                    {active ? <motion.span layoutId="theme-pill" className="absolute inset-0 rounded-full bg-accent" transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} /> : null}
                    <Icon className={cn("relative size-3.5", active ? "text-accent-ink" : "text-muted")} />
                  </button>
                );
              })}
            </div>
            <button type="button" className="btn btn-ghost size-11 px-0 md:hidden" aria-label="Open search" onClick={() => setPalette(true)}>
              <Search className="size-4" />
            </button>
            <button type="button" className="btn btn-ghost size-11 px-0 lg:hidden" aria-expanded={open} aria-label="Open menu" onClick={() => setOpen((value) => !value)}>
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
        <nav className="relative mx-auto hidden max-w-[1440px] gap-1 px-8 pb-3 lg:flex" aria-label="Primary">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className="nav-link">
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      {open ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-canvas/95 px-5 pb-10 pt-6 backdrop-blur-xl lg:hidden" data-lenis-prevent>
          <div className="mb-6 flex items-center justify-between">
            <p className="font-display text-2xl">AURORA</p>
            <button type="button" className="btn btn-ghost size-11 px-0" aria-label="Close menu" onClick={() => setOpen(false)}>
              <X className="size-4" />
            </button>
          </div>
          <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted" htmlFor="role-mobile">Role</label>
          <select id="role-mobile" className="field mt-2" value={hydrated ? role : "editor"} onChange={(event) => setRole(event.target.value as Role)}>
            {(Object.keys(ROLE_LABEL) as Role[]).map((item) => (
              <option key={item} value={item}>{ROLE_LABEL[item]}</option>
            ))}
          </select>
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Theme">
            {THEMES.map((item) => (
              <button key={item.id} type="button" className={cn("btn btn-ghost", theme === item.id && "bg-accent text-accent-ink")} aria-pressed={theme === item.id} onClick={() => setTheme(item.id)}>
                {item.label}
              </button>
            ))}
          </div>
          <nav className="mt-6 grid gap-1" aria-label="Mobile">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-2xl px-3 py-4 text-2xl font-display tracking-[-0.03em] hover:bg-panel">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
      <CommandPalette open={palette} onClose={() => setPalette(false)} />
    </>
  );
}
