"use client";
import { useEffect } from "react";
import { Button } from "@/components/Button";

export default function Error({
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
    <main className="flex flex-1 flex-col items-center justify-center px-4 gap-4">
      <p className="text-accent text-center max-w-sm">Something went wrong.</p>
      <Button onClick={reset} className="px-6 py-2.5 font-medium">
        Try Again
      </Button>
    </main>
  );
}
