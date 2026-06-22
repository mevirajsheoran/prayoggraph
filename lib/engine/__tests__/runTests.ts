import { logger } from "../../utils/logger";
import type {
  CircuitInput,
  CircuitInputEdge,
  CircuitInputNode,
  ComponentKind,
  TerminalId,
} from "../types";

/* ─── Type-safe test input helper ─── */

/**
 * Builds a CircuitInput with proper typing.
 * Use this in tests instead of inline objects to avoid `string` not assignable to ComponentKind.
 */
export function makeInput(
  nodes: Array<{
    id: string;
    kind: ComponentKind;
    isOpen?: boolean;
  }>,
  edges: Array<{
    id: string;
    source: string;
    target: string;
    sourceHandle: TerminalId;
    targetHandle: TerminalId;
  }>
): CircuitInput {
  return {
    nodes: nodes.map<CircuitInputNode>((n) => ({
      id: n.id,
      type: n.kind,
      data: { kind: n.kind, isOpen: n.isOpen },
    })),
    edges: edges.map<CircuitInputEdge>((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle,
    })),
  };
}

export interface TestCase {
  name: string;
  fn: () => void | Promise<void>;
}

export class TestRunner {
  private tests: TestCase[] = [];
  private passed = 0;
  private failed = 0;
  private failures: Array<{ name: string; error: string }> = [];

  test(name: string, fn: () => void | Promise<void>): void {
    this.tests.push({ name, fn });
  }

  async run(): Promise<void> {
    logger.info(`Running ${this.tests.length} test(s)...\n`);

    for (const { name, fn } of this.tests) {
      try {
        await fn();
        this.passed++;
        console.log(`  \x1b[32m✓\x1b[0m ${name}`);
      } catch (err) {
        this.failed++;
        const errorMsg = err instanceof Error ? err.message : String(err);
        this.failures.push({ name, error: errorMsg });
        console.log(`  \x1b[31m✗\x1b[0m ${name}`);
        console.log(`    \x1b[31m${errorMsg}\x1b[0m`);
      }
    }

    console.log("");
    logger.info(
      `Results: ${this.passed} passed, ${this.failed} failed, ${this.tests.length} total`
    );

    if (this.failed > 0) {
      console.log("\nFailures:");
      for (const { name, error } of this.failures) {
        console.log(`  • ${name}\n    ${error}`);
      }
      process.exit(1);
    }
  }
}

/* ─── Assertion helpers ─── */

export function assertEqual<T>(actual: T, expected: T, label = ""): void {
  if (actual !== expected) {
    throw new Error(
      `${label ? label + ": " : ""}expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
    );
  }
}

export function assertTrue(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

export function assertIncludes<T>(arr: T[], value: T, label = ""): void {
  if (!arr.includes(value)) {
    throw new Error(
      `${label ? label + ": " : ""}expected array to include ${JSON.stringify(value)}, got ${JSON.stringify(arr)}`
    );
  }
}

export function assertNotNull<T>(value: T | null | undefined, label = ""): T {
  if (value === null || value === undefined) {
    throw new Error(`${label ? label + ": " : ""}expected non-null value`);
  }
  return value;
}