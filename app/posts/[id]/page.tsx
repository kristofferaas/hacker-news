import { getItem } from "@/lib/api";

export default async function Post({ params }: { params: { id: string } }) {
  const item = await getItem(params.id);

  const url = item.url ? new URL(item.url) : null;

  return (
    <main className="container max-w-5xl my-4">
      <h1 className="text-lg font-bold my-2">
        {item.title}{" "}
        {url && (
          <span className="font-normal text-muted-foreground text-sm">
            ({url.hostname})
          </span>
        )}
      </h1>
      <p className="text-muted-foreground text-sm">
        by <span>{item.by}</span> - <span>{item.score}</span> points
      </p>
      <p className="mt-4">Comments ({item.descendants})</p>
      <ol>
        {item.kids?.map((id) => (
          <Comment key={id} id={id} />
        ))}
      </ol>
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
