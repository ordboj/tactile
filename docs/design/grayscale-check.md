# Grayscale check

This file is team text.
It is not player text.

It checks the walker against the car when the picture is grey.
Source: [docs/design/walker.md](walker.md) and [public/assets/walker.svg](../../public/assets/walker.svg).

The lead set 44 pt as 44 CSS px.
The lead accepted the road color, the pavement color and the car colors in walker.md.
The accepted car colors are the car fill and the car outline.
No car color changes in this check.

## Formula

Relative luminance uses the WCAG 2 formula.
The same formula is in walker.md.

Take each sRGB channel as an integer from 0 to 255.
Divide the channel by 255.
Call that value c.
If c is 0.04045 or less, the linear channel is c divided by 12.92.
If c is greater than 0.04045, add 0.055 to c, divide by 1.055, and raise the result to the power 2.4.
Relative luminance is 0.2126 times linear red, plus 0.7152 times linear green, plus 0.0722 times linear blue.

Put the lighter luminance in L1.
Put the darker luminance in L2.
The contrast ratio is (L1 + 0.05) divided by (L2 + 0.05).

Luminance in the tables is rounded to 4 decimal places.
Contrast in the tables is rounded to 2 decimal places.
A non-text pair passes the color test at 3:1 or above.

## Luminance

| Part | Hex | Relative luminance |
| --- | --- | --- |
| Walker fill | `#FFE566` | 0.7826 |
| Walker outline | `#14110E` | 0.0058 |
| Car fill | `#F4F7FA` | 0.9266 |
| Car outline | `#14110E` | 0.0058 |
| Road | `#616C76` | 0.1457 |
| Pavement | `#7A6854` | 0.1468 |
| Failure grey | `#6A6E6E` | 0.1534 |

The walker outline and the car outline share `#14110E`.
Their luminance is the same.

## Walker against each car color

| Walker part | Car part | Contrast | Color test |
| --- | --- | --- | --- |
| Walker fill | Car fill | 1.17:1 | Under 3:1 |
| Walker fill | Car outline | 14.92:1 | 3:1 or above |
| Walker outline | Car fill | 17.50:1 | 3:1 or above |
| Walker outline | Car outline | 1.00:1 | Under 3:1 |

The fill-on-fill pair is under 3:1.
The outline-on-outline pair is under 3:1.
The light part of one shape on the dark part of the other shape is above 3:1.

## Each part on the road

| Part | Contrast on the road |
| --- | --- |
| Walker fill | 4.25:1 |
| Walker outline | 3.51:1 |
| Car fill | 4.99:1 |
| Car outline | 3.51:1 |

Each part on the road is 3.51:1 or above.
The walker fill on the road matches walker.md (4.25:1).
The walker outline on the road matches walker.md (3.51:1).

The other grounds use the same formula.

| Part | Contrast on the pavement | Contrast on the failure grey |
| --- | --- | --- |
| Walker fill | 4.23:1 | 4.09:1 |
| Walker outline | 3.53:1 | 3.64:1 |
| Car fill | 4.96:1 | 4.80:1 |
| Car outline | 3.53:1 | 3.64:1 |

Each part on the pavement is 3.53:1 or above.
Each part on the failure grey is 3.64:1 or above.
At the freeze, the ground turns to the failure grey.
The walker keeps the walker fill and the walker outline.
The car keeps the car fill and the car outline.

## Pass rule

The walker and every car color must differ by at least 3:1, or a clear shape difference must separate them.
A clear outline difference can also separate them.

The car fill fails the 3:1 test against the walker fill.
The car outline fails the 3:1 test against the walker outline.
The outline hex is the same, so the outline color does not separate them.
The shape path passes.
No replacement hex is needed.
The accepted car colors stay.

## Shape and outline

The walker outline draws a drop.
The point is the heading.
The body is taller than it is wide.
The minimum body width is 44 CSS px.
On a phone, the scene body is 48 CSS px wide.
On the map, the body is 44 CSS px wide.
The walker has two dot eyes.

The car outline draws a box.
The scene car is 120 CSS px wide.
The scene car is 56 CSS px tall.
The car is wider than it is tall.
On the map, the car is 72 CSS px wide.
The map car stays a box.
The map car stays wider than the map walker.
The car has no point.
The car has no eyes.

The outline color is one shared hex.
The outline shape is a drop for the walker.
The outline shape is a box for the car.
A grey picture still shows a drop and a box.
That shape difference is the pass.

## Color-blind safety

Protanopia and deuteranopia are two kinds of red-green color vision.
This check uses the Machado, Oliveira and Fernandes simulation from 2009.
The severity is full.
The matrix runs on linear RGB.
Clamp each channel to the range 0 to 1.
Then convert the color back to sRGB.
Then take the WCAG luminance of that sRGB color.

| View | Walker fill | Car fill | Walker outline | Car outline |
| --- | --- | --- | --- | --- |
| Normal | `#FFE566` | `#F4F7FA` | `#14110E` | `#14110E` |
| Protanopia | `#F9E058` | `#F6F7FA` | `#12110E` | `#12110E` |
| Deuteranopia | `#FFE96C` | `#F5F6FA` | `#13120E` | `#13120E` |

| View | Walker fill luminance | Car fill luminance | Fill contrast | Outline contrast |
| --- | --- | --- | --- | --- |
| Normal | 0.7826 | 0.9266 | 1.17:1 | 1.00:1 |
| Protanopia | 0.7416 | 0.9302 | 1.24:1 | 1.00:1 |
| Deuteranopia | 0.8062 | 0.9223 | 1.14:1 | 1.00:1 |

In protanopia the walker fill goes a little darker.
The fill contrast rises from 1.17:1 to 1.24:1.
In deuteranopia the walker fill goes a little lighter.
The fill contrast falls from 1.17:1 to 1.14:1.
Both fills stay light.
The fill contrast stays under 3:1 in both views.
The outlines stay dark.
The outline contrast stays 1.00:1 because each view gives both outlines the same hex.

The cross pairs stay strong.

| View | Walker fill on car outline | Walker outline on car fill |
| --- | --- | --- |
| Normal | 14.92:1 | 17.50:1 |
| Protanopia | 14.23:1 | 17.63:1 |
| Deuteranopia | 15.28:1 | 17.35:1 |

Each cross pair is above 14:1.
The yellow hue is not the separator.
The drop, the box and the dark outline on a light fill still separate the walker from the car.
A player who does not separate red from green can still use that shape difference.

## Result

The car fill stays `#F4F7FA`.
The car outline stays `#14110E`.
The road stays `#616C76`.
The pavement stays `#7A6854`.
The failure grey stays `#6A6E6E`.
No car color changes.
