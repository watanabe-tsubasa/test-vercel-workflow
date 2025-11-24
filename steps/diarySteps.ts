// steps/diarySteps.ts

import { openai } from "@ai-sdk/openai";
import { experimental_generateImage as generateImage } from "ai";
import type {
	UpdateDiaryInput,
	UpdateDiaryResponse,
} from "@/app/api/diary/update/route";
import type { StreamDiaryInput } from "@/app/api/internal/ai/stream-start/route";
import {
	imageKitConfigured,
	placeholderDiaryImage,
	uploadDiaryImage,
} from "@/lib/imagekitClient";
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
// 画像生成＋ImageKitアップロードステップ
// -------------------------
export async function stepGenerateDiaryImage(input: {
	workflowId: string;
	prompt: string;
}): Promise<{ imageUrl: string; hasImage: boolean }> {
	"use step";
	const { workflowId, prompt } = input;

	const placeholder = placeholderDiaryImage(prompt);
	let uploadSource = placeholder;

	if (process.env.OPENAI_API_KEY) {
		try {
			const result = await generateImage({
				model: openai.imageModel("gpt-image-1"),
				prompt: `日記の内容に合うイラストを1枚生成してください: ${prompt}`,
				size: "1024x1024",
			});
			// ai SDK returns base64 string
			const base64Image =
				(result as unknown as { image?: string; imageBase64?: string })
					.imageBase64 || (result as unknown as { image?: string }).image;
			if (typeof base64Image === "string") {
				uploadSource = base64Image.replace(/^data:image\/\w+;base64,/, "");
			}
		} catch (err) {
			console.error(
				"Image generation failed, falling back to placeholder:",
				err,
			);
		}
	}

	if (imageKitConfigured()) {
		try {
			const upload = await uploadDiaryImage({
				file: uploadSource,
				fileName: `${workflowId}.png`,
				folder: "/diaries",
			});
			return { imageUrl: upload.url, hasImage: true };
		} catch (err) {
			console.error("ImageKit upload failed, using placeholder:", err);
		}
	}

	return { imageUrl: placeholder, hasImage: false };
}
