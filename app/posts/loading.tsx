import { ItemSkeleton } from "@/components/hacker-news/item";

const fiftyElements = Array.from({ length: 50 });

export default function Loading() {
  return (
    <main className="container max-w-5xl">
      <ol className="space-y-2 mt-2">
        {fiftyElements.map((_, i) => (
          <ItemSkeleton key={i} />
        ))}
      </ol>
    </main>
  );
}
