import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const diaryStateEnum = pgEnum("DiaryState", [
	"DRAFT",
	"GENERATING",
	"WAITING_USER",
	"DRAWING",
	"COMPLETED",
]);

export const users = pgTable("User", {
	id: text("id").primaryKey(),
	name: text("name"),
	email: text("email").unique(),
	image: text("image"),
	createdAt: timestamp("createdAt", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updatedAt", { withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const diaries = pgTable("Diary", {
	id: text("id").primaryKey(),
	title: text("title").notNull(),
	date: timestamp("date", { withTimezone: true }).notNull(),
	content: text("content"),
	imageUrl: text("imageUrl"),
	hasImage: boolean("hasImage").notNull().default(false),
	state: diaryStateEnum("state").notNull().default("DRAFT"),
	workflowId: text("workflowId").unique(),
	userId: text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	createdAt: timestamp("createdAt", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updatedAt", { withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export type DiaryState = (typeof diaryStateEnum.enumValues)[number];
export type Diary = InferSelectModel<typeof diaries>;
export type NewDiary = InferInsertModel<typeof diaries>;
export type User = InferSelectModel<typeof users>;
