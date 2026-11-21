import { describe, expect, it } from "vitest";
import { AVLTree } from "../structures/avl/AVLTree";
import {
  DEFAULT_REPETITIONS,
  runRepeatedBenchmark,
} from "../benchmarks/repeatedBenchmark";
import type { BenchmarkSequences } from "../benchmarks/benchmarkRunner";

describe("Repeated benchmark", () => {
  const sequences: BenchmarkSequences = {
    insertion: [10, 20, 30],
    successfulSearch: [10, 20, 30],
    unsuccessfulSearch: [40, 50, 60],
    deletion: [20, 10, 30],
  };

  it("should run 10 repetitions by default", () => {
    const result = runRepeatedBenchmark(() => new AVLTree(), sequences);

    expect(DEFAULT_REPETITIONS).toBe(10);
    expect(result.runs).toHaveLength(10);
  });

  it("should support a custom number of repetitions", () => {
    const result = runRepeatedBenchmark(() => new AVLTree(), sequences, 3);

    expect(result.runs).toHaveLength(3);
  });

  it("should create a fresh structure for each repetition", () => {
    let created = 0;

    runRepeatedBenchmark(
      () => {
        created++;
        return new AVLTree();
      },
      sequences,
      5,
    );

    expect(created).toBe(24);
  });

  it("should calculate median for every operation", () => {
    const result = runRepeatedBenchmark(() => new AVLTree(), sequences, 5);

    const operations = [
      "insertionTime",
      "successfulSearchTime",
      "unsuccessfulSearchTime",
      "deletionTime",
    ] as const;

    for (const operation of operations) {
      const values = result.runs
        .map((run) => run[operation])
        .sort((a, b) => a - b);

      expect(result.median[operation]).toBe(values[2]);
    }
  });

  it("should reject invalid repetition counts", () => {
    expect(() =>
      runRepeatedBenchmark(() => new AVLTree(), sequences, 0),
    ).toThrow(RangeError);

    expect(() =>
      runRepeatedBenchmark(() => new AVLTree(), sequences, -1),
    ).toThrow(RangeError);

    expect(() =>
      runRepeatedBenchmark(() => new AVLTree(), sequences, 1.5),
    ).toThrow(RangeError);
  });

  it("should exclude warm-up runs from measured results", () => {
    let created = 0;

    const result = runRepeatedBenchmark(
      () => {
        created++;
        return new AVLTree();
      },
      sequences,
      3,
      2,
    );

    expect(created).toBe(20);
    expect(result.runs).toHaveLength(3);
  });

  it("should allow disabling warm-up runs", () => {
    let created = 0;

    const result = runRepeatedBenchmark(
      () => {
        created++;
        return new AVLTree();
      },
      sequences,
      3,
      0,
    );

    expect(created).toBe(12);
    expect(result.runs).toHaveLength(3);
  });

  it("should reject invalid warm-up counts", () => {
    for (const warmupRuns of [-1, 1.5, NaN, Infinity]) {
      expect(() =>
        runRepeatedBenchmark(() => new AVLTree(), sequences, 3, warmupRuns),
      ).toThrow(RangeError);
    }
  });
});
