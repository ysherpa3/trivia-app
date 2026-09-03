export interface Question {
  category: string;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  correct_answer: string;
  /**
   * Presentation order, shuffled once on the server. Shuffling during render
   * would make the server and client disagree and break hydration.
   */
  answers: string[];
}

export interface GameSettings {
  amount: number;
  category: string;
  difficulty: string;
}

export interface UserAnswer {
  question: Question;
  selected: string;
  correct: boolean;
}

export interface GameResult {
  answers: UserAnswer[];
  score: number;
  total: number;
}
