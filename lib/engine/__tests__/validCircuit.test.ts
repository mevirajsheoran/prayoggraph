import { evaluateCircuit } from "../evaluator";
import { TestRunner, assertEqual, assertTrue, makeInput } from "./runTests";

export function registerValidCircuitTests(runner: TestRunner): void {
  runner.test("VALID: battery + closed switch + bulb (simple series)", () => {
    const result = evaluateCircuit(
      makeInput(
        [
          { id: "bat", kind: "battery" },
          { id: "sw", kind: "switch", isOpen: false },
          { id: "bulb", kind: "bulb" },
        ],
        [
          { id: "e1", source: "bat",  target: "sw",   sourceHandle: "positive", targetHandle: "in" },
          { id: "e2", source: "sw",   target: "bulb", sourceHandle: "out",      targetHandle: "in" },
          { id: "e3", source: "bulb", target: "bat",  sourceHandle: "out",      targetHandle: "negative" },
        ]
      )
    );
    assertEqual(result.result, "VALID_CIRCUIT", "result");
    assertTrue(result.activeEdgeIds.length === 3, "should activate all 3 edges");
    assertTrue(result.computedAt < 16, `should be <16ms, was ${result.computedAt}ms`);
  });

  runner.test("VALID: battery + bulb only (no switch)", () => {
    const result = evaluateCircuit(
      makeInput(
        [
          { id: "bat", kind: "battery" },
          { id: "bulb", kind: "bulb" },
        ],
        [
          { id: "e1", source: "bat",  target: "bulb", sourceHandle: "positive", targetHandle: "in" },
          { id: "e2", source: "bulb", target: "bat",  sourceHandle: "out",      targetHandle: "negative" },
        ]
      )
    );
    assertEqual(result.result, "VALID_CIRCUIT", "result");
  });

  runner.test("VALID: path through multiple bulbs", () => {
    const result = evaluateCircuit(
      makeInput(
        [
          { id: "bat", kind: "battery" },
          { id: "b1", kind: "bulb" },
          { id: "b2", kind: "bulb" },
        ],
        [
          { id: "e1", source: "bat", target: "b1", sourceHandle: "positive", targetHandle: "in" },
          { id: "e2", source: "b1",  target: "b2", sourceHandle: "out",      targetHandle: "in" },
          { id: "e3", source: "b2",  target: "bat", sourceHandle: "out",      targetHandle: "negative" },
        ]
      )
    );
    assertEqual(result.result, "VALID_CIRCUIT", "result");
    assertTrue(result.paths[0].passesThroughBulb, "path must go through bulb");
  });

  runner.test("VALID: parallel branches both containing bulbs", () => {
    const result = evaluateCircuit(
      makeInput(
        [
          { id: "bat", kind: "battery" },
          { id: "b1", kind: "bulb" },
          { id: "b2", kind: "bulb" },
        ],
        [
          { id: "e1", source: "bat", target: "b1", sourceHandle: "positive", targetHandle: "in" },
          { id: "e2", source: "b1",  target: "bat", sourceHandle: "out",      targetHandle: "negative" },
          { id: "e3", source: "bat", target: "b2", sourceHandle: "positive", targetHandle: "in" },
          { id: "e4", source: "b2",  target: "bat", sourceHandle: "out",      targetHandle: "negative" },
        ]
      )
    );
    assertEqual(result.result, "VALID_CIRCUIT", "result");
  });

  runner.test("VALID: 5-bulb series completes in <16ms", () => {
    const result = evaluateCircuit(
      makeInput(
        [
          { id: "bat", kind: "battery" },
          { id: "b0", kind: "bulb" },
          { id: "b1", kind: "bulb" },
          { id: "b2", kind: "bulb" },
          { id: "b3", kind: "bulb" },
          { id: "b4", kind: "bulb" },
        ],
        [
          { id: "e0", source: "bat", target: "b0", sourceHandle: "positive", targetHandle: "in" },
          { id: "e1", source: "b0",  target: "b1", sourceHandle: "out",      targetHandle: "in" },
          { id: "e2", source: "b1",  target: "b2", sourceHandle: "out",      targetHandle: "in" },
          { id: "e3", source: "b2",  target: "b3", sourceHandle: "out",      targetHandle: "in" },
          { id: "e4", source: "b3",  target: "b4", sourceHandle: "out",      targetHandle: "in" },
          { id: "e5", source: "b4",  target: "bat", sourceHandle: "out",      targetHandle: "negative" },
        ]
      )
    );
    assertEqual(result.result, "VALID_CIRCUIT", "result");
    assertTrue(
      result.computedAt < 16,
      `must complete in <16ms, took ${result.computedAt}ms`
    );
  });
}