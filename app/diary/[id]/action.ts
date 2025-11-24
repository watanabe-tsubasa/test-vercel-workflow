"use server";

import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prismaClient";

export async function getDiaryById(id: string) {
	const { id: userId } = await requireCurrentUser();
	const diary = await prisma.diary.findUnique({
		where: { id, userId },
		select: {
			id: true,
			title: true,
			date: true,
			content: true,
			imageUrl: true,
			hasImage: true,
		},
	});

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
