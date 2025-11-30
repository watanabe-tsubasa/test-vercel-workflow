CREATE TYPE "public"."DiaryState" AS ENUM('DRAFT', 'GENERATING', 'WAITING_USER', 'DRAWING', 'COMPLETED');--> statement-breakpoint
CREATE TABLE "Diary" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"content" text,
	"imageUrl" text,
	"hasImage" boolean DEFAULT false NOT NULL,
	"state" "DiaryState" DEFAULT 'DRAFT' NOT NULL,
	"workflowId" text,
	"userId" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "Diary_workflowId_unique" UNIQUE("workflowId")
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"image" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "Diary" ADD CONSTRAINT "Diary_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;