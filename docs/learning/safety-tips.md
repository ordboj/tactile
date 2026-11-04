# Traffic-safety tips

This file is team text.
It holds the Mission 1 tip list.
The tips are player text.
Ticket: TAC-9.
Source: [docs/product/mission-1-spec.md](../product/mission-1-spec.md) sections 5, 6, and 8.
Copy rules: [docs/learning/copy-rules.md](copy-rules.md).
Cue names: [docs/design/sound-cue-visuals.md](../design/sound-cue-visuals.md).

**Risky.** The game can show these lines to players.
The lines are real-world traffic-safety claims.
Gate G1 applies.
The reviewer reviews this list.
The reviewer gives a risk sign-off.
The sign-off is APPROVED or REJECTED.
Do not show a tip before that sign-off.

Each source URL below was checked on 2026-11-04.
A tip with no working source is not in this list.

## General guidance

The tips are general guidance for a pedestrian at a crossing.
They are not a full traffic code.
Some rules differ by country.
Do not state a country rule as a rule for every country.

The game shows this exact line:

```text
This is a game. Follow local traffic rules.
```

The copy rules set the row split.
The copy rules set the places.
The line is not a tip.
Do not add words to the line.
Do not remove words from the line.

## When a tip is shown

Part A has no failure flow.
Do not show a tip in Part A.

The failure flow starts in Part B.
After one failure, the game shows one tip.
The spec sets this in section 6, step e.
The spec also sets it in OQ-4.
The tip comes from the table in this file.
Show the row whose trigger matches the replay line.
Do not show two tips after one failure.

The known replay line is in the tutorial file.
The line is "The walker crossed while the car sound came closer."
That line selects TIP-03.
The cue name is Car sound.
The caption is "Closer."
If the replay names another trigger in the table, show that row.
If no row matches, show TIP-03.
TIP-03 is the missed cue in the spec example.

A level can also end with one tip from this table.
The spec does not name that screen.
This file allows it because the task asks for it.
Use TIP-02 when the failure flow did not run.
Show that tip once.
If the failure flow did run, do not add a tip at the end of that same try.
The end tip is not a second failure tip.

## Player-text rules

Show the tip text as written in the table.
Do not add words.
Each tip has 12 words or fewer.
Each tip is third person.
The subject is the walker.
A tip is not a command.
A tip does not say "you".
A tip does not say "your".
A tip is text.
A tip is not a voice.
Use a calm tone.
Do not blame the player.
A tip does not say that a stopped car makes a cross safe.
A tip does not imply that a stopped car makes a cross safe.

The banned words are in the copy rules.
Do not use them in a tip.

## Tip list

| Tip ID | Tip text | Trigger | Source name | Source URL | Date checked | What the source says |
| --- | --- | --- | --- | --- | --- | --- |
| TIP-01 | The walker stops at the curb before the crossing. | Did not stop at the curb | The Highway Code, Rule 7 | [gov.uk](https://www.gov.uk/guidance/the-highway-code/rules-for-pedestrians-1-to-35) | 2026-11-04 | The Code tells a pedestrian to stop just before the kerb, at a place with a clear view, and not to get too close to the traffic. The Code uses "kerb". The spec uses "curb". The tip uses "curb". |
| TIP-02 | The walker looks and listens before the crossing. | Did not look and listen before the crossing | The Highway Code, Rule 7 | [gov.uk](https://www.gov.uk/guidance/the-highway-code/rules-for-pedestrians-1-to-35) | 2026-11-04 | The Code tells a pedestrian to look all around for traffic and to listen. Traffic can come from any direction. A pedestrian can sometimes hear traffic before seeing it. |
| TIP-03 | The walker waits while the car sound comes closer. | Crossed while the car sound came closer. Cue: Car sound. Caption: Closer. | Swedish Transport Agency (Transportstyrelsen) | [transportstyrelsen.se](https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/trafikregler/generella-trafikregler/overgangsstalle/) | 2026-11-04 | A pedestrian must not step onto a crossing without considering vehicles that approach. The Highway Code, Rule 7, says that if traffic is coming, let it pass, and wait for a safe gap. The tip uses the cue name Car sound for an approaching car. [NTF](https://ntf.se/konsumentupplysning/gaende/) states the same duty and cites the Swedish traffic ordinance. |
| TIP-04 | The walker lets a coming car pass first. | Crossed before the car passed. Cue: Car sound. | The Highway Code, Rule 7 | [gov.uk](https://www.gov.uk/guidance/the-highway-code/rules-for-pedestrians-1-to-35) | 2026-11-04 | The Code tells a pedestrian to let coming traffic pass, and to wait for a safe gap before the cross. |
| TIP-05 | The walker crosses in a straight line. | Crossed on a diagonal | The Highway Code, Rule 7 | [gov.uk](https://www.gov.uk/guidance/the-highway-code/rules-for-pedestrians-1-to-35#rule7) | 2026-11-04 | Verified on GOV.UK on 2026-11-04. Rule 7 says to go straight across the road and not to walk on a diagonal. The tip follows Rule 7. [NTF](https://ntf.se/konsumentupplysning/gaende/) says that if no crossing is nearby, cross the carriageway straight across. |
| TIP-06 | The walker uses a crossing when one is near. | Did not use the crossing | The Highway Code, Rule 7 | [gov.uk](https://www.gov.uk/guidance/the-highway-code/rules-for-pedestrians-1-to-35) | 2026-11-04 | The Code tells a pedestrian to use a crossing where one is nearby. [NTF](https://ntf.se/konsumentupplysning/gaende/) says to cross at a pedestrian crossing, and to cross straight across if none is nearby. The tip keeps the shared point. It does not set one country rule for every country. |
| TIP-07 | The walker looks and listens during the crossing. | Did not look and listen during the crossing. Cue: Car sound. | The Highway Code, Rule 7 | [gov.uk](https://www.gov.uk/guidance/the-highway-code/rules-for-pedestrians-1-to-35) | 2026-11-04 | The Code tells a pedestrian to keep looking and listening for traffic during the cross. |
| TIP-08 | The walker also looks, because a car can be quiet. | Cue: Car sound. The car sound is hard to hear. | Department for Transport (GOV.UK) | [gov.uk](https://www.gov.uk/government/news/new-noise-systems-to-stop-silent-electric-cars-and-improve-safety) | 2026-11-04 | Quiet electric and hybrid vehicles can be too silent to hear. From 1 July 2019, new types must make a sound when they reverse or move below 20 km/h. The tip does not give that speed. The line does not say that every car is quiet. The line says the walker also looks, so it does not say that hearing is enough. |

## Word count

| Tip ID | Words |
| --- | --- |
| TIP-01 | 9 |
| TIP-02 | 8 |
| TIP-03 | 9 |
| TIP-04 | 8 |
| TIP-05 | 7 |
| TIP-06 | 9 |
| TIP-07 | 8 |
| TIP-08 | 10 |

## Cue names

Use the cue names from the spec and the sound-cue file.

The missed cue in Mission 1 is Car sound.
The caption "Closer." means the car sound comes closer.
TIP-03 uses that cue.

These cues do not select a tip.

- Place sound. Part A has no failure flow.
- Road pulse. Touch to Query is not a failure.
- Danger. This is the freeze sound. It is not the missed cue.

## Rules this list does not state

Mission 1 has no traffic light.
The spec sets this in OQ-1 and in OQ-15.
A green signal is not the same rule in every country.
A red signal is not the same rule in every country.
This list has no tip about a green signal.
This list has no tip about a red signal.
The task examples named those cases.
The spec does not have those cues.
The game line covers local signal rules.

The side of the road is not the same in every country.
This list has no tip about which side to walk on.

A stopped car does not make a crossing safe.
No tip says that.
No tip implies that.
The Highway Code, Rule 18, says to check that traffic has stopped before a start at a crossing.
That sentence is not a tip in this list.
A tip from that sentence could imply that a stop makes the cross safe.
The spec forbids that implication.
NTF also says not to step out in front of or behind a stationary vehicle, because the view is blocked.
That case is not a Mission 1 cue.
This list does not turn it into a universal line.

## Pages checked that are not tip sources

These pages were open on 2026-11-04.
They do not state the crossing steps in the table.
They are not the source of a tip.

- [Trafikverket, safety for pedestrians](https://www.trafikverket.se/resa-och-trafik/trafiksakerhet/sakerhet-pa-vag/sakerhet-for-gaende/). The page is about being seen in the dark and about falls.
- [WHO, road traffic injuries fact sheet](https://www.who.int/news-room/fact-sheets/detail/road-traffic-injuries). The page names pedestrians as vulnerable road users. It names safe crossing points as a road-design measure. It does not state these step-by-step actions.

NHTSA pedestrian pages are not cited.
Those pages returned HTTP 403 to the link checker on 2026-11-04.
A 403 is not an accepted link-check result.
A source URL that the link check cannot open is not used.

The US minimum-sound rule on the eCFR site is not cited.
A link check of that page is sent to an access wall.
The quiet-car tip uses the Department for Transport page.
That page states the point in plain text.

## Reviewer check

Each answer must be yes before a tip is shown.

- The tip has 12 words or fewer.
- The tip is third person.
- The tip does not say "you".
- The tip does not say "your".
- The tip is not a command.
- The tip does not use a banned word.
- The tip does not blame the player.
- The tip does not say that a stopped car makes a cross safe.
- The tip does not imply that a stopped car makes a cross safe.
- The tip has a real source.
- The source URL was checked.
- The note matches the source page.
- The failure flow shows one tip only.
