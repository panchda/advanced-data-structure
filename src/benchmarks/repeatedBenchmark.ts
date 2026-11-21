import type { DataStructure } from "../structures/DataStructure";
import {
  runBenchmark,
  type BenchmarkResult,
  type BenchmarkSequences,
} from "./benchmarkRunner";
import { median } from "./statistics";

export const DEFAULT_REPETITIONS = 10;
export const DEFAULT_WARMUP_RUNS = 1;

export interface RepeatedBenchmarkResult {
  median: BenchmarkResult;
  runs: BenchmarkResult[];
}

export function runRepeatedBenchmark(
  createStructure: () => DataStructure,
  sequences: BenchmarkSequences,
  repetitions = DEFAULT_REPETITIONS,
  warmupRuns = DEFAULT_WARMUP_RUNS,
): RepeatedBenchmarkResult {
  if (!Number.isSafeInteger(repetitions) || repetitions <= 0) {
    throw new RangeError("Repetitions must be a positive integer");
  }

  if (!Number.isSafeInteger(warmupRuns) || warmupRuns < 0) {
    throw new RangeError("Warm-up runs must be a non-negative integer");
  }

  // Warm-up runs are excluded from the measured results.
  for (let i = 0; i < warmupRuns; i++) {
    runBenchmark(createStructure, sequences);
  }

  const runs: BenchmarkResult[] = [];

  // Each measured run uses a fresh data structure.
  for (let i = 0; i < repetitions; i++) {
    runs.push(runBenchmark(createStructure, sequences));
  }

  return {
    median: {
      insertionTime: median(runs.map((run) => run.insertionTime)),
      successfulSearchTime: median(runs.map((run) => run.successfulSearchTime)),
      unsuccessfulSearchTime: median(
        runs.map((run) => run.unsuccessfulSearchTime),
      ),
      deletionTime: median(runs.map((run) => run.deletionTime)),
    },
    runs,
  };
}
