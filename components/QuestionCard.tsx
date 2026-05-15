import { cn } from "@/lib/utils";
import type { Question } from "@/types";

interface QuestionCardProps {
  question: Question;
  answers: string[];
  feedbackAnswer: string | null;
  onAnswer: (answer: string) => void;
}

const difficultyColor: Record<Question["difficulty"], string> = {
  easy: "text-[#1B7A73]",
  medium: "text-yellow-700",
  hard: "text-[#B84040]",
};

export function QuestionCard({
  question,
  answers,
  feedbackAnswer,
  onAnswer,
}: QuestionCardProps) {
  function buttonStyle(ans: string) {
    if (feedbackAnswer === null) {
      return "bg-[#F5EEE6] text-gray-800 hover:bg-[#EDE4D8] cursor-pointer";
    }
    if (ans === question.correct_answer) {
      return "bg-[#4ECDC4] text-gray-900";
    }
    if (ans === feedbackAnswer) {
      return "bg-[#FF6B6B] text-gray-900";
    }
    return "bg-[#F5EEE6] text-gray-500 cursor-default";
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F5EEE6] text-gray-500">
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
        {answers.map((ans) => (
          <button
            key={ans}
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
    </div>
  );
}
