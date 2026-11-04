import type { PartData, PlayerAction } from "../../levels/schema";
import { playerLine } from "../../levels/playerCopy";
import { GameEvents, type GameEvent } from "../contracts";

export interface PartAStepSpec {
  readonly action: PlayerAction;
  readonly instructionKey: string;
  readonly successKey: string;
}

/**
 * Spec order for Part A.
 * Stop, step back, and align wait for OQ-13.
 * Wait stays in Part B.
 * Each step shows the instruction key. The success key is the outcome line.
 */
export const PART_A_STEP_SPECS: readonly PartAStepSpec[] = [
  { action: "move", instructionKey: "move.1", successKey: "move.2" },
  { action: "turn", instructionKey: "turn.1", successKey: "turn.3" },
  { action: "listen", instructionKey: "listen.1", successKey: "listen.2" },
  { action: "read-map", instructionKey: "map.1", successKey: "map.4" },
  { action: "cross", instructionKey: "cross.1", successKey: "cross.3" },
];

export interface PartAResult {
  readonly accepted: boolean;
  readonly completed: boolean;
  readonly instructionKey: string | null;
  readonly successKey: string | null;
  readonly events: readonly GameEvent[];
}

export class PartAFlow {
  private index = 0;
  private done = false;

  public constructor(part: PartData) {
    if (part.id !== "A") {
      throw new Error("Part A flow needs part A");
    }
    if (part.cars.length !== 0) {
      throw new Error("Part A has no car");
    }
    if (part.trafficLight !== null) {
      throw new Error("Part A has no traffic light");
    }
    if (part.failureEnabled) {
      throw new Error("The failure flow never starts in Part A");
    }
    if (part.steps.some((step) => step.action === "wait")) {
      throw new Error("Wait is in Part B");
    }
    if (part.steps.length !== PART_A_STEP_SPECS.length) {
      throw new Error("Part A step count does not match the spec order");
    }
    part.steps.forEach((step, index) => {
      const spec = PART_A_STEP_SPECS[index];
      if (spec === undefined || step.action !== spec.action) {
        throw new Error("Part A step order does not match the spec order");
      }
      if (!step.copyKeys.includes(spec.instructionKey) || !step.copyKeys.includes(spec.successKey)) {
        throw new Error(`Part A step ${step.id} is missing a copy key`);
      }
    });
  }

  public get completed(): boolean {
    return this.done;
  }

  public get instructionKey(): string | null {
    if (this.done) {
      return null;
    }
    return PART_A_STEP_SPECS[this.index]?.instructionKey ?? null;
  }

  public instructionText(): string | null {
    const key = this.instructionKey;
    if (key === null) {
      return null;
    }
    return playerLine(key);
  }

  public tryAction(action: PlayerAction): PartAResult {
    if (this.done) {
      return { accepted: false, completed: true, instructionKey: null, successKey: null, events: [] };
    }
    const spec = PART_A_STEP_SPECS[this.index];
    if (spec === undefined) {
      throw new Error("Part A step is missing");
    }
    if (action !== spec.action) {
      return {
        accepted: false,
        completed: false,
        instructionKey: spec.instructionKey,
        successKey: null,
        events: [],
      };
    }
    const events: GameEvent[] = [{ type: GameEvents.text, text: playerLine(spec.successKey) }];
    this.index += 1;
    if (this.index >= PART_A_STEP_SPECS.length) {
      this.done = true;
      events.push({ type: GameEvents.partComplete, partId: "A" });
    }
    const next = this.done ? null : (PART_A_STEP_SPECS[this.index]?.instructionKey ?? null);
    return {
      accepted: true,
      completed: this.done,
      instructionKey: next,
      successKey: spec.successKey,
      events,
    };
  }
}
