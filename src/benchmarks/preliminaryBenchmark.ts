import { AVLTree } from "../structures/avl/AVLTree";
import { SplayTree } from "../structures/splay/SplayTree";
import type { DataStructure } from "../structures/DataStructure";

import {
  DEFAULT_SEED,
  generateData,
  generateOperationSequences,
  type DataOrder,
} from "./dataGenerator";

import { runRepeatedBenchmark, DEFAULT_REPETITIONS } from "./repeatedBenchmark";

import type { BenchmarkSequences } from "./benchmarkRunner";

const PRELIMINARY_SIZES = [1_000, 10_000];
const PRELIMINARY_ORDER: DataOrder = "random";

const structures: {
  name: string;
  create: () => DataStructure;
}[] = [
  { name: "AVL Tree", create: () => new AVLTree() },
  { name: "Splay Tree", create: () => new SplayTree() },
];

export function runPreliminaryBenchmarks(): void {
  console.log("Starting preliminary benchmarks...\n");

  for (const size of PRELIMINARY_SIZES) {
    const insertion = generateData(size, PRELIMINARY_ORDER, DEFAULT_SEED);

    const operations = generateOperationSequences(size, DEFAULT_SEED);

    const sequences: BenchmarkSequences = {
      insertion,
      ...operations,
    };

    for (const structure of structures) {
      const result = runRepeatedBenchmark(
        structure.create,
        sequences,
        DEFAULT_REPETITIONS,
      );

      console.log({
        structure: structure.name,
        size,
        order: PRELIMINARY_ORDER,
        repetitions: DEFAULT_REPETITIONS,
        ...result.median,
      });
    }
  }

  console.log("\nPreliminary benchmarks completed.");
}
