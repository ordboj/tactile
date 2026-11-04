import type { Vec2 } from "../levels/schema";

export interface SpatialCue {
  readonly cueId: string;
  readonly position: Vec2;
  readonly distance: number;
  readonly directionRad: number;
}

export interface AudioHooks {
  playSpatial(cue: SpatialCue): void;
  playDanger(): void;
  replayCue(cueId: string): void;
  stopAll(): void;
}
