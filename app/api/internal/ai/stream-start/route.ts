// /api/internal/ai/stream-start/route.ts

import { streamText, experimental_generateImage as generateImage } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import { firstDraftHook } from "@/workflows/hook";
import z from "zod";

// ---- Zod Schema ----
const StreamPostBodySchema = z.object({
	workflowId: z.string(),
	bullets: z.string(),
});

export type StreamDiaryInput = z.infer<typeof StreamPostBodySchema>;
export interface StreamDiaryResponse {
	status: "ok" | "error";
	error?: string;
	details?: string;
}

export async function POST(req: Request) {
	const json = await req.json();

	// ---- Validate ----
	const parseResult = StreamPostBodySchema.safeParse(json);
	if (!parseResult.success) {
		return NextResponse.json(
			{
				status: "error",
				error: "Invalid request body",
				details: parseResult.error.message,
			},
			{ status: 400 },
		);
	}

	const { workflowId, bullets } = parseResult.data;

	try {
		const stream = streamText({
			model: openai.languageModel("gpt-5"),
			prompt: `以下の箇条書きから日記文を生成してください:\n${bullets}`,
		});

		// 本番ではフロントへ SSE/WebSocket で streaming
		// sendToClient(workflowId, stream);

		// streaming の最終結果だけ workflow に渡す
		const fullText = await stream.text;
		console.log(`streamtext: ${fullText}`);

		// Workflow 再開
		await firstDraftHook.resume(workflowId, {
			firstDraft: fullText,
		});

		return NextResponse.json({ status: "ok" });
	} catch (err) {
		return NextResponse.json(
			{ status: "error", error: "Internal Server Error", details: String(err) },
			{ status: 500 },
		);
	}
}
