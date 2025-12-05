# AI-Powered Diary Workflow App

Next.js (App Router) app that turns bullet points into illustrated diaries. Google sign-in gates access, OpenAI generates the draft and image, ImageKit hosts the artwork, and a Vercel Workflow orchestrates the steps end-to-end.

## Features

- Google OAuth login with NextAuth; diaries are scoped per user
- Diary creation flow: stream AI draft → user revision → OpenAI image generation → ImageKit upload
- Workflow status polling and SSE draft streaming for responsive UX
- Dashboard of your diaries with state badges, detail view with stored ImageKit URL
- Drizzle ORM + Neon (PostgreSQL) schema for `User`/`Diary`

## Tech Stack

- Next.js 16 / React 19 (App Router, Server Actions)
- Drizzle ORM on Neon serverless Postgres
- NextAuth (Google provider, JWT session)
- OpenAI (text + image) via AI SDK, ImageKit for storage/CDN
- Workflow runtime (`workflows/`, `steps/`) to coordinate diary generation
- Biome for lint/format

## Prerequisites

- Node.js 18+ (Bun or npm available)
- PostgreSQL connection string (Neon recommended)
- OpenAI API key, ImageKit credentials, Google OAuth client/secret

## Environment Variables

Create `.env.local` with at least:

```.env
DATABASE_URL=postgres://user:pass@host:5432/db
WORKFLOW_BASE_URL=http://localhost:3000
OPENAI_API_KEY=sk-***
IMAGEKIT_PUBLIC_KEY=***
IMAGEKIT_PRIVATE_KEY=***
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_space
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret
GOOGLE_CLIENT_ID=***
GOOGLE_CLIENT_SECRET=***
```

## Setup & Commands

Install dependencies:

```sh
bun install
# or: npm install
```

Create schema on your Postgres instance:

```sh
bun run db:push
```

Run the app locally:

```sh
bun run dev
# open http://localhost:3000
```

Build for production (run after changes to verify):

```sh
bun run build
```

Lint/format when needed:

```sh
bun run lint
bun run format
```

## Workflow & API Notes

- New diary: `/creation` starts a workflow (`/api/diary/create`) that streams a draft (`/api/internal/ai/stream-start`), waits for user revision (`/api/diary/revise`), then generates title/image and persists via `/api/diary/update`.
- Workflow status is polled from `/api/workflow/status` using the `workflowId`.
- Auth is enforced server-side (`requireCurrentUser`); unauthenticated users are redirected to `/login`.

## Project Structure

- `app/` — App Router pages (dashboard, creation flow, diary detail, auth) and API routes
- `components/` — Reusable UI (sidebar, inputs, cards)
- `db/` — Drizzle schema for User/Diary
- `lib/` — Auth, DB, OpenAI, ImageKit, workflow client helpers
- `workflows/` & `steps/` — Workflow definitions and step functions
- `public/` — Static assets
