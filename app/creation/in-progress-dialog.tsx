"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

type InProgressDiary = {
	id: string;
	title: string;
	date: string;
	hasImage: boolean;
	state?: string;
	workflowId?: string | null;
	content?: string | null;
};

type Props = {
	diaries: InProgressDiary[];
	onResume: (diary: InProgressDiary) => void | Promise<void>;
};

export function InProgressDialog({ diaries, onResume }: Props) {
	const [open, setOpen] = useState(diaries.length > 0);

	useEffect(() => {
		setOpen(diaries.length > 0);
	}, [diaries.length]);

	if (diaries.length === 0) return null;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>作成中の日記があります</DialogTitle>
				</DialogHeader>
				<div className="space-y-3">
					<p className="text-sm text-muted-foreground">
						前回の作業が完了していません。続きから再開しますか？
					</p>
					<div className="space-y-2">
						{diaries.map((d) => (
							<button
								key={d.id}
								type="button"
								onClick={() => {
									onResume(d);
									setOpen(false);
								}}
								className="flex w-full items-center justify-between rounded-md border border-border px-3 py-2 text-left text-sm hover:bg-muted"
							>
								<span className="font-medium">{d.title || "無題の日記"}</span>
								<span className="text-muted-foreground">{d.date}</span>
							</button>
						))}
					</div>
					<div className="flex justify-end gap-2 pt-2">
						<Button variant="ghost" onClick={() => setOpen(false)}>
							新しく作成する
						</Button>
						<Button
							disabled={!diaries[0]}
							onClick={() => {
								onResume(diaries[0]);
								setOpen(false);
							}}
						>
							続きへ
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
