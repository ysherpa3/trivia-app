interface ScoreBarProps {
  score: number;
  current: number;
  total: number;
}

export function ScoreBar({ score, current, total }: ScoreBarProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <span className="text-sm font-medium text-gray-500">
        Question{" "}
        <span className="text-gray-900 font-semibold">{current + 1}</span>{" "}
        <span className="text-gray-500">of {total}</span>
      </span>
      <span className="text-sm font-medium text-gray-500">
        Score <span className="text-gray-900 font-semibold">{score}</span>
      </span>
    </div>
  );
}
