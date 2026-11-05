import type { PlayerAction } from "../../levels/schema";

const STEP_ACTION = {
  Move: "move",
  Stop: "stop",
  Turn: "turn",
  "Step back": "step-back",
  Align: "align",
  Listen: "listen",
  Map: "read-map",
  Cross: "cross",
} as const satisfies Record<string, PlayerAction>;

export interface PartATutorialStep {
  readonly name: keyof typeof STEP_ACTION;
  readonly action: PlayerAction;
  readonly instruction: string;
  readonly success: string;
}

function textFences(block: string): string[] {
  const lines: string[] = [];
  for (const match of block.matchAll(/```text\r?\n([\s\S]*?)```/g)) {
    const text = match[1]?.trim() ?? "";
    if (text !== "") {
      lines.push(text);
    }
  }
  return lines;
}

function instructionLine(block: string): string {
  const beforeSuccess = block.split(/^Success:\s*$/m)[0] ?? block;
  const instruction = textFences(beforeSuccess)[0];
  if (instruction === undefined) {
    throw new Error("A Part A step has no instruction line");
  }
  return instruction;
}

function successLine(block: string): string {
  const successAt = block.search(/^Success:\s*$/m);
  if (successAt < 0) {
    throw new Error("A Part A step has no success line");
  }
  const success = textFences(block.slice(successAt))[0];
  if (success === undefined) {
    throw new Error("A Part A step has no success line");
  }
  return success;
}

function sectionBlocks(markdown: string): ReadonlyMap<string, string> {
  const sections = new Map<string, string>();
  for (const part of markdown.split(/^## /m).slice(1)) {
    const end = part.indexOf("\n");
    const title = (end < 0 ? part : part.slice(0, end)).trim();
    sections.set(title, part);
  }
  return sections;
}

function orderNames(markdown: string): string[] {
  const orderStart = markdown.indexOf("The order with the proposal is:");
  if (orderStart < 0) {
    throw new Error("The Part A tutorial text has no step order");
  }
  const names: string[] = [];
  for (const line of markdown.slice(orderStart).split(/\r?\n/)) {
    const match = /^\d+\.\s+(.+)\.\s*$/.exec(line);
    const name = match?.[1];
    if (name !== undefined) {
      names.push(name);
      continue;
    }
    if (names.length > 0 && line.trim() !== "") {
      break;
    }
  }
  if (names.length === 0) {
    throw new Error("The Part A tutorial text has no step order");
  }
  return names;
}

function proposedBlock(proposed: string, name: "Stop" | "Step back" | "Align"): string {
  const label = `${name}:`;
  const at = proposed.indexOf(label);
  if (at < 0) {
    throw new Error(`The Part A tutorial text has no ${name} lines`);
  }
  let end = proposed.length;
  for (const next of ["Stop:", "Step back:", "Align:"]) {
    if (next === label) {
      continue;
    }
    const nextAt = proposed.indexOf(next, at + label.length);
    if (nextAt > at && nextAt < end) {
      end = nextAt;
    }
  }
  return proposed.slice(at, end);
}

/**
 * Read the Part A step order and the player lines from the tutorial text.
 * The order is the numbered list in that file.
 */
export function readPartATutorial(markdown: string): readonly PartATutorialStep[] {
  const sections = sectionBlocks(markdown);
  const proposed = sections.get("Proposed steps");
  if (proposed === undefined) {
    throw new Error("The Part A tutorial text has no proposed steps");
  }
  return orderNames(markdown).map((name) => {
    if (!(name in STEP_ACTION)) {
      throw new Error(`The Part A tutorial text names an unknown step: ${name}`);
    }
    const known = name as keyof typeof STEP_ACTION;
    const action = STEP_ACTION[known];
    if (known === "Stop" || known === "Step back" || known === "Align") {
      const block = proposedBlock(proposed, known);
      return { name: known, action, instruction: instructionLine(block), success: successLine(block) };
    }
    const section = sections.get(known);
    if (section === undefined) {
      throw new Error(`The Part A tutorial text has no ${known} section`);
    }
    return { name: known, action, instruction: instructionLine(section), success: successLine(section) };
  });
}
