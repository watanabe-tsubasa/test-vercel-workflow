import {
	stepGenerateFirstDraft,
	stepStartStream,
	stepUpdateDiary,
	stepWaitUserEdit,
} from "@/steps/diarySteps";

/**
 * Diary作成用のWorkflow
 * @param workflowId resumeのIDを追跡
 * @param bullets ユーザーが入力した箇条書き
 */
export const diaryWorkflow = async (workflowId: string, bullets: string) => {
	"use workflow";

	// 状態1️⃣: 箇条書き受信 → DRAFTに登録
	await stepUpdateDiary({
		workflowId,
		state: "GENERATING",
	});

	// 状態2️⃣: AIによる日記文生成
	const firstDraft = await stepGenerateFirstDraft(workflowId);
	await stepStartStream({
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
	const revisedBullets = await stepWaitUserEdit(workflowId);
	await stepUpdateDiary({
		workflowId,
		state: "DRAWING",
		content: revisedBullets,
	});

	// 状態4️⃣: 絵を生成
	// const { image } = await generateImage({
	// 	model: openai.imageModel("gpt-image-1"),
	// 	prompt: `次の日記内容を絵にしてください: ${revisedBullets}`,
	// 	size: "1792x1024",
	// });

	// 状態5️⃣: DBへ保存 → 完了
	const res = await stepUpdateDiary({
		workflowId,
		imageUrl: "sample url(tbd)",
		hasImage: true,
		state: "COMPLETED",
	});

	if (res.status === "ok") {
		return { message: "completed", id: res.updated.id };
	} else {
		return { message: res.error };
	}
};
