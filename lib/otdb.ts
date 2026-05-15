import type { GameSettings, Question } from "@/types";

export async function fetchQuestions(
  settings: Pick<GameSettings, "amount" | "category" | "difficulty">,
): Promise<Question[]> {
  const params = new URLSearchParams({ amount: String(settings.amount) });
  if (settings.category) params.set("category", settings.category);
  if (settings.difficulty) params.set("difficulty", settings.difficulty);

  const res = await fetch(`/api/questions?${params}`);
  const data = (await res.json()) as Question[] | { error: string };

  if (!res.ok) {
    throw new Error(
      (data as { error: string }).error ?? "Failed to load questions",
    );
  }

  return data as Question[];
}
