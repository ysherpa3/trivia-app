import { Suspense } from "react";
import Link from "next/link";
import { getQuestions, parseSettings } from "@/lib/questions";
import { buttonClass } from "@/components/Button";
import { GameUI } from "@/components/GameUI";
import { Spinner } from "@/components/Spinner";
import { cn } from "@/lib/utils";

type SearchParams = Record<string, string | string[] | undefined>;

function PlayError({ message }: { message: string }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 gap-4">
      <p className="text-accent text-center max-w-sm">{message}</p>
      <Link href="/" className={cn(buttonClass, "px-6 py-2.5 font-medium")}>
        Go Back
      </Link>
    </main>
  );
}

async function Game({ params }: { params: Promise<SearchParams> }) {
  const parsed = parseSettings(await params);
  if (!parsed.ok) return <PlayError message={parsed.error} />;

  const result = await getQuestions(parsed.settings);
  if (!result.ok) return <PlayError message={result.error} />;

  return <GameUI questions={result.questions} />;
}

export default function PlayPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Questions are fetched during render, so without a boundary the whole page
  // would wait on the upstream call. Suspense streams the shell immediately.
  return (
    <Suspense fallback={<Spinner label="Loading questions…" />}>
      <Game params={searchParams} />
    </Suspense>
  );
}
