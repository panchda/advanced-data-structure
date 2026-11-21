import { describe, expect, it } from "vitest";
import {
  BLOCK_SIZE,
  generateData,
  generateOperationSequences,
  shuffle,
} from "../benchmarks/dataGenerator";

describe("Data generator", () => {
  describe("Sorted data", () => {
    it("should generate ascending keys", () => {
      expect(generateData(5, "sorted")).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe("Random data", () => {
    it("should preserve all unique keys", () => {
      const data = generateData(1000, "random");

      expect(data).toHaveLength(1000);
      expect(new Set(data).size).toBe(1000);
      expect([...data].sort((a, b) => a - b)).toEqual(
        generateData(1000, "sorted"),
      );
    });

    it("should be reproducible with the same seed", () => {
      expect(generateData(1000, "random", 2026)).toEqual(
        generateData(1000, "random", 2026),
      );
    });

    it("should produce different orders for different seeds", () => {
      expect(generateData(1000, "random", 2026)).not.toEqual(
        generateData(1000, "random", 2027),
      );
    });
  });

  describe("Partially sorted data", () => {
    it("should preserve all keys", () => {
      const data = generateData(1000, "partiallySorted");

      expect([...data].sort((a, b) => a - b)).toEqual(
        generateData(1000, "sorted"),
      );
    });

    it("should keep each block internally sorted", () => {
      const data = generateData(1000, "partiallySorted");

      for (let i = 0; i < data.length; i += BLOCK_SIZE) {
        const block = data.slice(i, i + BLOCK_SIZE);

        expect(block).toEqual([...block].sort((a, b) => a - b));
      }
    });

    it("should be reproducible", () => {
      expect(generateData(1000, "partiallySorted")).toEqual(
        generateData(1000, "partiallySorted"),
      );
    });
  });

  describe("Edge cases", () => {
    it("should handle empty datasets", () => {
      expect(generateData(0, "random")).toEqual([]);
      expect(generateData(0, "sorted")).toEqual([]);
      expect(generateData(0, "partiallySorted")).toEqual([]);
    });

    it("should reject invalid sizes", () => {
      expect(() => generateData(-1, "random")).toThrow(RangeError);
      expect(() => generateData(1.5, "sorted")).toThrow(RangeError);
    });

    it("should not mutate the original array when shuffling", () => {
      const original = [1, 2, 3, 4, 5];

      shuffle(original);

      expect(original).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe("generateOperationSequences", () => {
    it("should generate the correct number of keys", () => {
      const sequences = generateOperationSequences(100);

      expect(sequences.successfulSearch).toHaveLength(100);
      expect(sequences.unsuccessfulSearch).toHaveLength(100);
      expect(sequences.deletion).toHaveLength(100);
    });

    it("should generate valid successful search keys", () => {
      const { successfulSearch } = generateOperationSequences(100);

      expect([...successfulSearch].sort((a, b) => a - b)).toEqual(
        Array.from({ length: 100 }, (_, index) => index + 1),
      );
    });

    it("should generate only missing keys for unsuccessful search", () => {
      const { unsuccessfulSearch } = generateOperationSequences(100);

      expect([...unsuccessfulSearch].sort((a, b) => a - b)).toEqual(
        Array.from({ length: 100 }, (_, index) => index + 101),
      );
    });

    it("should generate valid deletion keys", () => {
      const { deletion } = generateOperationSequences(100);

      expect([...deletion].sort((a, b) => a - b)).toEqual(
        Array.from({ length: 100 }, (_, index) => index + 1),
      );
    });

    it("should produce reproducible sequences for the same seed", () => {
      expect(generateOperationSequences(100, 2026)).toEqual(
        generateOperationSequences(100, 2026),
      );
    });

    it("should handle an empty dataset", () => {
      expect(generateOperationSequences(0)).toEqual({
        successfulSearch: [],
        unsuccessfulSearch: [],
        deletion: [],
      });
    });
  });
});
