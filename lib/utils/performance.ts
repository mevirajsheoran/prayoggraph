/**
 * Performance utilities. The physics engine should complete in <16ms.
 * These helpers provide easy instrumentation.
 */

export function now(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

export function measureSync<T>(label: string, fn: () => T): { result: T; ms: number } {
  const start = now();
  const result = fn();
  const ms = Math.round((now() - start) * 1000) / 1000;
  return { result, ms };
}

export async function measureAsync<T>(
  label: string,
  fn: () => Promise<T>
): Promise<{ result: T; ms: number }> {
  const start = now();
  const result = await fn();
  const ms = Math.round((now() - start) * 1000) / 1000;
  return { result, ms };
}

/**
 * Asserts that a value completes within a time budget (in ms).
 * Throws if exceeded.
 */
export function assertUnderBudget(ms: number, budget: number, label: string) {
  if (ms > budget) {
    throw new Error(
      `${label} exceeded budget: ${ms}ms > ${budget}ms`
    );
  }
}