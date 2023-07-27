import { Points } from "@/components/hacker-news/points";
import { Search } from "@/components/hacker-news/search";
import { getItem, search } from "@/lib/api";
import { formatDistance } from "date-fns";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { z } from "zod";

const searchParamsSchema = z.object({
  query: z.string().optional(),
});

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { query } = searchParamsSchema.parse(searchParams);

  const posts = await search({
    query: query,
    tags: ["story"],
  });

  return (
    <main className="container max-w-5xl my-2 space-y-2">
      <Search query={query ?? ""} />
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <ol className="space-y-2">
            {posts.hits.map((hit) => (
              <Item key={hit.objectID} id={hit.objectID} />
            ))}
          </ol>
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

async function Item({ id }: { id: string }) {
  const item = await getItem(id);

  const url = item.url ? new URL(item.url) : null;
  const time = formatDistance(new Date(item.time * 1000), new Date(), {
    addSuffix: true,
  });

  return (
    <Link
      className="flex border rounded-lg p-4 space-x-4 hover:bg-accent"
      href={`/posts/${id}`}
    >
      <Points id={item.id} />
      <div>
        <h2 className="font-bold">
          {item.title}{" "}
          {url && (
            <span className="font-normal text-muted-foreground text-sm">
              ({url.hostname})
            </span>
          )}
        </h2>
        <p className="text-muted-foreground text-sm">
          by <span>{item.by}</span> - <span>{item.descendants}</span> comments -{" "}
          <span>{time}</span>
        </p>
      </div>
    </Link>
  );
}
