import { describe, expect, it } from "vitest";
import type { CarState } from "../contracts";
import { FIXED_STEP_MS, predictContactTimeMs } from "../traffic";
import { SESSION_SCORE } from "../sessionScore";
import { decideCross, type DecideCrossInput } from "./ListenWait";

const crosswalk = { minX: 360, maxX: 440 };

function car(patch: Partial<CarState>): CarState {
  return {
    id: "car-1",
    position: { x: -40, y: 300 },
    heading: { x: 1, y: 0 },
    speed: 80,
    passedCrosswalk: false,
    ...patch,
  };
}

function input(patch: Partial<DecideCrossInput> & Pick<DecideCrossInput, "car">): DecideCrossInput {
  return {
    crosswalk,
    nowMs: 0,
    waited: false,
    ...patch,
  };
}

describe("listen and wait", () => {
  it("scores a safe wait higher than a fast cross", () => {
    const passed = car({ position: { x: 440, y: 300 }, passedCrosswalk: true });
    const safe = decideCross(input({ car: passed, waited: true }));
    const fast = decideCross(input({ car: passed, waited: false }));
    expect(safe.kind).toBe("good");
    expect(fast.kind).toBe("good");
    if (safe.kind !== "good" || fast.kind !== "good") {
      return;
    }
    expect(safe.score).toBe(SESSION_SCORE.safeWait);
    expect(fast.score).toBe(SESSION_SCORE.fastCross);
    expect(safe.score).toBeGreaterThan(fast.score);
    expect(safe).not.toHaveProperty("event");
    expect(fast).not.toHaveProperty("event");
  });

  it("raises one failure event for a bad time, with the fixed-step contact time", () => {
    const nowMs = 250;
    const moving = car({ position: { x: -40, y: 300 } });
    const predicted = predictContactTimeMs({
      carX: moving.position.x,
      speed: moving.speed,
      crosswalkMinX: crosswalk.minX,
      crosswalkMaxX: crosswalk.maxX,
      walkerOnRoad: true,
      nowMs,
    });
    let x = moving.position.x;
    let time = nowMs;
    while (x < crosswalk.minX) {
      x += moving.speed * (FIXED_STEP_MS / 1000);
      time += FIXED_STEP_MS;
    }
    expect(time).toBe(predicted);
    expect(x).toBeCloseTo(crosswalk.minX, 10);

    const first = decideCross(input({ car: moving, nowMs }));
    const second = decideCross(input({ car: moving, nowMs }));
    expect(first).toEqual(second);
    expect(first.kind).toBe("bad");
    if (first.kind !== "bad") {
      return;
    }
    expect(first.event).toEqual({
      type: "failure",
      predictedContactMs: predicted,
      missedCueId: "car-sound",
    });
    expect(first.predictedContactMs).toBe(predicted);
    expect(Object.keys(first.event)).toEqual(["type", "predictedContactMs", "missedCueId"]);
  });

  it("does not treat a stopped car as a good time", () => {
    const stopped = decideCross(
      input({
        car: car({ speed: 0, position: { x: 0, y: 300 }, passedCrosswalk: false }),
        nowMs: 80,
        waited: true,
      }),
    );
    expect(stopped.kind).toBe("bad");
    if (stopped.kind !== "bad") {
      return;
    }
    expect(stopped.predictedContactMs).toBe(80);
    expect(stopped.missedCueId).toBe("car-sound");

    const inside = decideCross(
      input({
        car: car({ speed: 0, position: { x: 400, y: 300 }, passedCrosswalk: false }),
        nowMs: 15,
      }),
    );
    expect(inside.kind).toBe("bad");
    if (inside.kind === "bad") {
      expect(inside.predictedContactMs).toBe(15);
    }
  });
});
