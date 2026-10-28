# Mission 1 (Scene 1) spec

Status: draft for the lead. Owner: product-manager.
Date: 2026-10-28. Updated: 2026-10-29 (lead decisions, see section 2).
Replaces: the earlier draft docs/product/scene-1-decisions.md (deleted). That draft used an old framing.
Sources: the Tactile team handbook, the lead (Piyangocu), and Tuğrul's words below.

This document is the source of truth for Mission 1. Only the lead changes the decisions in it.

Language rule: all text in this document and all player text use third person. Example: "The walker waits at the curb." The text uses simple, short sentences (ASD-STE100 style).

## 1. Framing

Tuğrul gave the framing on 2026-10-28 (through the lead). His words are below, verbatim. The English lines are plain translations for the team. The Turkish words are the source.

1. "Körler filan uzak durmamız lazım bence. Bunu sosyal sorumluluk projesi olarak göstermeyeceğiz"
   (Translation: I think we must keep away from blind people and the like. We will not present this as a social-responsibility project.)
2. "Baston tamamen kalksın, karakter sadece sesle ve haritayla yön bulsun"
   (Translation: remove the cane fully. The character finds the way only with sound and the map.)
3. "Sarı damla yürüyücü ile devam edelim"
   (Translation: continue with the yellow drop walker.)
4. "Eğitmen sesi olmasın, sadece yazılı geri bildirim olsun"
   (Translation: no trainer voice. Written feedback only.)

Rules that follow from these words:

- The game has no blindness theme.
- The game has no cane.
- The game has no blindness copy. No player text, store text or marketing text uses blindness framing.
- The game has no blind playtests.
- The game is not an awareness project and not a social-responsibility project.
- The core idea stays: a pedestrian finds the way with sound, memory and the tactile map. Visual support fades as levels go on.
- The game has no guide voice. All feedback is written text.

## 1a. Lead decisions and plan status (2026-10-29)

The lead (Piyangocu) decided these open questions on 2026-10-29. Section 14 marks them resolved.

| OQ | Decision |
| --- | --- |
| OQ-1 | Part A has no traffic light and no traffic. Signals come in a later mission. |
| OQ-3 | Reduced motion: the device setting (prefers-reduced-motion) is the default. The game also has an in-game switch. |
| OQ-4 | One tip per failure. |
| OQ-10 | devops owns the scaffold dependencies (package.json). The staff-engineer owns the architecture. |
| OQ-11 | The product-manager rewrites README.md to the new framing in a small PR. The player-psychologist does the ethics review. |
| OQ-12 | Working name: "Walker". Tuğrul decides the final name later. Nobody waits for the final name. |
| OQ-14 | The tip list reviewers are the design-critic and the player-psychologist. Then the approver. |

Plan status:

- The lead accepted the ticket list as the plan.
- TAC-5 to TAC-10 may start now.
- **Gate:** TAC-11 and all tickets above it (the game-developer, audio-designer and tip-display work, TAC-11 to TAC-19) must wait for a lead "go". Tuğrul must approve the list first. Nobody starts these tickets before the "go".
- The new tickets TAC-21 (devops scaffold dependencies) and TAC-22 (README rewrite) are part of the plan. TAC-21 is a prototype dependency and also waits for the "go".
- TAC-20 (tests) follows the code tickets. It has no code to test before the "go".

## 2. Mission 1 overview

- Mission 1 is the first mission. It is one designed scene.
- The scene has a crosswalk and a one-way, single-lane road. Mission 1 has no traffic light. Signals come in a later mission (lead decision, OQ-1).
- The goal is the other side of the road.
- The tactile map is on the left. The controls are on the right.
- The style is soft cartoon 2D.
- The tutorial is inside Mission 1.
- The player is a pedestrian. The player is never a car.
- Core actions: walk, stop, turn, listen, step back, align, wait, cross.
- The tactile map is always visible in Mission 1. Support fading starts in later levels (out of scope here).
- Haptics work only on demand (Touch to Query: hold on the road to feel traffic pulses). There is no constant traffic vibration. Vibration has an audio and visual fallback. iOS Safari has no vibration.
- Safe decisions score higher than speed.
- The game explains failure and risk clearly.

Mission 1 has two parts.

## 3. The character (decision D1)

Decision:

- The character is a warm yellow drop-shaped walker.
- The character has a thick dark outline.
- The character has two dot eyes. It has no mouth and no species.
- The character has no cane, no whisker and no antenna.
- The character is at least 44 pt (see OQ-2 for the unit).
- The character looks clearly different from the boxy cars (shape and silhouette). A reviewer can tell them apart in grayscale.
- The same character is on the tactile map (as a top-down icon) and in the scene.
- The character has a working name: "Walker". Tuğrul decides the final name later. Nobody waits for the final name. The name appears in text only. It never appears in a voice.

Acceptance criteria:

- [ ] The character is yellow, drop-shaped and has a thick dark outline.
- [ ] The character has two dot eyes and no other face part.
- [ ] No cane, whisker or antenna is drawn on the map or in the scene.
- [ ] The character is at least 44 pt on the map and in the scene.
- [ ] A reviewer can tell the character from a car in grayscale.
- [ ] The map icon and the scene sprite show the same character (same color, outline and eyes).
- [ ] The working name "Walker" appears in text only. No audio file has a spoken voice for the name.
- [ ] The player-psychologist approves the character (gate G2).

## 4. Part A: learn the controls (no traffic)

Part A has no traffic and no traffic light. The player learns these actions: move, turn, listen, read the tactile map. The player crosses the road once. Signals come in a later mission.

Rules:

- No car and no traffic light are in Part A.
- The tutorial text shows the next step as written text. There is no guide voice.
- The tutorial uses sound cues, memory and the tactile map. It does not use a cane or blindness copy.
- The player crosses once to finish Part A.
- Part A cannot cause a failure flow. (Failure starts in Part B.)

Acceptance criteria:

- [ ] Part A starts with no car and no traffic light in the scene.
- [ ] The player does each step: move, turn, listen, read the map.
- [ ] Each step shows one short written instruction in third person.
- [ ] The player crosses the road once. Then Part B starts.
- [ ] No spoken voice plays.
- [ ] The failure flow never starts in Part A.

## 5. Part B: listen and wait (one car)

Part B has one car on the one-way, single-lane road. The player must listen and wait. The failure flow starts here.

Rules:

- One car drives on the road. The car is boxy and looks different from the character.
- The car makes a sound. The sound has a direction and a distance (spatial audio).
- The player must listen for the car, wait, and cross only when the car has passed or has stopped.
- Touch to Query works on the road: hold on the road to feel traffic pulses.
- If the player crosses at a bad time, the failure flow starts (section 6).
- The rule that predicts contact time is in OQ-8.

Acceptance criteria:

- [ ] One car is on a one-way, single-lane road.
- [ ] The car sound changes with the car position (direction and distance).
- [ ] The player can wait. A safe wait scores higher than a fast cross.
- [ ] A cross at a bad time starts the failure flow.
- [ ] A cross at a good time completes the mission.

## 6. Failure flow (decision D3)

The failure flow starts in Part B. The game never shows impact.

Step a. Freeze.
- The scene freezes less than 1 second before contact.
- The scene goes grey. The character and the car keep their color.
- A double ring and a sound mark the danger.
- With reduced motion, the ring is static. The device setting (prefers-reduced-motion) is the default. An in-game switch also sets reduced motion.

Step b. Replay.
- The replay is 3 seconds or less. The player can skip it.
- The replay shows dashed arrows.
- The replay shows a text outcome, for example "The car could not stop." The text names the missed cue.

Step c. Missed cue.
- The missed cue plays again. The player finds the cue.

Step d. Rewind.
- The game rewinds to the decision point.
- The rewind has a real score cost.
- Safe waits score higher than speed.

Step e. Tip.
- The game shows one practical traffic-safety tip for each failure.
- The tip is risky content. It goes through gate G1.

Acceptance criteria:

- [ ] No frame in the failure flow shows contact, impact, injury or a collision effect.
- [ ] The freeze starts less than 1 s before the predicted contact time.
- [ ] At freeze, the scene is grey. The character and the car keep their color.
- [ ] At freeze, a double ring and a sound appear.
- [ ] With reduced motion, the ring is static (no movement, no pulse).
- [ ] Reduced motion is on by default when the device setting asks for it. The in-game switch turns it on or off, and the game uses the switch value after the player sets it.
- [ ] The replay lasts 3 s or less. The player can skip it at any time.
- [ ] The replay shows dashed arrows and a text outcome. The text names the missed cue.
- [ ] The missed cue plays again. The player can find it.
- [ ] The game rewinds to the decision point.
- [ ] The rewind cost is greater than zero. The value is set in one config place (OQ-5).
- [ ] A safe wait scores higher than a fast cross.
- [ ] The game shows exactly one tip after each failure flow. The tip comes from the approved tip list.
- [ ] No spoken voice plays in any step.

## 7. Scoring

- Safe decisions score higher than speed.
- A failure costs real score. The cost is not zero.
- The score is for the current session only in Mission 1. The spec does not change the save-data format. If a save change is needed, the game-developer stops and asks for a staff-engineer ticket (risky, gate G3).
- The score numbers are not set yet (OQ-5).

## 8. Text rules (decision D4)

- All player text is third person.
- All feedback is written text. There is no guide voice.
- No player text uses blindness framing, awareness framing or social-responsibility framing.
- The learning-designer defines the banned-phrase list and the copy rules (ticket in section 12).
- An automated check finds the banned phrases (qa).

## 9. Decisions

| ID | Decision | Source |
| --- | --- | --- |
| D1 | The character is the yellow drop walker. No cane. Same on map and in scene. At least 44 pt. | Tuğrul quote 3 and quote 2 |
| D2 | No guide voice. Feedback is written text only. | Tuğrul quote 4 |
| D3 | Failure never shows impact. Five-step failure flow. | Lead (Piyangocu) |
| D4 | Third-person copy. No blindness framing. | Lead, Tuğrul quote 1 |
| D5 | Mission 1 Part A has no traffic. Part B has one car. The failure flow starts in Part B. | Lead, 2026-10-28 |
| D6 | The game is not an awareness or social-responsibility project. | Tuğrul quote 1 |
| D7 | Traffic-safety tips shown to players are risky (gate G1). | Lead, handbook risk gate |

## 10. Gates

**G1. Risk gate.**
- Traffic-safety tips that the game shows to players are risky.
- Risky work: stop before code. Write a design or diff. Get two independent bot reviews. Send it to the approver.
- Reviewers for the tip list: the design-critic and the player-psychologist (lead decision, OQ-14). Then the approver.
- Merge only after the approver says APPROVED and CI is green.
- The design-critic reviews only. The approver approves.
- Every tip needs a real source. Nobody invents a source or a fact.

**G2. Ethics review.**
- A design that touches representation, framing or marketing needs an ethics review from the player-psychologist before code.
- Files go in docs/psychology/.
- This gate covers: the character (D1), the failure flow (D3) and the player copy (D4).

**G3. Other risk items (handbook).**
- Save-data format or migration.
- Third-party assets or licenses (for example sounds).
- A major dependency bump.
- A cross-owner change.
- A contested review.

**G4. Escalation.**
- Escalate to Tuğrul only through the lead.
- Cases: an uncertain factual claim in a traffic-safety tip, possible player data loss, spending money, or a reviewer deadlock after 2 rounds.

**Workflow gate.** The owner checks main first. A cloud agent works on a fresh branch. The qa writes fail-first tests. A non-author bot reviews. CI goes green. The owner sends the PR link to the lead. The lead merges.

## 11. Ownership

| Area | Owner | Paths |
| --- | --- | --- |
| Scope and specs | product-manager | docs/product/ |
| Scenes and game logic | game-developer | src/scenes/**, src/game/** |
| Sounds | audio-designer | public/audio/**, src/audio/**, docs/audio/ |
| Learning and copy rules | learning-designer | docs/learning/ |
| Architecture, entry, level data schema, save-data format | staff-engineer | src/main.ts, index.html, shared utils, src/levels/** |
| Build, CI/CD, dependencies (package.json, Vite, Phaser 3, TypeScript) | devops | package.json, lockfile, build and CI config |
| README.md | product-manager (lead decision, OQ-11) | README.md |
| Tests | qa | *.test.ts, src/test/** |
| Visual style and UX audits | ui-ux-expert | no code (see OQ-9 for the document path) |
| Psychology and ethics | player-psychologist | docs/psychology/ |
| Adversarial design review | design-critic | read-only |
| Approval of risky changes | approver | none |

The accessibility-expert role no longer exists. No ticket goes to it.

## 12. Ticket map (Linear team TAC)

Each ticket has one owner role.

| Ticket | Owner | Title | Risky |
| --- | --- | --- | --- |
| TAC-5 | product-manager | Mission 1: spec PR (docs/product/mission-1-spec.md) | no |
| TAC-6 | staff-engineer | Mission 1: architecture and level data schema | yes |
| TAC-7 | ui-ux-expert | Mission 1: yellow drop walker visual spec | no |
| TAC-8 | learning-designer | Mission 1: Part A tutorial text and feedback copy rules | no |
| TAC-9 | learning-designer | Mission 1: traffic-safety tip list with sources | yes |
| TAC-10 | player-psychologist | Mission 1: framing and ethics review | no |
| TAC-11 | game-developer | Mission 1: yellow drop walker on map and in scene | no |
| TAC-12 | game-developer | Mission 1: Part A tutorial flow | no |
| TAC-13 | game-developer | Mission 1: Part B car and listen-wait logic | no |
| TAC-14 | audio-designer | Mission 1: car sound and spatial audio | yes |
| TAC-15 | game-developer | Mission 1: failure freeze, ring and reduced motion | no |
| TAC-16 | audio-designer | Mission 1: danger sound and missed-cue replay audio | yes |
| TAC-17 | game-developer | Mission 1: failure replay with arrows, text outcome and cue replay | no |
| TAC-18 | game-developer | Mission 1: rewind, score cost and safe-wait scoring | no |
| TAC-19 | game-developer | Mission 1: show one traffic-safety tip after failure | no |
| TAC-20 | qa | Mission 1: tests | no |
| TAC-21 | devops | Mission 1: scaffold dependencies (package.json, Vite, Phaser 3, TypeScript) | yes |
| TAC-22 | product-manager | README.md: rewrite to new framing | no |

TAC-5 to TAC-10 and TAC-22 may start now. TAC-11 to TAC-19 and TAC-21 wait for the lead "go". TAC-20 follows the code tickets.

The Linear tickets hold the scope, acceptance checklist and dependencies. If this table and Linear differ, Linear is newer for ticket detail. This spec is newer for decisions.

## 13. Repo state

On 2026-10-28, the repo ordboj/tactile on main has one file: README.md. It has no src/, no docs/ and no package.json. All paths under src/, public/ and docs/ in the tickets are planned paths. They do not exist yet. File names inside the owner paths are proposals. The devops ticket TAC-21 creates the package and build base. The staff-engineer ticket TAC-6 creates the architecture and the level schema.

The main README.md describes the game with the old framing ("shows how blind pedestrians find their way", "an awareness game"). This conflicts with section 1. TAC-22 rewrites it (draft: /workspace/tactile-pm/README.md).

## 14. Open questions

- **OQ-1 (resolved 2026-10-29): Part A traffic light.** Part A has no traffic light and no traffic. Signals come in a later mission.
- **OQ-2: Unit of "44 pt".** The web game uses pixels. Does 44 pt mean 44 CSS px, or a size at a set screen density?
- **OQ-3 (resolved 2026-10-29): Reduced motion.** The device setting is the default. The game also has an in-game switch.
- **OQ-4 (resolved 2026-10-29): Tip count.** One tip for each failure.
- **OQ-5: Score values.** No numbers exist for the rewind cost, the safe-wait score and the speed score. The game-developer puts them in one config place. The lead or the learning-designer sets the values.
- **OQ-6: Danger sound.** Which sound marks the danger? The audio-designer proposes it. It must not be a voice. If it uses a third-party asset, G3 applies.
- **OQ-7: Skip control.** Which control skips the replay? The ui-ux-expert proposes it.
- **OQ-8: Contact time rule.** The freeze starts less than 1 s before contact, but the game never shows contact. The game-developer proposes a rule that predicts the contact time.
- **OQ-9: Document path for the ui-ux-expert.** The handbook gives the ui-ux-expert no file path. The ticket proposes docs/ux/. The lead confirms.
- **OQ-10 (resolved 2026-10-29): Scaffold owner.** devops owns the scaffold dependencies (package.json). The staff-engineer owns the architecture.
- **OQ-11 (resolved 2026-10-29): README.** The product-manager rewrites README.md to the new framing in a small PR (TAC-22). The player-psychologist does the ethics review.
- **OQ-12 (resolved 2026-10-29): Character name.** The working name is "Walker". Tuğrul decides the final name later. Nobody waits for it.
- **OQ-13: Step back and align.** Core actions include step back and align. In which part does the tutorial teach them? The learning-designer proposes in TAC-8.
- **OQ-14 (resolved 2026-10-29): Tip reviewers.** The design-critic and the player-psychologist review the tip list. Then the approver.
- **OQ-15: Traffic light in Part B.** The lead said signals come in a later mission. The tickets assume Part B has no traffic light either. The lead confirms.

## 15. Out of scope

- Levels after Mission 1.
- Support fading across levels.
- Touch to Query tuning beyond use on the road in Part B.
- Save-data and score persistence.
- Store text, marketing text and the README (OQ-11).
