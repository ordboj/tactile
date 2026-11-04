import { describe, expect, it } from "vitest";
import type { AudioHooks, SpatialCue } from "../../audio/hooks";
import { playerLine } from "../../levels/playerCopy";
import cueText from "../../../docs/design/sound-cue-visuals.md?raw";
import {
  PULSE_GAP_MS,
  PULSE_ON_MS,
  ROAD_PULSE_KEY,
  pulsePattern,
  touchToQuery,
  vibrateFromNavigator,
  type TouchQueryInput,
} from "./TouchToQuery";

function audio(): AudioHooks & { readonly spatial: SpatialCue[] } {
  const spatial: SpatialCue[] = [];
  return {
    spatial,
    playSpatial(cue) {
      spatial.push(cue);
    },
    playDanger() {},
    replayCue() {},
    stopAll() {},
  };
}

function query(patch: Partial<TouchQueryInput> & Pick<TouchQueryInput, "audio" | "vibrate">): TouchQueryInput {
  return {
    holding: true,
    nowMs: 0,
    lastPulseMs: null,
    distance: 100,
    position: { x: 10, y: 20 },
    directionRad: 0,
    ...patch,
  };
}

describe("touch to query", () => {
  it("uses audio and visual fallback when vibrate is missing", () => {
    expect(vibrateFromNavigator(undefined)).toBeUndefined();
    expect(vibrateFromNavigator({})).toBeUndefined();
    expect(vibrateFromNavigator({ vibrate: undefined })).toBeUndefined();
    const hooks = audio();
    const result = touchToQuery(query({ audio: hooks, vibrate: undefined, distance: 40 }));
    expect(result.usedVibration).toBe(false);
    expect(result.usedFallback).toBe(true);
    expect(result.barCount).toBe(3);
    expect(hooks.spatial).toHaveLength(1);
    expect(hooks.spatial[0]?.cueId).toBe("road-pulse");
    expect(result.captionKey).toBe(ROAD_PULSE_KEY);
    expect(playerLine(ROAD_PULSE_KEY)).toBe("Road pulse.");
    expect(cueText).toContain(playerLine(ROAD_PULSE_KEY));
    expect(result.pattern).toEqual(pulsePattern(3));
    expect(result.pattern).toContain(PULSE_GAP_MS);
    expect(Math.max(...result.pattern)).toBeLessThan(100);
    expect(result.pattern.every((value) => value === PULSE_ON_MS || value === PULSE_GAP_MS)).toBe(true);
  });

  it("does not vibrate unless the player is holding, and not on every call", () => {
    const calls: number[][] = [];
    const vibrate = (pattern: readonly number[]): boolean => {
      calls.push([...pattern]);
      return true;
    };
    const hooks = audio();
    const idle = touchToQuery(query({ audio: hooks, vibrate, holding: false }));
    expect(idle.usedVibration).toBe(false);
    expect(idle.barCount).toBe(0);
    expect(calls).toHaveLength(0);
    expect(hooks.spatial).toHaveLength(0);

    const first = touchToQuery(query({ audio: hooks, vibrate, nowMs: 0 }));
    const soon = touchToQuery(
      query({ audio: hooks, vibrate, nowMs: 40, lastPulseMs: first.lastPulseMs }),
    );
    expect(first.pulsed).toBe(true);
    expect(first.usedFallback).toBe(false);
    expect(soon.pulsed).toBe(false);
    expect(calls).toHaveLength(1);
    expect(hooks.spatial).toHaveLength(0);
  });
});
