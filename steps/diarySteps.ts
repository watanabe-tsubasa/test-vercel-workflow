// steps/diarySteps.ts

import {
	updateDiaryInWorkflow,
	streamStartInWorkflow,
	createDiaryInWorkflow,
	reviseDiaryInWorkflow,
} from "@/lib/workflowClient";

import {
	UpdateDiaryInput,
	UpdateDiaryResponse,
} from "@/app/api/diary/update/route";

import {
	StreamDiaryInput,
	StreamDiaryResponse,
} from "@/app/api/internal/ai/stream-start/route";

import {
	CreateDiaryInput,
	CreateDiaryResponse,
} from "@/app/api/diary/create/route";

import {
	ReviseDiaryInput,
	ReviseDiaryResponse,
} from "@/app/api/diary/revise/route";

import { firstDraftHook, userEditedHook } from "@/workflows/hook";

// -------------------------
// 日記DB更新ステップ
// -------------------------
export async function stepUpdateDiary(
	input: UpdateDiaryInput,
): Promise<UpdateDiaryResponse> {
	"use step";
	return await updateDiaryInWorkflow(input);
}

// -------------------------
// AI初稿生成ステップ
// -------------------------
export async function stepGenerateFirstDraft(
	workflowId: string,
): Promise<string> {
	"use step";
	const { firstDraft } = await firstDraftHook.create({ token: workflowId });
	return firstDraft;
}

// -------------------------
// AIストリーミング開始ステップ
// -------------------------
export async function stepStartStream(
	input: StreamDiaryInput,
): Promise<StreamDiaryResponse> {
	"use step";
	return await streamStartInWorkflow(input);
}

// -------------------------
// ユーザー編集待ちステップ
// -------------------------
export async function stepWaitUserEdit(workflowId: string): Promise<string> {
	"use step";
	const { revisedBullets } = await userEditedHook.create({ token: workflowId });
	return revisedBullets;
}
