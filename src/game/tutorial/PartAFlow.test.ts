import { describe, expect, it } from "vitest";
import tutorialText from "../../../docs/learning/part-a-tutorial-text.md?raw";
import { mission1 } from "../../levels/mission1";
import { playerLine } from "../../levels/playerCopy";
import type { PlayerAction } from "../../levels/schema";
import { GameEvents } from "../contracts";
import { PART_A_STEP_SPECS, PartAFlow } from "./PartAFlow";

const partA = mission1.parts[0];

if (partA === undefined) {
  throw new Error("missing part A");
}

describe("part A flow", () => {
  it("teaches the lead order and shows one instruction from the text doc", () => {
    expect(PART_A_STEP_SPECS.map((step) => step.action)).toEqual([
      "move",
      "stop",
      "turn",
      "step-back",
      "align",
      "listen",
      "read-map",
      "cross",
    ]);
    expect(PART_A_STEP_SPECS.some((step) => step.action === "wait")).toBe(false);
    const flow = new PartAFlow(partA);
    for (const spec of PART_A_STEP_SPECS) {
      const line = flow.instructionText();
      expect(line).toBe(playerLine(spec.instructionKey));
      expect(line?.includes("\n")).toBe(false);
      expect(tutorialText).toContain(line);
      const wrong = flow.tryAction(spec.action === "move" ? "wait" : "move");
      expect(wrong.accepted).toBe(false);
      expect(wrong.events).toEqual([]);
      const result = flow.tryAction(spec.action);
      expect(result.accepted).toBe(true);
      expect(result.events.some((event) => event.type === GameEvents.failure)).toBe(false);
      expect(result.events.some((event) => event.type === "freeze")).toBe(false);
    }
    expect(flow.completed).toBe(true);
    expect(flow.instructionText()).toBeNull();
  });

  it("ends after one cross and never starts the failure flow", () => {
    const flow = new PartAFlow(partA);
    const actions: PlayerAction[] = [
      "move",
      "stop",
      "turn",
      "step-back",
      "align",
      "listen",
      "read-map",
      "cross",
    ];
    let sawPart = false;
    for (const action of actions) {
      const result = flow.tryAction(action);
      expect(result.events.map((event) => event.type)).not.toContain("failure");
      if (result.events.some((event) => event.type === GameEvents.partComplete)) {
        sawPart = true;
        expect(result.completed).toBe(true);
        expect(result.events).toContainEqual({ type: GameEvents.partComplete, partId: "A" });
        expect(result.events.some((event) => event.type === GameEvents.missionComplete)).toBe(false);
      }
    }
    expect(sawPart).toBe(true);
    expect(flow.tryAction("cross").events).toEqual([]);
  });

  it("rejects a car, a traffic light, failure, and wait", () => {
    expect(() => new PartAFlow({ ...partA, cars: mission1.parts[1]?.cars ?? [] })).toThrow(/no car/);
    expect(() => new PartAFlow({ ...partA, failureEnabled: true })).toThrow(/failure/);
    expect(() => new PartAFlow({ ...partA, trafficLight: { color: "red" } as unknown as null })).toThrow(
      /traffic light/,
    );
    const withWait = {
      ...partA,
      steps: partA.steps.map((step, index) =>
        index === 0 ? { ...step, action: "wait" as const } : step,
      ),
    };
    expect(() => new PartAFlow(withWait)).toThrow(/Wait/);
  });
});
