# Walker visual spec

This file is team text. It is not player text.
The player lines are in [docs/learning/part-a-tutorial-text.md](../learning/part-a-tutorial-text.md).

Ticket: TAC-7.
Source: [docs/product/mission-1-spec.md](../product/mission-1-spec.md), section 3, decision D1.

The working name is Walker.
The name is text only.
No voice says the name.

## Shape

The walker is a warm yellow drop.
The drop is rounded.
The point faces the heading.
In this asset the point faces up.

The outline is dark.
The outline is thick.
The walker has two dot eyes.
The eyes are the same size.
The eyes sit on one level line.
The walker has no mouth.

Do not draw these parts:

- a cane
- an arm
- a hand
- a tool
- a whisker
- an antenna

Do not show a species.
Do not show an age.
Do not show a gender.

The same art is on the map and in the scene.
Only the size changes.
The color does not change.
The outline does not change.
The eyes do not change.

## Colors

The spec does not set the road color.
The spec does not set the pavement color.
This file proposes the colors below.
The lead can change them.

The fill and the outline must each reach a contrast ratio of at least 3:1.
That rule applies on every ground where the walker stands.
A light yellow and a dark outline can both pass only in a narrow brightness band.
The road and the pavement share that band.
Hue and pattern keep them apart.
A light edge line marks the road.
Light stripes mark the crosswalk.
The pavement has no stripes.

| Use | Hex |
| --- | --- |
| Walker fill | `#FFE566` |
| Walker outline | `#14110E` |
| Walker eyes | `#14110E` |
| Contrast rim | `#FFF6D8` |
| Road | `#616C76` |
| Pavement | `#7A6854` |
| Map board | `#6D6F62` |
| Failure grey | `#6A6E6E` |
| Road edge and crosswalk stripes | `#FFF6D8` |
| Car fill | `#F4F7FA` |
| Car outline | `#14110E` |

The contrast rim is not a body part.
The rim keeps the dark outline visible on a dark canvas.
The yellow fill keeps the drop visible on a dark canvas.
The dark outline keeps the drop visible on a light canvas.

The car colors are a proposal for the silhouette check.
The car is a box.
The walker is a drop.
A reviewer turns the picture grey.
The drop is still not a box.

At the freeze, the scene ground turns to the failure grey.
The walker keeps the yellow fill.
The walker keeps the dark outline.
The car keeps the car fill.
The car keeps the car outline.

## Contrast

The ratios use the standard web contrast formula (WCAG 2).
A non-text ratio must be at least 3:1.
The ratios below are above that bar.

| Ground | Fill ratio | Outline ratio |
| --- | --- | --- |
| Road `#616C76` | 4.25:1 | 3.51:1 |
| Pavement `#7A6854` | 4.23:1 | 3.53:1 |
| Map board `#6D6F62` | 4.06:1 | 3.67:1 |
| Failure grey `#6A6E6E` | 4.09:1 | 3.64:1 |

More ratios:

- Fill on outline: 14.92:1.
- Eyes on fill: 14.92:1.
- Rim on outline: 17.40:1.
- Rim on black `#000000`: 19.43:1.
- Outline on white `#FFFFFF`: 18.81:1.
- Road edge `#FFF6D8` on the road: 4.96:1.
- Road edge `#FFF6D8` on the pavement: 4.94:1.

The yellow fill on a white canvas is 1.26:1.
The dark outline does the work on a white canvas.
The dark outline on a black canvas is 1.12:1.
The yellow fill and the light rim do the work on a black canvas.

## Size

CSS px is the pixel unit in the page layout.

The spec asks for at least 44 pt (open question OQ-2).
This file proposes 44 CSS px as the minimum width.
The lead confirms the unit.

On a phone, the scene walker is 48 CSS px across the body.
48 CSS px is above the 44 CSS px minimum.
The body is the wide round part of the drop.
The point is inside that width.

On the map, the walker is 44 CSS px across the body.
The map picture uses the same file.
The scene picture uses the same file.

The reference phone width for this size is 390 CSS px.

The car in the scene is 120 CSS px wide.
The car in the scene is 56 CSS px tall.
The car is 2.5 times as wide as the scene walker.
The walker is taller than it is wide.
The car is wider than it is tall.

On the map, the car is 72 CSS px wide.
The map car stays a box.
The map car stays wider than the map walker.

## Heading

The drop point is the heading mark.
Do not add a second mark.
A second mark can look like a tool.

The asset points up.
Up is north in this asset.
The scene turns the picture to the heading.
The map turns the same picture to the heading.
The eyes stay level with the body.
Do not draw the eyes on the point.

## Danger ring

The danger ring is a double ring around the walker.
The full rules are in [docs/design/sound-cue-visuals.md](sound-cue-visuals.md).

The ring file is [public/assets/danger-ring.svg](../../public/assets/danger-ring.svg).
The inner ring is `#14110E`.
The outer ring is `#F2FBFF`.
The ring uses shape and a caption.
The ring does not use color alone.

Center the ring on the center of the walker image.
That center is x 68 and y 84.
That center is the center of the view box.
The round part of the drop sits below this center.
The ring still wraps the drop point.

When reduced motion is on, the ring is still.
The ring does not move.
The ring does not pulse.

## Reduced motion

The device setting `prefers-reduced-motion` is the default.
The game also has an in-game switch.
After the player sets the switch, the game uses the switch value.

The walker asset has no motion.
Do not bob the walker.
Do not pulse the walker.
Do not squash the walker.
Use the same still picture for each calm state.

## Asset

The file is [public/assets/walker.svg](../../public/assets/walker.svg).
The builder imports that file.
The file is original work of this repo.
The file has no third-party art.
The file has a view box.
The file has no embedded picture.
The file has no animation.

The view box is `0 0 136 168`.
The group id is `walker`.
The shape id is `walker-shape`.
The rim id is `walker-rim`.
The eyes id is `walker-eyes`.

Set the scene display width so the body is 48 CSS px.
Do not set 48 CSS px on the whole view box and then call the body 48 CSS px.
The body path runs from x 20 to x 116.
That span is 96 view-box units before the outline.
The outline adds width.
Count the dark outline in the 48 CSS px body width.

## Open questions

- OQ-2. The spec says 44 pt. This file proposes 44 CSS px as the minimum width. The lead confirms the unit.
- OQ-9. The spec does not set a folder for visual style. This file uses `docs/design/`. The lead confirms the folder.
- The road and the pavement share a brightness band. That band lets the fill and the outline both reach 3:1. A lighter pavement would drop the fill ratio below 3:1. The lead can reject this palette.
- The car colors are a proposal. They are here for the grey silhouette check.
