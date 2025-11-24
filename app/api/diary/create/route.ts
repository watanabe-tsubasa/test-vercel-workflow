// /api/diary/create/route.ts

import { NextResponse } from "next/server";
import z from "zod";
import { diaryWorkflow } from "../../../../workflows/diary-creation";
import { start } from "workflow/api";
import { prisma } from "@/lib/prismaClient";
import { DiaryState } from "@prisma/client";
import { demoId } from "@/lib/utils";

const CreatePostBodySchema = z.object({
	bullet: z.string(),
	token: z.string(),
});

export type CreateDiaryInput = z.infer<typeof CreatePostBodySchema>;
export interface CreateDiaryResponse {
	message: string;
}

export async function POST(request: Request) {
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
		const baseDiary = await prisma.diary.create({
			data: {
				title: "test",
				date,
				content: "test",
				hasImage: false,
				state: DiaryState.DRAFT,
				userId: demoId,
				workflowId: token,
			},
		});

		await start(diaryWorkflow, [token, bullet]);

		return NextResponse.json({
			message: `Received diaryId: ${body.bullet}`,
		});
	} catch (error) {
		const message = error as string;
		console.error(message);
		return NextResponse.json({ message });
	}
}
