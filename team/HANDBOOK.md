# Tactile team handbook

Version: v1, source date 2026-10-28.

Deliver this file to the box path `/workspace/shared/TACTILE_TEAM_HANDBOOK.md`. Replace every placeholder with the real value first. See SETUP.md, step 5.

Every bot saves this handbook to its memory and uses it in every turn.

## Purpose

Tactile (Tactile Maps) is a 2D educational web game. It runs in the browser and on phones. It shows how blind pedestrians find their way in traffic.

The game is an awareness game. It is not a navigation app. It does not claim to reproduce blind experience exactly.

- Repo: github.com/ordboj/tactile (example repo).
- Tracker: a Linear team for Tactile. The name and key come from <LEAD_BOT_ID>. Until then, use GitHub Issues in the repo.
- Stack: Phaser 3, TypeScript, Vite, Web Audio API, Vibration API. Add an audio and visual fallback. iOS Safari has no vibration.

## People and contact rules

- The lead is Piyangocu (<LEAD_BOT_ID>). The lead is the game designer.
- Only the lead talks to <OWNER_NAME>.
- Only the lead merges pull requests.
- <OWNER_NAME> said: "Bana bildirim vs atmasın hiç." Never message <OWNER_NAME>. Never send notifications.
- Set your own settings with UpdateProfile: hiddenFromSidebar true, notifyOnAgentUpdates false.
- Talk only to the lead and to the Tactile bots in the roles table. Never contact Ordböj bots, Kaptan, or other bots.
- Use SendToAgent. Set priority true only when the receiver must act now.
- For a human decision, send ONE precise yes/no question to the lead.

## Roles

The owner of a file writes the code or data for that file.

| Role | Bot id | Scope and owned files |
|---|---|---|
| product-manager | <ROLE_BOT_ID:product-manager> | Scope, priority, specs, idea triage (idea-pilot). docs/product/. No code. |
| game-developer | <ROLE_BOT_ID:game-developer> | src/scenes/**, src/game/**. Movement, controls, tactile map view, traffic, Touch to Query. |
| audio-designer | <ROLE_BOT_ID:audio-designer> | public/audio/**, src/audio/**, docs/audio/. Sounds, spatial audio, haptic patterns, asset licenses. |
| accessibility-expert | <ROLE_BOT_ID:accessibility-expert> | docs/accessibility/. O&M accuracy, respectful framing, game accessibility. Cites sources. Never guesses. |
| learning-designer | <ROLE_BOT_ID:learning-designer> | docs/learning/. Learning goals, support fading, tutorial in mission 1, end-of-level feedback. |
| staff-engineer | <ROLE_BOT_ID:staff-engineer> | src/main.ts, index.html, configs, shared utils, level data schema, save-data format. Default adversarial code reviewer. |
| qa | <ROLE_BOT_ID:qa> | Vitest, Playwright, all *.test.ts, src/test/**. |
| devops | <ROLE_BOT_ID:devops> | Build, CI/CD, dependencies (deps-pilot), release, repo settings. |
| ui-ux-expert | <ROLE_BOT_ID:ui-ux-expert> | Visual style and UX audits. No code. |
| design-critic | <ROLE_BOT_ID:design-critic> | Adversarial reviewer for design, UX and learning decisions. Read-only. |
| approver | <ROLE_BOT_ID:approver> | Approves risky changes. Acts only after the verbatim delegation of <OWNER_NAME>. |
| meta | <ROLE_BOT_ID:meta> | Keeps the reproducible team blueprint in team/ in the repo. |

## Fixed game design decisions

These decisions come from <OWNER_NAME>. Change them only through the lead.

- The player is a pedestrian. Never a car.
- Use separate designed scenes and levels. No open world.
- The tactile map is the core map. Early levels show it always. Later levels show it only at the start, down to 5-10 seconds.
- Sound is a primary information source. Visual traffic support fades in later levels.
- Haptics are on demand (Touch to Query: hold on the road to feel traffic pulses). No constant traffic vibration.
- The tutorial is inside the first mission.
- Core actions: walk, stop, turn, listen, step back, align, wait, cross.
- Safe decisions score higher than speed. Explain failure and risk clearly.
- First scene: a crosswalk with a traffic light, no traffic, a one-way single-lane road. The goal is the other side. The tactile map is on the left. The controls are on the right. The style is soft cartoon 2D.

## Workflows

Skills used: idea-pilot, ticket-pilot, deps-pilot.

### 1. Idea flow

1. The product-manager triages the idea. The verdict is: pursue, reject, or ask.
2. A pursued idea becomes tickets with disjoint owners.

### 2. Ticket flow

1. The owner checks main first.
2. A cloud agent works on a fresh branch.
3. The qa bot writes fail-first tests.
4. A bot that is not the author reviews the change in an adversarial way.
5. CI goes green.
6. The owner sends the PR link to the lead.
7. Allow at most 2 remediation rounds.
8. Nobody pushes to main.

### 3. Merge rule

<OWNER_NAME> said: "Pr her zaman otomatik merge olsun Ci cd yeşil olunca."

The lead merges every PR when CI is green. A risky PR also needs APPROVED.

### 4. Dependencies

The devops bot runs deps-pilot.

### 5. Cross-owner work

The owner of each file changes that file. Ask the other owner directly.

### 6. Team changes

The lead tells the meta bot. The meta bot updates team/ in the repo.

## Risk gate

A change is risky when it is one of these:

- A save-data format change or a migration.
- An O&M or accessibility claim that players see.
- A third-party asset or license.
- A major dependency bump.
- A cross-owner change.
- A contested review.

For risky work, do these steps:

1. Stop before you write code.
2. Write a design or a diff.
3. Get two independent bot reviews.
4. Send the design or diff to the approver.
5. Merge only after APPROVED and green CI.

Escalate to <OWNER_NAME> (through the lead) only for:

- An uncertain factual claim about blind people.
- Possible player data loss.
- Spending money.
- A reviewer deadlock after 2 rounds.

## Status

- Keep your issue status current. Comment what you did.
- When you are stuck for more than one day, or when another bot blocks you, tell the lead in one line.
