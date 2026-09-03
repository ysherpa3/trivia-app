import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getQuestions, parseSettings, type Settings } from "./questions";

// getQuestions caches by amount|category|difficulty, so every upstream test
// uses a distinct amount to avoid picking up another test's cached response.
let amount = 1;
const settings = (over: Partial<Settings> = {}): Settings => ({
  amount: ++amount,
  category: "",
  difficulty: "",
  ...over,
});

function upstream(body: unknown, init: { status?: number } = {}) {
  const status = init.status ?? 200;
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: status < 400,
      status,
      json: async () => {
        if (body === "not-json") throw new SyntaxError("Unexpected token <");
        return body;
      },
    })),
  );
}

const question = (overrides = {}) => ({
  category: "Science%3A%20Computers",
  difficulty: "easy",
  question: "What%20does%20GPU%20stand%20for%3F",
  correct_answer: "Graphics%20Processing%20Unit",
  incorrect_answers: ["Gaming%20Processor%20Unit"],
  ...overrides,
});

beforeEach(() => vi.spyOn(console, "error").mockImplementation(() => {}));
afterEach(() => vi.unstubAllGlobals());

describe("parseSettings", () => {
  it("applies defaults when nothing is supplied", () => {
    expect(parseSettings({})).toEqual({
      ok: true,
      settings: { amount: 10, category: "", difficulty: "" },
    });
  });

  it("accepts a valid combination", () => {
    expect(
      parseSettings({ amount: "5", category: "18", difficulty: "easy" }),
    ).toEqual({
      ok: true,
      settings: { amount: 5, category: "18", difficulty: "easy" },
    });
  });

  it("rejects an amount above the upstream maximum", () => {
    expect(parseSettings({ amount: "99999" }).ok).toBe(false);
  });

  it("rejects a non-numeric amount", () => {
    expect(parseSettings({ amount: "abc" }).ok).toBe(false);
  });

  it("rejects a fractional amount", () => {
    expect(parseSettings({ amount: "2.5" }).ok).toBe(false);
  });

  it("rejects a zero or negative amount", () => {
    expect(parseSettings({ amount: "0" }).ok).toBe(false);
    expect(parseSettings({ amount: "-3" }).ok).toBe(false);
  });

  it("rejects an unknown category", () => {
    expect(parseSettings({ category: "999" }).ok).toBe(false);
  });

  it("rejects an unknown difficulty", () => {
    expect(parseSettings({ difficulty: "impossible" }).ok).toBe(false);
  });

  it("takes the first value when a param is repeated", () => {
    const parsed = parseSettings({ amount: ["5", "50"] });
    expect(parsed).toMatchObject({ ok: true, settings: { amount: 5 } });
  });
});

describe("getQuestions", () => {
  it("decodes url3986 payloads", async () => {
    upstream({ response_code: 0, results: [question()] });
    const res = await getQuestions(settings());

    expect(res).toMatchObject({
      ok: true,
      questions: [
        {
          category: "Science: Computers",
          difficulty: "easy",
          question: "What does GPU stand for?",
          correct_answer: "Graphics Processing Unit",
        },
      ],
    });
    // Answer order is decided here, not during render, so hydration matches.
    const answers = res.ok ? res.questions[0].answers : [];
    expect([...answers].sort()).toEqual(
      ["Gaming Processor Unit", "Graphics Processing Unit"].sort(),
    );
  });

  it("requests url3986 encoding from upstream", async () => {
    upstream({ response_code: 0, results: [question()] });
    await getQuestions(settings());
    expect(vi.mocked(fetch).mock.calls[0][0]).toContain("encode=url3986");
  });

  it("passes category and difficulty upstream only when set", async () => {
    upstream({ response_code: 0, results: [question()] });
    await getQuestions(settings({ category: "18", difficulty: "easy" }));
    const url = String(vi.mocked(fetch).mock.calls[0][0]);
    expect(url).toContain("category=18");
    expect(url).toContain("difficulty=easy");

    upstream({ response_code: 0, results: [question()] });
    await getQuestions(settings());
    const bare = String(vi.mocked(fetch).mock.calls[0][0]);
    expect(bare).not.toContain("category=");
    expect(bare).not.toContain("difficulty=");
  });

  it("falls back to a valid difficulty when upstream sends junk", async () => {
    upstream({
      response_code: 0,
      results: [question({ difficulty: "impossible" })],
    });
    const res = await getQuestions(settings());
    expect(res.ok && ["easy", "medium", "hard"]).toContain(
      res.ok ? res.questions[0].difficulty : "",
    );
  });

  it("reports response_code 1 as not enough questions", async () => {
    upstream({ response_code: 1, results: [] });
    expect(await getQuestions(settings())).toEqual({
      ok: false,
      error: "Not enough questions for these settings",
    });
  });

  it("treats an empty result set as not enough questions", async () => {
    // Otherwise the game finishes instantly and the results page shows NaN%.
    upstream({ response_code: 0, results: [] });
    expect(await getQuestions(settings())).toEqual({
      ok: false,
      error: "Not enough questions for these settings",
    });
  });

  it("fails on an unknown response_code", async () => {
    upstream({ response_code: 3, results: [] });
    expect((await getQuestions(settings())).ok).toBe(false);
  });

  it("fails when upstream sends a non-JSON body", async () => {
    upstream("not-json");
    expect((await getQuestions(settings())).ok).toBe(false);
  });

  it("fails when upstream responds with an error status", async () => {
    upstream({}, { status: 500 });
    expect((await getQuestions(settings())).ok).toBe(false);
  });

  it("fails when the upstream fetch throws", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("network down");
      }),
    );
    expect((await getQuestions(settings())).ok).toBe(false);
  });

  it("serves a repeat request from cache without calling upstream twice", async () => {
    upstream({ response_code: 0, results: [question()] });
    const same = settings({ category: "18" });
    await getQuestions(same);
    await getQuestions(same);
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(1);
  });
});
