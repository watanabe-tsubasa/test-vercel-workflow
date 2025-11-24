// /lib/workflowClient.ts

import {
	CreateDiaryInput,
	CreateDiaryResponse,
} from "@/app/api/diary/create/route";

import {
	ReviseDiaryInput,
	ReviseDiaryResponse,
} from "@/app/api/diary/revise/route";

import {
	UpdateDiaryInput,
	UpdateDiaryResponse,
} from "@/app/api/diary/update/route";

import {
	StreamDiaryInput,
	StreamDiaryResponse,
} from "@/app/api/internal/ai/stream-start/route";

import { fetch } from "workflow";

const BASE_URL = process.env.WORKFLOW_BASE_URL || "http://localhost:3000";

// --------------------------
// CREATE
// --------------------------
export async function createDiaryInWorkflow(input: CreateDiaryInput) {
	const res = await fetch(`${BASE_URL}/api/diary/create`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input),
	});
	if (!res.ok) throw new Error("Failed to create diary");

	return (await res.json()) as CreateDiaryResponse;
}

// --------------------------
// REVISE
// --------------------------
export async function reviseDiaryInWorkflow(input: ReviseDiaryInput) {
	const res = await fetch(`${BASE_URL}/api/diary/revise`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input),
	});
	if (!res.ok) throw new Error("Failed to revise diary");

	return (await res.json()) as ReviseDiaryResponse;
}

// --------------------------
// UPDATE
// --------------------------
export async function updateDiaryInWorkflow(input: UpdateDiaryInput) {
  console.log("BASE_URL used by workflow:", BASE_URL);
	const res = await fetch(`${BASE_URL}/api/diary/update`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input),
	});

	if (!res.ok) throw new Error("Failed to update diary");

	return (await res.json()) as UpdateDiaryResponse;
}

// --------------------------
// STREAM FIRST DRAFT (WORKFLOW)
// --------------------------
export async function streamStartInWorkflow(input: StreamDiaryInput) {
	const res = await fetch(`${BASE_URL}/api/internal/ai/stream-start`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input),
	});

	if (!res.ok) throw new Error("Failed to start stream diary in workflow");

	return (await res.json()) as StreamDiaryResponse;
}
