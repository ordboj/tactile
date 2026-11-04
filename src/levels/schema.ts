export const PLAYER_ACTIONS = [
  "move",
  "stop",
  "turn",
  "listen",
  "step-back",
  "align",
  "wait",
  "cross",
  "read-map",
] as const;

export type PlayerAction = (typeof PLAYER_ACTIONS)[number];

export type PartId = "A" | "B";

export type RoadDirection = "one-way";

export type RoadAxis = "horizontal" | "vertical";

export interface Vec2 {
  readonly x: number;
  readonly y: number;
}

export interface RoadData {
  readonly direction: RoadDirection;
  readonly lanes: number;
  readonly axis: RoadAxis;
  readonly from: Vec2;
  readonly to: Vec2;
  readonly width: number;
}

export interface CarData {
  readonly id: string;
  readonly speed: number;
  readonly start: Vec2;
  readonly heading: Vec2;
}

export interface CrosswalkData {
  readonly id: string;
  readonly from: Vec2;
  readonly to: Vec2;
  readonly width: number;
}

export interface TactileMapData {
  readonly visible: boolean;
  readonly width: number;
  readonly height: number;
  readonly walkerStart: Vec2;
  readonly goal: Vec2;
}

export interface TutorialStepData {
  readonly id: string;
  readonly action: PlayerAction;
  readonly copyKeys: readonly string[];
}

export interface PartData {
  readonly id: PartId;
  readonly cars: readonly CarData[];
  readonly trafficLight: null;
  readonly road: RoadData;
  readonly crosswalk: CrosswalkData;
  readonly map: TactileMapData;
  readonly failureEnabled: boolean;
  readonly steps: readonly TutorialStepData[];
}

/**
 * Level data for one mission.
 * The score is not in this object.
 * The score exists only for the current session.
 */
export interface LevelData {
  readonly id: string;
  readonly notice: string;
  readonly parts: readonly PartData[];
}

export const SAVE_DATA_KEYS: readonly string[] = [
  "save",
  "savedata",
  "savedscore",
  "highscore",
  "bestscore",
  "localstorage",
  "sessionstorage",
  "profile",
  "persist",
  "persistence",
  "checkpoint",
];

const SAVE_DATA_KEY_SET = new Set(SAVE_DATA_KEYS);

const LEVEL_KEYS = ["id", "notice", "parts"] as const;
const PART_KEYS = [
  "id",
  "cars",
  "trafficLight",
  "road",
  "crosswalk",
  "map",
  "failureEnabled",
  "steps",
] as const;
const ROAD_KEYS = ["direction", "lanes", "axis", "from", "to", "width"] as const;
const CAR_KEYS = ["id", "speed", "start", "heading"] as const;
const CROSSWALK_KEYS = ["id", "from", "to", "width"] as const;
const MAP_KEYS = ["visible", "width", "height", "walkerStart", "goal"] as const;
const STEP_KEYS = ["id", "action", "copyKeys"] as const;
const VEC_KEYS = ["x", "y"] as const;

const PART_IDS: readonly PartId[] = ["A", "B"];
const ROAD_AXES: readonly RoadAxis[] = ["horizontal", "vertical"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertAllowedKeys(
  value: Record<string, unknown>,
  allowed: readonly string[],
  path: string,
): void {
  for (const key of Object.keys(value)) {
    if (SAVE_DATA_KEY_SET.has(key.toLowerCase())) {
      throw new Error(`${path}.${key} is a save-data field`);
    }
    if (!allowed.includes(key)) {
      throw new Error(`${path}.${key} is not a level-data field`);
    }
  }
}

function readString(value: unknown, path: string): string {
  if (typeof value !== "string" || value.trim() === "" || value !== value.trim()) {
    throw new Error(`${path} must be a non-empty string`);
  }
  return value;
}

function readFinite(value: unknown, path: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${path} must be a finite number`);
  }
  return value;
}

function readPositive(value: unknown, path: string): number {
  const number = readFinite(value, path);
  if (number <= 0) {
    throw new Error(`${path} must be > 0`);
  }
  return number;
}

function readVec(value: unknown, path: string): Vec2 {
  if (!isRecord(value)) {
    throw new Error(`${path} must be a point`);
  }
  assertAllowedKeys(value, VEC_KEYS, path);
  return {
    x: readFinite(value.x, `${path}.x`),
    y: readFinite(value.y, `${path}.y`),
  };
}

function readHeading(value: unknown, path: string, axis: RoadAxis): Vec2 {
  const heading = readVec(value, path);
  const length = Math.hypot(heading.x, heading.y);
  if (Math.abs(length - 1) > 1e-6) {
    throw new Error(`${path} must be a unit vector`);
  }
  if (axis === "horizontal" && Math.abs(heading.y) > 1e-6) {
    throw new Error(`${path} must follow the road axis`);
  }
  if (axis === "vertical" && Math.abs(heading.x) > 1e-6) {
    throw new Error(`${path} must follow the road axis`);
  }
  return heading;
}

function readRoad(value: unknown, path: string): RoadData {
  if (!isRecord(value)) {
    throw new Error(`${path} must be a road`);
  }
  assertAllowedKeys(value, ROAD_KEYS, path);
  if (value.direction !== "one-way") {
    throw new Error(`${path}.direction must be one-way`);
  }
  if (value.lanes !== 1) {
    throw new Error(`${path}.lanes must be 1`);
  }
  if (!ROAD_AXES.includes(value.axis as RoadAxis)) {
    throw new Error(`${path}.axis must be horizontal or vertical`);
  }
  const axis = value.axis as RoadAxis;
  return {
    direction: "one-way",
    lanes: 1,
    axis,
    from: readVec(value.from, `${path}.from`),
    to: readVec(value.to, `${path}.to`),
    width: readPositive(value.width, `${path}.width`),
  };
}

function readCar(value: unknown, path: string, axis: RoadAxis): CarData {
  if (!isRecord(value)) {
    throw new Error(`${path} must be a car`);
  }
  assertAllowedKeys(value, CAR_KEYS, path);
  return {
    id: readString(value.id, `${path}.id`),
    speed: readPositive(value.speed, `${path}.speed`),
    start: readVec(value.start, `${path}.start`),
    heading: readHeading(value.heading, `${path}.heading`, axis),
  };
}

function readCrosswalk(value: unknown, path: string): CrosswalkData {
  if (!isRecord(value)) {
    throw new Error(`${path} must be a crosswalk`);
  }
  assertAllowedKeys(value, CROSSWALK_KEYS, path);
  return {
    id: readString(value.id, `${path}.id`),
    from: readVec(value.from, `${path}.from`),
    to: readVec(value.to, `${path}.to`),
    width: readPositive(value.width, `${path}.width`),
  };
}

function readMap(value: unknown, path: string): TactileMapData {
  if (!isRecord(value)) {
    throw new Error(`${path} must be tactile map data`);
  }
  assertAllowedKeys(value, MAP_KEYS, path);
  if (typeof value.visible !== "boolean") {
    throw new Error(`${path}.visible must be a boolean`);
  }
  return {
    visible: value.visible,
    width: readPositive(value.width, `${path}.width`),
    height: readPositive(value.height, `${path}.height`),
    walkerStart: readVec(value.walkerStart, `${path}.walkerStart`),
    goal: readVec(value.goal, `${path}.goal`),
  };
}

function readCopyKeys(value: unknown, path: string): readonly string[] {
  if (!Array.isArray(value) || value.length < 1) {
    throw new Error(`${path} must be a non-empty list`);
  }
  return value.map((item, index) => {
    if (typeof item !== "string" || !/^[a-z0-9-]+(?:\.[a-z0-9-]+)+$/.test(item)) {
      throw new Error(`${path}[${index}] must be a copy key`);
    }
    return item;
  });
}

function readStep(value: unknown, path: string): TutorialStepData {
  if (!isRecord(value)) {
    throw new Error(`${path} must be a step`);
  }
  assertAllowedKeys(value, STEP_KEYS, path);
  if (!PLAYER_ACTIONS.includes(value.action as PlayerAction)) {
    throw new Error(`${path}.action is not a player action`);
  }
  return {
    id: readString(value.id, `${path}.id`),
    action: value.action as PlayerAction,
    copyKeys: readCopyKeys(value.copyKeys, `${path}.copyKeys`),
  };
}

function readPart(value: unknown, path: string): PartData {
  if (!isRecord(value)) {
    throw new Error(`${path} must be a part`);
  }
  assertAllowedKeys(value, PART_KEYS, path);
  if (!PART_IDS.includes(value.id as PartId)) {
    throw new Error(`${path}.id must be A or B`);
  }
  if (value.trafficLight !== null) {
    throw new Error(`${path}.trafficLight must be null`);
  }
  if (typeof value.failureEnabled !== "boolean") {
    throw new Error(`${path}.failureEnabled must be a boolean`);
  }
  if (!Array.isArray(value.cars)) {
    throw new Error(`${path}.cars must be a list`);
  }
  if (!Array.isArray(value.steps)) {
    throw new Error(`${path}.steps must be a list`);
  }
  const road = readRoad(value.road, `${path}.road`);
  return {
    id: value.id as PartId,
    cars: value.cars.map((car, index) => readCar(car, `${path}.cars[${index}]`, road.axis)),
    trafficLight: null,
    road,
    crosswalk: readCrosswalk(value.crosswalk, `${path}.crosswalk`),
    map: readMap(value.map, `${path}.map`),
    failureEnabled: value.failureEnabled,
    steps: value.steps.map((step, index) => readStep(step, `${path}.steps[${index}]`)),
  };
}

export function validateLevel(value: unknown): LevelData {
  if (!isRecord(value)) {
    throw new Error("level must be an object");
  }
  assertAllowedKeys(value, LEVEL_KEYS, "level");
  if (!Array.isArray(value.parts) || value.parts.length < 1) {
    throw new Error("level.parts must be a non-empty list");
  }
  const parts = value.parts.map((part, index) => readPart(part, `level.parts[${index}]`));
  const ids = new Set(parts.map((part) => part.id));
  if (ids.size !== parts.length) {
    throw new Error("level.parts has a duplicate id");
  }
  return {
    id: readString(value.id, "level.id"),
    notice: readString(value.notice, "level.notice"),
    parts,
  };
}
