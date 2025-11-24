import { DiarySidebar } from "@/components/diary-sidebar";
import { Header } from "@/components/header";
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
		<div className="flex h-screen flex-col">
			<Header />
			<div className="flex flex-1 overflow-hidden">
				<DiarySidebar />
				<main className="flex-1">
					<DiaryContent diary={diary} />
				</main>
			</div>
		</div>
	);
}
