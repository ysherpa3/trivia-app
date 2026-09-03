import { cn } from "@/lib/utils";
import type { Question } from "@/types";

interface QuestionCardProps {
  question: Question;
  answers: string[];
  feedbackAnswer: string | null;
  onAnswer: (answer: string) => void;
}

const difficultyColor: Record<Question["difficulty"], string> = {
  easy: "text-correct-ink",
  medium: "text-yellow-700",
  hard: "text-accent",
};

export function QuestionCard({
  question,
  answers,
  feedbackAnswer,
  onAnswer,
}: QuestionCardProps) {
  function buttonStyle(ans: string) {
    if (feedbackAnswer === null) {
      return "bg-surface text-gray-800 hover:bg-surface-hover cursor-pointer";
    }
    if (ans === question.correct_answer) {
      return "bg-correct text-gray-900";
    }
    if (ans === feedbackAnswer) {
      return "bg-brand text-gray-900";
    }
    return "bg-surface text-gray-500 cursor-default";
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface text-gray-500">
          {question.category}
        </span>
        <span
          className={cn(
            "text-xs font-medium capitalize",
            difficultyColor[question.difficulty],
          )}
        >
          {question.difficulty}
        </span>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 leading-7">
        {question.question}
      </h2>

      <div className="grid grid-cols-1 gap-3">
        {answers.map((ans, i) => (
          <button
            key={i}
            onClick={() => onAnswer(ans)}
            disabled={feedbackAnswer !== null}
            className={cn(
              "w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-800 focus-visible:ring-offset-1",
              buttonStyle(ans),
            )}
          >
            {ans}
          </button>
        ))}
      </div>

      {/* Feedback is otherwise colour-only. Rendered empty up front so the
          region exists before it changes and actually gets announced. */}
      <p aria-live="polite" className="sr-only">
        {feedbackAnswer === null
          ? ""
          : feedbackAnswer === question.correct_answer
            ? "Correct."
            : `Incorrect. The correct answer is ${question.correct_answer}.`}
      </p>
    </div>
  );
}
