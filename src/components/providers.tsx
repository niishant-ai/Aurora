"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Cursor, ScrollProgress } from "@/components/chrome";
import { useUi } from "@/store/ui-store";

function ThemeController() {
  const theme = useUi((state) => state.theme);
  const setHydrated = useUi((state) => state.setHydrated);

  useEffect(() => {
    const apply = () => {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const dark = theme === "dark" || (theme === "system" && systemDark);
      document.documentElement.dataset.theme = dark ? "dark" : "light";
    };
    apply();
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", apply);
    const fallback = window.setTimeout(() => setHydrated(true), 350);
    return () => {
      media.removeEventListener("change", apply);
      window.clearTimeout(fallback);
    };
  }, [setHydrated, theme]);

  return null;
}

function SmoothScroll() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    let destroy = () => {};
    let cancelled = false;
    (async () => {
      const [{ default: Lenis }, gsapModule, scrollModule] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      const gsap = gsapModule.default;
      gsap.registerPlugin(scrollModule.ScrollTrigger);
      const lenis = new Lenis({
        lerp: 0.085,
        anchors: true,
        prevent: (node) => Boolean(node.closest("[data-lenis-prevent]")),
      });
      lenis.on("scroll", scrollModule.ScrollTrigger.update);
      const ticker = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
      destroy = () => {
        gsap.ticker.remove(ticker);
        lenis.destroy();
      };
    })();
    return () => {
      cancelled = true;
      destroy();
    };
  }, []);
  return null;
}

function Toasts() {
  const toasts = useUi((state) => state.toasts);
  const dismiss = useUi((state) => state.dismissToast);
  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((toast) => window.setTimeout(() => dismiss(toast.id), 4200));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [dismiss, toasts]);
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[70] flex w-[min(100%-2rem,22rem)] flex-col gap-2" aria-live="polite">
      {toasts.map((toast) => (
        <button key={toast.id} type="button" className="toast-card pointer-events-auto px-4 py-3 text-left text-sm" onClick={() => dismiss(toast.id)}>
          {toast.message}
        </button>
      ))}
    </div>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 5000, refetchOnWindowFocus: false } } }));
  return (
    <QueryClientProvider client={client}>
      <ThemeController />
      <SmoothScroll />
      <ScrollProgress />
      <Cursor />
      {children}
      <Toasts />
    </QueryClientProvider>
  );
}
