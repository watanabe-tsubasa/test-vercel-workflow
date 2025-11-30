# Prisma → Drizzle 移行タスクリスト（/creation 影響含む）

## 1. パッケージ/セットアップ
- 依存追加: `drizzle-orm`, `drizzle-kit`, `pg`（Neon接続用）, `postgres` (option)。
- 依存削除: `prisma`, `@prisma/client`（取り除くタイミングは最後に）。
- スクリプト変更: `package.json` の `build` から `prisma generate` を外し、`drizzle-kit generate` / `drizzle-kit push` に差し替え。`prisma.seed` も削除し、seed スクリプトを Drizzle 用に再作成。
- 新規設定ファイル: `drizzle.config.ts` を追加（schema パス・out ディレクトリ・connection string）。

## 2. スキーマ/マイグレーション
- `prisma/schema.prisma` を Drizzle のスキーマ（例: `drizzle/schema.ts`）に移植。`Diary`, `User`, `DiaryState` enum を TypeScript で定義。
- 既存の Prisma マイグレーションは不要になるため、Drizzle 用の `drizzle` ディレクトリで管理。必要なら `drizzle-kit push` で DB 反映。
- seed: `prisma/seed.ts` を `drizzle/seed.ts` に移植し、Drizzle の `db.insert` で再実装。

## 3. DB クライアント層
- `lib/prismaClient.ts` を置き換え/削除し、`lib/db.ts` (drizzle) を新設。Node/Edge どちらで動くかを考慮して `neon-http` or `pg` クライアントを選択。
- `next.config.ts` の `serverExternalPackages` から Prisma 関連を削除。
- Env: `.env.local` の `DATABASE_URL` を Drizzle クライアントでも利用するよう統一。

## 4. アプリコード差し替えポイント
- 型 import: `@prisma/client` から取得している `DiaryState`, `Diary` などを Drizzle の型 (`typeof diary`, `DiaryState` enum) に差し替え。
  - 該当ファイル例: `app/creation/creation-flow.tsx`, `app/creation/current-diary-content.tsx`, `app/page.tsx`, `app/api/diary/*/route.ts`, `app/api/workflow/status/route.ts`, `prisma/seed.ts` など。
- クエリ置換（Prisma → Drizzle）:
  - `lib/auth.ts`: `prisma.user.upsert` → `db.insert`/`onConflictDoUpdate` (drizzle)。
  - `app/actions.ts`: `prisma.diary.findMany` → `db.select().from(diaries).where(...)`。
  - `app/api/diary/create/update/revise/status`: それぞれ `prisma.diary.*` を Drizzle に置換。
  - `workflows` / `steps`: 直接 Prisma を使っていないが、API 経由で依存しているため、API レイヤーの型を更新。
- Enum/状態: Prisma の `DiaryState` enum を Drizzle スキーマに再定義し、API の zod スキーマ (`app/api/diary/update/route.ts` など) で参照する型を更新。

## 5. その他
- `tsconfig` パス: 新しい `drizzle` ディレクトリを `paths`/`include` に追加する必要があれば更新。
- `proxy.ts` / workflow runtime: Prisma バンドル前提の設定がないか確認（現状 `serverExternalPackages` のみ）。
- CI/ビルド: Vercel での `build` コマンドを `drizzle-kit generate && next build` などに変更。DB マイグレーションをいつ実行するか（ビルド前 or 手動）を決める。
- リムーブ作業: Prisma 関連ファイル (`prisma/` ディレクトリ, client ファイル) は Drizzle への移行が完了した後に削除。
