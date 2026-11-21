import { describe, expect, it } from "vitest";
import { median } from "../benchmarks/statistics";

describe("Statistics", () => {
  describe("median", () => {
    it("should calculate the median of an odd-length array", () => {
      expect(median([30, 10, 20])).toBe(20);
    });

    it("should calculate the median of an even-length array", () => {
      expect(median([10, 30, 20, 50])).toBe(25);
    });

    it("should handle a single value", () => {
      expect(median([42])).toBe(42);
    });

    it("should handle duplicate values", () => {
      expect(median([10, 10, 20, 30])).toBe(15);
    });

    it("should handle negative and decimal values", () => {
      expect(median([-2.5, 1.5, 0])).toBe(0);
    });

    it("should not modify the original array", () => {
      const values = [30, 10, 20];

      median(values);

      expect(values).toEqual([30, 10, 20]);
    });

    it("should reject an empty array", () => {
      expect(() => median([])).toThrow(
        "Cannot calculate median of an empty array",
      );
    });

    it.each([NaN, Infinity, -Infinity])(
      "should reject non-finite value %s",
      (value) => {
        expect(() => median([10, value, 20])).toThrow(
          "Cannot calculate median of non-finite values",
        );
      },
    );
  });
});
