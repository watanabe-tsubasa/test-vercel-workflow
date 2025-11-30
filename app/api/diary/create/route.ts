// /api/diary/create/route.ts

export const runtime = "nodejs";

import { DiaryState } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { start } from "workflow/api";
import z from "zod";
import { authOptions, ensureUserFromSession } from "@/lib/auth";
import { prisma } from "@/lib/prismaClient";
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
	const date = new Date().toISOString();
	try {
		const user = await ensureUserFromSession();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		await prisma.diary.create({
			data: {
				title: "",
				date,
				content: bullet,
				hasImage: false,
				state: DiaryState.DRAFT,
				userId: user.id,
				workflowId: token,
			},
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
