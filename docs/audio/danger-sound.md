# Danger sound

This file is team text.
It is not player text.

Ticket: TAC-16.
The hook is `playDanger()` in [src/audio/hooks.ts](../../src/audio/hooks.ts).
The hook keeps that name.
The hook takes no argument.
Source: [docs/product/mission-1-spec.md](../product/mission-1-spec.md) section 6 and OQ-6.
The ethics review asks for a short cue and a set loudness.
That review is [docs/psychology/mission-1-ethics-review.md](../psychology/mission-1-ethics-review.md).
This file sets the cue and the loudness.

The danger sound has no audio file.
The builder makes the cue with the Web Audio API.
Use one `OscillatorNode`.
Use one `BiquadFilterNode`.
Use one `GainNode` for the cue.
Use one `StereoPannerNode`.
Use one master `GainNode`.
The cue has no voice.
The cue uses no third-party asset.
Gate G3 does not apply to this cue.

## Design goals

The cue is clearly alarming.
The cue is not harsh.
The cue is not painful.
Each burst is well under 1 second.
The peak gain is at most 0.3 before the master.
The cue does not clip.

The place sound is a different cue.
The car sound is a different cue.
The separation rules are below.

## Shared parameters

Both variants use these values.
The Web Audio API uses seconds.
A time of 280 ms is 0.28 seconds.

| Parameter | Value |
| --- | --- |
| Wave type | `triangle` |
| Start pitch | 480 Hz |
| End pitch | 960 Hz |
| Pitch pattern | One steady octave rise over the whole burst |
| Frequency ramp | `exponentialRampToValueAtTime` from 480 Hz to 960 Hz |
| Attack start gain | 0 |
| Gain ramp | `linearRampToValueAtTime` |
| Filter type | `lowpass` |
| Filter frequency | 2400 Hz |
| Filter Q | 0.707 |
| Pan | 0 |
| Master gain | 1 |

At t seconds from the burst start, take 2 to the power of (t / 0.28).
Multiply that result by 480.
The unit is Hz.
At 0 seconds the pitch is 480 Hz.
At 0.28 seconds the pitch is 960 Hz.
The rise does not stop during the hold.
The pitch does not fall.

Ramp the gain in straight lines between the points below.
The release ends at gain 0.
Use `linearRampToValueAtTime` for every gain move.
Do not use `exponentialRampToValueAtTime` for a gain move that ends at 0.
The API rejects an exponential ramp to 0.

Set the filter Q to 0.707.
Do not set Q above 0.707.
A higher Q can boost the peak.
Do not set `filter.gain`.
`filter.gain` has no effect on a lowpass.

## Standard cue

Use this cue when reduced motion is off.

| Parameter | Value |
| --- | --- |
| Attack | 20 ms, gain 0 to 0.22 |
| Decay | 40 ms, gain 0.22 to 0.14 |
| Hold | 160 ms at gain 0.14 |
| Release | 60 ms, gain 0.14 to 0 |
| Burst length | 280 ms |
| Peak gain | 0.22 |
| Sustain gain | 0.14 |
| Bursts | 2 |
| Repeats | 1 |
| Gap | 80 ms of silence |
| Pattern length | 640 ms |

Repeats means the extra bursts after the first burst.
One repeat gives two bursts.
The second burst starts at 360 ms.
The second burst uses the same rise.
The second burst starts again at 480 Hz.

Gain points for one burst:

| Time | Gain |
| --- | --- |
| 0 ms | 0 |
| 20 ms | 0.22 |
| 60 ms | 0.14 |
| 220 ms | 0.14 |
| 280 ms | 0 |

Add 360 ms to each time for the second burst.
From 280 ms to 360 ms the gain stays at 0.

## Reduced-intensity cue

Use this cue when reduced motion is on.
The pitch, the wave, the filter and the pan stay the same.
The burst length stays 280 ms.
The rise rate stays the same.

| Parameter | Value |
| --- | --- |
| Attack | 40 ms, gain 0 to 0.10 |
| Decay | 30 ms, gain 0.10 to 0.06 |
| Hold | 140 ms at gain 0.06 |
| Release | 70 ms, gain 0.06 to 0 |
| Burst length | 280 ms |
| Peak gain | 0.10 |
| Sustain gain | 0.06 |
| Bursts | 1 |
| Repeats | 0 |
| Gap | 0 ms |
| Pattern length | 280 ms |

There is no second burst.
There is no gap.

Gain points:

| Time | Gain |
| --- | --- |
| 0 ms | 0 |
| 40 ms | 0.10 |
| 70 ms | 0.06 |
| 210 ms | 0.06 |
| 280 ms | 0 |

The slower attack makes the start softer.
The lower peak makes the cue quieter.
One burst removes the second onset.

## Loudness and clipping

The peak in the tables is the cue `GainNode`.
That peak is before the master.
The standard peak is 0.22.
The reduced peak is 0.10.
Both peaks are under 0.3.
The master gain is 1.
Do not set a gain in this chain above 1.
Use one oscillator.
One oscillator at these peaks does not clip.
Keep the sum of this cue and any other cue at or below 1 at the master.

## Pan rule

Set `StereoPannerNode.pan` to 0.
Both ears get the same signal.
Do not move the pan.
Do not read the car direction for this cue.
Do not follow the car position with this cue.

The node order is fixed.

1. `OscillatorNode`
2. `BiquadFilterNode`
3. Cue `GainNode`
4. `StereoPannerNode`
5. Master `GainNode`
6. `AudioContext.destination`

## When to play

Resume the `AudioContext` from a user gesture before the first cue.
A browser can block sound until that gesture.
Start the cue at the freeze.
Start the cue with the ring.
Play the pattern once.
Do not loop the pattern.
The cue may run past the freeze.
Do not start a second pattern in the replay.

The device setting `prefers-reduced-motion` is the default.
The game has an in-game switch.
After the player sets the switch, use the switch value.
The same switch selects the ring motion.
The rule is in [docs/design/sound-cue-visuals.md](../design/sound-cue-visuals.md).

## Visual pair

The reduced-intensity cue uses the danger visual.
The standard cue uses the same visual.
The visual is the double ring and the caption.

The caption rows are:

```text
Danger.
The scene stops.
```

The ring file is [public/assets/danger-ring.svg](../../public/assets/danger-ring.svg).
The file is original work of this repo.
The inner ring is `#14110E`.
The outer ring is `#F2FBFF`.
Center the ring on the walker.
The scene ring width is 120 CSS px.

When reduced motion is off, the ring grows once.
The grow runs from scale 0.75 to scale 1.
The grow lasts 400 ms.
Play the standard cue with that ring.

When reduced motion is on, the ring is still.
Show scale 1 at once.
The ring does not grow.
The ring does not pulse.
Play the reduced-intensity cue with that still ring.
The caption rows stay the same.
The caption does not move.
The caption does not fade.

## Separation from the other cues

The place sound is one steady tone.
It has one pitch.
It has no second burst.
The caption is "Place sound."
The tone lasts 1 second or less.
Those rules are in [docs/design/sound-cue-visuals.md](../design/sound-cue-visuals.md).

The car sound follows the car.
It has a direction and a distance.
It can continue while the car moves.
The caption is "Car sound."

The danger sound rises one octave, from 480 Hz to 960 Hz.
The standard pattern has two bursts.
The pan stays at 0.
Each burst is 280 ms.
The pattern plays once.

Keep this rise for the danger sound only.
Keep pan 0 for the danger sound only.
The place sound keeps one pitch.
The car sound keeps its direction.

## Files and voice

Do not add a file under `public/audio/` for this cue.
Do not call `decodeAudioData`.
Do not use an `AudioBuffer` for this cue.
Do not use `speechSynthesis`.
Do not play a spoken word.
Do not speak the name Walker.
Use `triangle` for this cue.
Do not use `square` for this cue.
Do not use `sawtooth` for this cue.
A square wave and a sawtooth wave are harsh at this pitch.

## Pseudo-code

This snippet is team text.
Do not add it under `src/`.
The times are seconds.
`reduced` is true when reduced motion is on.

```ts
function playDangerTone(ctx: AudioContext, reduced: boolean): void {
  const peak = reduced ? 0.10 : 0.22;
  const sustain = reduced ? 0.06 : 0.14;
  const attack = reduced ? 0.04 : 0.02;
  const decay = reduced ? 0.03 : 0.04;
  const release = reduced ? 0.07 : 0.06;
  const total = 0.28;
  const bursts = reduced ? 1 : 2;
  const gap = 0.08;

  const master = ctx.createGain();
  master.gain.value = 1;
  master.connect(ctx.destination);

  for (let i = 0; i < bursts; i += 1) {
    const t0 = ctx.currentTime + i * (total + gap);
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    const pan = ctx.createStereoPanner();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(480, t0);
    osc.frequency.exponentialRampToValueAtTime(960, t0 + total);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2400, t0);
    filter.Q.setValueAtTime(0.707, t0);

    const holdEnd = t0 + total - release;
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(peak, t0 + attack);
    gain.gain.linearRampToValueAtTime(sustain, t0 + attack + decay);
    gain.gain.setValueAtTime(sustain, holdEnd);
    gain.gain.linearRampToValueAtTime(0, t0 + total);

    pan.pan.setValueAtTime(0, t0);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(pan);
    pan.connect(master);
    osc.start(t0);
    osc.stop(t0 + total);
  }
}
```
