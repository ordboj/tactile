import type { Vec2 } from "../levels/schema";

export const FIXED_STEP_MS = 50;

export const FREEZE_LEAD_MS = 800;

export const MAX_REPLAY_MS = 3000;

export interface Clock {
  readonly timeMs: number;
  readonly accumulatorMs: number;
}

export interface CarMotion {
  readonly position: Vec2;
  readonly heading: Vec2;
  readonly speed: number;
}

export interface ContactQuery {
  readonly carX: number;
  readonly speed: number;
  readonly crosswalkMinX: number;
  readonly crosswalkMaxX: number;
  readonly walkerOnRoad: boolean;
  readonly nowMs: number;
}

export interface TrafficStepInput {
  readonly clock: Clock;
  readonly car: CarMotion;
  readonly frameDtMs: number;
  readonly contactMs: number | null;
  readonly leadMs?: number;
}

export interface TrafficStepResult {
  readonly clock: Clock;
  readonly car: CarMotion;
  readonly freeze: boolean;
  readonly steps: number;
}

export function createClock(): Clock {
  return { timeMs: 0, accumulatorMs: 0 };
}

function assertFrameDt(frameDtMs: number): void {
  if (!Number.isInteger(frameDtMs) || frameDtMs < 0) {
    throw new Error("frameDtMs must be an integer >= 0");
  }
}

function assertLead(leadMs: number): void {
  if (!Number.isInteger(leadMs) || leadMs <= 0 || leadMs >= 1000) {
    throw new Error("leadMs must be an integer > 0 and < 1000");
  }
  if (leadMs < FIXED_STEP_MS) {
    throw new Error("leadMs must be >= the fixed time step");
  }
}

export function advanceClock(clock: Clock, frameDtMs: number): {
  readonly clock: Clock;
  readonly stepCount: number;
} {
  assertFrameDt(frameDtMs);
  let accumulatorMs = clock.accumulatorMs + frameDtMs;
  let timeMs = clock.timeMs;
  let stepCount = 0;
  while (accumulatorMs >= FIXED_STEP_MS) {
    accumulatorMs -= FIXED_STEP_MS;
    timeMs += FIXED_STEP_MS;
    stepCount += 1;
  }
  return {
    clock: { timeMs, accumulatorMs },
    stepCount,
  };
}

export function stepCar<T extends CarMotion>(car: T, stepMs: number = FIXED_STEP_MS): T {
  if (stepMs !== FIXED_STEP_MS) {
    throw new Error("stepCar only accepts the fixed time step");
  }
  const seconds = stepMs / 1000;
  return {
    ...car,
    position: {
      x: car.position.x + car.heading.x * car.speed * seconds,
      y: car.position.y + car.heading.y * car.speed * seconds,
    },
  };
}

export function predictContactTimeMs(query: ContactQuery): number | null {
  if (!query.walkerOnRoad) {
    return null;
  }
  if (!Number.isFinite(query.speed) || query.speed <= 0) {
    throw new Error("speed must be a finite number > 0");
  }
  if (query.carX >= query.crosswalkMaxX) {
    return null;
  }
  const entryX = Math.max(query.carX, query.crosswalkMinX);
  const distance = entryX - query.carX;
  return query.nowMs + (distance / query.speed) * 1000;
}

export function mustFreeze(nowMs: number, contactMs: number, leadMs: number = FREEZE_LEAD_MS): boolean {
  assertLead(leadMs);
  return nowMs >= contactMs - leadMs;
}

export function stepTraffic(input: TrafficStepInput): TrafficStepResult {
  const leadMs = input.leadMs ?? FREEZE_LEAD_MS;
  assertFrameDt(input.frameDtMs);
  if (input.contactMs !== null) {
    assertLead(leadMs);
  }

  let timeMs = input.clock.timeMs;
  let accumulatorMs = input.clock.accumulatorMs + input.frameDtMs;
  let car = input.car;
  let steps = 0;

  const inFreezeWindow = (): boolean =>
    input.contactMs !== null && mustFreeze(timeMs, input.contactMs, leadMs);

  if (inFreezeWindow()) {
    return { clock: { timeMs, accumulatorMs: 0 }, car, freeze: true, steps };
  }

  while (accumulatorMs >= FIXED_STEP_MS) {
    accumulatorMs -= FIXED_STEP_MS;
    timeMs += FIXED_STEP_MS;
    car = stepCar(car);
    steps += 1;
    if (input.contactMs !== null && timeMs >= input.contactMs) {
      throw new Error("The traffic model stepped onto the contact time");
    }
    if (inFreezeWindow()) {
      return { clock: { timeMs, accumulatorMs: 0 }, car, freeze: true, steps };
    }
  }

  return {
    clock: { timeMs, accumulatorMs },
    car,
    freeze: false,
    steps,
  };
}
