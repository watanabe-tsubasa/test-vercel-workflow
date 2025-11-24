// /lib/apiClient.ts

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

// --------------------------
// CREATE
// --------------------------
export async function createDiary(input: CreateDiaryInput) {
	const res = await fetch("/api/diary/create", {
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
export async function reviseDiary(input: ReviseDiaryInput) {
	const res = await fetch("/api/diary/revise", {
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
export async function updateDiary(input: UpdateDiaryInput) {
	const res = await fetch("/api/diary/update", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input),
	});

	if (!res.ok) throw new Error("Failed to update diary");

	return (await res.json()) as UpdateDiaryResponse;
}

// --------------------------
// STREAM FIRST DRAFT
// --------------------------
export async function streamStart(input: StreamDiaryInput) {
	const res = await fetch("/api/internal/ai/stream-start", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input),
	});

	if (!res.ok) throw new Error("Failed to start stream diary");

	return (await res.json()) as StreamDiaryResponse;
}
