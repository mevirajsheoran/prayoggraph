import { evaluateCircuit } from "../evaluator";
import { TestRunner, assertEqual, makeInput } from "./runTests";

export function registerOpenCircuitTests(runner: TestRunner): void {
  runner.test("OPEN: open switch breaks the circuit", () => {
    const result = evaluateCircuit(
      makeInput(
        [
          { id: "bat", kind: "battery" },
          { id: "sw", kind: "switch", isOpen: true },
          { id: "bulb", kind: "bulb" },
        ],
        [
          { id: "e1", source: "bat",  target: "sw",   sourceHandle: "positive", targetHandle: "in" },
          { id: "e2", source: "sw",   target: "bulb", sourceHandle: "out",      targetHandle: "in" },
          { id: "e3", source: "bulb", target: "bat",  sourceHandle: "out",      targetHandle: "negative" },
        ]
      )
    );
    assertEqual(result.result, "OPEN_CIRCUIT", "result");
  });

  runner.test("OPEN: missing wire (bulb disconnected)", () => {
    const result = evaluateCircuit(
      makeInput(
        [
          { id: "bat", kind: "battery" },
          { id: "bulb", kind: "bulb" },
        ],
        [
          { id: "e1", source: "bat", target: "bulb", sourceHandle: "positive", targetHandle: "in" },
        ]
      )
    );
    assertEqual(result.result, "OPEN_CIRCUIT", "result");
  });

  runner.test("OPEN: floating bulb (no wires at all)", () => {
    const result = evaluateCircuit(
      makeInput(
        [
          { id: "bat", kind: "battery" },
          { id: "bulb", kind: "bulb" },
        ],
        []
      )
    );
    assertEqual(result.result, "OPEN_CIRCUIT", "result");
  });

  runner.test("OPEN: battery with only one terminal connected", () => {
    const result = evaluateCircuit(
      makeInput(
        [
          { id: "bat", kind: "battery" },
          { id: "bulb", kind: "bulb" },
        ],
        [
          { id: "e1", source: "bat", target: "bulb", sourceHandle: "positive", targetHandle: "in" },
        ]
      )
    );
    assertEqual(result.result, "OPEN_CIRCUIT", "result");
  });
}