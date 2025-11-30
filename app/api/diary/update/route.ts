// /api/diary/update/route.ts

export const runtime = "nodejs";

import { type Diary, DiaryState } from "@prisma/client";
import { NextResponse } from "next/server";
import z from "zod";
import { prisma } from "@/lib/prismaClient";

const UpdateDiarySchema = z.object({
	workflowId: z.string(),
	imageUrl: z.string().optional(),
	hasImage: z.boolean().optional(),
	state: z.nativeEnum(DiaryState).optional(),
	content: z.string().optional(),
	title: z.string().optional(),
});

export type UpdateDiaryInput = z.infer<typeof UpdateDiarySchema>;
export type UpdateDiaryResponse =
	| {
			status: "ok";
			updated: Diary;
	  }
	| {
			status: "error";
			error: string;
			details?: string;
	  };

export async function POST(req: Request) {
	try {
		const json = await req.json();
		const parsed = UpdateDiarySchema.safeParse(json);

		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid request body", details: parsed.error.message },
				{ status: 400 },
			);
		}

		const { workflowId, ...updateData } = parsed.data;

		const updatedDiary = await prisma.diary.update({
			where: { workflowId },
			data: updateData,
		});

		return NextResponse.json({
			status: "ok",
			updated: updatedDiary,
		});
	} catch (err) {
		console.error("Diary update API error:", err);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
