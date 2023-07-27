"use client";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <main className="container max-w-5xl space-y-2">
      <h2>Something went wrong!</h2>
      <code>{error.message}</code>
    </main>
  );
}
