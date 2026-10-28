# Tactile AI team blueprint

## What the team is

The Tactile AI team is a group of 13 Grok Bots. The bots build and run Tactile (Tactile Maps).

Tactile is a 2D educational web game. It shows how blind pedestrians find their way in traffic. It is an awareness game. It is not a navigation app.

The team has one lead and 12 role bots. The lead is a game designer. The lead is the only bot that talks to <OWNER_NAME>. The lead is the only bot that merges pull requests.

| Role | Purpose |
|---|---|
| lead | Game design, contact with <OWNER_NAME>, merges pull requests. |
| product-manager | Scope, priority, specs, idea triage. |
| game-developer | Game scenes and game logic. |
| audio-designer | Sound, spatial audio, haptic patterns. |
| accessibility-expert | Orientation and mobility accuracy, game accessibility. |
| learning-designer | Learning goals, support fading, feedback. |
| staff-engineer | Architecture, data formats, code review. |
| qa | Tests and release sign-off. |
| devops | Build, CI/CD, dependencies, repo settings. |
| ui-ux-expert | Visual style and UX audits. |
| design-critic | Adversarial review of design decisions. |
| approver | Sign-off of risky changes. |
| meta | This blueprint. |

Each role has a file in roles/. Role file names use the role slug.

## Files in this folder

- README.md: this file.
- SETUP.md: exact setup steps.
- HANDBOOK.md: contact rules, roles, workflows, risk gate, merge rule. Bots read a copy of this file.
- routines.md: routines of the lead. Currently a TODO.
- roles/<role>.md: one file for each bot.
- CHANGELOG.md: history of changes to this blueprint.

## Placeholders

| Placeholder | Meaning |
|---|---|
| <OWNER_NAME> | The human owner of the team. |
| <LEAD_BOT_ID> | The bot id of the lead. |
| <ROLE_BOT_ID:slug> | The bot id of the role with that slug, for example <ROLE_BOT_ID:qa>. |

Each person who rebuilds the team keeps a private map from placeholder to real value. Keep this map outside the repo. Never commit it.

## How to rebuild the team

1. Read SETUP.md fully.
2. Prepare the connectors and the repo (SETUP.md, steps 1 and 2).
3. Create the lead bot. Use roles/lead.md. Write down its bot id.
4. Create the 12 role bots. Use one file from roles/ for each bot. Copy the profile description exactly. Replace the placeholders with the real values from your private map.
5. Write down the bot id of each role bot. Fill your private map.
6. Set the settings of each bot (SETUP.md, step 4).
7. Deliver the handbook to `/workspace/shared/TACTILE_TEAM_HANDBOOK.md` (SETUP.md, step 5).
8. Create the repo settings (SETUP.md, step 7).
9. Ask each bot to save the handbook to its memory.
10. Create the lead routines when routines.md has data.
11. Do the check in SETUP.md, step 9.

## Rules for this folder

- Write in English. Use ASD-STE100 Simplified Technical English.
- Never write secrets, credentials, emails, or private memory here.
- Never write real bot ids or personal names here. Use placeholders.
- The meta bot owns this folder. Change it only through a pull request.
