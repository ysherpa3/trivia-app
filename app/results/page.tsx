"use client";
import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import type { GameResult } from "@/types";
import { ResultsSummary } from "@/components/ResultsSummary";

function Spinner() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-2 border-[#FF6B6B] border-t-transparent rounded-full animate-spin" />
    </main>
  );
}

// Cached so getSnapshot returns a stable reference — required by useSyncExternalStore.
let _cachedRaw: string | null | undefined = undefined;
let _cachedResult: GameResult | null = null;

function getResult(): GameResult | null {
  const raw = sessionStorage.getItem("trivia-result");
  if (raw === _cachedRaw) return _cachedResult;
  _cachedRaw = raw;
  if (!raw) return (_cachedResult = null);
  try {
    return (_cachedResult = JSON.parse(raw) as GameResult);
  } catch {
    return (_cachedResult = null);
  }
}

export default function ResultsPage() {
  const router = useRouter();
  const result = useSyncExternalStore(
    () => () => {},
    getResult,
    () => null,
  );

  useEffect(() => {
    if (!result) router.replace("/");
  }, [result]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!result) return <Spinner />;

  return (
    <main className="flex flex-1 flex-col items-center justify-start px-4 py-8">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Results
        </h1>
        <ResultsSummary result={result} onPlayAgain={() => router.push("/")} />
      </div>
    </main>
  );
}
