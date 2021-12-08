/**
 * Fetches questions from the Open Trivia Database
 */

import { shuffleArray } from "../utils/shuffleArray";

export type Question = {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
};

export type Answer = {
  correctAnswer: string;
  isCorrect: boolean;
  question: string;
  selectedAnswer: string;
};

export type Questions = Question & { answers: string[] };

export const fetchQuestions = async (
  totalQuestions: number,
  category: string,
  difficulty: string
): Promise<Questions[]> => {
  const apiUrl = `https://opentdb.com/api.php?amount=${totalQuestions}&category=${category}&difficulty=${difficulty}&type=multiple`;
  const data = await (await fetch(apiUrl)).json();
  return data.results.map((question: Question) => ({
    ...question,
    answers: shuffleArray([
      ...question.incorrect_answers,
      question.correct_answer,
    ]),
  }));
};
