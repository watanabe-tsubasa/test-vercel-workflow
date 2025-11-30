"use server";

import { and, desc, eq, ne } from "drizzle-orm";
import { diaries } from "@/db/schema";
import { requireCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

// 汎用で使うserver action

type Diaries = Array<{
	id: string;
	title: string;
	date: string;
	hasImage: boolean;
	state?: string;
	workflowId?: string | null;
	content?: string | null;
}>;

export async function getDiaries(): Promise<Diaries> {
	const { id: currentUserId } = await requireCurrentUser();
	const rows = await db
		.select({
			id: diaries.id,
			title: diaries.title,
			date: diaries.date,
			hasImage: diaries.hasImage,
			state: diaries.state,
		})
		.from(diaries)
		.where(eq(diaries.userId, currentUserId))
		.orderBy(desc(diaries.date));

	return rows.map((d) => ({
		...d,
		state: d.state ?? undefined,
		date: d.date?.toLocaleDateString("ja-JP", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		}),
	}));
}

export async function getInProgressDiaries(): Promise<Diaries> {
	const { id: currentUserId } = await requireCurrentUser();
	const rows = await db
		.select({
			id: diaries.id,
			title: diaries.title,
			date: diaries.date,
			hasImage: diaries.hasImage,
			state: diaries.state,
			workflowId: diaries.workflowId,
			content: diaries.content,
		})
		.from(diaries)
		.where(
			and(eq(diaries.userId, currentUserId), ne(diaries.state, "COMPLETED")),
		)
		.orderBy(desc(diaries.updatedAt));

	return rows.map((d) => ({
		...d,
		date: d.date?.toLocaleDateString("ja-JP", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		}),
	}));
}
