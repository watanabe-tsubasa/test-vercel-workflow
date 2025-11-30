// steps/diarySteps.ts

import type {
	UpdateDiaryInput,
	UpdateDiaryResponse,
} from "@/app/api/diary/update/route";
import type { StreamDiaryInput } from "@/app/api/internal/ai/stream-start/route";
import { placeholderDiaryImage, uploadDiaryImage } from "@/lib/imagekitClient";
import { MODELS, openai } from "@/lib/openaiClient";
import {
	streamStartInWorkflow,
	updateDiaryInWorkflow,
} from "@/lib/workflowClient";

// -------------------------
// 日記DB更新ステップ
// -------------------------
export async function stepUpdateDiary(
	input: UpdateDiaryInput,
): Promise<UpdateDiaryResponse> {
	"use step";
	return await updateDiaryInWorkflow(input);
}

// -------------------------
// AIストリーミング開始ステップ
// -------------------------
export async function stepStartStream(
	input: StreamDiaryInput,
): Promise<string> {
	"use step";
	const res = await streamStartInWorkflow(input);
	return res.firstDraft;
}

// -------------------------
// タイトル生成ステップ
// -------------------------
export async function stepGenerateDiaryTitle(input: {
	workflowId: string;
	prompt: string;
}): Promise<string> {
	"use step";

	try {
		const response = await openai.responses.create({
			model: MODELS.text,
			input: `次の日記の内容から、15文字以内の日本語タイトルを1つ作成してください。タイトル以外は返さないでください。\n${input.prompt}`,
		});

		const rawTitle = response.output_text?.trim() ?? "";
		const firstLine = rawTitle.split(/\r?\n/)[0]?.trim();
		return firstLine && firstLine.length > 0 ? firstLine : "日記";
	} catch (err) {
		console.error("Title generation error:", err);
		return "日記";
	}
}

// -------------------------
// 画像生成＋ImageKitアップロードステップ
// -------------------------
export async function stepGenerateDiaryImage(input: {
	workflowId: string;
	prompt: string;
}): Promise<{ imageUrl: string; hasImage: boolean }> {
	"use step";

	const { workflowId, prompt } = input;
	const placeholder = placeholderDiaryImage(prompt);

	try {
		const result = await openai.images.generate({
			model: MODELS.image,
			size: "1536x1024",
			prompt: `日記の内容に合うイラストを1枚生成してください: ${prompt}`,
		});

		// OpenAI SDK の正式な返却形式
		const base64Image = result.data?.[0]?.b64_json;

		if (!base64Image) {
			console.error("❌ base64 image not found in OpenAI response");
			return { imageUrl: placeholder, hasImage: false };
		}

		// ImageKit は純粋な base64 を必要とする
		const upload = await uploadDiaryImage({
			file: base64Image, // そのまま渡せる
			fileName: `${workflowId}.png`,
			folder: "/diaries",
		});

		return { imageUrl: upload.url, hasImage: true };
	} catch (err) {
		console.error("Image generation or upload error:", err);
		return { imageUrl: placeholder, hasImage: false };
	}
}
