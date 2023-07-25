import { Points } from "@/components/hacker-news/points";
import { getItem, getTopStories, search } from "@/lib/api";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistance } from "date-fns";

export default async function Home() {
  const posts = await search({
    tags: ["story"],
  });

  return (
    <main className="container max-w-5xl my-2 space-y-2">
      <Filter />
      <ol className="space-y-2">
        {posts.hits.map((hit) => (
          <Item key={hit.objectID} id={hit.objectID} />
        ))}
      </ol>
    </main>
  );
}

const Filter = () => {
  return (
    <div className="flex space-x-2">
      <Select value="story">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Stories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="story">Stories</SelectItem>
          <SelectItem value="comment">Comments</SelectItem>
          <SelectItem value="poll">Polls</SelectItem>
        </SelectContent>
      </Select>
      <Select value="top">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Posts" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="top">Top</SelectItem>
          <SelectItem value="hot">Hot</SelectItem>
          <SelectItem value="new">New</SelectItem>
        </SelectContent>
      </Select>
      <Select value="all">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All time" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All time</SelectItem>
          <SelectItem value="year">Year</SelectItem>
          <SelectItem value="month">Month</SelectItem>
          <SelectItem value="week">Week</SelectItem>
          <SelectItem value="day">Day</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

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
