import { evaluateCircuit } from "../evaluator";
import { TestRunner, assertEqual, assertTrue, makeInput } from "./runTests";

export function registerShortCircuitTests(runner: TestRunner): void {
  runner.test("SHORT: direct wire from battery+ to battery-", () => {
    const result = evaluateCircuit(
      makeInput(
        [{ id: "bat", kind: "battery" }],
        [
          { id: "e1", source: "bat", target: "bat", sourceHandle: "positive", targetHandle: "negative" },
        ]
      )
    );
    assertEqual(result.result, "SHORT_CIRCUIT", "result");
    assertTrue(result.message.includes("short circuit"), "message should mention short circuit");
  });

  runner.test("SHORT: wire through closed switch (no bulb)", () => {
    const result = evaluateCircuit(
      makeInput(
        [
          { id: "bat", kind: "battery" },
          { id: "sw", kind: "switch", isOpen: false },
        ],
        [
          { id: "e1", source: "bat", target: "sw", sourceHandle: "positive", targetHandle: "in" },
          { id: "e2", source: "sw",  target: "bat", sourceHandle: "out",      targetHandle: "negative" },
        ]
      )
    );
    assertEqual(result.result, "SHORT_CIRCUIT", "result");
  });

  runner.test("SHORT: parallel branch exists without bulb (short wins over valid)", () => {
    const result = evaluateCircuit(
      makeInput(
        [
          { id: "bat", kind: "battery" },
          { id: "bulb", kind: "bulb" },
        ],
        [
          { id: "e1", source: "bat",  target: "bulb", sourceHandle: "positive", targetHandle: "in" },
          { id: "e2", source: "bulb", target: "bat",  sourceHandle: "out",      targetHandle: "negative" },
          { id: "e3", source: "bat",  target: "bat",  sourceHandle: "positive", targetHandle: "negative" },
        ]
      )
    );
    assertEqual(result.result, "SHORT_CIRCUIT", "short must override valid");
  });

  runner.test("SHORT: short path detected even with open switch in series", () => {
    const result = evaluateCircuit(
      makeInput(
        [
          { id: "bat", kind: "battery" },
          { id: "sw", kind: "switch", isOpen: true },
          { id: "bulb", kind: "bulb" },
        ],
        [
          { id: "e1", source: "bat",  target: "bulb", sourceHandle: "positive", targetHandle: "in" },
          { id: "e2", source: "bulb", target: "sw",   sourceHandle: "out",      targetHandle: "in" },
          { id: "e3", source: "sw",   target: "bat",  sourceHandle: "out",      targetHandle: "negative" },
          { id: "e4", source: "bat",  target: "bat",  sourceHandle: "positive", targetHandle: "negative" },
        ]
      )
    );
    assertEqual(result.result, "SHORT_CIRCUIT", "result");
  });
}