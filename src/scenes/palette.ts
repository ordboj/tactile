/** Colors from docs/design/walker.md and docs/design/sound-cue-visuals.md. */
export const PALETTE = {
  walkerFill: "#FFE566",
  ink: "#14110E",
  rim: "#FFF6D8",
  road: "#616C76",
  pavement: "#7A6854",
  mapBoard: "#6D6F62",
  carFill: "#F4F7FA",
  plate: "#FFF6D8",
} as const;

export function cssColorToHex(color: string): number {
  return Number.parseInt(color.slice(1), 16);
}
