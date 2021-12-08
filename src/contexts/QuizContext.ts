/**
 * Quiz context
 */

import * as React from "react";
import { Answer, Questions } from "../api/fetchData";

export type Review = {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
};

interface QuizState {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  difficulty: string;
  setDifficulty: React.Dispatch<React.SetStateAction<string>>;
  totalQuestions: number;
  setTotalQuestions: React.Dispatch<React.SetStateAction<number>>;
  questions: Questions[];
  setQuestions: React.Dispatch<React.SetStateAction<Questions[]>>;
  questionNumber: number;
  setQuestionNumber: React.Dispatch<React.SetStateAction<number>>;
  userAnswers: Answer[];
  setUserAnswers: React.Dispatch<React.SetStateAction<Answer[]>>;
  reviewQuestions: Review[];
  setReviewQuestions: React.Dispatch<React.SetStateAction<Review[]>>;
}

export const QuizContext = React.createContext({} as QuizState);
