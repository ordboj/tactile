# Sound cue visuals

This file is team text.
It sets a visual for each Mission 1 sound cue.
A visual is a caption, an icon, or both.

Source: [docs/product/mission-1-spec.md](../product/mission-1-spec.md) section 6 (decision D8) and the ethics review change R3.
The designer must finish this work before TAC-15.
The designer must finish this work before TAC-17.

Do not use color alone.
Use a shape.
Use a caption.
Use motion only when reduced motion is off.

The ground colors are in [docs/design/walker.md](walker.md).
The player lines are in [docs/learning/part-a-tutorial-text.md](../learning/part-a-tutorial-text.md).

## Caption style

Draw the caption as text.
Do not draw the caption as a picture.
Use a plain sans-serif font.
Use weight 700.
Use a size of at least 16 CSS px on a phone.
16 CSS px is the minimum.
Use a larger size if the row needs it.
Set the line height to 1.35.

Put one caption row in the plate.
Use a second row only when the cue needs it.
Each row has 12 words or fewer.

Place the plate above the walker.
Center the plate on the walker.
Leave a gap of 8 CSS px between the plate and the drop point.
Do not cover the drop point.
Do not cover the eyes.
Do not cover the goal on the map.
If the plate would leave the screen, place it below the walker.
Use the same gap.

The plate color is `#FFF6D8`.
The text color is `#14110E`.
The text ratio on the plate is 17.40:1.
The minimum for this text is 4.5:1.
17.40:1 is above that bar.

The plate ratio on the grounds:

| Ground | Plate ratio |
| --- | --- |
| Road `#616C76` | 4.96:1 |
| Pavement `#7A6854` | 4.94:1 |
| Map board `#6D6F62` | 4.74:1 |
| Failure grey `#6A6E6E` | 4.77:1 |

Pad the plate by 8 CSS px.
Round the plate corners by 8 CSS px.

The icon sits on the left of the text.
The gap is 8 CSS px.
The icon is 16 CSS px wide and 16 CSS px tall.
The icon file is [public/assets/sound-wave.svg](../../public/assets/sound-wave.svg).
The icon is original work of this repo.
The dark mark is `#14110E`.
The light rim on the mark is `#FFF6D8`.
The icon is a shape.
The icon is not a letter.

When reduced motion is on, the caption does not move.
The caption does not fade.
The caption appears at full strength.
The icon stays still.
Do not animate the sound-wave marks.

## Danger sound

The danger sound plays at the freeze.
The sound is not a voice.
Open question OQ-6 asks which sound to use.
This file sets the visual only.
Do not use a third-party sound in this file.

The visual has three parts:

- A double ring around the walker.
- The caption "Danger."
- The row "The scene stops."

The ring file is [public/assets/danger-ring.svg](../../public/assets/danger-ring.svg).
The file is original work of this repo.
The file is static.
The inner ring is dark `#14110E`.
The outer ring is light `#F2FBFF`.
The two rings contrast at 17.93:1.
The light ring on the road is 5.11:1.
The light ring on the pavement is 5.09:1.
The light ring on the map board is 4.88:1.
The light ring on the failure grey is 4.92:1.
The dark ring uses the outline color `#14110E`.
The walker file lists the contrast of that color on each ground.
Each of those ratios is above 3:1.

The pair is a light ring and a dark ring.
The pair is not a red ring and a green ring.
Shape carries the meaning when a player does not separate some hues.

Center the ring on the center of the walker image.
The walker file gives that point.
Set the ring image width to 120 CSS px in the scene.
The outer edge is then 104 CSS px across.
The inner hole is 76 CSS px across.
The stroke is 4 CSS px.
The gap between the two strokes is 6 CSS px.
The walker body is 48 CSS px across.
The outer ring is 2.17 times that body width.
The full walker image is about 66 CSS px tall.
The point stays inside the hole.

When reduced motion is off, the ring grows once.
It grows from scale 0.75 to scale 1.
The grow lasts 400 milliseconds.
Then the ring holds.
The ring does not loop.
The ring does not pulse.

When reduced motion is on, show scale 1 at once.
The ring does not grow.
The ring does not pulse.
The device setting `prefers-reduced-motion` is the default.
The in-game switch can change it.
After the player sets the switch, the game uses the switch value.

The caption appears with the ring.
The caption stays through the freeze.
The caption stays through the replay.
The caption leaves when the replay ends.
The caption leaves when the player skips.
The freeze is under 1 second.
The replay is 3 seconds or less.

## Missed cue

The missed cue in Mission 1 is the car sound.
The replay names it in the outcome line.
The line is "The walker crossed while the car sound came closer."

At the moment the cue played, show the sound-wave icon.
Show the caption "Car sound."
The icon and the words name the cue.
Do not use color alone.

After the replay, play the cue again.
If the player skips the replay, still play the cue again.
Show the same icon and the same caption for 1.5 seconds.
Then rewind to the decision point.

The replay also shows dashed arrows.
The arrows use `#FFF6D8`.
A dash is 6 CSS px on and 4 CSS px off.
The arrows show the path.
The arrows do not replace the cue name.

## Car sound

Part B has one car.
The car sound has a direction and a distance.
The scene shows the car.
The caption is the visual for the sound.

Show the sound-wave icon while the car sound plays.
Use these rows.
Show the row that matches the sound.
Change the row when the direction changes.
Change the row when the distance changes.
Hide the caption when the sound stops.

```text
Car sound.
Left. Far.
Left. Near.
Right. Far.
Right. Near.
Closer.
```

Each row has 3 words or fewer.
"Closer." means the car sound comes closer.

## Place sound

Part A has a listen step.
The spec does not name that sound.
The tutorial file proposes a short tone.
The tone is not a voice.
The tone is not a car.

Show the sound-wave icon with this caption:

```text
Place sound.
```

The tone lasts 1 second or less.
Keep the caption for 1.5 seconds so the player can read it.
The lead can rename this cue.

## Road pulse

Touch to Query is a hold on the road.
The hold plays traffic pulses.
The game does not vibrate for the whole Part B scene.
iOS Safari has no vibration.
The pulse has an audio fallback and a visual fallback.

The visual is one, two, or three short bars on the road.
More bars mean a stronger pulse.
The bars use `#FFF6D8`.
Show the caption "Road pulse."

```text
Road pulse.
```

The audio fallback is a short tone.
The tone is not a voice.
The same caption covers the tone.

When reduced motion is on, the bars stay still.
The bars do not travel.
The bars do not pulse in size.

The caption stays while the player holds the road.
The caption leaves when the hold ends.

## Reduced motion summary

- The walker does not bob.
- The danger ring does not grow.
- The danger ring does not pulse.
- The caption does not move.
- The caption does not fade.
- The sound-wave icon stays still.
- The road-pulse bars stay still.
