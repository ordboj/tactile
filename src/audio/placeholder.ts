import type { AudioHooks, SpatialCue } from "./hooks";

interface ToneHandle {
  readonly stop: () => void;
}

/**
 * Placeholder tones for the audio hooks.
 * Sine waves only. No voice. No audio files.
 */
export function createPlaceholderAudio(): AudioHooks {
  let context: AudioContext | null = null;
  let lastSpatial: SpatialCue | null = null;
  const active: ToneHandle[] = [];

  function audioContext(): AudioContext | null {
    if (context !== null) {
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
    playSpatial,
    playDanger() {
      tone(110, 0.45, 0.22, 0);
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
