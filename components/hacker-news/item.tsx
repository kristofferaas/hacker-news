import { Points } from "@/components/hacker-news/points";
import { getItem } from "@/lib/api";
import { formatDistance } from "date-fns";

export async function Item({ id }: { id: string }) {
  const item = await getItem(id);

  const url = item.url ? new URL(item.url) : null;
  const time = formatDistance(new Date(item.time * 1000), new Date(), {
    addSuffix: true,
  });

  return (
    <a
      className="flex border rounded-lg p-4 space-x-4 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground"
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
