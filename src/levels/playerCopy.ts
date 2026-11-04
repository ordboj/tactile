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

export function playerLine(copyKey: string): string {
  const line = playerLines.get(copyKey);
  if (line === undefined) {
    throw new Error(`Missing player line for ${copyKey}`);
  }
  return line;
}

export function playerLineKeys(): readonly string[] {
  return [...playerLines.keys()];
}
