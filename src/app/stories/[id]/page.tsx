import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CitedBody } from "@/components/cited-body";
import { getDraft } from "@/lib/data";
import { audienceLabel, formatWhen } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const story = await getDraft(id);
  return { title: story?.title ?? "Story" };
}

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const story = await getDraft(id);
  if (!story || story.status !== "published") notFound();
  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:px-8 lg:grid-cols-[1fr_280px]">
      <article>
        <p className="eyebrow">{story.channel} · {audienceLabel(story.audience)}</p>
        <h1 className="mt-3 font-display text-[clamp(2.6rem,6vw,5rem)] leading-[0.95] tracking-[-0.04em]">{story.title}</h1>
        <p className="mt-4 text-sm text-muted">{story.authorName} · {formatWhen(story.updatedAt)} · IST</p>
        <CitedBody body={story.body} citations={story.citations} className="story-body mt-8" />
        {story.glossary.length ? (
          <section className="mt-10 border-t border-line pt-6">
            <h2 className="font-display text-3xl">Terms, not findings</h2>
            <ul className="mt-4 space-y-2 text-sm leading-6">
              {story.glossary.map((entry) => <li key={entry.term}><strong>{entry.term}.</strong> {entry.definition}</li>)}
            </ul>
          </section>
        ) : null}
      </article>
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="panel p-4">
          <p className="eyebrow">Sources</p>
          <ol className="mt-3 space-y-3 text-sm">
            {story.citations.map((citation) => (
              <li key={citation.n}>
                <Link className="font-semibold text-aurora" href={`/documents/${citation.assetId}#p-${citation.passageId}`}>[{citation.n}] {citation.heading}</Link>
                <p className="mt-1 text-muted">{citation.excerpt}</p>
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </main>
  );
}
