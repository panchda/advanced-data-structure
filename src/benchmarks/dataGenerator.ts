export type DataOrder = "random" | "sorted" | "partiallySorted";

export interface OperationSequences {
  successfulSearch: number[];
  unsuccessfulSearch: number[];
  deletion: number[];
}

export const DEFAULT_SEED = 2026;
export const BLOCK_SIZE = 100;

export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;

    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(
  values: readonly T[],
  seed: number = DEFAULT_SEED,
): T[] {
  const result = [...values];
  const random = mulberry32(seed);

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function generateData(
  size: number,
  order: DataOrder,
  seed: number = DEFAULT_SEED,
): number[] {
  if (!Number.isSafeInteger(size) || size < 0) {
    throw new RangeError("Size must be a non-negative safe integer");
  }

  const keys = Array.from({ length: size }, (_, index) => index + 1);

  switch (order) {
    case "sorted":
      return keys;

    case "random":
      return shuffle(keys, seed);

    case "partiallySorted": {
      const blocks: number[][] = [];

      for (let i = 0; i < keys.length; i += BLOCK_SIZE) {
        blocks.push(keys.slice(i, i + BLOCK_SIZE));
      }

      return shuffle(blocks, seed).flat();
    }
  }
}

export function generateOperationSequences(
  size: number,
  seed = 2026,
): OperationSequences {
  if (
    !Number.isSafeInteger(size) ||
    size < 0 ||
    size > Number.MAX_SAFE_INTEGER / 2
  ) {
    throw new RangeError("Size must be a non-negative safe integer");
  }

  const existingKeys = Array.from({ length: size }, (_, index) => index + 1);

  const missingKeys = Array.from(
    { length: size },
    (_, index) => size + index + 1,
  );

  return {
    successfulSearch: shuffle(existingKeys, seed),
    unsuccessfulSearch: shuffle(missingKeys, seed + 1),
    deletion: shuffle(existingKeys, seed + 2),
  };
}
