// /api/internal/ai/stream-start/route.ts

import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import z from "zod";

// ---- Zod Schema ----
const StreamPostBodySchema = z.object({
	workflowId: z.string(),
	bullets: z.string(),
});

export type StreamDiaryInput = z.infer<typeof StreamPostBodySchema>;
export interface StreamDiaryResponse {
	firstDraft: string;
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

	const { bullets } = parseResult.data;

	try {
		if (!process.env.OPENAI_API_KEY) {
			const mockDraft = `Draft (mock): ${bullets}`;
			return NextResponse.json({ firstDraft: mockDraft });
		}

		const stream = streamText({
			model: openai.languageModel("gpt-5"),
			prompt: `以下の箇条書きから日記文を生成してください:\n${bullets}`,
		});

		// streaming の最終結果を返却
		const fullText = await stream.text;
		console.log(`streamtext: ${fullText}`);

		return NextResponse.json({ firstDraft: fullText });
	} catch (err) {
		return NextResponse.json(
			{ error: "Internal Server Error", details: String(err) },
			{ status: 500 },
		);
	}
}
