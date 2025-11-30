"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { DiaryInputSidebar } from "@/components/diary-input-sidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { DiaryState } from "@/db/schema";
import { CurrentDiaryContent } from "./current-diary-content";
import { InProgressDialog } from "./in-progress-dialog";

type WorkflowStatus = {
	status: DiaryState | "PENDING";
	updatedAt?: string;
	createdAt?: string;
	imageUrl?: string | null;
	hasImage?: boolean;
	title?: string;
	content?: string | null;
	workflowId: string;
	diaryId?: string;
};

type InProgressDiary = {
	id: string;
	title: string;
	date: string;
	hasImage: boolean;
	state?: string;
	workflowId?: string | null;
	content?: string | null;
};

export function CreationFlow({
	inProgressDiaries = [],
}: {
	inProgressDiaries?: InProgressDiary[];
}) {
	const [workflowId, setWorkflowId] = useState<string | null>(null);
	const [status, setStatus] = useState<WorkflowStatus | null>(null);
	const [loading, setLoading] = useState(false);
	const [reviseLoading, setReviseLoading] = useState(false);
	const pollTimer = useRef<NodeJS.Timeout | null>(null);
	const streamController = useRef<AbortController | null>(null);

	const clearPoll = useCallback(() => {
		if (pollTimer.current) {
			clearTimeout(pollTimer.current);
			pollTimer.current = null;
		}
	}, []);

	const stopStream = useCallback(() => {
		if (streamController.current) {
			streamController.current.abort();
			streamController.current = null;
		}
	}, []);

	const startDraftStream = useCallback(
		async (id: string, bullets: string) => {
			stopStream();
			const controller = new AbortController();
			streamController.current = controller;

			try {
				const res = await fetch("/api/internal/ai/stream-start", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "text/event-stream",
					},
					body: JSON.stringify({ workflowId: id, bullets }),
					signal: controller.signal,
				});

				if (!res.ok || !res.body) {
					throw new Error("Failed to start diary stream");
				}

				const reader = res.body.getReader();
				const decoder = new TextDecoder("utf-8");
				let buffer = "";
				let combined = "";

				while (true) {
					const { value, done } = await reader.read();
					if (done) break;
					buffer += decoder.decode(value, { stream: true });
					const events = buffer.split("\n\n");
					buffer = events.pop() ?? "";

					for (const raw of events) {
						const line = raw.trim();
						if (!line.startsWith("data:")) continue;
						const payload = JSON.parse(line.slice("data:".length).trim()) as {
							type: "snapshot" | "delta" | "done" | "error";
							content?: string;
							message?: string;
						};

						if (payload.type === "snapshot" && payload.content) {
							combined = payload.content;
						} else if (payload.type === "delta" && payload.content) {
							combined += payload.content;
						} else if (payload.type === "done" && payload.content) {
							combined = payload.content;
						} else if (payload.type === "error") {
							throw new Error(payload.message ?? "stream error");
						} else {
							continue;
						}

						setStatus((prev) =>
							prev
								? {
										...prev,
										content: combined,
										status:
											payload.type === "done" && prev.status === "GENERATING"
												? "WAITING_USER"
												: prev.status,
									}
								: prev,
						);
					}
				}
			} catch (err) {
				if (controller.signal.aborted) return;
				console.error(err);
				toast.error("文章のストリーミングに失敗しました");
			} finally {
				if (streamController.current === controller) {
					streamController.current = null;
				}
			}
		},
		[stopStream],
	);

	const pollStatus = useCallback(async (id: string) => {
		try {
			const res = await fetch(`/api/workflow/status?workflowId=${id}`);
			if (!res.ok && res.status !== 202) throw new Error("Status fetch failed");
			const json = (await res.json()) as WorkflowStatus;
			setStatus(json);
			// content反映はステータス側のuseEffectで制御（WAITING_USERでは上書きしない）
			if (json.status === "COMPLETED") return;
			pollTimer.current = setTimeout(() => pollStatus(id), 2000);
		} catch (err) {
			console.error(err);
			pollTimer.current = setTimeout(() => pollStatus(id), 4000);
		}
	}, []);

	const handleStart = useCallback(
		async (bullets: string) => {
			clearPoll();
			stopStream();
			const token = crypto.randomUUID();
			setWorkflowId(token);
			setStatus({
				status: "GENERATING",
				updatedAt: new Date().toISOString(),
				createdAt: new Date().toISOString(),
				imageUrl: null,
				hasImage: false,
				title: "生成中",
				content: "",
				workflowId: token,
				diaryId: "",
			});
			setLoading(true);
			try {
				startDraftStream(token, bullets);
				const res = await fetch("/api/diary/create", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ bullet: bullets, token }),
				});
				if (!res.ok) {
					throw new Error(`Failed to start workflow: ${await res.text()}`);
				}
				toast.success("日記生成を開始しました");
				pollStatus(token);
			} catch (err) {
				console.error(err);
				toast.error("生成開始に失敗しました");
			} finally {
				setLoading(false);
			}
		},
		[pollStatus, clearPoll, startDraftStream, stopStream],
	);

	const handleRevise = useCallback(
		async (revised: string) => {
			if (!workflowId) return;
			setReviseLoading(true);
			try {
				const res = await fetch("/api/diary/revise", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ workflowId, revisedBullets: revised }),
				});
				if (!res.ok) throw new Error("Revise failed");
				toast.success(
					"修正を送信しました。画像とタイトルを生成中です。このまま画面を閉じてもバックグラウンドで続行されます。",
				);
				clearPoll();
				pollTimer.current = setTimeout(() => pollStatus(workflowId), 2000);
				setStatus((prev) =>
					prev
						? {
								...prev,
								status: "DRAWING",
								content: revised,
							}
						: prev,
				);
			} catch (err) {
				console.error(err);
				toast.error("修正の送信に失敗しました");
			} finally {
				setReviseLoading(false);
			}
		},
		[pollStatus, workflowId, clearPoll],
	);

	useEffect(
		() => () => {
			clearPoll();
			stopStream();
		},
		[clearPoll, stopStream],
	);

	const handleResume = useCallback(
		async (diary: InProgressDiary) => {
			if (!diary.workflowId) {
				toast.error("この日記の再開に必要な情報がありません。");
				return;
			}

			stopStream();
			clearPoll();
			setWorkflowId(diary.workflowId);
			setLoading(true);

			try {
				const res = await fetch(
					`/api/workflow/status?workflowId=${diary.workflowId}`,
				);
				if (!res.ok && res.status !== 202) {
					throw new Error("failed to fetch status");
				}
				const json = (await res.json()) as WorkflowStatus;
				const merged: WorkflowStatus = {
					...json,
					content: json.content ?? diary.content ?? "",
					title: json.title ?? diary.title ?? "タイトル生成中",
					imageUrl: json.imageUrl ?? null,
					workflowId: diary.workflowId,
					diaryId: diary.id,
				};
				setStatus(merged);
				toast.success("前回の作成を再開しました");
				if (merged.status !== "COMPLETED") {
					pollTimer.current = setTimeout(
						() => pollStatus(diary.workflowId as string),
						0,
					);
				}
			} catch (err) {
				console.error(err);
				toast.error("再開に失敗しました。もう一度お試しください。");
			} finally {
				setLoading(false);
			}
		},
		[clearPoll, pollStatus, stopStream],
	);

	const uiStatus = useMemo(() => status?.status ?? "IDLE", [status]);

	return (
		<div className="flex flex-1 overflow-hidden">
			<InProgressDialog diaries={inProgressDiaries} onResume={handleResume} />
			<div className="hidden md:flex">
				<DiaryInputSidebar onStart={handleStart} loading={loading} />
			</div>
			<main className="flex-1">
				<div className="md:hidden flex justify-end px-4 py-4">
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline" size="sm">
								入力を開く
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-md">
							<DiaryInputSidebar onStart={handleStart} loading={loading} />
						</DialogContent>
					</Dialog>
				</div>
				<CurrentDiaryContent
					status={uiStatus as DiaryState | "PENDING" | "IDLE"}
					content={status?.content ?? ""}
					imageUrl={status?.imageUrl ?? null}
					title={status?.title ?? "タイトル生成中"}
					onRevise={handleRevise}
					updatedAt={status?.updatedAt}
					reviseLoading={reviseLoading}
				/>
			</main>
		</div>
	);
}
