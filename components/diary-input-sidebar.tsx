"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

export function DiaryInputSidebar(props: {
	onStart: (bullets: string) => void;
	loading?: boolean;
}) {
	const { onStart, loading } = props;
	const [bulletPoints, setBulletPoints] = useState(
		"• 朝、近所の公園を散歩した\n• カフェで美味しいコーヒーを飲んだ\n• 友達と電話で話した\n• 夕方、きれいな夕焼けを見た",
	);

	const handleStart = () => {
		if (loading) return;
		onStart(bulletPoints);
	};

	return (
		<div className="flex h-full w-80 flex-col border-r border-border bg-sidebar">
			<div className="border-b border-sidebar-border p-4">
				<h2 className="text-lg font-semibold text-sidebar-foreground">
					入力内容
				</h2>
			</div>
			<ScrollArea className="flex-1">
				<div className="space-y-4 p-4">
					<div className="space-y-2">
						<Label
							htmlFor="bullet-points"
							className="text-sm font-medium text-sidebar-foreground"
						>
							箇条書き
						</Label>
						<Textarea
							id="bullet-points"
							value={bulletPoints}
							onChange={(e) => setBulletPoints(e.target.value)}
							className="min-h-[200px] resize-none"
							placeholder="今日の出来事を箇条書きで..."
						/>
					</div>
					<Button
						className="w-full"
						size="lg"
						onClick={handleStart}
						disabled={loading}
					>
						<Sparkles className="mr-2 h-4 w-4" />
						{loading ? "生成中..." : "日記を生成"}
					</Button>
				</div>
			</ScrollArea>
		</div>
	);
}
