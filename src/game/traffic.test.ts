import { describe, expect, it } from "vitest";
import { canCross, type CarState } from "./contracts";
import {
  FIXED_STEP_MS,
  FREEZE_LEAD_MS,
  MAX_REPLAY_MS,
  advanceClock,
  createClock,
  mustFreeze,
  predictContactTimeMs,
  stepCar,
  stepTraffic,
  type CarMotion,
  type Clock,
} from "./traffic";

const car: CarMotion = {
  position: { x: 0, y: 300 },
  heading: { x: 1, y: 0 },
  speed: 80,
};

function runFrames(frames: readonly number[], contactMs: number | null): {
  readonly clock: Clock;
  readonly car: CarMotion;
  readonly freeze: boolean;
} {
  let clock = createClock();
  let current = car;
  let freeze = false;
  for (const frameDtMs of frames) {
    const result = stepTraffic({
      clock,
      car: current,
      frameDtMs,
      contactMs,
    });
    clock = result.clock;
    current = result.car;
    freeze = result.freeze;
    if (freeze) {
      break;
    }
  }
  return { clock, car: current, freeze };
}

describe("fixed time step", () => {
  it("gives the same clock for the same frame times", () => {
    const once = advanceClock(createClock(), 100);
    const split = advanceClock(advanceClock(createClock(), 30).clock, 70);
    expect(once.clock).toEqual(split.clock);
    expect(once.clock.timeMs).toBe(100);
    expect(once.stepCount).toBe(2);
    expect(once.clock.accumulatorMs).toBe(0);
  });

  it("moves the car the same way for split frames", () => {
    const whole = runFrames([100], null);
    const split = runFrames([30, 70], null);
    const other = runFrames([40, 60], null);
    expect(split).toEqual(whole);
    expect(other).toEqual(whole);
    expect(whole.car.position.x).toBeCloseTo(8, 10);
    expect(whole.freeze).toBe(false);
  });

  it("rejects a negative frame and a step that is not fixed", () => {
    expect(() => advanceClock(createClock(), -1)).toThrow(/frameDtMs/);
    expect(() => stepCar(car, 16)).toThrow(/fixed time step/);
    expect(FIXED_STEP_MS).toBe(50);
  });
});

describe("contact and freeze", () => {
  it("predicts contact on the crosswalk entry", () => {
    expect(
      predictContactTimeMs({
        carX: -40,
        speed: 80,
        crosswalkMinX: 360,
        crosswalkMaxX: 440,
        walkerOnRoad: true,
        nowMs: 0,
      }),
    ).toBe(5000);
  });

  it("returns no contact when the walker is off the road or the car has passed", () => {
    expect(
      predictContactTimeMs({
        carX: 0,
        speed: 80,
        crosswalkMinX: 360,
        crosswalkMaxX: 440,
        walkerOnRoad: false,
        nowMs: 0,
      }),
    ).toBeNull();
    expect(
      predictContactTimeMs({
        carX: 440,
        speed: 80,
        crosswalkMinX: 360,
        crosswalkMaxX: 440,
        walkerOnRoad: true,
        nowMs: 0,
      }),
    ).toBeNull();
  });

  it("sets contact to now when the car is already in the crosswalk", () => {
    expect(
      predictContactTimeMs({
        carX: 400,
        speed: 80,
        crosswalkMinX: 360,
        crosswalkMaxX: 440,
        walkerOnRoad: true,
        nowMs: 250,
      }),
    ).toBe(250);
  });

  it("stops a long frame before the contact time", () => {
    const contactMs = 1000;
    const longFrame = runFrames([5000], contactMs);
    const shortFrames = runFrames(Array.from({ length: 100 }, () => FIXED_STEP_MS), contactMs);
    expect(longFrame).toEqual(shortFrames);
    expect(longFrame.freeze).toBe(true);
    expect(longFrame.clock.timeMs).toBe(contactMs - FREEZE_LEAD_MS);
    expect(longFrame.car.position.x).toBeCloseTo(16, 10);
    expect(longFrame.car.position.x).toBeLessThan(80);
  });

  it("keeps the lead below 1 second and the replay at 3 seconds or less", () => {
    expect(FREEZE_LEAD_MS).toBeLessThan(1000);
    expect(FREEZE_LEAD_MS).toBeGreaterThan(0);
    expect(MAX_REPLAY_MS).toBeLessThanOrEqual(3000);
    expect(mustFreeze(200, 1000)).toBe(true);
    expect(mustFreeze(0, 1000)).toBe(false);
    expect(() => mustFreeze(0, 1000, 1000)).toThrow(/leadMs/);
  });
});

describe("cross rule", () => {
  const state = (passedCrosswalk: boolean, speed: number): CarState => ({
    id: "car-1",
    position: { x: 0, y: 0 },
    heading: { x: 1, y: 0 },
    speed,
    passedCrosswalk,
  });

  it("does not treat a stopped car as a safe cross", () => {
    expect(canCross(state(false, 0))).toBe(false);
    expect(canCross(state(true, 80))).toBe(true);
  });
});
