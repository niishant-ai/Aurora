import Link from "next/link";
import { PageIntro, Shell } from "@/components/ui";
import { listStories } from "@/lib/data";
import { audienceLabel, formatWhen } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Stories" };

export default async function StoriesPage() {
  const stories = await listStories();
  return (
    <main>
      <PageIntro kicker="Published" title="Lines that were allowed to leave the desk." lede="Each story is a citation-locked draft an admin published. The numbers still point at a passage." />
      <Shell>
        <div className="grid gap-4 md:grid-cols-2">
          {stories.map((story) => (
            <Link key={story.id} href={`/stories/${story.id}`} className="panel p-6">
              <p className="text-xs uppercase tracking-[0.14em] text-aurora">{story.channel} · {audienceLabel(story.audience)}</p>
              <h2 className="mt-3 font-display text-3xl leading-tight">{story.title}</h2>
              <p className="mt-3 line-clamp-4 text-sm leading-6 text-muted">{story.body}</p>
              <p className="mt-4 text-xs text-muted">{story.authorName} · {formatWhen(story.updatedAt)}</p>
            </Link>
          ))}
          {!stories.length ? <p className="text-sm text-muted">No published stories yet. An admin can release one from the review queue.</p> : null}
        </div>
      </Shell>
    </main>
  );
}
