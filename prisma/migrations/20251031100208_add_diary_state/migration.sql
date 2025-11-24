/*
  Warnings:

  - A unique constraint covering the columns `[workflowId]` on the table `Diary` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "DiaryState" AS ENUM ('DRAFT', 'GENERATING', 'WAITING_USER', 'DRAWING', 'COMPLETED');

-- AlterTable
ALTER TABLE "Diary" ADD COLUMN     "state" "DiaryState" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "workflowId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Diary_workflowId_key" ON "Diary"("workflowId");
