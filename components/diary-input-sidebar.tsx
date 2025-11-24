"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles } from "lucide-react";

export function DiaryInputSidebar() {
	const [bulletPoints, setBulletPoints] = useState(
		"• 朝、近所の公園を散歩した\n• カフェで美味しいコーヒーを飲んだ\n• 友達と電話で話した\n• 夕方、きれいな夕焼けを見た",
	);

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
					<Button className="w-full" size="lg">
						<Sparkles className="mr-2 h-4 w-4" />
						日記を生成
					</Button>
				</div>
			</ScrollArea>
		</div>
	);
}
