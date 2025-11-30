import Link from "next/link";
import { getDiaries } from "@/app/actions";
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
	const diaries = await getDiaries();
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
				<div className="hidden md:flex">
					<DiarySidebar />
				</div>
				<main className="flex-1">
					<div className="md:hidden p-4">
						<details className="rounded-lg border border-border bg-card">
							<summary className="cursor-pointer px-4 py-3 text-sm font-medium">
								日記一覧を開く
							</summary>
							<div className="divide-y">
								{diaries.map((d) => (
									<Link
										href={`/diary/${d.id}`}
										key={d.id}
										className="flex items-center justify-between px-4 py-3 text-sm"
									>
										<span>{d.title}</span>
										<span className="text-muted-foreground">{d.date}</span>
									</Link>
								))}
							</div>
						</details>
					</div>
					<DiaryContent diary={diary} />
				</main>
			</div>
		</div>
	);
}
