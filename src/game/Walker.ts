import type { CrosswalkData, TactileMapData, Vec2 } from "../levels/schema";
import { FIXED_STEP_MS } from "./traffic";
import type { WalkerView } from "./contracts";

export const WALKER_ASSET = "assets/walker.svg";

export const WALKER_SPEED_PX_PER_SEC = 160;

export const WALKER_STEP_BACK_PX = 40;

/** View box of public/assets/walker.svg. */
export const WALKER_VIEWBOX = { width: 136, height: 168 } as const;

/**
 * Body path from x 20 to x 116 is 96 view-box units.
 * The dark outline is 8 units wide and centered, so it adds 8.
 * docs/design/walker.md counts that outline in the body width.
 */
export const WALKER_BODY_VIEWBOX = 104;

export const WALKER_BODY_CSS_PX = {
  map: 44,
  scene: 48,
} as const;

export function walkerImageCssSize(place: "map" | "scene"): { readonly width: number; readonly height: number } {
  const scale = WALKER_BODY_CSS_PX[place] / WALKER_BODY_VIEWBOX;
  return {
    width: WALKER_VIEWBOX.width * scale,
    height: WALKER_VIEWBOX.height * scale,
  };
}

export function headingFromFacing(facingRad: number): Vec2 {
  return { x: Math.cos(facingRad), y: Math.sin(facingRad) };
}

export function facingFromHeading(heading: Vec2): number {
  return Math.atan2(heading.y, heading.x);
}

/** Clockwise radians from the asset's up-facing point to the heading. */
export function assetRotationRad(heading: Vec2): number {
  return Math.atan2(heading.x, -heading.y);
}

function normalize(heading: Vec2): Vec2 {
  const length = Math.hypot(heading.x, heading.y);
  if (length === 0) {
    throw new Error("heading must be a unit vector");
  }
  return { x: heading.x / length, y: heading.y / length };
}

function turnClockwise(heading: Vec2): Vec2 {
  return { x: -heading.y, y: heading.x };
}

export class Walker {
  private position: Vec2;
  private heading: Vec2;
  private moving = false;

  public constructor(
    start: Vec2,
    private readonly bounds: Pick<TactileMapData, "width" | "height">,
    heading: Vec2 = { x: 0, y: -1 },
  ) {
    this.position = this.clamp(start);
    this.heading = normalize(heading);
  }

  public get positionNow(): Vec2 {
    return { ...this.position };
  }

  public get headingNow(): Vec2 {
    return { ...this.heading };
  }

  public get isMoving(): boolean {
    return this.moving;
  }

  public move(): void {
    this.moving = true;
  }

  public stop(): void {
    this.moving = false;
  }

  public turn(): void {
    this.heading = turnClockwise(this.heading);
  }

  public stepBack(): void {
    this.moving = false;
    this.position = this.clamp({
      x: this.position.x - this.heading.x * WALKER_STEP_BACK_PX,
      y: this.position.y - this.heading.y * WALKER_STEP_BACK_PX,
    });
  }

  public align(crosswalk: CrosswalkData): void {
    this.moving = false;
    this.position = this.clamp({ x: crosswalk.from.x, y: this.position.y });
  }

  public place(next: Vec2): void {
    this.moving = false;
    this.position = this.clamp(next);
  }

  public advance(steps: number): void {
    if (!this.moving || steps <= 0) {
      return;
    }
    const distance = WALKER_SPEED_PX_PER_SEC * (FIXED_STEP_MS / 1000) * steps;
    this.position = this.clamp({
      x: this.position.x + this.heading.x * distance,
      y: this.position.y + this.heading.y * distance,
    });
  }

  public view(place: "map" | "scene"): WalkerView {
    return {
      place,
      shape: "drop",
      color: "yellow",
      outline: "thick-dark",
      eyeCount: 2,
      mouth: false,
      cane: false,
      minSizePx: 44,
      position: { ...this.position },
      facingRad: facingFromHeading(this.heading),
    };
  }

  private clamp(point: Vec2): Vec2 {
    return {
      x: Math.min(this.bounds.width, Math.max(0, point.x)),
      y: Math.min(this.bounds.height, Math.max(0, point.y)),
    };
  }
}
