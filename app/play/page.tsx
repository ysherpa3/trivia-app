"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchQuestions } from "@/lib/otdb";
import { useGame } from "@/hooks/useGame";
import { QuestionCard } from "@/components/QuestionCard";
import { ScoreBar } from "@/components/ScoreBar";
import type { GameResult, Question } from "@/types";

function Spinner({ label }: { label: string }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3">
      <div
        aria-hidden="true"
        className="w-8 h-8 border-2 border-[#FF6B6B] border-t-transparent rounded-full animate-spin"
      />
      <p role="status" className="text-gray-600 text-sm">
        {label}
      </p>
    </main>
  );
}

function GameUI({ questions }: { questions: Question[] }) {
  const router = useRouter();
  const game = useGame(questions);
  const [confirmEnd, setConfirmEnd] = useState(false);

  useEffect(() => {
    if (!game.isFinished) return;
    const result: GameResult = {
      answers: game.answers,
      score: game.score,
      total: game.total,
    };
    sessionStorage.setItem("trivia-result", JSON.stringify(result));
    router.push("/results");
  }, [game.isFinished]); // eslint-disable-line react-hooks/exhaustive-deps

  if (game.isFinished) return <Spinner label="Saving results…" />;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <ScoreBar
              score={game.score}
              current={game.currentIndex}
              total={game.total}
            />
          </div>
          <div aria-live="polite" aria-atomic="true" className="shrink-0">
            {confirmEnd ? (
              <span className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">End quiz?</span>
                <button
                  onClick={() => router.push("/")}
                  className="text-[#B84040] font-medium cursor-pointer hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-800 rounded px-1 py-1"
                >
                  Yes
                </button>
                <span aria-hidden="true" className="text-gray-300">
                  ·
                </span>
                <button
                  onClick={() => setConfirmEnd(false)}
                  className="text-gray-600 cursor-pointer hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-800 rounded px-1 py-1"
                >
                  Cancel
                </button>
              </span>
            ) : (
              <button
                onClick={() => setConfirmEnd(true)}
                className="text-sm text-gray-600 hover:text-[#B84040] border border-gray-200 hover:border-[#B84040] rounded-lg px-3 py-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-800 focus-visible:ring-offset-1"
              >
                End quiz
              </button>
            )}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EDE0D0]">
          {game.question && (
            <QuestionCard
              question={game.question}
              answers={game.shuffledAnswers}
              feedbackAnswer={game.feedbackAnswer}
              onAnswer={game.answer}
            />
          )}
        </div>
      </div>
    </main>
  );
}

function PlayInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const amount = Number(searchParams.get("amount") || "10");
  const category = searchParams.get("category") || "";
  const difficulty = searchParams.get("difficulty") || "";

  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchQuestions({ amount, category, difficulty })
      .then((q) => {
        if (!cancelled) setQuestions(q);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-4 gap-4">
        <p className="text-[#B84040] text-center max-w-sm">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2.5 rounded-xl bg-[#FF6B6B] hover:bg-[#e85555] text-gray-900 font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-800 focus-visible:ring-offset-2"
        >
          Go Back
        </button>
      </main>
    );
  }

  if (!questions) return <Spinner label="Loading questions…" />;

  return <GameUI questions={questions} />;
}

export default function PlayPage() {
  return (
    <Suspense fallback={<Spinner label="Loading…" />}>
      <PlayInner />
    </Suspense>
  );
}
