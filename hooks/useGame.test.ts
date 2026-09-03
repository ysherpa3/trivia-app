import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useGame } from "./useGame";
import type { Question } from "@/types";

const q = (n: number): Question => ({
  category: "Test",
  difficulty: "easy",
  question: `Q${n}?`,
  correct_answer: `right${n}`,
  answers: [`wrong${n}a`, `right${n}`, `wrong${n}c`, `wrong${n}b`],
});

const QUESTIONS = [q(1), q(2)];

// The hook waits 800ms on a timer before moving to the next question.
const ADVANCE_MS = 800;

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

function answerWith(
  result: ReturnType<typeof renderHook<ReturnType<typeof useGame>, unknown>>,
  selected: string,
) {
  act(() => result.result.current.answer(selected));
  act(() => void vi.advanceTimersByTime(ADVANCE_MS));
}

describe("useGame", () => {
  it("starts on the first question with nothing scored", () => {
    const { result } = renderHook(() => useGame(QUESTIONS));
    expect(result.current.question).toEqual(QUESTIONS[0]);
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.total).toBe(2);
    expect(result.current.score).toBe(0);
    expect(result.current.isFinished).toBe(false);
  });

  it("surfaces the server-decided answer order verbatim", () => {
    const { result } = renderHook(() => useGame(QUESTIONS));
    expect(result.current.answerOptions).toEqual(QUESTIONS[0].answers);
  });

  it("keeps the same answer order across re-renders", () => {
    const r = renderHook(() => useGame(QUESTIONS));
    const before = r.result.current.answerOptions;
    r.rerender();
    expect(r.result.current.answerOptions).toEqual(before);
  });

  it("scores a correct answer and advances", () => {
    const r = renderHook(() => useGame(QUESTIONS));
    answerWith(r, "right1");
    expect(r.result.current.score).toBe(1);
    expect(r.result.current.currentIndex).toBe(1);
    expect(r.result.current.question).toEqual(QUESTIONS[1]);
  });

  it("does not score a wrong answer but still records it", () => {
    const r = renderHook(() => useGame(QUESTIONS));
    answerWith(r, "wrong1a");
    expect(r.result.current.score).toBe(0);
    expect(r.result.current.answers).toEqual([
      { question: QUESTIONS[0], selected: "wrong1a", correct: false },
    ]);
  });

  it("shows feedback before advancing, then clears it", () => {
    const r = renderHook(() => useGame(QUESTIONS));
    act(() => r.result.current.answer("right1"));

    expect(r.result.current.feedbackAnswer).toBe("right1");
    expect(r.result.current.currentIndex).toBe(0);

    act(() => void vi.advanceTimersByTime(ADVANCE_MS));
    expect(r.result.current.feedbackAnswer).toBeNull();
    expect(r.result.current.currentIndex).toBe(1);
  });

  it("ignores a second answer during the feedback window", () => {
    const r = renderHook(() => useGame(QUESTIONS));
    act(() => r.result.current.answer("right1"));
    act(() => r.result.current.answer("wrong1a"));
    act(() => void vi.advanceTimersByTime(ADVANCE_MS));

    expect(r.result.current.score).toBe(1);
    expect(r.result.current.answers).toHaveLength(1);
  });

  it("finishes after the last question with no current question", () => {
    const r = renderHook(() => useGame(QUESTIONS));
    answerWith(r, "right1");
    answerWith(r, "right2");

    expect(r.result.current.isFinished).toBe(true);
    expect(r.result.current.question).toBeNull();
    expect(r.result.current.score).toBe(2);
    expect(r.result.current.answers).toHaveLength(2);
  });

  it("treats an empty question set as finished immediately", () => {
    const { result } = renderHook(() => useGame([]));
    expect(result.current.isFinished).toBe(true);
    expect(result.current.total).toBe(0);
    expect(result.current.answerOptions).toEqual([]);
  });
});
