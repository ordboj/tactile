import dangerText from "../../docs/audio/danger-sound.md?raw";
import cueText from "../../docs/design/sound-cue-visuals.md?raw";
import tutorialText from "../../docs/learning/part-a-tutorial-text.md?raw";

function headingSlug(heading: string): string {
  return heading
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function indexPlayerLines(markdown: string): ReadonlyMap<string, string> {
  const index = new Map<string, string>();
  let h2 = "";
  let section = "";
  let count = 0;
  let inTextFence = false;
  const fence: string[] = [];

  for (const line of markdown.split(/\r?\n/)) {
    if (!inTextFence && line.startsWith("## ")) {
      h2 = headingSlug(line.slice(3));
      section = h2;
      count = 0;
      continue;
    }
    if (!inTextFence && line.startsWith("### ")) {
      section = `${h2}.${headingSlug(line.slice(4))}`;
      count = 0;
      continue;
    }
    if (line.startsWith("```")) {
      if (!inTextFence) {
        inTextFence = line === "```text";
        fence.length = 0;
        continue;
      }
      if (inTextFence) {
        count += 1;
        const text = fence.join("\n").trim();
        if (section === "" || text === "") {
          throw new Error("A player line has no section or no text");
        }
        index.set(`${section}.${count}`, text);
      }
      inTextFence = false;
      continue;
    }
    if (inTextFence) {
      fence.push(line);
    }
  }

  if (inTextFence) {
    throw new Error("A player line fence is not closed");
  }
  return index;
}

const playerLines = indexPlayerLines(tutorialText);
const cueLines = indexPlayerLines(cueText);
const dangerLines = indexPlayerLines(dangerText);

export function playerLine(copyKey: string): string {
  const line = playerLines.get(copyKey) ?? cueLines.get(copyKey) ?? dangerLines.get(copyKey);
  if (line === undefined) {
    throw new Error(`Missing player line for ${copyKey}`);
  }
  return line;
}

export function playerLineRow(copyKey: string, row: number): string {
  const lines = playerLine(copyKey).split("\n");
  const line = lines[row];
  if (line === undefined || line.trim() === "") {
    throw new Error(`Missing player line row ${row} for ${copyKey}`);
  }
  return line;
}

export function playerLineSource(copyKey: string): "tutorial" | "cues" | "danger" {
  if (playerLines.has(copyKey)) {
    return "tutorial";
  }
  if (cueLines.has(copyKey)) {
    return "cues";
  }
  if (dangerLines.has(copyKey)) {
    return "danger";
  }
  throw new Error(`Missing player line for ${copyKey}`);
}

export function playerLineKeys(): readonly string[] {
  return [...playerLines.keys()];
}
