import type { DataStructure } from "../structures/DataStructure";
import { measureTime } from "./measureTime";

export interface BenchmarkResult {
  insertionTime: number;
  successfulSearchTime: number;
  unsuccessfulSearchTime: number;
  deletionTime: number;
}

export interface BenchmarkSequences {
  insertion: number[];
  successfulSearch: number[];
  unsuccessfulSearch: number[];
  deletion: number[];
}

function createPopulatedStructure(
  createStructure: () => DataStructure,
  keys: readonly number[],
): DataStructure {
  const structure = createStructure();

  for (const key of keys) {
    structure.insert(key);
  }

  return structure;
}

export function runBenchmark(
  createStructure: () => DataStructure,
  sequences: BenchmarkSequences,
): BenchmarkResult {
  // Scenario 1: insertion into an empty structure
  const insertionStructure = createStructure();

  const insertionTime = measureTime(() => {
    for (const key of sequences.insertion) {
      insertionStructure.insert(key);
    }
  });

  // Scenario 2: successful search
  const successfulSearchStructure = createPopulatedStructure(
    createStructure,
    sequences.insertion,
  );

  const successfulSearchTime = measureTime(() => {
    for (const key of sequences.successfulSearch) {
      successfulSearchStructure.search(key);
    }
  });

  // Scenario 3: unsuccessful search
  const unsuccessfulSearchStructure = createPopulatedStructure(
    createStructure,
    sequences.insertion,
  );

  const unsuccessfulSearchTime = measureTime(() => {
    for (const key of sequences.unsuccessfulSearch) {
      unsuccessfulSearchStructure.search(key);
    }
  });

  // Scenario 4: deletion
  const deletionStructure = createPopulatedStructure(
    createStructure,
    sequences.insertion,
  );

  const deletionTime = measureTime(() => {
    for (const key of sequences.deletion) {
      deletionStructure.delete(key);
    }
  });

  return {
    insertionTime,
    successfulSearchTime,
    unsuccessfulSearchTime,
    deletionTime,
  };
}
