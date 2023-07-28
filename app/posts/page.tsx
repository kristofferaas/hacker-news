import { Item } from "@/components/hacker-news/item";
import { Button } from "@/components/ui/button";
import { NumericFilter, search } from "@/lib/api";
import { qs } from "@/lib/utils";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
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
    <main className="container max-w-5xl">
      {query && (
        <p className="text-sm text-muted-foreground my-2">
          {nbHits} results for &quot;{query}&quot;
        </p>
      )}
      <ol className="space-y-2 mt-2">
        {hits.map((hit) => (
          <Item key={hit.objectID} id={hit.objectID} />
        ))}
      </ol>
      <Pagination page={page} pageCount={nbPages} searchParams={searchParams} />
    </main>
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
      <Button className="shrink-0 my-2" variant="outline" size="icon" asChild>
        <Link href={`/posts?${qs({ ...searchParams, page: prevPage })}`}>
          <ArrowLeftIcon className="w-4 h-4" />
        </Link>
      </Button>
      <div className="flex flex-grow space-x-2 p-2 overflow-auto">
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
      <Button className="shrink-0 my-2" variant="outline" size="icon" asChild>
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
