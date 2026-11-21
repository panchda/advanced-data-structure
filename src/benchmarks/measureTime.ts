export function measureTime(operation: () => void): number {
  const start = performance.now();

  operation();

  const end = performance.now();

  return end - start;
}
