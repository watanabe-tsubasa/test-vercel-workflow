"use server";

import { and, eq } from "drizzle-orm";
import { diaries } from "@/db/schema";
import { requireCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function getDiaryById(id: string) {
	const { id: userId } = await requireCurrentUser();
	const [diary] = await db
		.select({
			id: diaries.id,
			title: diaries.title,
			date: diaries.date,
			content: diaries.content,
			imageUrl: diaries.imageUrl,
			hasImage: diaries.hasImage,
		})
		.from(diaries)
		.where(and(eq(diaries.id, id), eq(diaries.userId, userId)));

	if (!diary) return null;

	return {
		...diary,
		date: diary.date.toLocaleDateString("ja-JP", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		}),
	};
}
