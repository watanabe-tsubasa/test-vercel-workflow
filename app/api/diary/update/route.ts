// /api/diary/update/route.ts

export const runtime = "nodejs";

import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import z from "zod";
import { type Diary, diaries, diaryStateEnum } from "@/db/schema";
import { db } from "@/lib/db";

const UpdateDiarySchema = z.object({
	workflowId: z.string(),
	imageUrl: z.string().optional(),
	hasImage: z.boolean().optional(),
	state: z.enum(diaryStateEnum.enumValues).optional(),
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

		const { workflowId, ...rest } = parsed.data;
		const updateData = Object.fromEntries(
			Object.entries(rest).filter(([, value]) => value !== undefined),
		) as Omit<UpdateDiaryInput, "workflowId">;

		const [updatedDiary] = await db
			.update(diaries)
			.set({ ...updateData, updatedAt: new Date() })
			.where(eq(diaries.workflowId, workflowId))
			.returning();

		if (!updatedDiary) {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}

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
