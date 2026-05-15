import { NextRequest, NextResponse } from "next/server";
import type { Question } from "@/types";

type RawQuestion = {
  category: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

function decode(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&lsquo;/g, "‘")
    .replace(/&rsquo;/g, "’")
    .replace(/&hellip;/g, "…")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&eacute;/g, "é")
    .replace(/&Eacute;/g, "É")
    .replace(/&ouml;/g, "ö")
    .replace(/&uuml;/g, "ü")
    .replace(/&auml;/g, "ä")
    .replace(/&oslash;/g, "ø")
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCharCode(Number(code)),
    );
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const RETRY_DELAY_MS = 5500;
const MAX_RETRIES = 2;

// Deduplicate rapid identical requests (handles React StrictMode double-invoke in dev)
const cache = new Map<string, { questions: Question[]; ts: number }>();
const CACHE_TTL_MS = 15_000;

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const amount = sp.get("amount") || "10";
  const category = sp.get("category") || "";
  const difficulty = sp.get("difficulty") || "";

  const cacheKey = `${amount}|${category}|${difficulty}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return NextResponse.json(cached.questions);
  }

  const params = new URLSearchParams({ amount, type: "multiple" });
  if (category) params.set("category", category);
  if (difficulty) params.set("difficulty", difficulty);

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    let res: Response;
    try {
      res = await fetch(`https://opentdb.com/api.php?${params}`);
    } catch {
      return NextResponse.json(
        { error: "Network error — please try again" },
        { status: 502 },
      );
    }

    if (res.status === 429) {
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS);
        continue;
      }
      return NextResponse.json(
        {
          error: "Too many requests — please wait a few seconds and try again",
        },
        { status: 429 },
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: "Network error — please try again" },
        { status: 502 },
      );
    }

    const data = (await res.json()) as {
      response_code: number;
      results: RawQuestion[];
    };

    if (data.response_code === 5) {
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS);
        continue;
      }
      return NextResponse.json(
        {
          error: "Too many requests — please wait a few seconds and try again",
        },
        { status: 429 },
      );
    }
    if (data.response_code === 1) {
      return NextResponse.json(
        { error: "Not enough questions for these settings" },
        { status: 422 },
      );
    }
    if (data.response_code !== 0) {
      return NextResponse.json(
        { error: "Failed to load questions" },
        { status: 502 },
      );
    }

    const questions: Question[] = data.results.map((q) => ({
      category: decode(q.category),
      difficulty: q.difficulty as Question["difficulty"],
      question: decode(q.question),
      correct_answer: decode(q.correct_answer),
      incorrect_answers: q.incorrect_answers.map(decode),
    }));

    cache.set(cacheKey, { questions, ts: Date.now() });
    return NextResponse.json(questions);
  }

  return NextResponse.json(
    { error: "Failed to load questions — please try again" },
    { status: 502 },
  );
}
