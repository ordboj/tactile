# Mission 1 (Scene 1) spec

Status: draft for the lead. Owner: lead.
Date: 2026-10-28. Updated: 2026-10-29 (lead decisions, see section 2). Updated: 2026-11-04 (ethics review R1, R2 and R3, and the four roles). Updated: 2026-11-05 (OQ-13).
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
- Playtest recruiting and playtest copy use no blindness framing.
- The game is not an awareness project and not a social-responsibility project.
- The core idea stays: a pedestrian finds the way with sound, memory and the tactile map. Visual support fades as levels go on.
- The game has no guide voice. All feedback is written text.

## 1a. Lead decisions and plan status (2026-10-29)

The lead (Piyangocu) decided OQ-1, OQ-3, OQ-4, OQ-10, OQ-11, OQ-12, OQ-14 and OQ-15 on 2026-10-29. The lead decided OQ-13 on Nov 5, 2026. Section 14 marks these questions resolved.

| OQ | Decision |
| --- | --- |
| OQ-1 | Part A has no traffic light and no traffic. Signals come in a later mission. |
| OQ-3 | Reduced motion: the device setting (prefers-reduced-motion) is the default. The game also has an in-game switch. |
| OQ-4 | One tip per failure. |
| OQ-10 | The builder owns the scaffold dependencies (package.json). The builder owns the architecture. |
| OQ-11 | The lead rewrites README.md to the new framing in a small PR. The reviewer does the ethics review. |
| OQ-12 | Working name: "Walker". Tuğrul decides the final name later. Nobody waits for the final name. |
| OQ-13 | Decided by the lead on Nov 5, 2026: Part A teaches Stop, Step back and Align. Wait stays in Part B. |
| OQ-14 | The reviewer reviews the tip list. The reviewer approves the tip list. |
| OQ-15 | Part B has no traffic light. Part B has one car on the one-way road. The player listens and waits. |

Plan status:

- The lead accepted the ticket list as the plan.
- TAC-5 to TAC-10 may start now.
- **Gate:** TAC-11 and all tickets above it (the builder, the designer and the tip-display work, TAC-11 to TAC-19) must wait for a lead "go". Tuğrul must approve the list first. Nobody starts these tickets before the "go".
- The new tickets TAC-21 (builder scaffold dependencies) and TAC-22 (README rewrite) are part of the plan. TAC-21 adds the build base and the CI. It may start now.
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
- [ ] The reviewer approves the character (gate G2).

## 4. Part A: learn the controls (no traffic)

Part A has no traffic and no traffic light. Decided by the lead on Nov 5, 2026: Part A teaches Stop, Step back and Align. Wait stays in Part B. The player learns these actions in this order: move, stop, turn, step back, align, listen, read the tactile map. The player crosses the road once. Signals come in a later mission.

Rules:

- No car and no traffic light are in Part A.
- The tutorial text shows the next step as written text. There is no guide voice.
- The tutorial uses sound cues, memory and the tactile map. It does not use a cane or blindness copy.
- The player crosses once to finish Part A.
- Part A cannot cause a failure flow. (Failure starts in Part B.)

Acceptance criteria:

- [ ] Part A starts with no car and no traffic light in the scene.
- [ ] The player does each step in this order: move, stop, turn, step back, align, listen, read the map.
- [ ] Part A does not teach Wait. Part B teaches Wait.
- [ ] Each step shows one short written instruction in third person.
- [ ] The player crosses the road once. Then Part B starts.
- [ ] No spoken voice plays.
- [ ] The failure flow never starts in Part A.

## 5. Part B: listen and wait (one car)

Part B has one car on the one-way, single-lane road. The player must listen and wait. The failure flow starts here.

Rules:

- One car drives on the road. The car is boxy and looks different from the character.
- The car makes a sound. The sound has a direction and a distance (spatial audio).
- The player listens for the car.
- The player waits.
- The player crosses only after the car has passed.
- A stopped car does not make a crossing safe.
- No text says that a stopped car makes a crossing safe.
- No text implies that a stopped car makes a crossing safe.
- The game shows this exact line: "This is a game. Follow local traffic rules."
- The designer owns the place where this line appears.
- Touch to Query works on the road: hold on the road to feel traffic pulses.
- If the player crosses at a bad time, the failure flow starts (section 6).
- The rule that predicts contact time is in OQ-8.

Acceptance criteria:

- [ ] One car is on a one-way, single-lane road.
- [ ] The car sound changes with the car position (direction and distance).
- [ ] The player can wait. A safe wait scores higher than a fast cross.
- [ ] A cross at a bad time starts the failure flow.
- [ ] A cross at a good time completes the mission.
- [ ] The player crosses only after the car has passed.
- [ ] No text says that a stopped car makes a crossing safe.
- [ ] No text implies that a stopped car makes a crossing safe.
- [ ] The game shows this exact line: "This is a game. Follow local traffic rules."

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
- The replay shows a text outcome, for example "Walker crossed while the car sound came closer." The text names the missed cue.

Step c. Missed cue.

- The missed cue plays again. The player finds the cue.

Step d. Rewind.

- The game rewinds to the decision point.
- The rewind has a real score cost.
- Safe waits score higher than speed.

Step e. Tip.

- The game shows one practical traffic-safety tip for each failure.
- The tip is risky content. It goes through gate G1.
- A tip does not say that a stopped car makes a crossing safe.
- A tip does not imply that a stopped car makes a crossing safe.

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
- [ ] A tip does not say that a stopped car makes a crossing safe.
- [ ] A tip does not imply that a stopped car makes a crossing safe.
- [ ] No spoken voice plays in any step.

Sound cue visuals:

- The designer owns the visual equivalents of key sound cues.
- A visual equivalent is a caption or an icon.
- The key sound cues include the danger sound.
- The key sound cues include the missed cue.
- The designer must complete this work before TAC-15.
- The designer must complete this work before TAC-17.

## 7. Scoring

- Safe decisions score higher than speed.
- A failure costs real score. The cost is not zero.
- The score is for the current session only in Mission 1. The spec does not change the save-data format. If a save change is needed, the builder stops. The builder asks the lead for a ticket.
- The score numbers are not set yet (OQ-5).

## 8. Text rules (decision D4)

- All player text is third person.
- All feedback is written text. There is no guide voice.
- No player text uses blindness framing, awareness framing or social-responsibility framing.
- Section 8a gives the banned words for player-facing copy.
- The designer writes the copy rules (TAC-8).
- The builder runs an automated check for the banned words.

## 8a. Banned words for player-facing copy

Player-facing copy must not use these words and phrases:

- blind
- blindness
- visually impaired
- simulate
- simulation
- experience what it is like
- disability
- awareness
- cane
- braille

The builder checks player text for these words and phrases.
The builder checks store text for these words and phrases.
The builder checks marketing text for these words and phrases.

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
| D8 | The designer owns the visual equivalents of key sound cues. A visual equivalent is a caption or an icon. The cues include the danger sound and the missed cue. The designer must complete this work before TAC-15. The designer must complete this work before TAC-17. | Ethics review R3 (TAC-10) |

## 10. Gates

**G1. Risk gate.**

- Traffic-safety tips that the game shows to players are risky.
- Risky work: stop before code. Write a design or diff. Send it to the reviewer.
- The reviewer reviews the tip list (lead decision, OQ-14).
- The reviewer approves the tip list.
- Merge only after the reviewer says APPROVED and CI is green.
- The reviewer reviews the change.
- The reviewer approves the change.
- Every tip needs a real source. Nobody invents a source or a fact.

**G2. Ethics review.**

- A design that touches representation, framing or marketing needs an ethics review from the reviewer before code.
- Files go in docs/psychology/.
- This gate covers: the character (D1), the failure flow (D3) and the player copy (D4).

**G3. Risk classes.**

These classes are the only risky work:

- A new third-party package, action or asset is risky.
- Record the license for that package, action or asset.
- A real-world traffic-safety claim shown to players is risky.
- A security change is risky.
- A permission change is risky.

**G4. Escalation.**

- Escalate to Tuğrul only through the lead.
- Cases: an uncertain factual claim in a traffic-safety tip, possible player data loss, spending money, or a REQUEST CHANGES that the owner and the reviewer cannot resolve.

**Workflow gate.** The lead assigns the work. The builder or the designer does the work. The owner sends the PR URL to the reviewer. The reviewer does one review round. The reviewer gives the risk sign-off in that review. The PR merges when CI is green and the review passes. A docs-only PR with no player-facing copy merges when CI is green. That PR needs no review.

## 11. Ownership

The team has four roles: lead, builder, designer and reviewer.

| Area | Owner | Paths |
| --- | --- | --- |
| Scope and specs | lead | docs/product/ |
| Scenes and game logic | builder | src/scenes/**, src/game/** |
| Sound code | builder | src/audio/** |
| Sound design | designer | public/audio/**, docs/audio/ |
| Visual equivalents of key sound cues | designer | captions or icons for the danger sound and the missed cue |
| Learning and copy rules | designer | docs/learning/ |
| Architecture, entry, level data schema, save-data format | builder | src/main.ts, index.html, shared utils, src/levels/** |
| Build, CI/CD, dependencies (package.json, Vite, Phaser 3, TypeScript) | builder | package.json, lockfile, build and CI config |
| README.md | lead (OQ-11) | README.md |
| Tests | builder | *.test.ts, src/test/** |
| Visual style and UX audits | designer | no code (see OQ-9 for the document path) |
| Psychology and ethics | reviewer | docs/psychology/ |
| Adversarial design review | reviewer | read-only |
| Approval of risky changes | reviewer | none |

The accessibility-expert role no longer exists. No ticket goes to it.

## 12. Ticket map (Linear team TAC)

Each ticket has one owner role.

| Ticket | Owner | Title | Risky |
| --- | --- | --- | --- |
| TAC-5 | lead | Mission 1: spec PR (docs/product/mission-1-spec.md) | no |
| TAC-6 | builder | Mission 1: architecture and level data schema | no, unless it adds a new third-party package |
| TAC-7 | designer | Mission 1: yellow drop walker visual spec | no |
| TAC-8 | designer | Mission 1: Part A tutorial text and feedback copy rules | no |
| TAC-9 | designer | Mission 1: traffic-safety tip list with sources | yes |
| TAC-10 | reviewer | Mission 1: framing and ethics review | no |
| TAC-11 | builder | Mission 1: yellow drop walker on map and in scene | no |
| TAC-12 | builder | Mission 1: Part A tutorial flow | no |
| TAC-13 | builder | Mission 1: Part B car and listen-wait logic | no |
| TAC-14 | designer | Mission 1: car sound and spatial audio | yes only if it adds a third-party sound asset |
| TAC-15 | builder | Mission 1: failure freeze, ring and reduced motion | no |
| TAC-16 | designer | Mission 1: danger sound and missed-cue replay audio | yes only if it adds a third-party sound asset |
| TAC-17 | builder | Mission 1: failure replay with arrows, text outcome and cue replay | no |
| TAC-18 | builder | Mission 1: rewind, score cost and safe-wait scoring | no |
| TAC-19 | builder | Mission 1: show one traffic-safety tip after failure | no |
| TAC-20 | builder | Mission 1: tests | no |
| TAC-21 | builder | Mission 1: scaffold dependencies (package.json, Vite, Phaser 3, TypeScript) | yes |
| TAC-22 | lead | README.md: rewrite to new framing | no |

TAC-5 to TAC-10, TAC-21 and TAC-22 may start now. TAC-11 to TAC-19 wait for the lead "go". TAC-20 follows the code tickets.

The designer must complete the visual equivalents of key sound cues before TAC-15.
The designer must complete the visual equivalents of key sound cues before TAC-17.
These cues include the danger sound.
These cues include the missed cue.

The Linear tickets hold the scope, acceptance checklist and dependencies. If this table and Linear differ, Linear is newer for ticket detail. This spec is newer for decisions.

## 13. Repo state

On 2026-10-28, the repo ordboj/tactile on main has one file: README.md. It has no src/, no docs/ and no package.json. All paths under src/, public/ and docs/ in the tickets are planned paths. They do not exist yet. File names inside the owner paths are proposals. The builder ticket TAC-21 creates the package and build base. The builder ticket TAC-6 creates the architecture and the level schema.

The main README.md describes the game with the old framing ("shows how blind pedestrians find their way", "an awareness game"). This conflicts with section 1. TAC-22 rewrites it (draft: /workspace/tactile-pm/README.md).

## 14. Open questions

- **OQ-1 (resolved 2026-10-29): Part A traffic light.** Part A has no traffic light and no traffic. Signals come in a later mission.
- **OQ-2: Unit of "44 pt".** The web game uses pixels. Does 44 pt mean 44 CSS px, or a size at a set screen density?
- **OQ-3 (resolved 2026-10-29): Reduced motion.** The device setting is the default. The game also has an in-game switch.
- **OQ-4 (resolved 2026-10-29): Tip count.** One tip for each failure.
- **OQ-5: Score values.** No numbers exist for the rewind cost, the safe-wait score and the speed score. The builder puts them in one config place. The lead or the designer sets the values.
- **OQ-6: Danger sound.** Which sound marks the danger? The designer proposes it. It must not be a voice. If it uses a third-party asset, G3 applies.
- **OQ-7: Skip control.** Which control skips the replay? The designer proposes it.
- **OQ-8: Contact time rule.** The freeze starts less than 1 s before contact, but the game never shows contact. The builder proposes a rule that predicts the contact time.
- **OQ-9: Document path for the designer.** The handbook gives the designer no file path. The ticket proposes docs/ux/. The lead confirms.
- **OQ-10 (resolved 2026-10-29): Scaffold owner.** The builder owns the scaffold dependencies (package.json). The builder owns the architecture.
- **OQ-11 (resolved 2026-10-29): README.** The lead rewrites README.md to the new framing in a small PR (TAC-22). The reviewer does the ethics review.
- **OQ-12 (resolved 2026-10-29): Character name.** The working name is "Walker". Tuğrul decides the final name later. Nobody waits for it.
- **OQ-13 (resolved 2026-11-05): Step back and align.** Decided by the lead on Nov 5, 2026: Part A teaches Stop, Step back and Align. Wait stays in Part B.
- **OQ-14 (resolved 2026-10-29): Tip reviewers.** The reviewer reviews the tip list. The reviewer approves the tip list.
- **OQ-15 (resolved 2026-10-29): Traffic light in Part B.** Part B has no traffic light. Part B has one car on the one-way road. The player listens and waits.

## 15. Out of scope

- Levels after Mission 1.
- Support fading across levels.
- Touch to Query tuning beyond use on the road in Part B.
- Save-data and score persistence.
- Store text, marketing text and the README (OQ-11).
