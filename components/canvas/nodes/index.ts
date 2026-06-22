import type { NodeTypes } from "reactflow";
import { BatteryNode } from "./BatteryNode";
import { BulbNode } from "./BulbNode";
import { SwitchNode } from "./SwitchNode";
import { LockedNode } from "./LockedNode";

/**
 * Registry mapping React Flow node `type` strings to components.
 *
 * The `type` field on each node must match one of these keys.
 * For our 3-component MVP:
 *   - "battery"  → BatteryNode
 *   - "bulb"     → BulbNode
 *   - "switch"   → SwitchNode
 *   - "locked"   → LockedNode (for resistor/capacitor/ammeter/voltmeter)
 */
export const nodeTypes: NodeTypes = {
  battery: BatteryNode,
  bulb: BulbNode,
  switch: SwitchNode,
  locked: LockedNode,
};