import type { DiaryState } from "@prisma/client";
import { Calendar, ImageIcon } from "lucide-react";
import Link from "next/link";
import { getDiaries } from "@/app/actions";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireCurrentUser } from "@/lib/auth";

export default async function HomePage() {
	await requireCurrentUser();
	const diaries = await getDiaries();
	return (
		<div className="flex h-screen flex-col">
			<Header />
			<main className="flex-1 overflow-auto bg-muted/30">
				<div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-foreground">マイ日記</h1>
							<p className="text-sm text-muted-foreground">
								最近生成した絵日記を確認しましょう
							</p>
						</div>
						<Button asChild>
							<Link href="/creation">新しい日記を作成</Link>
						</Button>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						{diaries.map((d) => (
							<Card key={d.id} className="p-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<h2 className="text-lg font-semibold">{d.title}</h2>
										{d.hasImage && (
											<ImageIcon className="h-4 w-4 text-primary" />
										)}
									</div>
									<StatusBadge
										state={(d as unknown as { state?: DiaryState }).state}
									/>
								</div>
								<div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
									<Calendar className="h-4 w-4" />
									<span>{d.date}</span>
								</div>
								<div className="mt-4 flex justify-end">
									<Button asChild variant="outline" size="sm">
										<Link href={`/diary/${d.id}`}>詳細を見る</Link>
									</Button>
								</div>
							</Card>
						))}
					</div>
					{diaries.length === 0 && (
						<div className="text-center text-muted-foreground">
							まだ日記がありません。
							<Link href="/creation" className="text-primary underline">
								日記を作成
							</Link>
							してください。
						</div>
					)}
				</div>
			</main>
		</div>
	);
}

function StatusBadge({ state }: { state?: DiaryState }) {
	if (!state) return null;
	const label =
		state === "COMPLETED"
			? "完了"
			: state === "WAITING_USER"
				? "編集待ち"
				: state === "DRAWING"
					? "画像生成中"
					: state === "GENERATING"
						? "生成中"
						: "下書き";
	const color =
		state === "COMPLETED"
			? "bg-emerald-100 text-emerald-700"
			: state === "WAITING_USER"
				? "bg-amber-100 text-amber-700"
				: state === "DRAWING"
					? "bg-indigo-100 text-indigo-700"
					: "bg-slate-100 text-slate-700";
	return (
		<span className={`rounded-full px-3 py-1 text-xs font-semibold ${color}`}>
			{label}
		</span>
	);
}
