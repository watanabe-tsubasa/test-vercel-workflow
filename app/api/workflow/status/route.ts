import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prismaClient";

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

	const diary = await prisma.diary.findUnique({
		where: { workflowId, userId: session.user.id },
		select: {
			id: true,
			title: true,
			state: true,
			imageUrl: true,
			hasImage: true,
			updatedAt: true,
			createdAt: true,
			content: true,
		},
	});

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
