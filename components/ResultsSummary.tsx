import { cn } from "@/lib/utils";
import type { GameResult } from "@/types";

interface ResultsSummaryProps {
  result: GameResult;
  onPlayAgain: () => void;
}

function verdict(pct: number) {
  if (pct === 100) return "Perfect score!";
  if (pct >= 80) return "Outstanding!";
  if (pct >= 60) return "Well done!";
  if (pct >= 40) return "Not bad.";
  return "Keep practicing.";
}

export function ResultsSummary({ result, onPlayAgain }: ResultsSummaryProps) {
  const { score, total, answers } = result;
  const pct = Math.round((score / total) * 100);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col items-center gap-1.5 py-5 sm:py-6 bg-white rounded-2xl shadow-sm border border-[#EDE0D0]">
        <p
          className="text-5xl sm:text-6xl font-bold text-gray-900 tabular-nums"
          aria-label={`${score} out of ${total}`}
        >
          {score}
          <span
            className="text-2xl sm:text-3xl text-gray-500"
            aria-hidden="true"
          >
            /{total}
          </span>
        </p>
        <p className="text-[#B84040] font-semibold text-lg">{verdict(pct)}</p>
        <p className="text-gray-600 text-sm">{pct}% correct</p>
      </div>

      <div className="flex flex-col gap-3">
        {answers.map((ua, i) => (
          <div
            key={i}
            className={cn(
              "rounded-xl p-4 border",
              ua.correct
                ? "border-[#4ECDC4]/40 bg-[#4ECDC4]/10"
                : "border-[#FF6B6B]/40 bg-[#FF6B6B]/10",
            )}
          >
            <p className="text-sm text-gray-700 mb-2.5">
              {ua.question.question}
            </p>
            <div className="flex flex-col gap-1 text-xs">
              <p className="text-[#1B7A73] font-medium">
                <span aria-hidden="true">✓ </span>
                <span className="sr-only">Correct answer: </span>
                {ua.question.correct_answer}
              </p>
              {!ua.correct && (
                <p className="text-[#B84040] font-medium">
                  <span aria-hidden="true">✗ </span>
                  <span className="sr-only">Your answer: </span>
                  {ua.selected}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onPlayAgain}
        className="w-full py-3 rounded-xl bg-[#FF6B6B] hover:bg-[#e85555] text-gray-900 font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-800 focus-visible:ring-offset-2"
      >
        Play Again
      </button>
    </div>
  );
}
