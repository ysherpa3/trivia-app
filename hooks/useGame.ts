import { useCallback, useEffect, useRef, useState } from "react";
import type { Question, UserAnswer } from "@/types";

export interface GameSnapshot {
  question: Question | null;
  answerOptions: string[];
  currentIndex: number;
  total: number;
  score: number;
  answers: UserAnswer[];
  isFinished: boolean;
  feedbackAnswer: string | null;
  answer: (selected: string) => void;
}

export function useGame(questions: Question[]): GameSnapshot {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [feedbackAnswer, setFeedbackAnswer] = useState<string | null>(null);

  const advanceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (advanceTimeout.current !== null) clearTimeout(advanceTimeout.current);
    };
  }, []);

  const advance = useCallback(
    (selected: string, isCorrect: boolean) => {
      setUserAnswers((prev) => [
        ...prev,
        { question: questions[currentIndex], selected, correct: isCorrect },
      ]);
      if (isCorrect) setScore((s) => s + 1);
      setFeedbackAnswer(selected);

      if (advanceTimeout.current !== null) clearTimeout(advanceTimeout.current);
      advanceTimeout.current = setTimeout(() => {
        advanceTimeout.current = null;
        setCurrentIndex((i) => i + 1);
        setFeedbackAnswer(null);
      }, 800);
    },
    [currentIndex, questions],
  );

  const answer = useCallback(
    (selected: string) => {
      if (feedbackAnswer !== null) return;
      advance(selected, selected === questions[currentIndex].correct_answer);
    },
    [feedbackAnswer, currentIndex, questions, advance],
  );

  const isFinished = currentIndex >= questions.length;

  return {
    question: isFinished ? null : questions[currentIndex],
    answerOptions: isFinished ? [] : questions[currentIndex].answers,
    currentIndex,
    total: questions.length,
    score,
    answers: userAnswers,
    isFinished,
    feedbackAnswer,
    answer,
  };
}
