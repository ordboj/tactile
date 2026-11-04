import { describe, expect, it } from "vitest";
import { WALKER_BODY_CSS_PX, walkerImageCssSize } from "../Walker";
import { CAR_SHAPE, MAP_CAR_PX, SCENE_CAR_PX, advanceCar, carSilhouette, createCarState, crosswalkInterval } from "./Car";
import { mission1 } from "../../levels/mission1";

describe("car", () => {
  it("is one box in one direction and a different silhouette from the walker", () => {
    const part = mission1.parts[1];
    const data = part?.cars[0];
    if (part === undefined || data === undefined) {
      throw new Error("missing car");
    }
    const interval = crosswalkInterval(part.crosswalk);
    const start = createCarState(data, interval);
    expect(start.passedCrosswalk).toBe(false);
    expect(start.heading).toEqual({ x: 1, y: 0 });
    const moved = advanceCar(start, 10, interval.maxX);
    expect(moved.heading).toEqual(start.heading);
    expect(moved.position.y).toBe(start.position.y);
    expect(moved.position.x).toBeGreaterThan(start.position.x);
    expect(CAR_SHAPE).toBe("box");
    expect(carSilhouette(SCENE_CAR_PX.width, SCENE_CAR_PX.height)).toBe("wide-box");
    expect(carSilhouette(walkerImageCssSize("scene").width, walkerImageCssSize("scene").height)).toBe("tall-drop");
    expect(MAP_CAR_PX.width).toBeGreaterThan(WALKER_BODY_CSS_PX.map);
    expect(SCENE_CAR_PX.width).toBeGreaterThan(SCENE_CAR_PX.height);
  });
});
