"use server";

import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prismaClient";

// 汎用で使うserver action

type Diaries = Array<{
	id: string;
	title: string;
	date: string;
	hasImage: boolean;
}>;

export async function getDiaries(): Promise<Diaries> {
	const { id: currentUserId } = await requireCurrentUser();
	const diaries = await prisma.diary.findMany({
		where: { userId: currentUserId },
		select: { id: true, title: true, date: true, hasImage: true },
		orderBy: { date: "desc" },
	});

	if (diaries.length === 0) {
		return [
			{
				id: "1",
				title: "公園でピクニック",
				date: "2024年1月15日",
				hasImage: true,
			},
			{
				id: "2",
				title: "友達とカフェ巡り",
				date: "2024年1月14日",
				hasImage: true,
			},
			{
				id: "3",
				title: "新しい本を読んだ",
				date: "2024年1月13日",
				hasImage: false,
			},
			{ id: "4", title: "料理に挑戦", date: "2024年1月12日", hasImage: true },
			{
				id: "5",
				title: "散歩で見つけた景色",
				date: "2024年1月11日",
				hasImage: true,
			},
		];
	}

	return diaries.map((d) => ({
		...d,
		date: d.date.toLocaleDateString("ja-JP", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		}),
	}));
}
