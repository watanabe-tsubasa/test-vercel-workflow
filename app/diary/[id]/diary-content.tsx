import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ImageModal from "./ImageComponent";

type Diary = {
	id: string;
	title: string;
	date: string;
	content: string | null;
	imageUrl: string | null;
	hasImage: boolean;
};

export async function DiaryContent({ diary }: { diary: Diary }) {
	return (
		<div className="mx-auto flex flex-col max-w-5xl space-y-6 h-full px-4 py-6 sm:px-6 lg:px-8">
			<div className="flex items-start justify-between gap-3">
				<div>
					<h2 className="text-2xl font-bold text-foreground">{diary.title}</h2>
					<span className="text-sm text-muted-foreground">{diary.date}</span>
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] h-full overflow-hidden flex-1">
				<Card className="p-6 flex flex-col h-full overflow-auto">
					<ScrollArea className="flex-1">
						<div className="prose prose-sm max-w-none leading-relaxed text-foreground">
							{diary.content?.split(/\r?\n/).map((paragraph, idx) => (
								<p key={`${idx}-${paragraph.slice(0, 20)}`}>{paragraph}</p>
							))}
						</div>
					</ScrollArea>
				</Card>

				<Card className="p-4 h-full flex flex-col">
					<div className="w-full flex-1 overflow-hidden">
						{diary.hasImage && diary.imageUrl ? (
							<ImageModal alt={diary.title} src={diary.imageUrl} />
						) : (
							<div className="aspect-3/2 flex items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
								画像はまだ生成されていません
							</div>
						)}
					</div>
				</Card>
			</div>
		</div>
	);
}
