// /api/internal/ai/stream-start/route.ts

import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import z from "zod";

// ---- Zod Schema ----
const StreamPostBodySchema = z.object({
	workflowId: z.string(),
	bullets: z.string(),
});

export type StreamDiaryInput = z.infer<typeof StreamPostBodySchema>;
export interface StreamDiaryResponse {
	firstDraft: string;
}

type StreamSubscriber = {
	onDelta?: (delta: string) => void;
	onSnapshot?: (content: string) => void;
	onDone?: (fullText: string) => void;
	onError?: (err: unknown) => void;
};

type GenerationTask = {
	promise: Promise<string>;
	subscribe: (subscriber: StreamSubscriber) => void;
	unsubscribe: (subscriber: StreamSubscriber) => void;
	currentText: () => string;
};

const activeTasks = new Map<string, GenerationTask>();
const finishedDrafts = new Map<
	string,
	{ text: string; timeout: NodeJS.Timeout }
>();
const encoder = new TextEncoder();

const SSE_HEADERS = {
	"Content-Type": "text/event-stream",
	"Cache-Control": "no-cache, no-transform",
	Connection: "keep-alive",
};

function encodeSse(data: unknown) {
	return encoder.encode(`data: ${JSON.stringify(data)}\n\n`);
}

function cacheDraft(workflowId: string, text: string) {
	if (finishedDrafts.has(workflowId)) return;
	const timeout = setTimeout(
		() => finishedDrafts.delete(workflowId),
		5 * 60 * 1000,
	);
	finishedDrafts.set(workflowId, { text, timeout });
}

function createMockTask(workflowId: string, bullets: string): GenerationTask {
	let currentText = "";
	const subscribers = new Set<StreamSubscriber>();
	const mockDraft = `Draft (mock): ${bullets}`;
	const chunks = mockDraft.match(/.{1,16}/g) ?? [mockDraft];

	const promise = new Promise<string>((resolve) => {
		chunks.forEach((chunk, idx) => {
			setTimeout(
				() => {
					currentText += chunk;
					for (const sub of subscribers) {
						sub.onDelta?.(chunk);
					}
					if (idx === chunks.length - 1) {
						for (const sub of subscribers) {
							sub.onDone?.(currentText);
						}
						cacheDraft(workflowId, currentText);
						resolve(currentText);
						activeTasks.delete(workflowId);
					}
				},
				200 * (idx + 1),
			);
		});
	});

	const task: GenerationTask = {
		promise,
		subscribe(subscriber) {
			if (currentText) {
				subscriber.onSnapshot?.(currentText);
			}
			subscribers.add(subscriber);
		},
		unsubscribe(subscriber) {
			subscribers.delete(subscriber);
		},
		currentText: () => currentText,
	};

	activeTasks.set(workflowId, task);
	return task;
}

function createAiTask(workflowId: string, bullets: string): GenerationTask {
	let currentText = "";
	const subscribers = new Set<StreamSubscriber>();
	const stream = streamText({
		model: openai.languageModel("gpt-5"),
		prompt: `以下の箇条書きから日記文を生成してください:\n${bullets}。日記文には区切りのタイミングに適切に改行、行間を入れてください。`,
	});

	const promise = (async () => {
		try {
			for await (const part of stream.fullStream) {
				if (part.type === "text-delta") {
					currentText += part.text;
					for (const sub of subscribers) {
						sub.onDelta?.(part.text);
					}
				}
			}

			for (const sub of subscribers) {
				sub.onDone?.(currentText);
			}
			cacheDraft(workflowId, currentText);
			return currentText;
		} catch (err) {
			for (const sub of subscribers) {
				sub.onError?.(err);
			}
			throw err;
		} finally {
			activeTasks.delete(workflowId);
		}
	})();

	const task: GenerationTask = {
		promise,
		subscribe(subscriber) {
			if (currentText) {
				subscriber.onSnapshot?.(currentText);
			}
			subscribers.add(subscriber);
		},
		unsubscribe(subscriber) {
			subscribers.delete(subscriber);
		},
		currentText: () => currentText,
	};

	activeTasks.set(workflowId, task);
	return task;
}

function getOrCreateTask(input: StreamDiaryInput): GenerationTask {
	const { workflowId, bullets } = input;

	const finished = finishedDrafts.get(workflowId);
	if (finished) {
		return {
			promise: Promise.resolve(finished.text),
			subscribe(subscriber) {
				if (finished.text) {
					subscriber.onSnapshot?.(finished.text);
				}
				subscriber.onDone?.(finished.text);
			},
			unsubscribe() {},
			currentText: () => finished.text,
		};
	}

	const existing = activeTasks.get(workflowId);
	if (existing) return existing;

	if (!process.env.OPENAI_API_KEY) {
		return createMockTask(workflowId, bullets);
	}

	return createAiTask(workflowId, bullets);
}

export async function POST(req: Request) {
	const json = await req.json();

	// ---- Validate ----
	const parseResult = StreamPostBodySchema.safeParse(json);
	if (!parseResult.success) {
		return NextResponse.json(
			{
				status: "error",
				error: "Invalid request body",
				details: parseResult.error.message,
			},
			{ status: 400 },
		);
	}

	try {
		const wantsStream =
			req.headers.get("accept")?.includes("text/event-stream") ?? false;
		const task = getOrCreateTask(parseResult.data);

		if (wantsStream) {
			const stream = new ReadableStream({
				start(controller) {
					const subscriber: StreamSubscriber = {
						onSnapshot(content) {
							controller.enqueue(encodeSse({ type: "snapshot", content }));
						},
						onDelta(delta) {
							controller.enqueue(encodeSse({ type: "delta", content: delta }));
						},
						onDone(fullText) {
							controller.enqueue(
								encodeSse({ type: "done", content: fullText }),
							);
							controller.close();
						},
						onError(err) {
							controller.enqueue(
								encodeSse({
									type: "error",
									message: err instanceof Error ? err.message : String(err),
								}),
							);
							controller.close();
						},
					};

					task.subscribe(subscriber);

					req.signal.addEventListener("abort", () => {
						task.unsubscribe(subscriber);
						controller.close();
					});
				},
			});

			return new Response(stream, { headers: SSE_HEADERS });
		}

		const fullText = await task.promise;
		return NextResponse.json({ firstDraft: fullText });
	} catch (err) {
		return NextResponse.json(
			{ error: "Internal Server Error", details: String(err) },
			{ status: 500 },
		);
	}
}
