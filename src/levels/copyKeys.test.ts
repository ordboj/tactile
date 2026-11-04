import { describe, expect, it } from "vitest";
import cueText from "../../docs/design/sound-cue-visuals.md?raw";
import tutorialText from "../../docs/learning/part-a-tutorial-text.md?raw";
import { CONTROL_ACTIONS, controlLabel } from "../scenes/controlLabels";
import { PART_A_STEP_SPECS } from "../game/tutorial/PartAFlow";
import { mission1 } from "./mission1";
import { playerLine, playerLineRow, playerLineSource } from "./playerCopy";

const BANNED = [
  "blindness",
  "visually impaired",
  "experience what it is like",
  "simulation",
  "simulate",
  "disability",
  "awareness",
  "braille",
  "blind",
  "cane",
];

describe("copy keys", () => {
  it("resolves mission, tutorial, and cue keys to designer lines", () => {
    const keys = new Set<string>([
      ...mission1.parts.flatMap((part) => part.steps.flatMap((step) => step.copyKeys)),
      ...PART_A_STEP_SPECS.flatMap((step) => [step.instructionKey, step.successKey]),
      "place-sound.1",
      "car-sound.1",
      "road-pulse.1",
      "cross.5",
      "part-b-feedback-lines.safe-wait.2",
      "part-b-feedback-lines.safe-wait.3",
      "part-b-feedback-lines.safe-cross.1",
    ]);
    expect(keys.size).toBeGreaterThan(10);
    for (const key of keys) {
      const line = key === "car-sound.1" ? playerLineRow(key, 0) : playerLine(key);
      const source = playerLineSource(key) === "tutorial" ? tutorialText : cueText;
      expect(source).toContain(line);
      const lower = line.toLowerCase();
      for (const banned of BANNED) {
        const pattern = new RegExp(`\\b${banned.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
        expect(pattern.test(lower), `${key} contains ${banned}`).toBe(false);
      }
    }
    expect(playerLineRow("car-sound.1", 1)).toBe("Left. Far.");
    expect(playerLine("place-sound.1")).toBe("Place sound.");
  });

  it("takes control labels from the designer text", () => {
    for (const action of CONTROL_ACTIONS) {
      const label = controlLabel(action);
      expect(tutorialText).toContain(label);
      expect(label.length).toBeGreaterThan(1);
    }
  });
});
