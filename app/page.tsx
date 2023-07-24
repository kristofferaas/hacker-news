import { getItem, getTopStories } from "@/lib/api";
import Link from "next/link";

export default async function Home() {
  const posts = await getTopStories();

  return (
    <main className="container max-w-5xl my-2">
      <ol className="space-y-2">
        {posts.map((id) => (
          <Item key={id} id={id} />
        ))}
      </ol>
    </main>
  );
}

async function Item({ id }: { id: number }) {
  const item = await getItem(id);

  const url = item.url ? new URL(item.url) : null;

  return (
    <Link
      className="flex space-y-2 border rounded-lg p-4 flex-col hover:bg-accent"
      href={`/posts/${id}`}
    >
      <h2 className="font-bold">
        {item.title}{" "}
        {url && (
          <span className="font-normal text-muted-foreground text-sm">
            ({url.hostname})
          </span>
        )}
      </h2>
      <p className="text-muted-foreground text-sm">
        by <span>{item.by}</span> - <span>{item.score}</span> points -{" "}
        <span>{item.descendants}</span> comments
      </p>
    </Link>
  );
}
