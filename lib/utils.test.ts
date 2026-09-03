import { describe, expect, it } from "vitest";
import { shuffle } from "./utils";

describe("shuffle", () => {
  it("returns a permutation and leaves the input alone", () => {
    const input = [1, 2, 3, 4, 5];
    const copy = [...input];
    const out = shuffle(input);

    expect(input).toEqual(copy);
    expect(out).not.toBe(input);
    expect([...out].sort()).toEqual([...input].sort());
  });

  it("handles empty and single-element arrays", () => {
    expect(shuffle([])).toEqual([]);
    expect(shuffle(["only"])).toEqual(["only"]);
  });

  it("keeps duplicates rather than collapsing them", () => {
    expect(shuffle(["a", "a", "b"]).sort()).toEqual(["a", "a", "b"]);
  });

  it("actually reorders over many runs", () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const moved = Array.from({ length: 50 }, () => shuffle(input)).some(
      (out) => out.some((v, i) => v !== input[i]),
    );
    expect(moved).toBe(true);
  });
});
