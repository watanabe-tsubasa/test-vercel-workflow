import {
	stepGenerateDiaryImage,
	stepStartStream,
	stepUpdateDiary,
} from "@/steps/diarySteps";
import { userEditedHook } from "@/workflows/hook";

/**
 * Diary作成用のWorkflow
 * @param workflowId resumeのIDを追跡
 * @param bullets ユーザーが入力した箇条書き
 */
export const diaryWorkflow = async (params: {
	workflowId: string;
	bullets: string;
	userId?: string;
}) => {
	"use workflow";

	const { workflowId, bullets, userId } = params;

	// hook は workflow コンテキストで生成する
	const userEditedPromise = userEditedHook.create({ token: workflowId });

	// 状態1️⃣: 箇条書き受信 → DRAFTに登録
	console.log("[workflow] start diary", { workflowId, userId });
	await stepUpdateDiary({
		workflowId,
		state: "GENERATING",
	});

	// 状態2️⃣: AIによる日記文生成（APIからdraftを直接取得）
	console.log("[workflow] generating first draft", { workflowId });
	const firstDraft = await stepStartStream({
		workflowId,
		bullets,
	});

	// --- DBに暫定文を保存しておく（オプション）---
	await stepUpdateDiary({
		workflowId,
		content: firstDraft,
		state: "WAITING_USER",
	});

	// 状態3️⃣: ユーザー修正版を待機（hook待ち）
	console.log("[workflow] waiting user edit", { workflowId });
	const { revisedBullets } = await userEditedPromise;
	await stepUpdateDiary({
		workflowId,
		state: "DRAWING",
		content: revisedBullets,
	});

	// 状態4️⃣: 絵を生成して保存
	console.log("[workflow] generating image", { workflowId });
	const { imageUrl, hasImage } = await stepGenerateDiaryImage({
		workflowId,
		prompt: revisedBullets,
	});

	// 状態5️⃣: DBへ保存 → 完了
	const res = await stepUpdateDiary({
		workflowId,
		imageUrl,
		hasImage,
		state: "COMPLETED",
	});

	if (res.status === "ok") {
		console.log("[workflow] completed", {
			workflowId,
			diaryId: res.updated.id,
		});
		return { message: "completed", id: res.updated.id };
	} else {
		console.error("[workflow] failed", { workflowId, error: res.error });
		return { message: res.error };
	}
};
