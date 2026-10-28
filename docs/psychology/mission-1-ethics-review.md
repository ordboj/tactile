# Mission 1 framing and ethics review (TAC-10)

Reviewer: player-psychologist
Date: 2026-10-29
Target: docs/product/mission-1-spec.md (PR #3, ticket TAC-5)
Ticket: TAC-10

## Verdict

**APPROVE WITH CHANGES.**

Required changes R1 to R3 must be in the spec before TAC-11 code starts.
Recommendations C1 to C4 do not block.

## Rules for this review

- Sources are only the two papers in section 7.
- A line that starts with "Opinion:" is a judgment. It is not a research result.
- This file uses banned words (see R2) only to describe the check. Player text must never use them.

## 1. Framing used in this review

The lead gave this framing for Tuğrul. It comes from spec section 1.

- The game has no blindness theme.
- The game has no cane.
- The game is not an awareness project.
- The game is not a social-responsibility project.
- The player is the yellow drop walker.
- All feedback is written text. No voice plays.

## 2. What is good (keep)

1. **No impact frame.** The failure flow never shows contact, impact or injury. This is suitable for young players.
2. **Third-person, text-only copy.** The copy stays simple and neutral.
3. **No blindness copy.** The spec bans it in player text, store text and marketing text.
4. **Safe decisions score higher than speed.** The score rewards waiting.
5. **The rewind has a real cost.** The cost is greater than zero.
   - Opinion: a failure with zero cost can feel patronising.
   - Basis for this opinion: a blind reviewer's critique of The Vale. The critique is in the team research file similar-games-characters.md. That file is not in this repo.
6. **The character reads in grayscale.** The drop shape differs from the boxy cars.
7. **The score is for the session only.** The game keeps no personal data.

## 3. Required changes

### R1. Real-traffic safety

Problem:

- Part B teaches: "cross only when the car has passed or has stopped".
- A stopped car does not mean the driver saw the pedestrian.
- Players can copy game rules in real traffic.

Change:

1. Part B rules and acceptance criteria must not say that a stopped car makes a cross safe.
2. Part B tips must not say this either.
3. Add one short third-person line at the start of Mission 1 or in settings.
4. Proposed text: "This is a game. In real traffic, follow local traffic rules."
5. The learning-designer sets the exact wording.
6. Every tip stays under gate G1. Every tip needs a real source.

### R2. Banned-phrase list (TAC-8)

Problem:

- The spec says the learning-designer defines the list.
- The spec does not set a minimum.

Change: the list must include at least these words and phrases.

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

The qa role automates the check. The check covers player text, store text and marketing text.

### R3. Sound-only cues exclude deaf and hard-of-hearing players

Problem:

- Key cues are sound only: the car, the danger sound and the missed cue.
- Players who cannot hear these cues lose information.
- The accessibility-expert role no longer exists. This work has no owner.

Change:

1. Add an open question for the lead: who owns visual equivalents (captions or icons) for key sound cues?
2. Suggested owner: ui-ux-expert.
3. In Mission 1 the tactile map stays visible.
4. The minimum for Mission 1 is a caption for the danger sound.
5. The minimum also includes a caption for the missed cue.

## 4. Recommendations (not blocking)

### C1. Residual blindness reading

The name "Tactile Maps", the term "tactile map", sound-only crossing and the earlier pitch can still make players and press read the game as a blindness game. They can then read the walker as a blind character with the cane removed.

Options for the lead:

- Rename the map term, for example "memory map".
- Consider the game name.
- For later levels, give a fictional reason why visual support fades (fog, night or a memory mechanic).

Opinion: the game name has the largest effect.

### C2. Failure feelings

- Keep the danger sound short.
- Keep the danger sound below a set loudness. This avoids a start for young players.
- Show positive text feedback after a safe wait. This supports the competence need (Ryan, Rigby & Przybylski, 2006).
- Keep the replay skippable. This supports autonomy (Ryan, Rigby & Przybylski, 2006).

### C3. Data and privacy

- Mission 1 keeps the score for the session only.
- If analytics or saved scores come later, run a new privacy review first.

### C4. Context from research

- Silverman, Gwinn & Van Boven (2015) found that simulating blindness lowered the ratings of blind people's capabilities.
- Under the new framing, the game must not claim to show how blind people move.
- The banned-phrase list (R2) and the store text rules enforce this.
- The research used blindfolds, not games. Applying it to games is an inference.

## 4a. Other checks from the TAC-10 checklist

- **Walker (D1):** pass. It is a yellow drop shape. It has no cane, no species and no person features.
- **Failure text:** pass. The example outcome "The car could not stop." is short and not harsh. Keep every outcome text in this style.
- **Score cost:** pass with a note. The spec sets the cost above zero. The numbers are open (OQ-5). Opinion: set a cost the player can notice but can recover from.
- **README.md:** on main, README.md still uses the old framing (spec section 13). TAC-22 (PR #4) rewrites it. This review does not cover the README text.
- **Facts:** this review states no fact without a source in section 7.

## 5. Gate G2 status

| Item | Status |
| --- | --- |
| D1 Character | Approved |
| D3 Failure flow | Approved |
| D4 Copy | Approved after R2 |

## 6. Actions

| Change | Owner | Before |
| --- | --- | --- |
| R1 | product-manager (spec), learning-designer (wording) | TAC-11 code |
| R2 | learning-designer (list), qa (check) | TAC-11 code |
| R3 | lead (owner decision), ui-ux-expert (suggested) | TAC-11 code |

## 7. Sources

- Silverman, A. M., Gwinn, J. D., & Van Boven, L. (2015). Social Psychological and Personality Science. Summary: https://www.apa.org/education-career/k12/infusing-diversity/social-personality/research-summary-blindness-simulation-empathy
- Ryan, R. M., Rigby, C. S., & Przybylski, A. (2006). The Motivational Pull of Video Games: A Self-Determination Theory Approach. Motivation and Emotion, 30(4).
