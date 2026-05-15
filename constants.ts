import type { GameSettings } from "./types";

export const CATEGORIES = [
  { id: "", name: "Any Category" },
  { id: "9", name: "General Knowledge" },
  { id: "10", name: "Books" },
  { id: "11", name: "Film" },
  { id: "12", name: "Music" },
  { id: "14", name: "Television" },
  { id: "15", name: "Video Games" },
  { id: "17", name: "Science & Nature" },
  { id: "18", name: "Computers" },
  { id: "19", name: "Mathematics" },
  { id: "20", name: "Mythology" },
  { id: "21", name: "Sports" },
  { id: "22", name: "Geography" },
  { id: "23", name: "History" },
  { id: "27", name: "Animals" },
];

export const DIFFICULTIES = [
  { value: "", label: "Any" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export const AMOUNTS = [5, 10, 15, 20];

export const DEFAULTS: GameSettings = {
  amount: 10,
  category: "",
  difficulty: "",
};
