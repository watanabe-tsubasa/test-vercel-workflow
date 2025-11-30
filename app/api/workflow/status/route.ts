import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { diaries } from "@/db/schema";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const QuerySchema = z.object({
	workflowId: z.string(),
});

export async function GET(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const url = new URL(req.url);
	const parseResult = QuerySchema.safeParse(
		Object.fromEntries(url.searchParams.entries()),
	);
	if (!parseResult.success) {
		return NextResponse.json(
			{ error: "Invalid query", details: parseResult.error.message },
			{ status: 400 },
		);
	}

	const { workflowId } = parseResult.data;

	const [diary] = await db
		.select({
			id: diaries.id,
			title: diaries.title,
			state: diaries.state,
			imageUrl: diaries.imageUrl,
			hasImage: diaries.hasImage,
			updatedAt: diaries.updatedAt,
			createdAt: diaries.createdAt,
			content: diaries.content,
		})
		.from(diaries)
		.where(
			and(
				eq(diaries.workflowId, workflowId),
				eq(diaries.userId, session.user.id),
			),
		);

	if (!diary) {
		// Workflow has not created the diary record yet or workflowId is unknown.
		return NextResponse.json(
			{ status: "PENDING", workflowId },
			{ status: 202 },
		);
	}

	return NextResponse.json({
		status: diary.state,
		updatedAt: diary.updatedAt,
		createdAt: diary.createdAt,
		imageUrl: diary.imageUrl,
		hasImage: diary.hasImage,
		title: diary.title,
		content: diary.content ?? null,
		workflowId,
		diaryId: diary.id,
	});
}
