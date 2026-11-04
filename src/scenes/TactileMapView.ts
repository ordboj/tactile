import type { CarState } from "../game/contracts";
import type { WalkerView } from "../game/contracts";
import { assetRotationRad, headingFromFacing, WALKER_ASSET, walkerImageCssSize } from "../game/Walker";
import { CAR_FILL, CAR_OUTLINE, crosswalkInterval, MAP_CAR_PX } from "../game/traffic/Car";
import type { CrosswalkData, RoadData, TactileMapData, Vec2 } from "../levels/schema";
import { PALETTE } from "./palette";

export interface MapRenderInput {
  readonly visible: boolean;
  readonly map: TactileMapData;
  readonly road: RoadData;
  readonly crosswalk: CrosswalkData;
  readonly walker: WalkerView;
  readonly car: CarState | null;
}

export class TactileMapView {
  private readonly road: HTMLElement;
  private readonly crosswalk: HTMLElement;
  private readonly goal: HTMLElement;
  private readonly car: HTMLElement;
  private readonly walker: HTMLImageElement;

  public constructor(private readonly root: HTMLElement) {
    this.root.replaceChildren();
    this.root.style.position = "relative";
    this.root.style.height = "100%";
    this.root.style.overflow = "hidden";
    this.root.style.background = PALETTE.mapBoard;
    this.road = document.createElement("div");
    this.crosswalk = document.createElement("div");
    this.goal = document.createElement("div");
    this.car = document.createElement("div");
    this.walker = document.createElement("img");
    this.walker.src = WALKER_ASSET;
    this.walker.alt = "";
    this.walker.draggable = false;
    this.styleCar();
    this.styleGoal();
    this.root.append(this.road, this.crosswalk, this.goal, this.car, this.walker);
  }

  public render(input: MapRenderInput): void {
    if (!input.visible || !input.map.visible) {
      throw new Error("The tactile map stays visible in Mission 1");
    }
    const worldW = input.map.width;
    const worldH = input.map.height;
    this.placeRoad(input.road, worldH);
    this.placeCrosswalk(input.crosswalk, worldW, worldH);
    this.placeMark(this.goal, input.map.goal, worldW, worldH);
    this.placeWalker(input.walker, worldW, worldH);
    if (input.car === null) {
      this.car.style.display = "none";
      return;
    }
    this.car.style.display = "block";
    this.placeMark(this.car, input.car.position, worldW, worldH);
  }

  private styleGoal(): void {
    this.goal.style.position = "absolute";
    this.goal.style.width = "16px";
    this.goal.style.height = "16px";
    this.goal.style.background = PALETTE.rim;
    this.goal.style.border = `3px solid ${PALETTE.ink}`;
    this.goal.style.boxSizing = "border-box";
  }

  private styleCar(): void {
    this.car.style.position = "absolute";
    this.car.style.width = `${MAP_CAR_PX.width}px`;
    this.car.style.height = `${MAP_CAR_PX.height}px`;
    this.car.style.background = CAR_FILL;
    this.car.style.border = `3px solid ${CAR_OUTLINE}`;
    this.car.style.borderRadius = "2px";
    this.car.style.boxSizing = "border-box";
    this.car.style.display = "none";
  }

  private placeRoad(road: RoadData, worldH: number): void {
    const top = (Math.min(road.from.y, road.to.y) - road.width / 2) / worldH;
    this.road.style.position = "absolute";
    this.road.style.left = "0";
    this.road.style.width = "100%";
    this.road.style.top = `${top * 100}%`;
    this.road.style.height = `${(road.width / worldH) * 100}%`;
    this.road.style.background = PALETTE.road;
    this.road.style.boxShadow = `inset 0 0 0 2px ${PALETTE.rim}`;
  }

  private placeCrosswalk(crosswalk: CrosswalkData, worldW: number, worldH: number): void {
    const interval = crosswalkInterval(crosswalk);
    const top = Math.min(crosswalk.from.y, crosswalk.to.y);
    const height = Math.abs(crosswalk.to.y - crosswalk.from.y);
    this.crosswalk.style.position = "absolute";
    this.crosswalk.style.left = `${(interval.minX / worldW) * 100}%`;
    this.crosswalk.style.top = `${(top / worldH) * 100}%`;
    this.crosswalk.style.width = `${((interval.maxX - interval.minX) / worldW) * 100}%`;
    this.crosswalk.style.height = `${(height / worldH) * 100}%`;
    this.crosswalk.style.background = `repeating-linear-gradient(${PALETTE.road}, ${PALETTE.road} 6px, ${PALETTE.rim} 6px, ${PALETTE.rim} 10px)`;
  }

  private placeWalker(walker: WalkerView, worldW: number, worldH: number): void {
    const size = walkerImageCssSize("map");
    const turn = assetRotationRad(headingFromFacing(walker.facingRad));
    const deg = (turn * 180) / Math.PI;
    this.walker.style.position = "absolute";
    this.walker.style.width = `${size.width}px`;
    this.walker.style.height = `${size.height}px`;
    this.walker.style.left = `${(walker.position.x / worldW) * 100}%`;
    this.walker.style.top = `${(walker.position.y / worldH) * 100}%`;
    this.walker.style.transform = `translate(-50%, -50%) rotate(${deg}deg)`;
  }

  private placeMark(node: HTMLElement, point: Vec2, worldW: number, worldH: number): void {
    node.style.left = `${(point.x / worldW) * 100}%`;
    node.style.top = `${(point.y / worldH) * 100}%`;
    node.style.transform = "translate(-50%, -50%)";
  }
}
