import { describe, expect, it } from "vitest";
import type { AudioHooks, SpatialCue } from "../audio/hooks";
import { mission1 } from "../levels/mission1";
import { playerLine } from "../levels/playerCopy";
import type { PlayerAction } from "../levels/schema";
import { predictContactTimeMs } from "./traffic";
import { SESSION_SCORE } from "./sessionScore";
import logicSource from "./Mission1Logic.ts?raw";
import { Mission1Logic } from "./Mission1Logic";
import sceneSource from "../scenes/Mission1Scene.ts?raw";
import mapSource from "../scenes/TactileMapView.ts?raw";
import pageSource from "../../index.html?raw";
import { playerLineRow } from "../levels/playerCopy";
import { PART_A_STEP_SPECS } from "./tutorial/PartAFlow";

const PART_A: readonly PlayerAction[] = PART_A_STEP_SPECS.map((step) => step.action);

function hooks(): AudioHooks & { danger: number; spatial: SpatialCue[] } {
  const spatial: SpatialCue[] = [];
  const api = {
    danger: 0,
    spatial,
    playSpatial(cue: SpatialCue) {
      spatial.push(cue);
    },
    playDanger() {
      api.danger += 1;
    },
    replayCue() {},
    stopAll() {},
  };
  return api;
}

function started(): { logic: Mission1Logic; audio: ReturnType<typeof hooks> } {
  const audio = hooks();
  const logic = new Mission1Logic(audio);
  logic.start(mission1);
  return { logic, audio };
}

function finishPartA(logic: Mission1Logic): void {
  for (const action of PART_A) {
    logic.input(action, logic.timeMs);
    const result = logic.tick(50);
    expect(result.events.some((event) => event.type === "failure")).toBe(false);
    expect(result.view.failure).toBeNull();
    if (action !== "cross") {
      expect(result.view.car).toBeNull();
    }
  }
}

describe("mission 1 logic", () => {
  it("keeps Part A free of cars and failure, then starts Part B", () => {
    const { logic } = started();
    const first = logic.tick(50);
    expect(first.view.car).toBeNull();
    expect(first.view.text?.text).toBe(playerLine("move.1"));
    expect(first.view.mapWalker.position).toEqual(first.view.sceneWalker.position);
    expect(first.view.notice).toBe("This is a game. Follow local traffic rules.");
    finishPartA(logic);
    expect(logic.tick(0).view.car).not.toBeNull();
    expect(logic.failures).toHaveLength(0);
  });

  it("completes on a good cross and scores a safe wait higher than a fast cross", () => {
    const safe = started();
    finishPartA(safe.logic);
    safe.logic.input("wait", safe.logic.timeMs);
    safe.logic.tick(6000);
    expect(safe.logic.tick(0).view.car?.passedCrosswalk).toBe(true);
    safe.logic.input("cross", safe.logic.timeMs);
    const safeResult = safe.logic.tick(50);
    expect(safeResult.events).toContainEqual({ type: "mission-complete" });
    expect(safeResult.events.some((event) => event.type === "failure")).toBe(false);
    expect(safe.logic.sessionScore).toBe(SESSION_SCORE.safeWait);
    expect(safeResult.view.text?.text).toBe(playerLine("part-b-feedback-lines.safe-wait.3"));

    const fast = started();
    finishPartA(fast.logic);
    fast.logic.tick(6000);
    fast.logic.input("cross", fast.logic.timeMs);
    const fastResult = fast.logic.tick(50);
    expect(fastResult.events).toContainEqual({ type: "mission-complete" });
    expect(fast.logic.sessionScore).toBe(SESSION_SCORE.fastCross);
    expect(fast.logic.sessionScore).toBeLessThan(safe.logic.sessionScore);
    expect(JSON.stringify(mission1)).not.toContain("sessionScore");
    expect(logicSource).not.toMatch(/localStorage|sessionStorage|indexedDB/);
  });

  it("emits one failure payload and does not move the car onto the walker", () => {
    const { logic, audio } = started();
    finishPartA(logic);
    const before = logic.tick(0);
    const car = before.view.car;
    if (car === undefined || car === null) {
      throw new Error("missing car");
    }
    logic.input("cross", logic.timeMs);
    const result = logic.tick(50);
    const failures = result.events.filter((event) => event.type === "failure");
    expect(failures).toHaveLength(1);
    const predicted = predictContactTimeMs({
      carX: car.position.x,
      speed: car.speed,
      crosswalkMinX: 360,
      crosswalkMaxX: 440,
      walkerOnRoad: true,
      nowMs: before.view ? logic.timeMs - 50 : 0,
    });
    expect(failures[0]).toEqual({
      type: "failure",
      predictedContactMs: predicted,
      missedCueId: "car-sound",
    });
    expect(logic.failures).toEqual([
      { predictedContactMs: predicted, missedCueId: "car-sound" },
    ]);
    expect(result.view.failure).toBeNull();
    expect(result.view.car?.position).toEqual(car.position);
    expect(result.view.sceneWalker.position).not.toEqual(result.view.car?.position);
    expect(audio.danger).toBe(1);
    expect(logic.captionText()).toBe(playerLineRow("visual-pair.1", 0));
    expect(logic.captionText()).toBe("Danger.");
    expect(pageSource).toContain('src="assets/sound-wave.svg"');
    expect(logicSource).not.toContain('"Danger."');
    logic.input("cross", logic.timeMs);
    const again = logic.tick(50);
    expect(again.events.filter((event) => event.type === "failure")).toHaveLength(0);
    expect(logic.failures).toHaveLength(1);
    expect(result.events.some((event) => event.type === "mission-complete")).toBe(false);
  });

  it("draws the same walker asset on the map and in the scene", () => {
    expect(sceneSource).toContain("WALKER_ASSET");
    expect(mapSource).toContain("WALKER_ASSET");
    expect(sceneSource).toContain("rectangle");
    expect(mapSource).toContain("MAP_CAR_PX");
  });
});
