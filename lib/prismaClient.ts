// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// PrismaClient をグローバルにキャッシュして、再生成を防ぐ
const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		log: ["query", "error", "warn"], // optional: デバッグログ
	});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
