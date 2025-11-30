// /api/diary/create/route.ts

export const runtime = "nodejs";

import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { start } from "workflow/api";
import z from "zod";
import { diaries } from "@/db/schema";
import { authOptions, ensureUserFromSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { diaryWorkflow } from "@/workflows/diary-creation";

const CreatePostBodySchema = z.object({
	bullet: z.string(),
	token: z.string(),
});

export type CreateDiaryInput = z.infer<typeof CreatePostBodySchema>;
export interface CreateDiaryResponse {
	message: string;
}

export async function POST(request: Request) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const json = await request.json();

	const parseResult = CreatePostBodySchema.safeParse(json);
	if (!parseResult.success) {
		return NextResponse.json(
			{ error: "Invalid request body", details: parseResult.error.message },
			{ status: 400 },
		);
	}

	const body = parseResult.data;
	const { bullet, token } = body;
	const date = new Date();
	const now = new Date();
	try {
		const user = await ensureUserFromSession();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		await db.insert(diaries).values({
			id: randomUUID(),
			title: "",
			date,
			content: bullet,
			hasImage: false,
			state: "DRAFT",
			userId: user.id,
			workflowId: token,
			createdAt: now,
			updatedAt: now,
		});

		await start(diaryWorkflow, [
			{ workflowId: token, bullets: bullet, userId: user.id },
		]);

		return NextResponse.json({
			message: `Received diaryId: ${body.bullet}`,
		});
	} catch (error) {
		const message = error as string;
		console.error(message);
		return NextResponse.json({ message });
	}
}
