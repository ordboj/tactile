import { describe, expect, it } from "vitest";
import dangerDoc from "../../docs/audio/danger-sound.md?raw";
import dangerSource from "./dangerTone.ts?raw";
import { createPlaceholderAudio } from "./placeholder";
import { dangerTonePlan, scheduleDangerTone } from "./dangerTone";

interface RampEvent {
  readonly method: "set" | "linear" | "expo";
  readonly value: number;
  readonly time: number;
}

interface RecNode {
  kind: string;
  type?: string;
  gainValue?: number;
  connectTarget?: RecNode;
  frequency?: RampEvent[];
  q?: RampEvent[];
  gain?: RampEvent[];
  pan?: RampEvent[];
  started?: number;
  stopped?: number;
}

function section(markdown: string, title: string): string {
  const marker = `## ${title}`;
  const start = markdown.indexOf(marker);
  if (start < 0) {
    throw new Error(`missing section ${title}`);
  }
  const rest = markdown.slice(start + marker.length);
  const next = rest.indexOf("\n## ");
  return next === -1 ? rest : rest.slice(0, next);
}

function cells(line: string): readonly string[] {
  return line
    .split("|")
    .map((cell) => cell.trim())
    .filter((cell) => cell !== "");
}

function parameterTable(markdown: string): ReadonlyMap<string, string> {
  const map = new Map<string, string>();
  let inTable = false;
  for (const line of markdown.split("\n")) {
    if (line.startsWith("| Parameter")) {
      inTable = true;
      continue;
    }
    if (!inTable) {
      continue;
    }
    if (line.startsWith("| ---")) {
      continue;
    }
    if (!line.startsWith("|")) {
      break;
    }
    const [name, value] = cells(line);
    if (name === undefined || value === undefined) {
      throw new Error(`bad parameter row ${line}`);
    }
    map.set(name, value.replace(/`/g, ""));
  }
  return map;
}

function gainPoints(markdown: string): readonly { readonly ms: number; readonly gain: number }[] {
  const points: { ms: number; gain: number }[] = [];
  let inTable = false;
  for (const line of markdown.split("\n")) {
    if (line.startsWith("| Time")) {
      inTable = true;
      continue;
    }
    if (!inTable) {
      continue;
    }
    if (line.startsWith("| ---")) {
      continue;
    }
    if (!line.startsWith("|")) {
      break;
    }
    const [time, gain] = cells(line);
    if (time === undefined || gain === undefined) {
      throw new Error(`bad gain row ${line}`);
    }
    points.push({ ms: Number.parseFloat(time), gain: Number.parseFloat(gain) });
  }
  return points;
}

function firstNumber(value: string): number {
  const match = /-?\d+(?:\.\d+)?/.exec(value);
  if (match === null) {
    throw new Error(`no number in ${value}`);
  }
  return Number.parseFloat(match[0]);
}

function param(): AudioParam & { readonly events: RampEvent[] } {
  const events: RampEvent[] = [];
  return {
    events,
    value: 0,
    defaultValue: 0,
    setValueAtTime(value: number, time: number) {
      events.push({ method: "set", value, time });
      return this;
    },
    linearRampToValueAtTime(value: number, time: number) {
      events.push({ method: "linear", value, time });
      return this;
    },
    exponentialRampToValueAtTime(value: number, time: number) {
      events.push({ method: "expo", value, time });
      return this;
    },
  } as unknown as AudioParam & { readonly events: RampEvent[] };
}

function fakeContext(now: number): { readonly ctx: AudioContext; readonly created: RecNode[] } {
  const created: RecNode[] = [];
  const destination: RecNode = { kind: "destination" };

  function node(kind: string): RecNode & { rec: RecNode } {
    const rec: RecNode = { kind };
    created.push(rec);
    return Object.assign(rec, { rec });
  }

  const ctx = {
    currentTime: now,
    destination,
    state: "running",
    createOscillator() {
      const rec = node("osc");
      const frequency = param();
      rec.frequency = frequency.events;
      return {
        rec,
        get type() {
          return rec.type ?? "";
        },
        set type(value: string) {
          rec.type = value;
        },
        frequency,
        connect(target: { rec?: RecNode }) {
          rec.connectTarget = target.rec ?? (target as RecNode);
        },
        start(when: number) {
          rec.started = when;
        },
        stop(when: number) {
          rec.stopped = when;
        },
      };
    },
    createBiquadFilter() {
      const rec = node("filter");
      const frequency = param();
      const q = param();
      rec.frequency = frequency.events;
      rec.q = q.events;
      return {
        rec,
        get type() {
          return rec.type ?? "";
        },
        set type(value: string) {
          rec.type = value;
        },
        frequency,
        Q: q,
        connect(target: { rec?: RecNode }) {
          rec.connectTarget = target.rec ?? (target as RecNode);
        },
      };
    },
    createGain() {
      const rec = node("gain");
      const gain = param();
      rec.gain = gain.events;
      Object.defineProperty(gain, "value", {
        configurable: true,
        get() {
          return rec.gainValue ?? 0;
        },
        set(next: number) {
          rec.gainValue = next;
        },
      });
      return {
        rec,
        gain,
        connect(target: { rec?: RecNode }) {
          rec.connectTarget = target.rec ?? (target as RecNode);
        },
      };
    },
    createStereoPanner() {
      const rec = node("pan");
      const pan = param();
      rec.pan = pan.events;
      return {
        rec,
        pan,
        connect(target: { rec?: RecNode }) {
          rec.connectTarget = target.rec ?? (target as RecNode);
        },
      };
    },
  };
  return { ctx: ctx as unknown as AudioContext, created };
}

function expectRamps(actual: readonly RampEvent[] | undefined, expected: readonly RampEvent[]): void {
  expect(actual).toHaveLength(expected.length);
  expected.forEach((event, index) => {
    const got = actual?.[index];
    expect(got?.method).toBe(event.method);
    expect(got?.value).toBeCloseTo(event.value, 10);
    expect(got?.time).toBeCloseTo(event.time, 10);
  });
}

describe("danger tone", () => {
  it("matches the shared, standard, and reduced values in the doc", () => {
    const shared = parameterTable(section(dangerDoc, "Shared parameters"));
    const standard = parameterTable(section(dangerDoc, "Standard cue"));
    const reduced = parameterTable(section(dangerDoc, "Reduced-intensity cue"));
    const standardPoints = gainPoints(section(dangerDoc, "Standard cue"));
    const reducedPoints = gainPoints(section(dangerDoc, "Reduced-intensity cue"));
    const full = dangerTonePlan(false);
    const soft = dangerTonePlan(true);

    expect(full.wave).toBe(shared.get("Wave type"));
    expect(full.startHz).toBe(firstNumber(shared.get("Start pitch") ?? ""));
    expect(full.endHz).toBe(firstNumber(shared.get("End pitch") ?? ""));
    expect(full.endHz / full.startHz).toBe(2);
    expect(full.filterType).toBe(shared.get("Filter type"));
    expect(full.filterHz).toBe(firstNumber(shared.get("Filter frequency") ?? ""));
    expect(full.filterQ).toBe(firstNumber(shared.get("Filter Q") ?? ""));
    expect(full.pan).toBe(firstNumber(shared.get("Pan") ?? ""));
    expect(full.masterGain).toBe(firstNumber(shared.get("Master gain") ?? ""));

    expect(full.burst.peak).toBe(firstNumber(standard.get("Peak gain") ?? ""));
    expect(full.burst.sustain).toBe(firstNumber(standard.get("Sustain gain") ?? ""));
    expect(full.burst.attackSec).toBeCloseTo(firstNumber(standard.get("Attack") ?? "") / 1000, 10);
    expect(full.burst.totalSec).toBeCloseTo(firstNumber(standard.get("Burst length") ?? "") / 1000, 10);
    expect(full.bursts).toBe(firstNumber(standard.get("Bursts") ?? ""));
    expect(full.gapSec).toBeCloseTo(firstNumber(standard.get("Gap") ?? "") / 1000, 10);
    expect(full.patternSec).toBeCloseTo(firstNumber(standard.get("Pattern length") ?? "") / 1000, 10);
    expect(full.burst.peak).toBeLessThanOrEqual(0.3);
    expect(full.masterGain).toBeLessThanOrEqual(1);

    expect(soft.burst.peak).toBe(firstNumber(reduced.get("Peak gain") ?? ""));
    expect(soft.burst.sustain).toBe(firstNumber(reduced.get("Sustain gain") ?? ""));
    expect(soft.burst.attackSec).toBeCloseTo(firstNumber(reduced.get("Attack") ?? "") / 1000, 10);
    expect(soft.bursts).toBe(firstNumber(reduced.get("Bursts") ?? ""));
    expect(soft.gapSec).toBe(0);
    expect(soft.patternSec).toBeCloseTo(firstNumber(reduced.get("Pattern length") ?? "") / 1000, 10);
    expect(soft.startHz).toBe(full.startHz);
    expect(soft.endHz).toBe(full.endHz);
    expect(soft.wave).toBe(full.wave);
    expect(soft.filterHz).toBe(full.filterHz);
    expect(soft.pan).toBe(0);

    expect(standardPoints).toEqual([
      { ms: 0, gain: 0 },
      { ms: 20, gain: full.burst.peak },
      { ms: 60, gain: full.burst.sustain },
      { ms: 220, gain: full.burst.sustain },
      { ms: 280, gain: 0 },
    ]);
    expect(reducedPoints).toEqual([
      { ms: 0, gain: 0 },
      { ms: 40, gain: soft.burst.peak },
      { ms: 70, gain: soft.burst.sustain },
      { ms: 210, gain: soft.burst.sustain },
      { ms: 280, gain: 0 },
    ]);
  });

  it("schedules the standard graph once, then the reduced graph as one burst", () => {
    const now = 5;
    const standard = fakeContext(now);
    scheduleDangerTone(standard.ctx, false);
    const oscillators = standard.created.filter((node) => node.kind === "osc");
    const masters = standard.created.filter((node) => node.kind === "gain" && node.gainValue === 1);
    expect(oscillators).toHaveLength(2);
    expect(masters).toHaveLength(1);
    expect(masters[0]?.connectTarget?.kind).toBe("destination");

    oscillators.forEach((osc, index) => {
      const t0 = now + index * 0.36;
      expect(osc.type).toBe("triangle");
      expect(osc.started).toBe(t0);
      expect(osc.stopped).toBeCloseTo(t0 + 0.28, 10);
      expectRamps(osc.frequency, [
        { method: "set", value: 480, time: t0 },
        { method: "expo", value: 960, time: t0 + 0.28 },
      ]);
      const filter = osc.connectTarget;
      expect(filter?.kind).toBe("filter");
      expect(filter?.type).toBe("lowpass");
      expectRamps(filter?.frequency, [{ method: "set", value: 2400, time: t0 }]);
      expectRamps(filter?.q, [{ method: "set", value: 0.707, time: t0 }]);
      const gain = filter?.connectTarget;
      expect(gain?.kind).toBe("gain");
      expect(gain?.gain?.some((event) => event.method === "expo")).toBe(false);
      expectRamps(gain?.gain, [
        { method: "set", value: 0, time: t0 },
        { method: "linear", value: 0.22, time: t0 + 0.02 },
        { method: "linear", value: 0.14, time: t0 + 0.06 },
        { method: "set", value: 0.14, time: t0 + 0.22 },
        { method: "linear", value: 0, time: t0 + 0.28 },
      ]);
      const pan = gain?.connectTarget;
      expect(pan?.kind).toBe("pan");
      expectRamps(pan?.pan, [{ method: "set", value: 0, time: t0 }]);
      expect(pan?.connectTarget).toBe(masters[0]);
    });
    expect((oscillators[0]?.stopped ?? 0) < (oscillators[1]?.started ?? 0)).toBe(true);

    const soft = fakeContext(now);
    scheduleDangerTone(soft.ctx, true);
    const softOsc = soft.created.filter((node) => node.kind === "osc");
    expect(softOsc).toHaveLength(1);
    expect(softOsc[0]?.gain === undefined).toBe(true);
    const softGain = softOsc[0]?.connectTarget?.connectTarget;
    expectRamps(softGain?.gain, [
      { method: "set", value: 0, time: now },
      { method: "linear", value: 0.1, time: now + 0.04 },
      { method: "linear", value: 0.06, time: now + 0.07 },
      { method: "set", value: 0.06, time: now + 0.21 },
      { method: "linear", value: 0, time: now + 0.28 },
    ]);
    expect(dangerSource).not.toMatch(/decodeAudioData|AudioBuffer|speechSynthesis|sawtooth|square/);
  });

  it("plays the doc tone from the danger hook", () => {
    const standard = fakeContext(2);
    const full = createPlaceholderAudio({
      reducedMotion: () => false,
      createContext: () => standard.ctx,
    });
    full.playDanger();
    expect(standard.created.filter((node) => node.kind === "osc")).toHaveLength(2);

    const soft = fakeContext(3);
    const quiet = createPlaceholderAudio({
      reducedMotion: () => true,
      createContext: () => soft.ctx,
    });
    quiet.playDanger();
    expect(soft.created.filter((node) => node.kind === "osc")).toHaveLength(1);
    expect(soft.created.find((node) => node.kind === "osc")?.type).toBe("triangle");
  });
});
