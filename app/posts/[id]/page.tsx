import { Points } from "@/components/hacker-news/points";
import { getItem } from "@/lib/api";
import { formatDistance } from "date-fns";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Post({ params }: { params: { id: string } }) {
  const item = await getItem(params.id);

  const url = item.url ? new URL(item.url) : null;
  const time = formatDistance(new Date(item.time * 1000), new Date(), {
    addSuffix: true,
  });

  return (
    <main className="container max-w-5xl my-4">
      <div className="flex space-x-4">
        <Points id={item.id} />
        <div className="flex flex-col">
          <h2 className="text-lg font-bold">
            {item.title}{" "}
            {url && (
              <span className="font-normal text-muted-foreground text-sm">
                ({url.hostname})
              </span>
            )}
          </h2>
          <p className="text-muted-foreground text-sm">
            by <span>{item.by}</span> - <span>{time}</span>
          </p>
        </div>
      </div>
      <ErrorBoundary fallback={<p>Something went wrong</p>}>
        <Suspense fallback={<p>Loading...</p>}>
          <p className="mt-4">Comments ({item.descendants})</p>
          <ol>
            {item.kids?.map((id) => (
              <Comment key={id} id={id} />
            ))}
          </ol>
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

async function Comment({ id }: { id: number }) {
  const comment = await getItem(id);

  return (
    <div className="border-l-2 border-gray-200 pl-4 mt-4 space-y-4">
      <p className="text-gray-500">{comment.by}</p>
      <p>{comment.text}</p>
      {comment.kids?.map((id) => (
        <Comment key={id} id={id} />
      ))}
    </div>
  );
}
