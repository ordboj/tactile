import {
  validateLevel,
  type CarData,
  type CrosswalkData,
  type LevelData,
  type PartData,
  type RoadData,
  type TactileMapData,
  type TutorialStepData,
} from "./schema";

const NOTICE = "This is a game. Follow local traffic rules.";

const road: RoadData = {
  direction: "one-way",
  lanes: 1,
  axis: "horizontal",
  from: { x: 0, y: 300 },
  to: { x: 800, y: 300 },
  width: 80,
};

const crosswalk: CrosswalkData = {
  id: "crosswalk-1",
  from: { x: 400, y: 220 },
  to: { x: 400, y: 380 },
  width: 80,
};

const map: TactileMapData = {
  visible: true,
  width: 800,
  height: 600,
  walkerStart: { x: 400, y: 460 },
  goal: { x: 400, y: 140 },
};

const car: CarData = {
  id: "car-1",
  speed: 80,
  start: { x: -40, y: 300 },
  heading: { x: 1, y: 0 },
};

const partASteps: readonly TutorialStepData[] = [
  { id: "move", action: "move", text: "The walker moves." },
  { id: "turn", action: "turn", text: "The walker turns." },
  { id: "listen", action: "listen", text: "The walker listens." },
  { id: "read-map", action: "read-map", text: "The walker reads the tactile map." },
  { id: "cross", action: "cross", text: "The walker crosses the road." },
];

const partBSteps: readonly TutorialStepData[] = [
  { id: "listen", action: "listen", text: "The walker listens for the car." },
  { id: "wait", action: "wait", text: "The walker waits." },
  { id: "cross", action: "cross", text: "The walker crosses after the car has passed." },
];

function makePart(
  id: PartData["id"],
  cars: readonly CarData[],
  failureEnabled: boolean,
  steps: readonly TutorialStepData[],
): PartData {
  return {
    id,
    cars,
    trafficLight: null,
    road,
    crosswalk,
    map,
    failureEnabled,
    steps,
  };
}

const raw: LevelData = {
  id: "mission-1",
  notice: NOTICE,
  parts: [
    makePart("A", [], false, partASteps),
    makePart("B", [car], true, partBSteps),
  ],
};

export const mission1: LevelData = validateLevel(raw);

export function assertMission1(level: LevelData): void {
  if (level.id !== "mission-1") {
    throw new Error("Mission 1 id must be mission-1");
  }
  if (level.notice !== NOTICE) {
    throw new Error("Mission 1 notice text is wrong");
  }
  if (level.parts.length !== 2) {
    throw new Error("Mission 1 must have two parts");
  }
  const partA = level.parts[0];
  const partB = level.parts[1];
  if (partA === undefined || partB === undefined) {
    throw new Error("Mission 1 must have two parts");
  }
  if (partA.id !== "A" || partB.id !== "B") {
    throw new Error("Mission 1 parts must be A then B");
  }
  if (partA.cars.length !== 0 || partA.trafficLight !== null || partA.failureEnabled) {
    throw new Error("Part A must have no car, no traffic light and no failure");
  }
  if (partB.cars.length !== 1 || partB.trafficLight !== null || !partB.failureEnabled) {
    throw new Error("Part B must have one car, no traffic light and failure on");
  }
  for (const part of level.parts) {
    if (part.road.direction !== "one-way" || part.road.lanes !== 1) {
      throw new Error("The road must be one-way with one lane");
    }
    if (part.road.axis !== "horizontal") {
      throw new Error("The Mission 1 road must be horizontal");
    }
    if (!part.map.visible) {
      throw new Error("The tactile map must be visible");
    }
  }
}

assertMission1(mission1);
