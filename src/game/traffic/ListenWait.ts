import { canCross, GameEvents, type CarState, type GameEvent } from "../contracts";
import { predictContactTimeMs, type ContactQuery } from "../traffic";
import { SESSION_SCORE } from "../sessionScore";
import type { CrosswalkInterval } from "./Car";

export const MISSED_CUE_ID = "car-sound";

export const CAR_SOUND_NEAR_PX = 240;

export interface GoodCross {
  readonly kind: "good";
  readonly waited: boolean;
  readonly score: number;
}

export interface BadCross {
  readonly kind: "bad";
  readonly predictedContactMs: number;
  readonly missedCueId: string;
  readonly event: GameEvent;
}

export type CrossDecision = GoodCross | BadCross;

export interface DecideCrossInput {
  readonly car: CarState;
  readonly crosswalk: CrosswalkInterval;
  readonly nowMs: number;
  readonly waited: boolean;
}

/**
 * Bad-cross contact time.
 * A moving car uses predictContactTimeMs, which is the closed form of the
 * 50 ms fixed step. A stopped car does not become safe. If it already
 * occupies the crosswalk, the time is now. If it is stopped before the
 * crosswalk, the fixed step never moves it, and the payload uses the
 * decision time. The scene does not draw that time.
 */
export function contactTimeForBadCross(query: ContactQuery): number {
  if (query.speed > 0) {
    const predicted = predictContactTimeMs(query);
    if (predicted === null) {
      throw new Error("A bad cross is missing a contact time");
    }
    return predicted;
  }
  return query.nowMs;
}

export function decideCross(input: DecideCrossInput): CrossDecision {
  if (canCross(input.car)) {
    return {
      kind: "good",
      waited: input.waited,
      score: input.waited ? SESSION_SCORE.safeWait : SESSION_SCORE.fastCross,
    };
  }
  const predictedContactMs = contactTimeForBadCross({
    carX: input.car.position.x,
    speed: input.car.speed,
    crosswalkMinX: input.crosswalk.minX,
    crosswalkMaxX: input.crosswalk.maxX,
    walkerOnRoad: true,
    nowMs: input.nowMs,
  });
  const event: GameEvent = {
    type: GameEvents.failure,
    predictedContactMs,
    missedCueId: MISSED_CUE_ID,
  };
  return {
    kind: "bad",
    predictedContactMs,
    missedCueId: MISSED_CUE_ID,
    event,
  };
}

export function pickCarSoundRow(input: {
  readonly carX: number;
  readonly walkerX: number;
  readonly distance: number;
  readonly previousDistance: number | null;
}): number {
  if (input.previousDistance !== null && input.distance < input.previousDistance) {
    return 5;
  }
  const left = input.carX < input.walkerX;
  const far = input.distance >= CAR_SOUND_NEAR_PX;
  if (left && far) {
    return 1;
  }
  if (left) {
    return 2;
  }
  if (far) {
    return 3;
  }
  return 4;
}
