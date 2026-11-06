# Setup steps

Do these steps in order. Use the private map of placeholders to real values. Never write real values into team/.

## Step 1. Prepare the accounts and connectors

1. Use a Grok Bot account that can create more than one bot.
2. Connect GitHub to the Grok Bot. The connector must read and write the repo. The connector must have access to the organization that owns the repo.
3. Install the Cursor GitHub app on the repo. The bots use Cursor cloud agents to change repo files.
4. Connect Linear when the team wants to use Linear. The name and key of the Linear team come from the lead. Until then, use GitHub Issues in the repo.
5. Keep all credentials inside the connector login pages. Never put a credential in a bot profile, a handbook, or a repo file.

## Step 2. Prepare the repo

1. Create the repo (the example is ordboj/tactile). Set the default branch to `main`.
2. Make sure the repo has a README.md on `main`.
3. Do not add a team/ folder by hand. The meta bot or a pull request adds it.

## Step 3. Create the bots with CreateAgent

Create 13 bots. Create the lead first. Then create the 12 role bots.

For each bot, call CreateAgent. Use these values:

- name: the "Bot name" line in the role file.
- description: the text in the "Profile description" block in the role file. Copy it exactly. Replace the placeholders with real values first.
- title, avatarShape, avatarColor: optional. The source bots leave them empty (the lead has avatar shape square, color cyan).

The CreateAgent call can differ between Grok Bot versions. Check the field names in your tool list before you call it.

| Order | Role file | Bot name |
|---|---|---|
| 1 | roles/lead.md | Piyangocu |
| 2 | roles/product-manager.md | Tactile Ürün Yöneticisi |
| 3 | roles/game-developer.md | Tactile Oyun Geliştirici |
| 4 | roles/audio-designer.md | Tactile Ses Tasarımcısı |
| 5 | roles/accessibility-expert.md | Tactile Erişilebilirlik Uzmanı |
| 6 | roles/learning-designer.md | Tactile Öğrenme Tasarımcısı |
| 7 | roles/staff-engineer.md | Tactile Staff Engineer |
| 8 | roles/qa.md | Tactile QA |
| 9 | roles/devops.md | Tactile DevOps |
| 10 | roles/ui-ux-expert.md | Tactile UI/UX |
| 11 | roles/design-critic.md | Tactile Tasarım Eleştirmeni |
| 12 | roles/approver.md | Tactile Onaylayıcı |
| 13 | roles/meta.md | Tactile Meta |

You can use other bot names. Keep the prefix "Tactile" for the 12 role bots. Update the files in roles/ when you change a name.

After each call, write down the bot id. Put it in your private map as <LEAD_BOT_ID> or <ROLE_BOT_ID:slug>.

## Step 4. Set the settings of each bot

For each of the 12 role bots, set:

- hiddenFromSidebar = true
- notifyOnAgentUpdates = false

The bot can set this itself with UpdateProfile. The handbook asks each bot to do this. Check the result in the settings of each bot.

Settings of the lead: keep the lead visible in the sidebar. The lead is the only bot that talks to <OWNER_NAME>. Choose the notification setting of the lead with <OWNER_NAME>.

## Step 5. Deliver the handbook

1. Copy HANDBOOK.md from this folder.
2. Replace every placeholder with the real value from your private map.
3. Save the result on the box as `/workspace/shared/TACTILE_TEAM_HANDBOOK.md`.
4. Check that all bots can read this path. All bots on the same box share /workspace/shared.
5. Send each bot one message with SendToAgent: "Save the handbook at /workspace/shared/TACTILE_TEAM_HANDBOOK.md to your memory. Use it in every turn."
6. Do this step again each time the handbook changes. Raise the version number in the first line.

## Step 6. Introduce the team

1. Tell the lead the id of each role bot.
2. Tell each role bot the id of the lead. The profile description already holds this id.
3. Make sure each role bot can send messages to the lead and to the other role bots.

## Step 7. Set the repo settings

Current state of the example repo on 2026-10-28 (read-only check):

- Branch `main` has no protection.
- No required status checks exist.
- No CI workflow exists.
- Auto-merge is off in the repo settings.
- Allowed merge methods: squash, merge commit, rebase.

Target settings. The devops bot owns this work. Raise it as a pull request or as a setting change that the lead approves.

1. Create a CI workflow in GitHub Actions. It must run lint, type check, unit tests, and the build.
2. Add the checks of this workflow as required status checks on `main`.
3. Protect `main`: require a pull request before merge, require the status checks, and block direct pushes.
4. Decide how a merge happens. The rule is: the lead merges every PR when CI is green. Option A: the lead merges by hand. Option B: turn on auto-merge in the repo settings, so GitHub merges when the required checks pass. Ask <OWNER_NAME> through the lead which option to use. TODO: this choice is open.
5. Do not give the bots any permission to push to `main` directly.
6. Set up dependency update pull requests (deps-pilot). The devops bot does this.

The exact names of the required checks are TODO. They depend on the CI workflow that does not exist yet.

## Step 8. Add this folder to the repo

1. The lead or the owner asks a Cursor cloud agent to open a pull request that adds team/ to the repo.
2. The lead merges the pull request when CI is green.
3. After this, the meta bot keeps team/ current.

## Step 9. Check the team

Do these checks. Write the evidence in an issue.

1. Ask each role bot: "Who can you talk to?" The answer must name the lead and the Tactile bots only.
2. Ask one role bot to send a test message to the lead with SendToAgent. The lead must receive it.
3. Check that no bot messaged <OWNER_NAME>.
4. Check the settings of the 12 role bots (step 4).
5. Open one test ticket. Follow the ticket flow in HANDBOOK.md. Check that no bot pushes to `main`.

## Step 10. Routines

Create the lead routines from routines.md. That file has a TODO now. Do not create routines from guesses.
