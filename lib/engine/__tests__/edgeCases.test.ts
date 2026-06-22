import { evaluateCircuit } from "../evaluator";
import { TestRunner, assertEqual, assertTrue, makeInput } from "./runTests";

export function registerEdgeCaseTests(runner: TestRunner): void {
  runner.test("EDGE: empty circuit returns IDLE", () => {
    const result = evaluateCircuit({ nodes: [], edges: [] });
    assertEqual(result.result, "IDLE", "result");
  });

  runner.test("EDGE: only bulb, no battery returns IDLE", () => {
    const result = evaluateCircuit(
      makeInput(
        [{ id: "b1", kind: "bulb" }],
        []
      )
    );
    assertEqual(result.result, "IDLE", "result");
  });

  runner.test("EDGE: disconnected components are ignored", () => {
    const result = evaluateCircuit(
      makeInput(
        [
          { id: "bat", kind: "battery" },
          { id: "bulb", kind: "bulb" },
          { id: "sw", kind: "switch", isOpen: true },
        ],
        [
          { id: "e1", source: "bat",  target: "bulb", sourceHandle: "positive", targetHandle: "in" },
          { id: "e2", source: "bulb", target: "bat",  sourceHandle: "out",      targetHandle: "negative" },
        ]
      )
    );
    assertEqual(result.result, "VALID_CIRCUIT", "result");
  });

  runner.test("EDGE: self-loop on switch doesn't crash", () => {
    const result = evaluateCircuit(
      makeInput(
        [
          { id: "bat", kind: "battery" },
          { id: "sw", kind: "switch", isOpen: false },
        ],
        [
          { id: "eLoop", source: "sw",  target: "sw",  sourceHandle: "in", targetHandle: "out" },
          { id: "e1",    source: "bat", target: "sw",  sourceHandle: "positive", targetHandle: "in" },
          { id: "e2",    source: "sw",  target: "bat", sourceHandle: "out",      targetHandle: "negative" },
        ]
      )
    );
    assertEqual(result.result, "SHORT_CIRCUIT", "self-loop counts as short");
  });

  runner.test("EDGE: deterministic — same input always same output", () => {
    const input = makeInput(
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
    );

    const result1 = evaluateCircuit(input);
    const result2 = evaluateCircuit(input);
    const result3 = evaluateCircuit(input);

    assertEqual(result1.result, result2.result, "run 1 vs 2");
    assertEqual(result2.result, result3.result, "run 2 vs 3");
    assertTrue(
      result1.activeEdgeIds.length === result2.activeEdgeIds.length,
      "active edges deterministic"
    );
  });

  runner.test("EDGE: 1000 simulations average under 5ms each", () => {
    const input = makeInput(
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
    );

    const start = Date.now();
    for (let i = 0; i < 1000; i++) {
      evaluateCircuit(input);
    }
    const elapsed = Date.now() - start;
    const avgMs = elapsed / 1000;

    assertTrue(
      avgMs < 5,
      `avg per simulation must be <5ms, was ${avgMs.toFixed(3)}ms`
    );
    console.log(`    \x1b[90m(perf: ${avgMs.toFixed(3)}ms/simulation)\x1b[0m`);
  });
}