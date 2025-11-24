import { Calendar, ImageIcon } from "lucide-react";
import Link from "next/link";
import { getDiaries } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export async function DiarySidebar() {
	const diaries = await getDiaries();
	return (
		<div className="flex h-full w-80 flex-col border-r border-border bg-sidebar hide-on-mobile">
			<div className="border-b border-sidebar-border p-4">
				<h2 className="text-lg font-semibold text-sidebar-foreground">
					これまでの日記
				</h2>
			</div>
			<ScrollArea className="flex-1">
				<div className="space-y-1 p-2">
					{diaries.map((diary) => (
						<Link href={`/diary/${diary.id}`} key={diary.id}>
							<Button
								key={diary.id}
								variant="ghost"
								className={cn(
									"h-auto w-full justify-start gap-3 px-3 py-3 text-left hover:bg-sidebar-accent",
									diary.id === "1" && "bg-sidebar-accent",
								)}
							>
								<div className="flex flex-1 flex-col gap-1">
									<div className="flex items-center gap-2">
										<span className="font-medium text-sidebar-foreground">
											{diary.title}
										</span>
										{diary.hasImage && (
											<ImageIcon className="h-3.5 w-3.5 text-sidebar-primary" />
										)}
									</div>
									<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
										<Calendar className="h-3 w-3" />
										<span>{diary.date}</span>
									</div>
								</div>
							</Button>
						</Link>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}
