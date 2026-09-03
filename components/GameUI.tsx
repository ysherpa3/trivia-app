"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/hooks/useGame";
import { QuestionCard } from "@/components/QuestionCard";
import { ResultsSummary } from "@/components/ResultsSummary";
import { ScoreBar } from "@/components/ScoreBar";
import type { Question } from "@/types";

export function GameUI({ questions }: { questions: Question[] }) {
  const router = useRouter();
  const game = useGame(questions);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const resultsHeading = useRef<HTMLHeadingElement>(null);

  // The whole view swaps in place, so move focus with it — otherwise a screen
  // reader is left on an answer button that no longer exists.
  useEffect(() => {
    if (game.isFinished) resultsHeading.current?.focus();
  }, [game.isFinished]);

  if (game.isFinished) {
    return (
      <main className="flex flex-1 flex-col items-center justify-start px-4 py-8">
        <div className="w-full max-w-lg">
          <h1
            ref={resultsHeading}
            tabIndex={-1}
            className="text-2xl font-bold text-gray-900 text-center mb-6 outline-none"
          >
            Results
          </h1>
          <ResultsSummary
            result={{
              answers: game.answers,
              score: game.score,
              total: game.total,
            }}
            onPlayAgain={() => router.push("/")}
          />
        </div>
      </main>
    );
  }

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
                  className="text-accent font-medium cursor-pointer hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-800 rounded px-1 py-1"
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
                className="text-sm text-gray-600 hover:text-accent border border-gray-200 hover:border-accent rounded-lg px-3 py-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-800 focus-visible:ring-offset-1"
              >
                End quiz
              </button>
            )}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-card-line">
          {game.question && (
            <QuestionCard
              question={game.question}
              answers={game.answerOptions}
              feedbackAnswer={game.feedbackAnswer}
              onAnswer={game.answer}
            />
          )}
        </div>
      </div>
    </main>
  );
}
