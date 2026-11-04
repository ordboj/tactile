import { describe, expect, it } from "vitest";
import { assertMission1, mission1 } from "./mission1";
import { validateLevel, type LevelData } from "./schema";

const BANNED_PLAYER_TEXT = [
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
] as const;

function collectStrings(value: unknown, out: string[]): void {
  if (typeof value === "string") {
    out.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      collectStrings(item, out);
    }
    return;
  }
  if (typeof value === "object" && value !== null) {
    for (const nested of Object.values(value)) {
      collectStrings(nested, out);
    }
  }
}

function cloneLevel(): LevelData {
  return structuredClone(mission1);
}

describe("mission 1 data", () => {
  it("matches the schema", () => {
    expect(validateLevel(mission1)).toEqual(mission1);
    expect(() => assertMission1(mission1)).not.toThrow();
  });

  it("keeps Part A free of cars, lights and failure", () => {
    const partA = mission1.parts[0];
    expect(partA).toBeDefined();
    if (partA === undefined) {
      return;
    }
    expect(partA.id).toBe("A");
    expect(partA.cars).toHaveLength(0);
    expect(partA.trafficLight).toBeNull();
    expect(partA.failureEnabled).toBe(false);
  });

  it("gives Part B one car on a one-way single-lane road", () => {
    const partB = mission1.parts[1];
    expect(partB).toBeDefined();
    if (partB === undefined) {
      return;
    }
    expect(partB.id).toBe("B");
    expect(partB.cars).toHaveLength(1);
    expect(partB.trafficLight).toBeNull();
    expect(partB.failureEnabled).toBe(true);
    expect(partB.road.direction).toBe("one-way");
    expect(partB.road.lanes).toBe(1);
    expect(partB.road.axis).toBe("horizontal");
    const car = partB.cars[0];
    expect(car).toBeDefined();
    if (car === undefined) {
      return;
    }
    expect(car.heading).toEqual({ x: 1, y: 0 });
    expect(car.start.x).toBeLessThan(partB.crosswalk.from.x - partB.crosswalk.width / 2);
  });

  it("uses the same road shape in both parts", () => {
    expect(mission1.parts[0]?.road).toEqual(mission1.parts[1]?.road);
    expect(mission1.parts[0]?.crosswalk).toEqual(mission1.parts[1]?.crosswalk);
    expect(mission1.parts[0]?.map.visible).toBe(true);
    expect(mission1.parts[1]?.map.visible).toBe(true);
  });

  it("shows the required notice", () => {
    expect(mission1.notice).toBe("This is a game. Follow local traffic rules.");
  });

  it("has no save-data fields", () => {
    const withScore = cloneLevel() as LevelData & { highScore?: number };
    withScore.highScore = 10;
    expect(() => validateLevel(withScore)).toThrow(/save-data field/);

    const nested = cloneLevel();
    const partB = nested.parts[1];
    if (partB === undefined) {
      throw new Error("missing part B");
    }
    (partB as { save?: boolean }).save = true;
    expect(() => validateLevel(nested)).toThrow(/save-data field/);
  });

  it("rejects a traffic light", () => {
    const level = cloneLevel();
    const partA = level.parts[0];
    if (partA === undefined) {
      throw new Error("missing part A");
    }
    (partA as { trafficLight: unknown }).trafficLight = { color: "red" };
    expect(() => validateLevel(level)).toThrow(/trafficLight/);
  });

  it("rejects a second car in Part B", () => {
    const level = cloneLevel();
    const partB = level.parts[1];
    if (partB === undefined || partB.cars[0] === undefined) {
      throw new Error("missing car");
    }
    const extra = { ...partB.cars[0], id: "car-2" };
    (partB as unknown as { cars: unknown[] }).cars = [...partB.cars, extra];
    const validated = validateLevel(level);
    expect(() => assertMission1(validated)).toThrow(/one car/);
  });

  it("round-trips through JSON", () => {
    const parsed: unknown = JSON.parse(JSON.stringify(mission1));
    expect(validateLevel(parsed)).toEqual(mission1);
  });

  it("keeps player text free of banned words", () => {
    const strings: string[] = [];
    collectStrings(mission1, strings);
    expect(strings.length).toBeGreaterThan(0);
    for (const text of strings) {
      const lower = text.toLowerCase();
      for (const banned of BANNED_PLAYER_TEXT) {
        const pattern = new RegExp(`\\b${banned.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
        expect(pattern.test(lower), `${text} contains ${banned}`).toBe(false);
      }
    }
  });
});
