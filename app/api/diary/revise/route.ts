// /api/diary/revise/route.ts

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import z from "zod";
import { userEditedHookClient } from "../../../../workflows/hook-client";

const RevisePostBodySchema = z.object({
	workflowId: z.string(),
	revisedBullets: z.string(),
});

export type ReviseDiaryInput = z.infer<typeof RevisePostBodySchema>;
export interface ReviseDiaryResponse {
	status: "ok" | "error";
	error?: string;
	details?: string;
}

export async function POST(req: Request) {
	const json = await req.json();
	// const { workflowId, revisedBullets } = await req.json();

	const parseResult = RevisePostBodySchema.safeParse(json);
	if (!parseResult.success) {
		return NextResponse.json(
			{ error: "Invalid request body", details: parseResult.error.message },
			{ status: 400 },
		);
	}
	const body = parseResult.data;
	const { workflowId, revisedBullets } = body;
	await userEditedHookClient.resume(workflowId, {
		revisedBullets,
	});

	return NextResponse.json({ status: "ok" });
}
