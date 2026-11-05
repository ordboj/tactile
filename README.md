# Tactile Maps

Tactile Maps is a 2D web game. It runs in the browser and on phones.

A pedestrian finds the way with sound, memory and a tactile map. The working name of the pedestrian is Walker. Walker is a warm yellow drop-shaped character. The game has separate designed scenes and levels. The first goal is to cross a one-way road. In early levels the tactile map is always on screen. In later levels visual support fades.

Tactile Maps is a game. It is not a navigation app.

## Stack

- Phaser 3
- TypeScript
- Vite
- Web Audio API (spatial sound)
- Vibration API, with an audio and visual fallback (iOS Safari has no vibration)

## Status

Mission 1 prototype work is underway on main.
The repository contains game code.
Part A teaches Stop, Step back and Align.
Wait stays in Part B.
Product documents go in `docs/product/`.

The site address is `tactile.<subdomain>.workers.dev`.
Replace `<subdomain>` with the Cloudflare account subdomain.
The game is served from the root of that address.

A push to the main branch starts the deploy workflow.
The workflow checks the types.
The workflow runs the tests.
The workflow builds the site.
A failed check stops the deploy.
The workflow deploys the site to Cloudflare Workers.
Start the same workflow from GitHub Actions when a manual deploy is required.

The repository must have two secrets.
The secret names are `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
The token must have Workers Scripts Edit on the account only.
Do not put the token in the repository.
Do not put the account id in the repository.
