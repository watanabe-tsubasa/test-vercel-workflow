# 絵日記アプリ 要件定義書

## 1. ゴール
- ユーザーが Google でサインインし、日記（テキスト＋生成画像）を作成・閲覧・更新できる。
- 日記は AI で初稿生成 → ユーザー修正 → 画像生成 → 保存まで自動化するワークフローを備える。
- 画像は ImageKit にアップロード・配信し、DB には URL とメタ情報のみを保持する。

## 2. ユースケース
- ログイン済みユーザーが「箇条書き」を入力すると、AI が初稿生成し、ユーザーが修正・確定し、画像生成まで行う。
- 過去の日記一覧から詳細を閲覧し、内容・画像を再生成できる。
- スマホ・PC の両方で快適に閲覧・編集できる。

## 3. 機能要件
- 認証
  - Google OAuth を利用（NextAuth 等を想定）。ログイン必須で日記作成・閲覧を制限。
  - セッション情報をフロントに提供し、ユーザー ID で日記をスコープ。
- 日記 CRUD
  - 作成: 箇条書き入力 → workflow 起動 → 初稿・最終稿保存。
  - 更新: 内容・画像の再生成、タイトル変更。
  - 閲覧: 一覧（ページング/ソート）、詳細表示。
- ワークフロー
  - ステップ: 下書き登録 → 初稿生成（AI）→ ユーザー修正待ち → 画像生成 → 永続化。
  - エラーハンドリング: ステップごとに失敗時リトライとユーザーへの通知（UI/Toast）。
  - フロント連携: 進行状況をポーリング or SSE/WebSocket で反映（簡易版はポーリング）。
- AI 生成
  - テキスト生成: OpenAI (gpt-4o / gpt-5 相当) に bullets を渡し文章を生成。
  - 画像生成: OpenAI 画像 API（ない場合はモック画像で代替）。
- 画像ストレージ（ImageKit）
  - バックエンドで ImageKit にアップロードし、返却された URL を DB に保存。
  - 変換用のベース URL/パスを環境変数で管理。
- フロントエンド
  - 画面: ログイン、ダッシュボード（日記一覧）、日記詳細、日記作成ウィザード。
  - 状態管理: React/Server Actions + フロント API クライアント。ローディング/エラー表示を標準化。
  - アクセシビリティ: フォームバリデーション（zod）、キーボード操作、モバイル対応レイアウト。

## 4. 非機能要件
- パフォーマンス: 初期レンダリング < 2s（キャッシュ/静的化できる部分は静的化）。画像は CDN（ImageKit）配信。
- セキュリティ: 環境変数に秘密鍵を保存（.env.local）。CSRF/XSS への対策（NextAuth/HTTP only cookie、入力サニタイズ）。
- 可用性: ワークフローはリトライ可能にし、失敗時はユーザーに再実行手段を提示。
- ログ/監視: ワークフロー実行ログ、API 失敗ログをサーバー側で出力。フロントはユーザー向けエラー表示を行う。

## 5. データモデル（主要）
- User: id, name, email, image.
- Diary: id, userId(FK), title, date, content, imageUrl, hasImage, state(DRAFT/GENERATING/WAITING_USER/DRAWING/COMPLETED), workflowId, createdAt, updatedAt.
- （将来）ImageMeta: imageUrl, width, height, format, thumbnailUrl（必要に応じて拡張）。

## 6. API / ワークフロー連携
- `/api/diary/create`: bullets, token → diary 作成 + workflow 起動。
- `/api/internal/ai/stream-start`: bullets → { firstDraft } を返却（モック可）。
- `/api/diary/revise`: workflowId, revisedBullets → userEdited hook 再開。
- `/api/diary/update`: workflowId と更新内容を DB に保存。
- 画像生成アップロード: 画像生成後、ImageKit へアップロード → URL を `/api/diary/update` で保存。

## 7. 認証/権限
- Google OAuth でログイン。非ログインユーザーはログイン画面へリダイレクト。
- API/ワークフローはセッションの userId でスコープ。自分の diary のみ閲覧・更新可能。

## 8. 環境変数
- `DATABASE_URL`
- `WORKFLOW_BASE_URL` (例: http://localhost:3000)
- `OPENAI_API_KEY`
- `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

## 9. UI 要件（ざっくり）
- ダッシュボード: 日記カード一覧（タイトル、日付、サムネイル）。新規作成ボタン。
- 作成フロー: 箇条書き入力 → 進行状況表示（生成中/待機中/画像生成中）→ 修正入力フォーム → 完了画面。
- 詳細画面: テキスト＋画像表示、再生成ボタン、編集フォーム。
- モバイル対応のレスポンシブレイアウト。

## 10. 今後の拡張
- コメント/共有機能（限定公開リンク）。
- 画像生成プロバイダ切り替え（ImageKit の変換 API 併用）。
- 通知（メール/Push）で生成完了を知らせる。
