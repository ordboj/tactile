import type {
  CrosswalkData,
  LevelData,
  PlayerAction,
  RoadData,
  Vec2,
} from "../levels/schema";

export const GameEvents = {
  failure: "failure",
  freeze: "freeze",
  replay: "replay",
  missedCue: "missed-cue",
  rewind: "rewind",
  tip: "tip",
  text: "text",
  partComplete: "part-complete",
  missionComplete: "mission-complete",
} as const;

export type GameEvent =
  | { readonly type: typeof GameEvents.failure; readonly predictedContactMs: number }
  | { readonly type: typeof GameEvents.freeze }
  | { readonly type: typeof GameEvents.replay; readonly durationMs: number }
  | { readonly type: typeof GameEvents.missedCue; readonly cueId: string }
  | { readonly type: typeof GameEvents.rewind; readonly decisionPointMs: number }
  | { readonly type: typeof GameEvents.tip; readonly text: string }
  | { readonly type: typeof GameEvents.text; readonly text: string }
  | { readonly type: typeof GameEvents.partComplete; readonly partId: "A" | "B" }
  | { readonly type: typeof GameEvents.missionComplete };

export interface WalkerView {
  readonly place: "map" | "scene";
  readonly shape: "drop";
  readonly color: "yellow";
  readonly outline: "thick-dark";
  readonly eyeCount: 2;
  readonly mouth: false;
  readonly cane: false;
  readonly minSizePx: 44;
  readonly position: Vec2;
  readonly facingRad: number;
}

export interface CarState {
  readonly id: string;
  readonly position: Vec2;
  readonly heading: Vec2;
  readonly speed: number;
  readonly passedCrosswalk: boolean;
}

export type FailurePhase = "freeze" | "replay" | "missed-cue" | "rewind" | "tip";

export interface FailureFlow {
  readonly phase: FailurePhase;
  readonly showImpact: false;
  readonly freezeLeadMs: number;
  readonly sceneGrey: true;
  readonly walkerKeepsColor: true;
  readonly carKeepsColor: true;
  readonly ring: "double";
  readonly ringMotion: "animated" | "static";
  readonly replayOnMap: true;
  readonly replayMs: number;
  readonly skipped: boolean;
  readonly missedCueId: string;
  readonly outcomeText: string;
  readonly decisionPointMs: number;
  readonly tipText: string | null;
}

export type TextRole = "instruction" | "outcome" | "notice" | "tip";

export interface TextLine {
  readonly role: TextRole;
  readonly text: string;
}

export interface MotionSettings {
  readonly reducedMotion: boolean;
  readonly source: "device" | "switch";
}

export interface SceneView {
  readonly mapWalker: WalkerView;
  readonly sceneWalker: WalkerView;
  readonly road: RoadData;
  readonly crosswalk: CrosswalkData;
  readonly car: CarState | null;
  readonly text: TextLine | null;
  readonly failure: FailureFlow | null;
  readonly notice: string;
  readonly motion: MotionSettings;
}

export interface TickResult {
  readonly view: SceneView;
  readonly events: readonly GameEvent[];
}

export interface GameLogic {
  start(level: LevelData): void;
  input(action: PlayerAction, timeMs: number): void;
  tick(frameDtMs: number): TickResult;
}

export function canCross(car: CarState): boolean {
  return car.passedCrosswalk;
}
