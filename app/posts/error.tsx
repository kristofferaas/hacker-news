"use client";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <code>{error.message}</code>
    </div>
  );
}
