# 実装タスク（絵日記アプリ）

## step.0 初期セットアップ
- [ ] Vercel プロジェクトと環境変数の投入（`DATABASE_URL`, `WORKFLOW_BASE_URL`, `OPENAI_API_KEY`, `IMAGEKIT_*`, `NEXTAUTH_*`, `GOOGLE_*`）
- [x] Neon（PostgreSQL）セットアップ済み
- [x] ImageKit 設定（URL endpoint / public / private key）
- [ ] 必要ライブラリ追加（NextAuth, ImageKit SDK, 画像生成 SDK が増える場合はここで）
- [x] Prisma スキーマ整備済み（Diary/User）
- [x] Google Cloud OAuthのセットアップ

## step.1 認証機能（Google / NextAuth）
- [x] NextAuth 設定（Google Provider, JWT/Session config）
- [x] セッション情報を API/Server Action から参照できるヘルパーを実装
- [x] 未ログイン時リダイレクト & ナビゲーション更新（ログイン/ログアウト）
- [x] 認証を前提とした diary API の user スコープ付け

## step.2 画像生成・保存（ImageKit）
- [x] ImageKit クライアント実装（env 参照、型安全なラッパー）
- [x] 画像生成ステップ（AI 画像 or モック）で ImageKit にアップロードし URL 保存
- [x] 既存 workflow の最終ステップで `imageUrl/hasImage` を DB へ反映
- [x] 失敗時のフォールバック（モック画像/再試行）

## step.3 Workflow 拡充・安定化
- [x] 生成ステップで userId を伝搬し、Diary のスコープを保証
- [x] エラーハンドリング/リトライ方針の明示（UI への通知も考慮）※ログとステップ更新を追加
- [x] 状態遷移のログ出力と簡易モニタリング（コンソール/DB フラグ）
- [x] stream API のレスポンス・型をフロントと統一
- [x] 全体認証ミドルウェア追加（未ログイン時に /login へリダイレクト）
- [x] Workflow ステータス API 追加（workflowId で状態取得できる endpoint）
- [x] ワークフロー呼び出しがフロントからエラーなく実行できるように調整（auth proxy 例外追加）

## step.4 フロント作成・統合
- [x] 画面: ログイン・ダッシュボード（日記一覧）・日記詳細・作成ウィザード
- [x] 作成フロー UI: 箇条書き入力 → 進捗表示 → 修正フォーム → 完了
- [x] API クライアント更新（auth セッション連携・ステータス表示）
- [x] モバイル対応レイアウトとローディング/エラー UI の共通化
- [x] ヘッダーのログアウトボタン押下時にログアウトされるように修正
- [x] ヘッダーのアイコンにgoogle のアイコンが表示されるように変更

## step.5 API/フロント結合テスト
- [x] ローカルで end-to-end 動作確認（dev サーバー＋workflowTst など）
- [x] 主要フローの手動テストチェックリスト作成（認証→作成→修正→画像生成→閲覧）
- [x] デプロイ前の `npm run lint` / `npm run format` / 簡易動作確認

## step.6 追加機能
- [x] アクセス時、作成中の日記が存在する場合（DB上にCOMPLETE以外のstatusが存在する場合）、`作成中の日記が存在します`のモーダルを表示し、ボタンクリックでそのページに飛ぶように変更（/creation で実装）
- [x] 日記表示ページ`/diary/[id]`で固定画像ではなく、Neonに保存されているimagekit urlを取得するように変更（プレースホルダーでフォールバック）
- [x] 初稿ステータスが「編集待ち」で文章を表示できるようにし、修正送信で DRAWING→COMPLETED へ進む
- [x] ImageKit アップロード失敗時にプレースホルダーで完了し、`hasImage` を正しく設定する
- [x] モバイル時に /diary や /creation のサイドバーを隠し、出し入れ or モーダル化する
- [x] 環境変数不足時でもモックドラフト/プレースホルダーでフローが継続することを確認・担保する
- [x] トップページをダッシュボード化し、Chat UI を `/chat` に移動

## step.7 追加修正

- [x] 作成したドラフトの日記文章をSSEでフロントにストリーミングし、フロント側で受け取り反映（現状は全文が一度に表示される状態。/api/internal/ai/stream-start/route.ts にSSEを実装）
- [x] 画像の生成が完了してもフロントに画像が表示されない
- [x] タイトルは自動生成する。記述はdiarySteps.ts内に"use step"で記述。openaiClient.tsを利用する。
- [x] タイトル自動生成をワークフローに組み込む。画像生成とタイトル自動生成はPromise.allで並列処理する
