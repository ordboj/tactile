import type { AudioHooks, SpatialCue } from "./hooks";
import { scheduleDangerTone, type DangerToneHandle } from "./dangerTone";

interface ToneHandle {
  readonly stop: () => void;
}

export interface PlaceholderAudioOptions {
  readonly reducedMotion?: () => boolean;
  readonly createContext?: () => AudioContext;
}

/**
 * Car, place, and road-pulse cues are short sine placeholders.
 * The danger cue is the tone in docs/audio/danger-sound.md.
 * No audio files and no voice.
 */
export function createPlaceholderAudio(options: PlaceholderAudioOptions = {}): AudioHooks & {
  prime(): void;
} {
  let context: AudioContext | null = null;
  let lastSpatial: SpatialCue | null = null;
  const active: ToneHandle[] = [];

  function audioContext(): AudioContext | null {
    if (context !== null) {
      return context;
    }
    if (options.createContext !== undefined) {
      context = options.createContext();
      return context;
    }
    const webkit = (globalThis as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    const Ctor = globalThis.AudioContext ?? webkit;
    if (typeof Ctor !== "function") {
      return null;
    }
    context = new Ctor();
    return context;
  }

  function track(handle: DangerToneHandle): void {
    active.push(handle);
  }

  function tone(frequency: number, seconds: number, gainValue: number, pan: number): void {
    const audio = audioContext();
    if (audio === null) {
      return;
    }
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    const panner = audio.createStereoPanner();
    osc.type = "sine";
    osc.frequency.value = frequency;
    const now = audio.currentTime;
    gain.gain.setValueAtTime(gainValue, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + seconds);
    panner.pan.value = Math.max(-1, Math.min(1, pan));
    osc.connect(gain);
    gain.connect(panner);
    panner.connect(audio.destination);
    osc.start(now);
    osc.stop(now + seconds);
    const handle: ToneHandle = {
      stop() {
        try {
          osc.stop();
        } catch {
          // The tone already ended.
        }
      },
    };
    active.push(handle);
    osc.onended = () => {
      const index = active.indexOf(handle);
      if (index >= 0) {
        active.splice(index, 1);
      }
    };
  }

  function playSpatial(cue: SpatialCue): void {
    lastSpatial = cue;
    const closeness = 1 / (1 + cue.distance / 200);
    const pan = Math.sin(cue.directionRad);
    tone(180 + closeness * 520, 0.35, 0.08 + closeness * 0.18, pan);
  }

  return {
    prime() {
      const audio = audioContext();
      if (audio !== null && audio.state === "suspended") {
        void audio.resume();
      }
    },
    playSpatial,
    playDanger() {
      const audio = audioContext();
      if (audio === null) {
        return;
      }
      if (audio.state === "suspended") {
        void audio.resume();
      }
      const reduced = options.reducedMotion?.() === true;
      for (const handle of scheduleDangerTone(audio, reduced)) {
        track(handle);
      }
    },
    replayCue(cueId) {
      if (lastSpatial !== null && lastSpatial.cueId === cueId) {
        playSpatial(lastSpatial);
        return;
      }
      tone(360, 0.3, 0.16, 0);
    },
    stopAll() {
      for (const handle of active) {
        handle.stop();
      }
      active.length = 0;
    },
  };
}
