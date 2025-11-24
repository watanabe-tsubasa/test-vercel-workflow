// /lib/workflowClient.ts

import { fetch as workflowFetch } from "workflow";
import type {
	CreateDiaryInput,
	CreateDiaryResponse,
} from "@/app/api/diary/create/route";
import type {
	ReviseDiaryInput,
	ReviseDiaryResponse,
} from "@/app/api/diary/revise/route";
import type {
	UpdateDiaryInput,
	UpdateDiaryResponse,
} from "@/app/api/diary/update/route";
import type { StreamDiaryInput } from "@/app/api/internal/ai/stream-start/route";

const BASE_URL = process.env.WORKFLOW_BASE_URL || "http://localhost:3000";

async function httpFetch(
	input: RequestInfo | URL,
	init?: RequestInit,
): Promise<Response> {
	// workflow fetch can be undefined when not running inside the workflow runtime,
	// so fall back to global fetch to keep local tests working.
	const candidate =
		typeof workflowFetch === "function" ? workflowFetch : globalThis.fetch;

	if (!candidate) {
		throw new Error("fetch is not available in this runtime");
	}

	const res = await candidate(input, init);
	if (res === undefined && globalThis.fetch && candidate !== globalThis.fetch) {
		return globalThis.fetch(input, init);
	}
	return res;
}

// --------------------------
// CREATE
// --------------------------
export async function createDiaryInWorkflow(input: CreateDiaryInput) {
	const res = await httpFetch(`${BASE_URL}/api/diary/create`, {
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
	const res = await httpFetch(`${BASE_URL}/api/diary/revise`, {
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
	const res = await httpFetch(`${BASE_URL}/api/diary/update`, {
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
	const res = await httpFetch(`${BASE_URL}/api/internal/ai/stream-start`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input),
	});

	if (!res.ok) throw new Error("Failed to start stream diary in workflow");

	const data = (await res.json()) as { firstDraft: string };
	return data;
}
