# Mission 1 architecture

This document gives the module layout for Mission 1.
This document gives the interfaces for Mission 1.
The game rules are in the [Mission 1 spec](../product/mission-1-spec.md).
The spec is the source of truth for the rules.
This document is the source of truth for the modules.
Tickets TAC-11 to TAC-19 use these interfaces.
The team lead must say go before TAC-11 to TAC-19 start.
This document does not add the code for TAC-11 to TAC-19.

## 1. Technical names

The time unit in the game logic is the millisecond (ms).

| Name | Meaning |
| --- | --- |
| Walker | The yellow drop token. The player moves the walker. |
| Tactile map | The map on the left side of the screen. |
| Crosswalk | The marked path across the road. |
| One-way road | A road where a car travels in one direction only. |
| Phaser | The program that draws the scene. |
| Vite | The program that starts the local page and builds the game. |
| Scene | The view that Phaser draws. |
| Game logic | The rules. The game logic does not draw. |
| Module | A group of source files with one task. |
| Interface | A set of names that modules share. |
| Event | A named signal from the game logic. |
| Cue | A sound that gives information to the player. |
| Tip | One written line after a failure. |
| Score | The point count for this session. |
| Decision point | The time when the player starts to cross. |
| Snapshot | A copy of the game state at one time. |
| Audio hook | A function that the game logic calls to play a cue. |
| Guide voice | Spoken words from the game. Mission 1 has no guide voice. |
| Fixed time step | A step of 50 ms. The model uses only the 50 ms step. |
| Reduced motion | The danger ring does not move. |
| Part A | The first part of Mission 1. Part A has no car. |
| Part B | The second part of Mission 1. Part B has one car. |

## 2. Module layout

| Module | Path | Task |
| --- | --- | --- |
| Entry | `index.html`, `src/main.ts` | Start the game |
| Scene | `src/scenes/` | Draw each frame |
| Game logic | `src/game/` | Own the rules |
| Audio hooks | `src/audio/` | Play cues |
| Level data | `src/levels/` | Hold the mission data |
| Tests | `src/**/*.test.ts` | Check the data and the model |

The scene module uses Phaser.
The game logic module must not use Phaser.
The level data module must not use Phaser.
The audio hook module must not use Phaser.
A test calls the game logic with no scene.

## 3. Entry

The command `npm run dev` starts Vite.
Vite loads `index.html`.
`index.html` loads `src/main.ts`.
`src/main.ts` starts Phaser.
Phaser starts one empty scene.
The scene key is `empty`.
The empty scene draws no walker and no car.
A later ticket replaces the empty scene.
The game does not send data on a network in Mission 1.

## 4. Scene interface

The scene draws the state.
The scene does not own the rules.
The scene gets the state from the game logic.

The state has the parts below.

- The walker on the tactile map
- The walker in the scene
- The road
- The crosswalk
- The car, or no car
- One text line
- The failure marks

The failure marks are a grey scene, a double ring and dashed arrows.
The same walker data feeds the map and the scene.
The map icon and the scene sprite use one color, one outline and two eyes.
`SceneView` is the interface in `src/game/contracts.ts`.

## 5. Game logic interface

`GameLogic` is the interface in `src/game/contracts.ts`.

`start` loads one level.
`input` takes one player action and the time in ms.
`tick` takes the frame time in ms.
`tick` gives the next state and a list of events.
`tick` uses the fixed time step.
`tick` does not read the wall clock.
`tick` does not use a random number.

The player actions are below.

- `move`
- `stop`
- `turn`
- `listen`
- `step-back`
- `align`
- `wait`
- `cross`
- `read-map`

## 6. Events

The game logic gives events to the scene.
The scene uses the event name from the game logic.
The scene must not invent an event name.

| Event name | When the game logic gives the event |
| --- | --- |
| `failure` | Part B predicts contact |
| `freeze` | The failure flow starts the freeze |
| `replay` | The short replay starts |
| `missed-cue` | The missed cue plays again |
| `rewind` | The game goes back to the decision point |
| `tip` | The game shows one text tip |
| `text` | The game shows written feedback |
| `part-complete` | The player finishes one part |
| `mission-complete` | The player finishes Mission 1 |

The first event in the failure flow is `failure`.

## 7. Walker on the map and in the scene

Ticket TAC-11 uses `WalkerView`.
`WalkerView` is in `src/game/contracts.ts`.

The walker is a warm yellow drop.
The walker has a thick dark outline.
The walker has two dot eyes.
The walker has no mouth.
The walker has no cane.
The walker has no whisker and no antenna.
The walker has no species.
The walker is at least 44 px on the map.
The walker is at least 44 px in the scene.
The spec keeps the size unit open in OQ-2.
This architecture uses px until the lead sets the unit.
The name Walker is text only.
No voice says the name.
A person can tell the walker from the car when the picture is grey.
`WalkerView` has a place.
The place is `map` or `scene`.
One position and one facing feed both places.

## 8. Part A

Ticket TAC-12 uses section 8.

Part A has no car.
Part A has no traffic light.
Part A shows the actions move, turn, listen and read the map.
Each action has one short text line.
The text uses the third person.
The game has no guide voice.
The player crosses the road one time.
Then Part B starts.
The failure flow must not start in Part A.

## 9. Part B

Ticket TAC-13 uses section 9.

Part B has one car.
The car has a box shape.
The road is a one-way road.
The road has one lane.
Part B has no traffic light.
The player listens for the car.
The player waits.
The player crosses only after the car has passed.
A stopped car does not make a cross safe.
No text says that a stopped car makes a cross safe.
The level data has this line: "This is a game. Follow local traffic rules."
The scene shows the line as text.
The designer sets the screen position of the line.

The car has a position, a heading and a speed.
The speed stays constant.
The heading is a unit vector.
A unit vector has a length of 1.
`canCross` is true only when the car has passed the crosswalk.
A speed of zero does not make `canCross` true.

## 10. Failure flow

Tickets TAC-15, TAC-17, TAC-18 and TAC-19 use `FailureFlow`.
`FailureFlow` is in `src/game/contracts.ts`.
The failure flow starts in Part B only.
The game does not show contact.
The game does not show impact.
The game does not show injury.
`showImpact` is false.

### 10.1 Freeze

The scene stops before contact.
The stop is less than 1 second before contact.
`FREEZE_LEAD_MS` is 800.
The value 800 is less than 1000.
The team lead can change `FREEZE_LEAD_MS`.
The scene goes grey.
The walker color stays yellow.
The car color stays the same.
A double ring and a sound mark the danger.
Reduced motion makes the ring static.
The device setting is the default.
The game also has a switch.
`MotionSettings` holds the switch value.
After the player sets the switch, the game uses the switch value.
A static ring has no movement and no pulse.

### 10.2 Replay

The replay is 3 seconds or less.
`MAX_REPLAY_MS` is 3000.
The player can skip the replay.
The replay is on the tactile map.
The replay shows dashed arrows.
The replay shows one text line.
The text line gives the name of the missed cue.

### 10.3 Missed cue

The missed cue plays again.
The player can find the cue.

### 10.4 Rewind

The game goes back to the decision point.
The game loads the snapshot for the decision point.
The rewind has a score cost.
The cost is more than zero.
A safe wait gives a higher score than a fast cross.

### 10.5 Tip

The game shows one text tip.
The game shows one tip for one failure.
The tip comes from the approved list.
Ticket TAC-9 owns the approved list.
The tip is text.
The game has no guide voice.

## 11. Audio hooks

Tickets TAC-14 and TAC-16 use `AudioHooks`.
`AudioHooks` is in `src/audio/hooks.ts`.
The game logic calls the hooks.
The hooks do not own the rules.

The hooks have the functions below.

- `playSpatial` plays the car cue with a direction and a distance.
- `playDanger` plays the danger sound.
- `replayCue` plays the missed cue again.
- `stopAll` stops all sound.

The hooks have no voice function.
No module plays a guide voice.
Feedback is text only.
The designer owns the sound files.
This architecture adds no sound file.

## 12. Text feedback

All feedback is text.
The text uses the third person.
`TextLine` is the interface in `src/game/contracts.ts`.
A text line has a text string and a role.
The role is `instruction`, `outcome`, `notice` or `tip`.
The game shows the notice from the level data.
The game shows one tip after a failure.

## 13. Traffic model

The traffic model is in `src/game/traffic.ts`.
The model uses a fixed time step of 50 ms.
The constant name is `FIXED_STEP_MS`.
The clock holds `timeMs` and the remaining frame time.
`advanceClock` adds the frame time to the remaining time.
Each full step adds 50 ms to `timeMs`.
The same frame times give the same steps.

One step is 0.05 seconds.
For one step, the car moves speed times 0.05 along the heading.
The model does not call `Date.now`.
The model does not use a random number.
The same steps from the same snapshot give the same car position.
Play and replay must call `stepTraffic`.
`stepTraffic` checks the contact time after each step.
`stepTraffic` stops when the freeze window starts.
`stepTraffic` does not take the next step.
A long frame cannot move the car to the contact time.
The scene does not draw a frame at the contact time.
The scene does not draw the car on the walker.

The contact rule is the proposal for OQ-8.

- `predictContactTimeMs` does the calculation.
- The car moves on the road axis at a constant speed.
- Contact is the time when the car reaches the crosswalk and the walker is on the road.
- The result is no contact when the car has passed the crosswalk.
- The contact time is now when the car is in the crosswalk.
- The result is no contact when the walker is not on the road.
- `mustFreeze` is true in the lead window.

## 14. Level data

The schema is `LevelData` in `src/levels/schema.ts`.
A level has an id, a notice and a list of parts.
A part has an id, cars, a road, a crosswalk, map data and steps.
The part has one road.
The scene and the tactile map use the one road.
`trafficLight` is null.
The schema has no save-data field.
`validateLevel` rejects a save-data key.
Mission 1 data is in `src/levels/mission1.ts`.
Part A has no car.
Part B has one car.
The road in the data is a one-way road with one lane.
The tactile map is visible.

## 15. Score

The score is for the current session only.
The game does not save the score.
The score is not a field on the level data.
Ticket TAC-18 puts the score numbers in one config object.
The rewind cost must be more than zero.
A safe wait must score more than a fast cross.
The spec does not set the numbers yet.
OQ-5 is still open.

## 16. Tickets and interfaces

| Ticket | Interface |
| --- | --- |
| TAC-11 | `WalkerView` for the map and the scene |
| TAC-12 | Part A steps and text lines |
| TAC-13 | `CarState`, listen and wait |
| TAC-14 | `AudioHooks.playSpatial` |
| TAC-15 | `FailureFlow` freeze, ring and reduced motion |
| TAC-16 | `AudioHooks.playDanger` and `AudioHooks.replayCue` |
| TAC-17 | `FailureFlow` replay on the tactile map |
| TAC-18 | Rewind, snapshot and session score |
| TAC-19 | `TextLine` with the role `tip` |
