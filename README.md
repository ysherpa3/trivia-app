# Trivia Challenge

A trivia quiz built with Next.js 16 and the [Open Trivia Database API](https://opentdb.com). Pick a question count, category, and difficulty, play through the questions with live scoring, and review every answer at the end.

## Features

- Multiple choice questions, configurable by count, category, and difficulty
- Immediate feedback on each answer before the next question
- Running score and progress while playing
- End the quiz early at any point, which discards the run
- Score summary with a per-question breakdown

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Vitest

## Getting started

Requires Node 20.9+ (see `.nvmrc`) and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
pnpm dev        # dev server
pnpm build      # production build (also runs typecheck)
pnpm start      # serve the production build
pnpm lint       # eslint
pnpm typecheck  # tsc --noEmit
pnpm test       # vitest run (once)
pnpm test:watch # vitest (watch mode)
```

CI runs lint, typecheck, tests, and build on every push and pull request.

## How it works

`/` collects the settings and sends them to `/play` as query params.

`/play` is a Server Component that calls Open Trivia DB during the render, so the browser never makes a data request of its own and there is no public proxy route to abuse. A `<Suspense>` boundary streams the shell immediately, so the upstream call does not hold up the whole page.

`lib/questions.ts` is the only module that talks to the API. It is `server-only`, validates every parameter before anything goes upstream, requests `encode=url3986` so responses decode with `decodeURIComponent`, retries on the upstream rate limit, and briefly caches identical requests. It also fixes the answer order: shuffling during render would make the server and client disagree and break hydration.

When the last question is answered, `/play` swaps to the score summary in place. The run never leaves React state, so there is no separate results route and nothing is written to browser storage. Reloading `/play` starts a fresh game rather than restoring a finished one.
