export function median(values: number[]): number {
  if (values.length === 0) {
    throw new Error("Cannot calculate median of an empty array");
  }

  if (values.some((value) => !Number.isFinite(value))) {
    throw new Error("Cannot calculate median of non-finite values");
  }

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}
