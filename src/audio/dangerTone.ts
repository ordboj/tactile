/**
 * Danger cue from docs/audio/danger-sound.md.
 * One oscillator per burst. The bursts do not overlap.
 * No audio file and no voice.
 */

export interface DangerBurstShape {
  readonly attackSec: number;
  readonly decaySec: number;
  readonly releaseSec: number;
  readonly totalSec: number;
  readonly peak: number;
  readonly sustain: number;
}

export interface DangerTonePlan {
  readonly wave: "triangle";
  readonly startHz: number;
  readonly endHz: number;
  readonly filterType: "lowpass";
  readonly filterHz: number;
  readonly filterQ: number;
  readonly pan: number;
  readonly masterGain: number;
  readonly bursts: number;
  readonly gapSec: number;
  readonly patternSec: number;
  readonly burst: DangerBurstShape;
}

const SHARED = {
  wave: "triangle",
  startHz: 480,
  endHz: 960,
  filterType: "lowpass",
  filterHz: 2400,
  filterQ: 0.707,
  pan: 0,
  masterGain: 1,
  totalSec: 0.28,
} as const;

export function dangerTonePlan(reduced: boolean): DangerTonePlan {
  const burst: DangerBurstShape = reduced
    ? { attackSec: 0.04, decaySec: 0.03, releaseSec: 0.07, totalSec: SHARED.totalSec, peak: 0.1, sustain: 0.06 }
    : { attackSec: 0.02, decaySec: 0.04, releaseSec: 0.06, totalSec: SHARED.totalSec, peak: 0.22, sustain: 0.14 };
  const bursts = reduced ? 1 : 2;
  const gapSec = reduced ? 0 : 0.08;
  const patternSec = bursts * burst.totalSec + (bursts - 1) * gapSec;
  return {
    wave: SHARED.wave,
    startHz: SHARED.startHz,
    endHz: SHARED.endHz,
    filterType: SHARED.filterType,
    filterHz: SHARED.filterHz,
    filterQ: SHARED.filterQ,
    pan: SHARED.pan,
    masterGain: SHARED.masterGain,
    bursts,
    gapSec,
    patternSec,
    burst,
  };
}

export interface DangerToneHandle {
  stop(): void;
}

export function scheduleDangerTone(ctx: AudioContext, reduced: boolean): readonly DangerToneHandle[] {
  const plan = dangerTonePlan(reduced);
  const master = ctx.createGain();
  master.gain.value = plan.masterGain;
  master.connect(ctx.destination);

  const handles: DangerToneHandle[] = [];
  for (let index = 0; index < plan.bursts; index += 1) {
    const t0 = ctx.currentTime + index * (plan.burst.totalSec + plan.gapSec);
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    const pan = ctx.createStereoPanner();

    osc.type = plan.wave;
    osc.frequency.setValueAtTime(plan.startHz, t0);
    osc.frequency.exponentialRampToValueAtTime(plan.endHz, t0 + plan.burst.totalSec);

    filter.type = plan.filterType;
    filter.frequency.setValueAtTime(plan.filterHz, t0);
    filter.Q.setValueAtTime(plan.filterQ, t0);

    const holdEnd = t0 + plan.burst.totalSec - plan.burst.releaseSec;
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(plan.burst.peak, t0 + plan.burst.attackSec);
    gain.gain.linearRampToValueAtTime(plan.burst.sustain, t0 + plan.burst.attackSec + plan.burst.decaySec);
    gain.gain.setValueAtTime(plan.burst.sustain, holdEnd);
    gain.gain.linearRampToValueAtTime(0, t0 + plan.burst.totalSec);

    pan.pan.setValueAtTime(plan.pan, t0);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(pan);
    pan.connect(master);
    osc.start(t0);
    osc.stop(t0 + plan.burst.totalSec);
    handles.push({
      stop() {
        try {
          osc.stop();
        } catch {
          // The burst already ended.
        }
      },
    });
  }
  return handles;
}
