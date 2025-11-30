"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

const placeholderText = `• 朝、近所の公園を散歩した
• カフェで美味しいコーヒーを飲んだ
• 友達と電話で話した
• 夕方、きれいな夕焼けを見た
`;

export function DiaryInputSidebar(props: {
	onStart: (bullets: string) => void;
	loading?: boolean;
}) {
	const { onStart, loading } = props;
	const [bulletPoints, setBulletPoints] = useState<string | undefined>(
		undefined,
	);

	const handleStart = () => {
		if (loading) return;
		if (!bulletPoints) return;
		onStart(bulletPoints);
	};

	return (
		<div className="flex h-headerless w-80 flex-col border-r border-border bg-sidebar">
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
							placeholder={placeholderText}
						/>
					</div>
					<Button
						className="w-full"
						size="lg"
						onClick={handleStart}
						disabled={loading || !bulletPoints}
					>
						<Sparkles className="mr-2 h-4 w-4" />
						{loading ? "生成中..." : "日記を生成"}
					</Button>
				</div>
			</ScrollArea>
		</div>
	);
}
