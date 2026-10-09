import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CountUp, ScrollCue, SplitLine, Tilt } from "@/components/chrome";
import { PipelineRail } from "@/components/pipeline-rail";
import { MediaImage } from "@/components/media-image";
import { PolarMap } from "@/components/polar-map";
import { Reveal } from "@/components/reveal";
import { getHome } from "@/lib/data";
import { HERO_IMAGE } from "@/lib/seed-data";
import { provenanceLabel, typeLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STEPS = [
  { n: "01", title: "Ingest", body: "Drop a report, still, clip, or table. The desk reads the filename before anyone retypes it.", href: "/ingest" },
  { n: "02", title: "Catalogue", body: "Every record sits on an expedition, a year, and a map of the stations India actually keeps.", href: "/archive" },
  { n: "03", title: "Search", body: "Keyword snippets and a semantic rank over passage embeddings. Hybrid is the default.", href: "/search" },
  { n: "04", title: "Generate", body: "Website copy and social posts are rewritten only from the sentences you select.", href: "/generate" },
  { n: "05", title: "Review", body: "Draft, review, approve, publish. The admin is the only role that can let a line leave the building.", href: "/review" },
  { n: "06", title: "Schedule", body: "Drag a checked item onto the month. The calendar writes back to the same row.", href: "/schedule" },
];

export default async function HomePage() {
  const data = await getHome();
  const featured = data.expeditions.slice(0, 3);

  return (
    <main>
      <section className="relative min-h-[100svh] overflow-hidden text-white">
        <MediaImage src={HERO_IMAGE} alt="" className="hero-photo absolute inset-0 h-full w-full" />
        <div className="aurora-mesh pointer-events-none absolute inset-0 opacity-80 mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,16,0.18),rgba(5,8,16,0.28)_42%,rgba(5,8,16,0.82))]" />
        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-end px-4 pb-20 pt-32 sm:px-6 lg:px-8">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-teal-100">SIH26063 · Ministry of Earth Sciences</p>
          <h1 className="mt-5 max-w-5xl font-display text-[clamp(3.1rem,9vw,7.4rem)] leading-[0.92] tracking-[-0.045em]">
            <SplitLine text="The ice remembers." />
            <SplitLine text="We make it readable." className="block italic text-teal-100" delay={180} />
          </h1>
          <p className="measure mt-6 text-base leading-7 text-white/80 md:text-lg">
            India’s polar record — Bharati, Maitri, Himadri, the Southern Ocean — catalogued so a public sentence can still find the passage it came from.
          </p>
          <form action="/search" className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="hero-search">Search the archive</label>
            <input id="hero-search" name="q" placeholder="Try black carbon, IndARC, neutron monitor" className="h-12 flex-1 rounded-full border border-white/25 bg-white/10 px-5 text-white placeholder:text-white/65 backdrop-blur" />
            <input type="hidden" name="mode" value="hybrid" />
            <button className="btn bg-white text-[#0A0E1A]" type="submit">Search the archive</button>
            <Link href="/dashboard" className="btn border border-white/30 bg-white/5 text-white">Open the desk</Link>
          </form>
          <dl className="mt-12 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
            {[
              [data.counts.expeditions, "Expeditions"],
              [data.counts.reports, "Field reports"],
              [data.counts.images, "Stills"],
              [data.counts.datasets, "Datasets"],
            ].map(([value, label]) => (
              <div key={String(label)} className="border-t border-white/25 pt-3">
                <dt className="text-[0.68rem] uppercase tracking-[0.16em] text-white/70">{label}</dt>
                <dd className="mt-1 font-display text-[clamp(2rem,4vw,3.2rem)] leading-none tracking-[-0.04em]">
                  <CountUp value={Number(value)} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <ScrollCue />
      </section>

      <section className="section-space mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Stations and cruises</p>
              <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.05] tracking-[-0.03em]">Where the record was made</h2>
            </div>
            <Link href="/archive?view=map" className="link-draw text-sm font-semibold text-aurora">Open the map</Link>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {featured.map((item) => (
              <Tilt key={item.id}>
                <Link href={`/expeditions/${item.id}`} className="panel group block p-7">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-aurora">{item.region} · {item.year}</p>
                  <h3 className="mt-4 font-display text-4xl leading-none tracking-[-0.03em]">{item.station}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted">{item.summary}</p>
                  <p className="mt-6 text-sm font-semibold">{item.code} <ArrowUpRight className="inline size-4 transition group-hover:translate-x-0.5" /></p>
                </Link>
              </Tilt>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="border-y border-line bg-panel/40">
        <div className="section-space mx-auto grid max-w-[1440px] gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <Reveal>
            <p className="eyebrow">Citation lock</p>
            <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.05] tracking-[-0.03em]">A sentence may leave only with its source.</h2>
            <p className="measure mt-5 text-base leading-7 text-muted">
              The generator does not call an outside model. It rewrites selected sentences, keeps every numeral, and refuses a line that cannot point at a verbatim span.
            </p>
          </Reveal>
          <Reveal>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="panel p-6">
                <p className="badge">Source passage</p>
                <p className="mt-5 text-sm leading-7">Black carbon mass concentration peaked at <mark className="rounded bg-warm/15 px-1">78 ng m-3</mark> on 14 January during a northerly wind shift.</p>
                <p className="mt-5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted">Bharati aerosol log · p. 5</p>
              </article>
              <article className="panel p-6">
                <p className="badge badge-warm">Public line</p>
                <p className="mt-5 text-sm leading-7">Soot in the air peaked at 78 ng m-3 on 14 January during a northerly wind shift. <a className="citation-mark" href="/documents/rpt-bharati-aod#p-rpt-bharati-aod-p2"><sup>[1]</sup></a></p>
                <p className="mt-5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted">Lock check · numerals unchanged</p>
              </article>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-space mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="eyebrow">Pipeline</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.05] tracking-[-0.03em]">Six desks, one row in the database</h2>
          <PipelineRail steps={STEPS} />
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] tracking-[-0.03em]">Latest in the catalogue</h2>
          <Link href="/archive" className="link-draw text-sm font-semibold text-aurora">All records</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.latest.map((asset) => (
            <Link key={asset.id} href={`/documents/${asset.id}`} className="panel overflow-hidden">
              <MediaImage src={asset.thumbnailUrl} alt="" className="h-52 w-full" />
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  <span className="badge badge-accent">{typeLabel(asset.type)}</span>
                  <span className="badge">{provenanceLabel(asset.provenance)}</span>
                </div>
                <h3 className="mt-4 font-display text-[1.7rem] leading-tight tracking-[-0.03em]">{asset.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted">{asset.abstract}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-space mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="eyebrow">Field geography</p>
          <h2 className="mt-3 mb-8 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.05] tracking-[-0.03em]">A desk map, not a tile service</h2>
          <PolarMap expeditions={data.expeditions} />
        </Reveal>
      </section>
    </main>
  );
}
