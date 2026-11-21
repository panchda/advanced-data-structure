import { describe, expect, it, vi } from "vitest";
import type { DataStructure } from "../structures/DataStructure";
import { runBenchmark } from "../benchmarks/benchmarkRunner";

describe("Benchmark runner", () => {
  it("should create four independent structures for each run", () => {
    const createStructure = vi.fn(
      (): DataStructure => ({
        insert: vi.fn(),
        search: vi.fn(() => true),
        delete: vi.fn(() => true),
      }),
    );

    const sequences = {
      insertion: [1],
      successfulSearch: [1],
      unsuccessfulSearch: [2],
      deletion: [1],
    };

    runBenchmark(createStructure, sequences);
    runBenchmark(createStructure, sequences);

    expect(createStructure).toHaveBeenCalledTimes(8);
  });

  it("should execute operations in the correct order", () => {
    const operations: string[] = [];

    const createStructure = (): DataStructure => ({
      insert: (key) => {
        operations.push(`insert:${key}`);
      },
      search: (key) => {
        operations.push(`search:${key}`);
        return true;
      },
      delete: (key) => {
        operations.push(`delete:${key}`);
        return true;
      },
    });

    runBenchmark(createStructure, {
      insertion: [1, 2],
      successfulSearch: [2, 1],
      unsuccessfulSearch: [3],
      deletion: [1, 2],
    });

    expect(operations).toEqual([
      // Insertion scenario
      "insert:1",
      "insert:2",

      // Prepare successful search structure
      "insert:1",
      "insert:2",

      // Successful search scenario
      "search:2",
      "search:1",

      // Prepare unsuccessful search structure
      "insert:1",
      "insert:2",

      // Unsuccessful search scenario
      "search:3",

      // Prepare deletion structure
      "insert:1",
      "insert:2",

      // Deletion scenario
      "delete:1",
      "delete:2",
    ]);
  });

  it("should use independent structures for each scenario", () => {
    const instances: DataStructure[] = [];

    const createStructure = (): DataStructure => {
      const keys = new Set<number>();

      const structure: DataStructure = {
        insert: (key) => {
          keys.add(key);
        },
        search: (key) => keys.has(key),
        delete: (key) => keys.delete(key),
      };

      instances.push(structure);

      return structure;
    };

    runBenchmark(createStructure, {
      insertion: [10, 20, 30],
      successfulSearch: [10, 20],
      unsuccessfulSearch: [40],
      deletion: [10, 20, 30],
    });

    expect(instances).toHaveLength(4);

    // Every scenario must use a different instance.
    expect(new Set(instances).size).toBe(4);
  });

  it("should return non-negative execution times", () => {
    const createStructure = (): DataStructure => ({
      insert: () => {},
      search: () => false,
      delete: () => false,
    });

    const result = runBenchmark(createStructure, {
      insertion: [1],
      successfulSearch: [1],
      unsuccessfulSearch: [2],
      deletion: [1],
    });

    expect(Object.values(result)).toHaveLength(4);

    for (const duration of Object.values(result)) {
      expect(Number.isFinite(duration)).toBe(true);
      expect(duration).toBeGreaterThanOrEqual(0);
    }
  });
});
