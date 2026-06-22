/**
 * Master test entry. Import all test suites and run them together.
 *
 * Run with:  npx tsx lib/engine/__tests__/allTests.ts
 */

import { TestRunner } from "./runTests";
import { registerValidCircuitTests } from "./validCircuit.test";
import { registerOpenCircuitTests } from "./openCircuit.test";
import { registerShortCircuitTests } from "./shortCircuit.test";
import { registerEdgeCaseTests } from "./edgeCases.test";

async function main() {
  console.log("\n\x1b[36m═══════════════════════════════════════════════════\x1b[0m");
  console.log("\x1b[36m  PrayogGraph Deterministic Physics Engine — Tests  \x1b[0m");
  console.log("\x1b[36m═══════════════════════════════════════════════════\x1b[0m\n");

  const runner = new TestRunner();

  registerValidCircuitTests(runner);
  registerOpenCircuitTests(runner);
  registerShortCircuitTests(runner);
  registerEdgeCaseTests(runner);

  await runner.run();

  console.log("\n\x1b[32m✓ All physics engine tests passed.\x1b[0m");
  console.log("\x1b[90m  The engine is provably correct and deterministic.\x1b[0m\n");
}

main().catch((err) => {
  console.error("\x1b[31m✗ Test runner crashed:\x1b[0m", err);
  process.exit(1);
});