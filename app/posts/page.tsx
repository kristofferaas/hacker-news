import { Points } from "@/components/hacker-news/points";
import { Button } from "@/components/ui/button";
import { getItem, search, NumericFilter } from "@/lib/api";
import { qs } from "@/lib/utils";
import { Arrow } from "@radix-ui/react-select";
import { formatDistance } from "date-fns";
import { ArrowLeft, ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { z } from "zod";

const searchParamsSchema = z.object({
  query: z.string().optional(),
  time: z.enum(["today", "week", "month", "year", "all"]).optional(),
  page: z.coerce.number().min(0).optional(),
});

type SearchParams = z.infer<typeof searchParamsSchema>;

export default async function Home(props: { searchParams: unknown }) {
  const searchParams = searchParamsSchema.parse(props.searchParams);

  const { hits, page, nbPages, nbHits, query } = await search({
    query: searchParams.query,
    tags: ["story"],
    numericFilters: createNumericFilter(searchParams),
    page: searchParams.page,
  });

  return (
    <main className="container max-w-5xl my-2 space-y-2">
      {query && (
        <span className="text-sm text-muted-foreground">
          {nbHits} results for &quot;{query}&quot;
        </span>
      )}
      <ol className="space-y-2">
        {hits.map((hit) => (
          <Item key={hit.objectID} id={hit.objectID} />
        ))}
      </ol>
      <Pagination page={page} pageCount={nbPages} searchParams={searchParams} />
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

const Pagination = ({
  page,
  pageCount,
  searchParams,
}: {
  page: number;
  pageCount: number;
  searchParams: SearchParams;
}) => {
  const pages = Array.from({ length: pageCount }, (_, i) => i);

  const prevPage = Math.max(0, page - 1);
  const nextPage = Math.min(pageCount - 1, page + 1);

  return (
    <div className="flex">
      <Button className="shrink-0" variant="outline" size="icon" asChild>
        <Link href={`/posts?${qs({ ...searchParams, page: prevPage })}`}>
          <ArrowLeftIcon className="w-4 h-4" />
        </Link>
      </Button>
      <div className="flex flex-grow space-x-2 px-2 overflow-auto">
        {pages.map((p) => (
          <Button
            key={p}
            size="icon"
            className="flex-shrink-0"
            variant={p === page ? "default" : "outline"}
            asChild
          >
            <Link
              href={`/posts?${qs({ ...searchParams, page: p })}`}
              prefetch={false}
            >
              {p}
            </Link>
          </Button>
        ))}
      </div>
      <Button className="shrink-0" variant="outline" size="icon" asChild>
        <Link href={`/posts?${qs({ ...searchParams, page: nextPage })}`}>
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
};

const createNumericFilter = ({ time }: SearchParams): NumericFilter => {
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
