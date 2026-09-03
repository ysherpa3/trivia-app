import "server-only";
import { CATEGORIES } from "@/constants";
import { shuffle } from "@/lib/utils";
import type { Question } from "@/types";

export type QuestionsResult =
  { ok: true; questions: Question[] } | { ok: false; error: string };

type RawQuestion = {
  category: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

export type Settings = { amount: number; category: string; difficulty: string };

const DIFFICULTIES = ["easy", "medium", "hard"] as const;
const CATEGORY_IDS = new Set(CATEGORIES.map((c) => c.id));

function isDifficulty(v: string): v is Question["difficulty"] {
  return (DIFFICULTIES as readonly string[]).includes(v);
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const RETRY_DELAY_MS = 5500;
const MAX_RETRIES = 2;
const UPSTREAM_TIMEOUT_MS = 10_000;

// Dedupes rapid identical requests (a refresh, or two players on the same
// settings). Per-instance, so it does nothing across serverless instances.
const cache = new Map<string, { questions: Question[]; ts: number }>();
const CACHE_TTL_MS = 15_000;

type Param = string | string[] | undefined;
const first = (v: Param) => (Array.isArray(v) ? v[0] : v);

/**
 * Validates before anything is sent upstream: unvalidated params guarantee
 * upstream misses, and each miss costs up to MAX_RETRIES * RETRY_DELAY_MS.
 */
export function parseSettings(
  params: Record<string, Param>,
): { ok: true; settings: Settings } | { ok: false; error: string } {
  const amount = Number(first(params.amount) ?? "10");
  if (!Number.isInteger(amount) || amount < 1 || amount > 50) {
    return { ok: false, error: "amount must be an integer between 1 and 50" };
  }

  const category = first(params.category) ?? "";
  if (!CATEGORY_IDS.has(category)) {
    return { ok: false, error: "Unknown category" };
  }

  const difficulty = first(params.difficulty) ?? "";
  if (difficulty && !isDifficulty(difficulty)) {
    return { ok: false, error: "Unknown difficulty" };
  }

  return { ok: true, settings: { amount, category, difficulty } };
}

const RATE_LIMITED =
  "Too many requests — please wait a few seconds and try again";
const NOT_ENOUGH = "Not enough questions for these settings";
const GENERIC = "Failed to load questions";

export async function getQuestions(
  settings: Settings,
): Promise<QuestionsResult> {
  const { amount, category, difficulty } = settings;
  const cacheKey = `${amount}|${category}|${difficulty}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return { ok: true, questions: cached.questions };
  }

  const params = new URLSearchParams({
    amount: String(amount),
    type: "multiple",
    // Ask for percent-encoding: OTDB's default is HTML entities, which need a
    // lookup table to decode. decodeURIComponent handles every character.
    encode: "url3986",
  });
  if (category) params.set("category", category);
  if (difficulty) params.set("difficulty", difficulty);

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    let res: Response;
    try {
      res = await fetch(`https://opentdb.com/api.php?${params}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      });
    } catch (e) {
      console.error("[questions] upstream fetch failed", e);
      return { ok: false, error: "Network error — please try again" };
    }

    if (res.status === 429) {
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS);
        continue;
      }
      return { ok: false, error: RATE_LIMITED };
    }

    if (!res.ok) {
      console.error("[questions] upstream returned", res.status);
      return { ok: false, error: "Network error — please try again" };
    }

    let data: { response_code: number; results: RawQuestion[] };
    try {
      data = await res.json();
    } catch (e) {
      console.error("[questions] upstream sent non-JSON body", e);
      return { ok: false, error: GENERIC };
    }

    if (data.response_code === 5) {
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS);
        continue;
      }
      return { ok: false, error: RATE_LIMITED };
    }
    if (data.response_code === 1) return { ok: false, error: NOT_ENOUGH };
    if (data.response_code !== 0) {
      console.error("[questions] upstream response_code", data.response_code);
      return { ok: false, error: GENERIC };
    }

    let questions: Question[];
    try {
      questions = data.results.map((q) => ({
        category: decodeURIComponent(q.category),
        difficulty: isDifficulty(q.difficulty) ? q.difficulty : "medium",
        question: decodeURIComponent(q.question),
        correct_answer: decodeURIComponent(q.correct_answer),
        answers: shuffle([
          decodeURIComponent(q.correct_answer),
          ...q.incorrect_answers.map(decodeURIComponent),
        ]),
      }));
    } catch (e) {
      console.error("[questions] failed to decode upstream payload", e);
      return { ok: false, error: GENERIC };
    }

    // An empty set would finish the game instantly and score 0 out of 0.
    if (questions.length === 0) return { ok: false, error: NOT_ENOUGH };

    cache.set(cacheKey, { questions, ts: Date.now() });
    return { ok: true, questions };
  }

  return { ok: false, error: "Failed to load questions — please try again" };
}
