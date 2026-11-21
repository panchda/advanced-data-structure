import { describe, expect, it } from "vitest";

describe("Project setup", () => {
  it("should run TypeScript tests successfully", () => {
    const numbers = [10, 20, 30];

    expect(numbers.length).toBe(3);
    expect(numbers.reduce((sum, n) => sum + n, 0)).toBe(60);
  });
});
