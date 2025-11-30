"use client";

import { Check, ImageIcon, Loader2, PenLine } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { DiaryState } from "@/db/schema";

interface Props {
	status: DiaryState | "IDLE" | "PENDING";
	content: string;
	imageUrl: string | null;
	title?: string;
	updatedAt?: string;
	onRevise: (content: string) => void;
	reviseLoading?: boolean;
}

export function CurrentDiaryContent({
	status,
	content,
	imageUrl,
	title,
	updatedAt,
	onRevise,
	reviseLoading = false,
}: Props) {
	const [draft, setDraft] = useState(content);

	useEffect(() => {
		setDraft(content);
	}, [content]);

	const stateLabel = useMemo(() => {
		switch (status) {
			case "GENERATING":
				return "AIが下書きを生成中...";
			case "WAITING_USER":
				return "下書きができました。編集して送信してください。";
			case "DRAWING":
				return "画像生成中...";
			case "COMPLETED":
				return "完了";
			case "PENDING":
				return "準備中...";
			default:
				return "待機中";
		}
	}, [status]);

	return (
		<div className="mx-auto max-w-5xl space-y-6 h-full px-4 py-6 sm:px-6 lg:px-8">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm text-muted-foreground">進行状況</p>
					<p className="text-lg font-semibold">{stateLabel}</p>
				</div>
				{updatedAt && (
					<p className="text-xs text-muted-foreground">
						更新: {new Date(updatedAt).toLocaleString("ja-JP")}
					</p>
				)}
			</div>

			<Card className="overflow-hidden gap-0">
				<CardHeader>
					<CardTitle className="text-sm text-muted-foreground">
						{title && title.trim().length > 0 ? title : "タイトル生成中..."}
					</CardTitle>
				</CardHeader>
				<div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex flex-col">
								<h2 className="text-xl font-bold text-foreground">文章</h2>
							</div>
							{status === "DRAWING" && (
								<span className="flex items-center gap-2 text-sm text-muted-foreground">
									<Loader2 className="h-4 w-4 animate-spin" />
									画像生成中...
								</span>
							)}
							{status === "COMPLETED" && (
								<span className="flex items-center gap-2 text-sm text-emerald-600">
									<Check className="h-4 w-4" />
									完了
								</span>
							)}
						</div>
						<Textarea
							value={draft}
							onChange={(e) => setDraft(e.target.value)}
							className="h-8/12 overflow-auto"
							placeholder="生成された文章がここに表示されます"
							disabled={
								status === "COMPLETED" || status === "DRAWING" || reviseLoading
							}
						/>
						{status === "WAITING_USER" && (
							<div className="flex justify-end">
								<Button
									onClick={() => onRevise(draft)}
									size="lg"
									disabled={reviseLoading}
								>
									<PenLine className="mr-2 h-4 w-4" />
									{reviseLoading ? "送信中..." : "修正を送信"}
								</Button>
							</div>
						)}
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-bold text-foreground">画像</h2>
						</div>
						<div className="relative aspect-4/3 overflow-hidden rounded-lg border border-border bg-muted">
							{status === "DRAWING" && (
								<div className="flex h-full items-center justify-center">
									<div className="text-center">
										<Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
										<p className="mt-2 text-sm text-muted-foreground">
											画像を生成中...
										</p>
									</div>
								</div>
							)}
							{status === "COMPLETED" && imageUrl && (
								<Image
									src={imageUrl}
									alt="生成された絵日記"
									className="h-full w-full object-cover"
									fill
									priority={false}
								/>
							)}
							{status !== "COMPLETED" && status !== "DRAWING" && (
								<div className="flex h-full items-center justify-center">
									<div className="text-center">
										<ImageIcon className="mx-auto h-10 w-10 text-muted-foreground" />
										<p className="mt-2 text-sm text-muted-foreground">
											文章を送信すると画像が生成されます
										</p>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
}
