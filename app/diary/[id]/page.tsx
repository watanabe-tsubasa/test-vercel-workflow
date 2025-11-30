import { DiarySidebar } from "@/components/diary-sidebar";
import { requireCurrentUser } from "@/lib/auth";
import { getDiaryById } from "./action";
import { DiaryContent } from "./diary-content";

export default async function FixedDiaryPage(props: {
	params: Promise<{ id: string }>;
}) {
	await requireCurrentUser();
	const { id } = await props.params;
	const diary = await getDiaryById(id);

	if (!diary) {
		return (
			<div className="p-6 text-center text-muted-foreground">
				日記が見つかりませんでした。
			</div>
		);
	}

	return (
		<div className="flex h-headerless flex-col bg-muted/30">
			<div className="flex flex-col md:flex-row flex-1 h-full">
				<div>
					<DiarySidebar />
				</div>
				<main className="flex-1 h-headerless">
					<DiaryContent diary={diary} />
				</main>
			</div>
		</div>
	);
}
