import type { Vec2 } from "../../levels/schema";
import type { AudioHooks, SpatialCue } from "../../audio/hooks";

export const PULSE_INTERVAL_MS = 480;

export const PULSE_ON_MS = 28;

export const PULSE_GAP_MS = 70;

export const ROAD_PULSE_KEY = "road-pulse.1";

export interface VibrateFn {
  (pattern: readonly number[]): boolean;
}

export interface TouchQueryInput {
  readonly holding: boolean;
  readonly nowMs: number;
  readonly lastPulseMs: number | null;
  readonly distance: number;
  readonly vibrate: VibrateFn | undefined;
  readonly audio: AudioHooks;
  readonly position: Vec2;
  readonly directionRad: number;
}

export interface TouchQueryResult {
  readonly lastPulseMs: number | null;
  readonly pulsed: boolean;
  readonly usedVibration: boolean;
  readonly usedFallback: boolean;
  readonly barCount: 0 | 1 | 2 | 3;
  readonly pattern: readonly number[];
  readonly captionKey: typeof ROAD_PULSE_KEY | null;
}

export function barsForDistance(distance: number): 1 | 2 | 3 {
  if (distance < 160) {
    return 3;
  }
  if (distance < 360) {
    return 2;
  }
  return 1;
}

export function pulsePattern(bars: 1 | 2 | 3): readonly number[] {
  const pattern: number[] = [];
  for (let index = 0; index < bars; index += 1) {
    pattern.push(PULSE_ON_MS);
    if (index < bars - 1) {
      pattern.push(PULSE_GAP_MS);
    }
  }
  return pattern;
}

export function vibrateFromNavigator(nav: { readonly vibrate?: unknown } | undefined): VibrateFn | undefined {
  const vibrate = nav?.vibrate;
  if (typeof vibrate !== "function") {
    return undefined;
  }
  return (pattern) => {
    const result = (vibrate as (this: unknown, pattern: number[]) => boolean).call(nav, [...pattern]);
    return result !== false;
  };
}

function pulseCue(input: TouchQueryInput): SpatialCue {
  return {
    cueId: "road-pulse",
    position: input.position,
    distance: input.distance,
    directionRad: input.directionRad,
  };
}

export function touchToQuery(input: TouchQueryInput): TouchQueryResult {
  if (!input.holding) {
    return {
      lastPulseMs: input.lastPulseMs,
      pulsed: false,
      usedVibration: false,
      usedFallback: false,
      barCount: 0,
      pattern: [],
      captionKey: null,
    };
  }

  const bars = barsForDistance(input.distance);
  const due = input.lastPulseMs === null || input.nowMs - input.lastPulseMs >= PULSE_INTERVAL_MS;
  if (!due) {
    return {
      lastPulseMs: input.lastPulseMs,
      pulsed: false,
      usedVibration: false,
      usedFallback: false,
      barCount: bars,
      pattern: [],
      captionKey: ROAD_PULSE_KEY,
    };
  }

  const pattern = pulsePattern(bars);
  const lastPulseMs = input.nowMs;
  if (input.vibrate !== undefined) {
    let vibrated = false;
    try {
      vibrated = input.vibrate(pattern);
    } catch {
      vibrated = false;
    }
    if (vibrated) {
      return {
        lastPulseMs,
        pulsed: true,
        usedVibration: true,
        usedFallback: false,
        barCount: bars,
        pattern,
        captionKey: ROAD_PULSE_KEY,
      };
    }
  }

  input.audio.playSpatial(pulseCue(input));
  return {
    lastPulseMs,
    pulsed: true,
    usedVibration: false,
    usedFallback: true,
    barCount: bars,
    pattern,
    captionKey: ROAD_PULSE_KEY,
  };
}
