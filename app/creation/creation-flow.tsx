"use client";

import type { DiaryState } from "@prisma/client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { DiaryInputSidebar } from "@/components/diary-input-sidebar";
import { CurrentDiaryContent } from "./current-diary-content";

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

export function CreationFlow() {
	const [workflowId, setWorkflowId] = useState<string | null>(null);
	const [status, setStatus] = useState<WorkflowStatus | null>(null);
	const [loading, setLoading] = useState(false);
	const pollTimer = useRef<NodeJS.Timeout | null>(null);

	const clearPoll = useCallback(() => {
		if (pollTimer.current) {
			clearTimeout(pollTimer.current);
			pollTimer.current = null;
		}
	}, []);

	const pollStatus = useCallback(async (id: string) => {
		try {
			const res = await fetch(`/api/workflow/status?workflowId=${id}`);
			if (!res.ok && res.status !== 202) throw new Error("Status fetch failed");
			const json = (await res.json()) as WorkflowStatus;
			setStatus(json);
			if (json.status === "COMPLETED" || json.status === "DRAWING") return;
			pollTimer.current = setTimeout(() => pollStatus(id), 2000);
		} catch (err) {
			console.error(err);
			pollTimer.current = setTimeout(() => pollStatus(id), 4000);
		}
	}, []);

	const handleStart = useCallback(
		async (bullets: string) => {
			clearPoll();
			const token = crypto.randomUUID();
			setWorkflowId(token);
			setStatus({
				status: "GENERATING",
				updatedAt: new Date().toISOString(),
				createdAt: new Date().toISOString(),
				imageUrl: null,
				hasImage: false,
				title: "生成中",
				content: bullets,
				workflowId: token,
				diaryId: "",
			});
			setLoading(true);
			try {
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
		[pollStatus, clearPoll],
	);

	const handleRevise = useCallback(
		async (revised: string) => {
			if (!workflowId) return;
			try {
				const res = await fetch("/api/diary/revise", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ workflowId, revisedBullets: revised }),
				});
				if (!res.ok) throw new Error("Revise failed");
				toast.success("修正を送信しました。画像を生成中...");
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
			}
		},
		[pollStatus, workflowId, clearPoll],
	);

	useEffect(() => () => clearPoll(), [clearPoll]);

	const uiStatus = useMemo(() => status?.status ?? "IDLE", [status]);

	return (
		<div className="flex flex-1 overflow-hidden">
			<DiaryInputSidebar onStart={handleStart} loading={loading} />
			<main className="flex-1">
				<CurrentDiaryContent
					status={uiStatus as DiaryState | "PENDING" | "IDLE"}
					content={status?.content ?? ""}
					imageUrl={status?.imageUrl ?? null}
					onRevise={handleRevise}
					updatedAt={status?.updatedAt}
				/>
			</main>
		</div>
	);
}
