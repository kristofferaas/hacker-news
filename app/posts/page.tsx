import { Points } from "@/components/hacker-news/points";
import { Button } from "@/components/ui/button";
import { getItem, search, NumericFilter } from "@/lib/api";
import { Arrow } from "@radix-ui/react-select";
import { formatDistance } from "date-fns";
import { ArrowLeft, ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { z } from "zod";

const searchParamsSchema = z.object({
  query: z.string().optional(),
  time: z.enum(["today", "week", "month", "year", "all"]).optional(),
});

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { query, time } = searchParamsSchema.parse(searchParams);

  const posts = await search({
    query: query,
    tags: ["story"],
    numericFilters: createNumericFilter({ time }),
  });

  return (
    <main className="container max-w-5xl my-2 space-y-2">
      <ol className="space-y-2">
        {posts.hits.map((hit) => (
          <Item key={hit.objectID} id={hit.objectID} />
        ))}
      </ol>
      <Pagination />
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
    <a
      className="flex border rounded-lg p-4 space-x-4 hover:bg-accent"
      href={item.url}
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
          by {item.by} - {item.descendants} comments - {time}
        </p>
      </div>
    </a>
  );
}

const Pagination = () => {
  return (
    <div className="flex space-x-2">
      <Button variant="outline" size="icon" asChild>
        <Link href="/posts?page=2">
          <ArrowLeftIcon className="w-4 h-4" />
        </Link>
      </Button>
      <Button variant="outline" size="icon" asChild>
        <Link href="/posts?page=2">
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
};

const createNumericFilter = ({
  time,
}: z.infer<typeof searchParamsSchema>): NumericFilter => {
  switch (time) {
    case "all": {
      return ["created_at_i", ">", 0];
    }
    case "year": {
      return ["created_at_i", ">", Date.now() / 1000 - 365 * 24 * 60 * 60];
    }
    case "month": {
      return ["created_at_i", ">", Date.now() / 1000 - 30 * 24 * 60 * 60];
    }
    case "week": {
      return ["created_at_i", ">", Date.now() / 1000 - 7 * 24 * 60 * 60];
    }
    case "today":
    default: {
      return ["created_at_i", ">", Date.now() / 1000 - 24 * 60 * 60];
    }
  }
};
