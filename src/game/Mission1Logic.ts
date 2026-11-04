import type { AudioHooks } from "../audio/hooks";
import { assertMission1, mission1 } from "../levels/mission1";
import { playerLine, playerLineRow } from "../levels/playerCopy";
import {
  validateLevel,
  type CrosswalkData,
  type LevelData,
  type PlayerAction,
  type RoadData,
  type Vec2,
} from "../levels/schema";
import {
  GameEvents,
  canCross,
  type CarState,
  type GameEvent,
  type MotionSettings,
  type SceneView,
  type TextLine,
  type TickResult,
} from "./contracts";
import { createFailureStub, type FailureRecord } from "./failure/FailureStub";
import { Walker } from "./Walker";
import { PartAFlow } from "./tutorial/PartAFlow";
import { advanceClock, createClock, stepCar, type Clock } from "./traffic";
import { createCarState, crosswalkInterval, markPassed, type CrosswalkInterval } from "./traffic/Car";
import { decideCross, pickCarSoundRow } from "./traffic/ListenWait";
import { touchToQuery, type VibrateFn } from "./traffic/TouchToQuery";

const PLACE_SOUND_MS = 1500;
const CAR_SOUND_INTERVAL_MS = 800;

function walkerOnRoad(position: Vec2, road: RoadData): boolean {
  if (road.axis !== "horizontal") {
    return false;
  }
  const minY = Math.min(road.from.y, road.to.y) - road.width / 2;
  const maxY = Math.max(road.from.y, road.to.y) + road.width / 2;
  const minX = Math.min(road.from.x, road.to.x);
  const maxX = Math.max(road.from.x, road.to.x);
  return position.x >= minX && position.x <= maxX && position.y >= minY && position.y <= maxY;
}

export interface Mission1LogicOptions {
  readonly vibrate?: VibrateFn;
  readonly reducedMotion?: boolean;
}

interface PendingAction {
  readonly action: PlayerAction;
  readonly timeMs: number;
}

type Phase = "A" | "B" | "done" | "failed";

export class Mission1Logic {
  private level: LevelData = mission1;
  private partA = new PartAFlow(mission1.parts[0] as NonNullable<(typeof mission1.parts)[number]>);
  private walker = new Walker(mission1.parts[0]?.map.walkerStart ?? { x: 0, y: 0 }, { width: 800, height: 600 });
  private road: RoadData = mission1.parts[0]?.road ?? mission1.parts[1]?.road ?? {
    direction: "one-way",
    lanes: 1,
    axis: "horizontal",
    from: { x: 0, y: 0 },
    to: { x: 1, y: 0 },
    width: 1,
  };
  private crosswalk: CrosswalkData = mission1.parts[0]?.crosswalk ?? {
    id: "crosswalk-1",
    from: { x: 0, y: 0 },
    to: { x: 0, y: 1 },
    width: 1,
  };
  private interval: CrosswalkInterval = { minX: 0, maxX: 0 };
  private goal: Vec2 = { x: 0, y: 0 };
  private phase: Phase = "A";
  private car: CarState | null = null;
  private clock: Clock = createClock();
  private pending: PendingAction[] = [];
  private line: TextLine | null = null;
  private score = 0;
  private waited = false;
  private announcedPass = false;
  private frozen = false;
  private hold = false;
  private lastPulseMs: number | null = null;
  private pulseBars: 0 | 1 | 2 | 3 = 0;
  private captionKey: string | null = null;
  private captionRow = 0;
  private captionUntilMs: number | null = null;
  private previousCarDistance: number | null = null;
  private nextCarSoundMs = 0;
  private readonly failureRecords: FailureRecord[];

  public constructor(
    private readonly audio: AudioHooks,
    private readonly options: Mission1LogicOptions = {},
    failureStub = createFailureStub(),
  ) {
    this.failureRecords = failureStub.records;
    this.handleFailure = failureStub.handle;
  }

  private readonly handleFailure: (event: GameEvent) => void;

  public get timeMs(): number {
    return this.clock.timeMs;
  }

  public get sessionScore(): number {
    return this.score;
  }

  public get failures(): readonly FailureRecord[] {
    return this.failureRecords;
  }

  public get pulseBarCount(): 0 | 1 | 2 | 3 {
    return this.pulseBars;
  }

  public start(level: LevelData): void {
    const validated = validateLevel(level);
    assertMission1(validated);
    const partA = validated.parts[0];
    if (partA === undefined) {
      throw new Error("Mission 1 is missing part A");
    }
    this.level = validated;
    this.partA = new PartAFlow(partA);
    this.walker = new Walker(partA.map.walkerStart, partA.map);
    this.road = partA.road;
    this.crosswalk = partA.crosswalk;
    this.interval = crosswalkInterval(partA.crosswalk);
    this.goal = { ...partA.map.goal };
    this.phase = "A";
    this.car = null;
    this.clock = createClock();
    this.pending = [];
    this.score = 0;
    this.waited = false;
    this.announcedPass = false;
    this.frozen = false;
    this.hold = false;
    this.lastPulseMs = null;
    this.pulseBars = 0;
    this.captionKey = null;
    this.captionRow = 0;
    this.captionUntilMs = null;
    this.previousCarDistance = null;
    this.nextCarSoundMs = 0;
    this.failureRecords.splice(0, this.failureRecords.length);
    const key = this.partA.instructionKey;
    if (key === null) {
      throw new Error("Part A is missing an instruction");
    }
    this.line = { role: "instruction", text: playerLine(key) };
    this.audio.stopAll();
  }

  public input(action: PlayerAction, timeMs: number): void {
    this.pending.push({ action, timeMs });
  }

  public setRoadHold(holding: boolean): void {
    this.hold = holding;
    if (!holding && this.captionKey === "road-pulse.1") {
      this.captionKey = null;
      this.pulseBars = 0;
    }
  }

  public captionText(): string | null {
    if (this.captionKey === null) {
      return null;
    }
    if (this.captionKey === "car-sound.1") {
      return playerLineRow(this.captionKey, this.captionRow);
    }
    return playerLine(this.captionKey);
  }

  public tick(frameDtMs: number): TickResult {
    const events: GameEvent[] = [];
    const actions = this.pending.splice(0, this.pending.length);
    for (const item of actions) {
      events.push(...this.applyAction(item.action, item.timeMs));
    }
    if (!this.frozen && this.phase !== "done" && this.phase !== "failed") {
      events.push(...this.stepWorld(frameDtMs));
    } else {
      this.clock = advanceClock(this.clock, frameDtMs).clock;
    }
    this.expireCaption();
    this.maybeCarSound();
    this.maybePulse();
    return { view: this.sceneView(), events };
  }

  private applyAction(action: PlayerAction, timeMs: number): readonly GameEvent[] {
    if (this.phase === "done" || this.phase === "failed") {
      return [];
    }
    if (this.phase === "A") {
      return this.applyPartA(action, timeMs);
    }
    return this.applyPartB(action, timeMs);
  }

  private applyPartA(action: PlayerAction, timeMs: number): readonly GameEvent[] {
    const result = this.partA.tryAction(action);
    if (!result.accepted) {
      return result.events;
    }
    this.applyTaughtMove(action);
    if (action === "listen") {
      this.playPlaceSound(timeMs);
    }
    if (result.completed) {
      this.enterPartB();
    } else if (result.instructionKey !== null) {
      this.line = { role: "instruction", text: playerLine(result.instructionKey) };
    }
    return result.events;
  }

  private applyTaughtMove(action: PlayerAction): void {
    if (action === "move") {
      this.walker.move();
    } else if (action === "stop") {
      this.walker.stop();
    } else if (action === "turn") {
      this.walker.turn();
    } else if (action === "step-back") {
      this.walker.stepBack();
    } else if (action === "align") {
      this.walker.align(this.crosswalk);
    } else if (action === "cross") {
      this.walker.place(this.goal);
    }
  }

  private applyPartB(action: PlayerAction, timeMs: number): readonly GameEvent[] {
    if (action === "move") {
      this.walker.move();
      return [];
    }
    if (action === "stop") {
      this.walker.stop();
      return [];
    }
    if (action === "turn") {
      this.walker.turn();
      return [];
    }
    if (action === "step-back") {
      this.walker.stepBack();
      return [];
    }
    if (action === "align") {
      this.walker.align(this.crosswalk);
      return [];
    }
    if (action === "read-map") {
      return [];
    }
    if (action === "listen") {
      this.playCarSound();
      return [];
    }
    if (action === "wait") {
      this.waited = true;
      const passed = this.car !== null && canCross(this.car);
      const key = passed ? "part-b-feedback-lines.safe-wait.2" : "cross.6";
      this.line = { role: "outcome", text: playerLine(key) };
      return [{ type: GameEvents.text, text: this.line.text }];
    }
    return this.crossPartB(timeMs);
  }

  private crossPartB(timeMs: number): readonly GameEvent[] {
    if (this.car === null) {
      return [];
    }
    const decision = decideCross({
      car: this.car,
      crosswalk: this.interval,
      nowMs: timeMs,
      waited: this.waited,
    });
    if (decision.kind === "bad") {
      this.frozen = true;
      this.phase = "failed";
      this.walker.stop();
      this.audio.stopAll();
      this.audio.playDanger();
      this.handleFailure(decision.event);
      return [decision.event];
    }
    this.score += decision.score;
    this.phase = "done";
    this.walker.place(this.goal);
    const key = this.waited
      ? "part-b-feedback-lines.safe-wait.3"
      : "part-b-feedback-lines.safe-cross.1";
    this.line = { role: "outcome", text: playerLine(key) };
    this.captionKey = null;
    this.audio.stopAll();
    return [
      { type: GameEvents.text, text: this.line.text },
      { type: GameEvents.partComplete, partId: "B" },
      { type: GameEvents.missionComplete },
    ];
  }

  private enterPartB(): void {
    const partB = this.level.parts[1];
    const carData = partB?.cars[0];
    if (partB === undefined || carData === undefined || partB.cars.length !== 1 || partB.trafficLight !== null) {
      throw new Error("Part B must have one car and no traffic light");
    }
    this.phase = "B";
    this.car = createCarState(carData, this.interval);
    this.line = { role: "instruction", text: playerLine("cross.5") };
    this.nextCarSoundMs = this.clock.timeMs;
  }

  private stepWorld(frameDtMs: number): readonly GameEvent[] {
    const stepped = advanceClock(this.clock, frameDtMs);
    this.clock = stepped.clock;
    this.walker.advance(stepped.stepCount);
    if (this.phase !== "B" || this.car === null) {
      return [];
    }
    for (let index = 0; index < stepped.stepCount; index += 1) {
      const next = stepCar(this.car);
      if (this.carWouldMeetWalker(this.car.position.x, next.position.x)) {
        return this.failNow(this.clock.timeMs);
      }
      this.car = markPassed(
        {
          ...this.car,
          position: next.position,
          heading: next.heading,
          speed: next.speed,
        },
        this.interval.maxX,
      );
    }
    if (this.waited && canCross(this.car) && !this.announcedPass) {
      this.announcedPass = true;
      this.line = { role: "outcome", text: playerLine("part-b-feedback-lines.safe-wait.2") };
      return [{ type: GameEvents.text, text: this.line.text }];
    }
    return [];
  }

  private carWouldMeetWalker(fromX: number, toX: number): boolean {
    if (!walkerOnRoad(this.walker.positionNow, this.road)) {
      return false;
    }
    const walkerX = this.walker.positionNow.x;
    const minX = Math.min(fromX, toX);
    const maxX = Math.max(fromX, toX);
    return walkerX >= minX && walkerX <= maxX;
  }

  private failNow(nowMs: number): readonly GameEvent[] {
    if (this.car === null) {
      return [];
    }
    const decision = decideCross({
      car: this.car,
      crosswalk: this.interval,
      nowMs,
      waited: this.waited,
    });
    if (decision.kind !== "bad") {
      return [];
    }
    this.frozen = true;
    this.phase = "failed";
    this.walker.stop();
    this.audio.stopAll();
    this.audio.playDanger();
    this.handleFailure(decision.event);
    return [decision.event];
  }

  private playPlaceSound(timeMs: number): void {
    this.audio.playSpatial({
      cueId: "place-sound",
      position: this.walker.positionNow,
      distance: 0,
      directionRad: 0,
    });
    this.captionKey = "place-sound.1";
    this.captionRow = 0;
    this.captionUntilMs = timeMs + PLACE_SOUND_MS;
  }

  private playCarSound(): void {
    if (this.car === null) {
      return;
    }
    const walker = this.walker.positionNow;
    const distance = Math.hypot(this.car.position.x - walker.x, this.car.position.y - walker.y);
    const directionRad = Math.atan2(this.car.position.y - walker.y, this.car.position.x - walker.x);
    this.audio.playSpatial({
      cueId: "car-sound",
      position: { ...this.car.position },
      distance,
      directionRad,
    });
    this.captionRow = pickCarSoundRow({
      carX: this.car.position.x,
      walkerX: walker.x,
      distance,
      previousDistance: this.previousCarDistance,
    });
    this.previousCarDistance = distance;
    if (this.captionKey !== "road-pulse.1") {
      this.captionKey = "car-sound.1";
      this.captionUntilMs = null;
    }
  }

  private maybeCarSound(): void {
    if (this.phase !== "B" || this.car === null || this.frozen || canCross(this.car)) {
      if (this.captionKey === "car-sound.1") {
        this.captionKey = null;
      }
      return;
    }
    if (this.clock.timeMs < this.nextCarSoundMs) {
      return;
    }
    this.playCarSound();
    this.nextCarSoundMs = this.clock.timeMs + CAR_SOUND_INTERVAL_MS;
  }

  private maybePulse(): void {
    if (this.phase !== "B" || this.car === null) {
      this.pulseBars = 0;
      return;
    }
    const walker = this.walker.positionNow;
    const distance = Math.hypot(this.car.position.x - walker.x, this.car.position.y - walker.y);
    const directionRad = Math.atan2(this.car.position.y - walker.y, this.car.position.x - walker.x);
    const result = touchToQuery({
      holding: this.hold,
      nowMs: this.clock.timeMs,
      lastPulseMs: this.lastPulseMs,
      distance,
      vibrate: this.options.vibrate,
      audio: this.audio,
      position: { ...this.car.position },
      directionRad,
    });
    this.lastPulseMs = result.lastPulseMs;
    this.pulseBars = result.barCount;
    if (result.captionKey !== null) {
      this.captionKey = result.captionKey;
      this.captionUntilMs = null;
    }
  }

  private expireCaption(): void {
    if (this.captionUntilMs !== null && this.clock.timeMs >= this.captionUntilMs) {
      this.captionKey = null;
      this.captionUntilMs = null;
    }
  }

  private sceneView(): SceneView {
    const motion: MotionSettings = {
      reducedMotion: this.options.reducedMotion === true,
      source: "device",
    };
    return {
      mapWalker: this.walker.view("map"),
      sceneWalker: this.walker.view("scene"),
      road: this.road,
      crosswalk: this.crosswalk,
      car: this.car === null ? null : { ...this.car, position: { ...this.car.position }, heading: { ...this.car.heading } },
      text: this.line,
      failure: null,
      notice: this.level.notice,
      motion,
    };
  }
}

export function noticeRows(notice: string): string {
  return notice.replace(/\.\s+/g, ".\n");
}
