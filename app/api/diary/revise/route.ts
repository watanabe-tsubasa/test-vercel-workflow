// /api/diary/revise/route.ts

import z from "zod";
import { userEditedHook } from "../../../../workflows/hook";
import { NextResponse } from "next/server";

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
	await userEditedHook.resume(workflowId, {
		revisedBullets,
	});

	return NextResponse.json({ status: "ok" });
}
