"use client";

import { useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";

type Step = { n: string; title: string; body: string; href: string };

export function PipelineRail({ steps }: { steps: Step[] }) {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    if (!desktop.matches) return;
    let kill = () => {};
    let cancelled = false;
    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled || !section.current || !track.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const tween = gsap.to(track.current, {
        x: () => Math.min(0, section.current!.clientWidth - track.current!.scrollWidth - 8),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top 112px",
          end: () => `+=${Math.max(track.current!.scrollWidth - section.current!.clientWidth, 240)}`,
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      kill = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    })();
    return () => {
      cancelled = true;
      kill();
    };
  }, [reduce, steps.length]);

  return (
    <div ref={section} className="relative mt-8">
      <div ref={track} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 lg:w-max lg:overflow-visible lg:pb-8" data-lenis-prevent>
        {steps.map((step) => (
          <Link key={step.n} href={step.href} className="panel w-[78vw] shrink-0 snap-start p-6 sm:w-[42vw] lg:w-[22rem]">
            <p className="font-display text-4xl text-aurora">{step.n}</p>
            <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em]">{step.title}</h3>
            <p className="mt-2 text-sm leading-7 text-muted">{step.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
