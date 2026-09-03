"use client";
import { useEffect } from "react";
import { Button } from "@/components/Button";

// Only catches errors thrown by the root layout itself, which app/error.tsx
// cannot reach — so it has to render its own <html> and <body>.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center gap-4 bg-page text-gray-900 px-4">
        <p className="text-accent text-center max-w-sm">
          Something went wrong.
        </p>
        <Button onClick={reset} className="px-6 py-2.5 font-medium">
          Try Again
        </Button>
      </body>
    </html>
  );
}
