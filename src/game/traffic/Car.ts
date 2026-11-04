import type { CarData, CrosswalkData, Vec2 } from "../../levels/schema";
import type { CarState } from "../contracts";
import { stepCar } from "../traffic";

export const CAR_SHAPE = "box" as const;

export const CAR_FILL = "#F4F7FA";

export const CAR_OUTLINE = "#14110E";

/** Scene size from docs/design/walker.md. Wider than it is tall. */
export const SCENE_CAR_PX = { width: 120, height: 56 } as const;

/** Map size from docs/design/walker.md. Wider than the map walker. */
export const MAP_CAR_PX = { width: 72, height: 32 } as const;

export interface CrosswalkInterval {
  readonly minX: number;
  readonly maxX: number;
}

export function crosswalkInterval(crosswalk: CrosswalkData): CrosswalkInterval {
  const half = crosswalk.width / 2;
  return {
    minX: Math.min(crosswalk.from.x, crosswalk.to.x) - half,
    maxX: Math.max(crosswalk.from.x, crosswalk.to.x) + half,
  };
}

export function createCarState(data: CarData, interval: CrosswalkInterval): CarState {
  return markPassed(
    {
      id: data.id,
      position: { ...data.start },
      heading: { ...data.heading },
      speed: data.speed,
      passedCrosswalk: false,
    },
    interval.maxX,
  );
}

export function markPassed(car: CarState, crosswalkMaxX: number): CarState {
  return {
    ...car,
    passedCrosswalk: car.position.x >= crosswalkMaxX,
  };
}

export function advanceCar(car: CarState, steps: number, crosswalkMaxX: number): CarState {
  let next = car;
  for (let index = 0; index < steps; index += 1) {
    next = stepCar(next);
  }
  return markPassed(next, crosswalkMaxX);
}

export function carSilhouette(width: number, height: number): "wide-box" | "tall-drop" {
  if (width > height) {
    return "wide-box";
  }
  return "tall-drop";
}

export function sameDirection(heading: Vec2, next: Vec2): boolean {
  return heading.x === next.x && heading.y === next.y;
}
