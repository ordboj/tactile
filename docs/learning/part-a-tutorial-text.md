# Part A tutorial text

This file holds the player lines for Part A.
It also holds the Part B feedback lines.
The rules are in [docs/learning/copy-rules.md](copy-rules.md).

Ticket: TAC-8.
Source: [docs/product/mission-1-spec.md](../product/mission-1-spec.md) sections 4, 5, and 6.

Part A has no car.
Part A has no traffic light.
Part A has no failure flow.
Do not show a failure line in Part A.

Each player line is one row.
Each player line has 12 words or fewer.
The lines use the third person.

## Start

Show these two rows before the first step.
Also show them at the top of Settings.

```text
This is a game.
Follow local traffic rules.
```

The first row has 4 words.
The second row has 4 words.

## Move

The player learns the move action.

```text
A press on Move walks the walker forward.
```

Words: 8.

Success:

```text
The walker moved forward.
```

Words: 4.

## Turn

The player learns the turn action.
The drop point shows the heading.
The heading rules are in [docs/design/walker.md](../design/walker.md).

```text
A press on Turn changes the heading.
```

Words: 7.

```text
The drop point shows the heading.
```

Words: 6.

Success:

```text
The walker turned.
```

Words: 3.

## Listen

The player learns the listen action.
Part A has no car sound.
The spec does not name the Part A sound.
This file proposes a short tone.
The tone is not a voice.
The caption is "Place sound."
The caption rules are in [docs/design/sound-cue-visuals.md](../design/sound-cue-visuals.md).
The lead can rename this cue.

```text
A press on Listen plays the place sound.
```

Words: 8.

Success:

```text
The walker listened.
```

Words: 3.

## Map

The map is on the left.
The map stays on screen in Mission 1.
This step has no new control.
The player reads the map.

```text
The map is on the left.
```

Words: 6.

```text
The map shows the road and the goal.
```

Words: 8.

```text
The walker on the map matches the scene walker.
```

Words: 9.

Success:

```text
The walker read the map.
```

Words: 5.

## Cross

The player crosses the road once.
Then Part A ends.
No car is in the scene.

```text
A press on Cross moves the walker across the road.
```

Words: 10.

```text
No car is in this part.
```

Words: 6.

Success:

```text
The walker crossed the road.
```

Words: 5.

```text
Part A is complete.
```

Words: 4.

Handoff to Part B:

```text
Part B has one car.
```

Words: 5.

```text
The walker waits.
```

Words: 3.

```text
The car must pass first.
```

Words: 5.

## Proposed steps

Open question OQ-13 asks where to teach step back and align.
This section is a proposal.
It is not the spec script until the lead accepts it.

Teach Stop after Move.
Teach Step back after Turn.
Teach Align after Step back.
Teach Listen after Align.
Keep Wait in Part B.
Part A still has no failure flow.

The order with the proposal is:

1. Move.
2. Stop.
3. Turn.
4. Step back.
5. Align.
6. Listen.
7. Map.
8. Cross.

Stop:

```text
A press on Stop makes the walker stop.
```

Words: 8.

Success:

```text
The walker stopped.
```

Words: 3.

Step back:

```text
A press on Back moves the walker back.
```

Words: 8.

Success:

```text
The walker stepped back.
```

Words: 4.

Align:

```text
A press on Align sets the walker on the crosswalk.
```

Words: 10.

Success:

```text
The walker aligned with the crosswalk.
```

Words: 6.

## Part B feedback lines

These lines are not for Part A.
An unsafe cross in Part B starts the failure flow.
Mission 1 has no separate near-miss state.
The freeze and the replay are the response to that cross.

Do not show contact.
Do not show impact.
Do not show injury.

### Safe wait

```text
The walker waited.
```

Words: 3.

```text
The car passed.
```

Words: 3.

```text
The safe wait scores higher.
```

Words: 5.

### Safe cross

```text
The walker crossed after the car passed.
```

Words: 7.

### Freeze

Show these rows with the danger ring.
The ring rules are in [docs/design/sound-cue-visuals.md](../design/sound-cue-visuals.md).

```text
The scene stops.
```

Words: 3.

```text
The danger ring shows.
```

Words: 4.

### Replay

The replay is 3 seconds or less.
The player can skip it.
The skip control is a button.
The button name is Skip.
Skip is a control name.
Skip is not a feedback line.

The outcome line names the missed cue:

```text
The walker crossed while the car sound came closer.
```

Words: 9.

Use the same pattern for a later cue.
Replace the cue name.
Keep the rest of the line.

### Missed cue

Play the missed cue again after the replay.
Also play it again if the player skips the replay.
Show the sound-wave icon with this caption:

```text
Car sound.
```

Words: 2.

The icon file is [public/assets/sound-wave.svg](../../public/assets/sound-wave.svg).
