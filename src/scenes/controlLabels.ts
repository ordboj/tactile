import tutorialText from "../../docs/learning/part-a-tutorial-text.md?raw";
import { playerLine } from "../levels/playerCopy";
import type { PlayerAction } from "../levels/schema";

const PRESS_KEY: Partial<Record<PlayerAction, string>> = {
  move: "move.1",
  stop: "proposed-steps.1",
  turn: "turn.1",
  "step-back": "proposed-steps.3",
  align: "proposed-steps.5",
  listen: "listen.1",
  cross: "cross.1",
};

function lineWord(pattern: RegExp, source: string): string {
  const found = pattern.exec(source);
  const word = found?.[0];
  if (word === undefined) {
    throw new Error("A control name is missing from the designer text");
  }
  return word;
}

export function controlLabel(action: PlayerAction): string {
  const key = PRESS_KEY[action];
  if (key !== undefined) {
    const named = /^A press on ([A-Z][A-Za-z]*)\b/.exec(playerLine(key));
    const label = named?.[1];
    if (label === undefined) {
      throw new Error(`A control name is missing from ${key}`);
    }
    return label;
  }
  if (action === "read-map") {
    return lineWord(/^## Map$/m, tutorialText).replace(/^##\s*/, "");
  }
  if (action === "wait") {
    return lineWord(/\bWait\b/, tutorialText);
  }
  throw new Error(`No control label for ${action}`);
}

export const CONTROL_ACTIONS: readonly PlayerAction[] = [
  "move",
  "stop",
  "turn",
  "step-back",
  "align",
  "listen",
  "read-map",
  "wait",
  "cross",
];

export const CONTROL_MIN_PX = 56;
