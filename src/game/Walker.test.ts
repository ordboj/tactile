import { describe, expect, it } from "vitest";
import { mission1 } from "../levels/mission1";
import {
  WALKER_ASSET,
  WALKER_BODY_CSS_PX,
  WALKER_STEP_BACK_PX,
  Walker,
  assetRotationRad,
  walkerImageCssSize,
} from "./Walker";

const map = mission1.parts[0]?.map;
const crosswalk = mission1.parts[0]?.crosswalk;

if (map === undefined || crosswalk === undefined) {
  throw new Error("Mission 1 is missing the map");
}

function walker(): Walker {
  return new Walker({ ...map.walkerStart }, map);
}

describe("walker", () => {
  it("moves, stops, and turns on the fixed step", () => {
    const body = walker();
    const start = body.positionNow;
    body.move();
    body.advance(2);
    expect(body.positionNow.y).toBeCloseTo(start.y - 16, 10);
    expect(body.positionNow.x).toBeCloseTo(start.x, 10);
    body.stop();
    body.advance(4);
    expect(body.positionNow).toEqual({ x: start.x, y: start.y - 16 });
    const heading = body.headingNow;
    body.turn();
    expect(body.headingNow).toEqual({ x: -heading.y, y: heading.x });
    body.turn();
    body.turn();
    body.turn();
    expect(body.headingNow.x).toBeCloseTo(heading.x, 10);
    expect(body.headingNow.y).toBeCloseTo(heading.y, 10);
  });

  it("steps back and aligns to the crosswalk", () => {
    const body = walker();
    const start = body.positionNow;
    body.stepBack();
    expect(body.positionNow.y).toBeCloseTo(start.y + WALKER_STEP_BACK_PX, 10);
    expect(body.isMoving).toBe(false);
    body.place({ x: 120, y: start.y });
    body.align(crosswalk);
    expect(body.positionNow.x).toBe(crosswalk.from.x);
    expect(body.positionNow.y).toBe(start.y);
  });

  it("feeds one position and one facing to the map and the scene", () => {
    const body = walker();
    body.turn();
    body.move();
    body.advance(1);
    const mapView = body.view("map");
    const sceneView = body.view("scene");
    expect(mapView.position).toEqual(sceneView.position);
    expect(mapView.facingRad).toBe(sceneView.facingRad);
    expect(mapView.shape).toBe("drop");
    expect(sceneView.shape).toBe("drop");
    expect(mapView.color).toBe("yellow");
    expect(sceneView.color).toBe("yellow");
    expect(mapView.outline).toBe("thick-dark");
    expect(sceneView.outline).toBe("thick-dark");
    expect(mapView.eyeCount).toBe(2);
    expect(sceneView.eyeCount).toBe(2);
    expect(mapView.mouth).toBe(false);
    expect(mapView.cane).toBe(false);
    expect(sceneView.cane).toBe(false);
    expect(mapView.minSizePx).toBe(44);
    expect(sceneView.minSizePx).toBeGreaterThanOrEqual(44);
    expect(mapView.place).toBe("map");
    expect(sceneView.place).toBe("scene");
  });

  it("uses one asset at the designer body sizes", () => {
    expect(WALKER_ASSET).toBe("assets/walker.svg");
    expect(WALKER_BODY_CSS_PX.map).toBeGreaterThanOrEqual(44);
    expect(WALKER_BODY_CSS_PX.scene).toBeGreaterThanOrEqual(48);
    const mapSize = walkerImageCssSize("map");
    const sceneSize = walkerImageCssSize("scene");
    expect(mapSize.height).toBeGreaterThan(mapSize.width);
    expect(sceneSize.height).toBeGreaterThan(sceneSize.width);
    expect(sceneSize.width).toBeGreaterThan(mapSize.width);
    const north = assetRotationRad({ x: 0, y: -1 });
    const east = assetRotationRad({ x: 1, y: 0 });
    expect(north).toBeCloseTo(0, 10);
    expect(east).toBeCloseTo(Math.PI / 2, 10);
  });
});
