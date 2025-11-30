# Repository Guidelines

- 開発速度を上げるために一通りの作業をした後で、`bun run build`でビルドが通ることを確認
- lintはこちらが指定したタイミングで実施（`bun run lint` && `bun run format`）
- pythonでのファイル更新は実施しない

## Project Structure & Module Organization
- `app/`: Next.js App Router pages, layouts, and API routes (`app/api/**/route.ts`).
- `components/`: Reusable React components (`*.tsx`).
- `lib/`: Client/server helpers (e.g., `prismaClient.ts`, `workflowClient.ts`).
- `prisma/`: Prisma schema, migrations, and seed (`schema.prisma`, `migrations/`, `seed.ts`).
- `workflows/` and `steps/`: Workflow definitions and step functions.
- `public/`: Static assets. Configuration at repo root (`next.config.ts`, `biome.json`).

## Build, Test, and Development Commands
- `npm run dev` — Start local dev server at `http://localhost:3000`.
- `npm run build` — Production build.
- `npm run start` — Run built app.
- `npm run lint` / `npm run lint:fix` — Lint (Biome) / fix issues.
- `npm run format` / `npm run format:check` — Format code / verify formatting.
- DB: `npx prisma migrate dev` (or `db push`) then `npx prisma db seed` (uses `prisma.seed`).
- Manual API exercise: start dev server, then `bun workflowTst.ts`.

## Coding Style & Naming Conventions
- TypeScript strict mode enabled; prefer explicit types at boundaries.
- Formatting via Biome: tab indentation, double quotes, organized imports.
- React components: PascalCase component names; filenames kebab-case or contextual (`diary-creation.ts`).
- API routes live under `app/api/**/route.ts`; shared utilities in `lib/`.

## Testing Guidelines
- No test runner is configured yet. Prefer small, testable functions in `lib/`.
- When adding tests, use `__tests__/` with `*.test.ts(x)` or colocate `*.spec.ts(x)`; aim for fast unit tests and minimal mocks.
- For API/manual flows, use `workflowTst.ts` or `curl`/`REST` clients against `npm run dev`.

## Commit & Pull Request Guidelines
- Use Conventional Commits where possible: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
- Keep PRs focused and small. Include: summary, rationale, testing steps, screenshots for UI, and linked issues.
- Run `npm run lint` and `npm run format:check` before submitting.

## Security & Configuration
- Never commit secrets. Use `.env.local` for developer overrides.
- Required env vars: `DATABASE_URL`, `WORKFLOW_BASE_URL` (defaults to `http://localhost:3000`), and OpenAI credentials for AI SDK (e.g., `OPENAI_API_KEY`).
- Example: `DATABASE_URL=postgres://user:pass@host:5432/db`.

## Agent-Specific Instructions
- Obey this guide within its directory scope. Prefer minimal, well-scoped changes.
- Before opening PRs, run lint/format and verify Prisma schema compiles.
