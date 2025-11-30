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
		<div className="mx-auto max-w-5xl space-y-6 h-full p-6">
			<div className="flex items-start justify-between gap-3">
				<div>
					<h2 className="text-2xl font-bold text-foreground">{diary.title}</h2>
					<span className="text-sm text-muted-foreground">{diary.date}</span>
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
				<Card className="p-6 h-full">
					<ScrollArea className="prose prose-sm max-w-none leading-relaxed text-foreground h-full">
						<div className="space-y-4">
							{diary.content?.split(/\r?\n/).map((paragraph, idx) => (
								<p key={`${idx}-${paragraph.slice(0, 20)}`}>{paragraph}</p>
							))}
						</div>
					</ScrollArea>
				</Card>

				<Card className="p-4 h-full">
					<div className="w-full">
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

// import { Card } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import ImageModal from "./ImageComponent";

// export function DiaryContent() {

// 	return (
// 		<div className="mx-auto max-w-4xl space-y-6 h-full p-6 grid grid-cols-4 grid-rows-5">
// 			{/* 画像エリア */}
// 			<Card className="overflow-hidden col-span-2 col-start-2 row-span-2">

// 					<ImageModal
//             src="/peaceful-park-scene-with-coffee-shop-and-sunset.jpg"
//             alt="生成された絵日記の画像"
//           />

// 			</Card>

// 			{/* 日記の文章 */}
// 			<Card className="p-6 col-span-5 row-span-3">
// 				<div className="space-y-4 h-full flex flex-col">
// 					<div className="flex items-center justify-between">
// 						<h2 className="text-2xl font-bold text-foreground">今日の一日</h2>
// 						<span className="text-sm text-muted-foreground">2024年1月15日</span>
// 					</div>
// 					<ScrollArea className="prose prose-sm max-w-none leading-relaxed text-foreground flex-1 overflow-auto">
// 						<p>
// 							今朝は気持ちの良い天気だったので、近所の公園を散歩することにした。
// 							朝の澄んだ空気を吸いながら歩くと、心が落ち着いていくのを感じた。
// 							公園では犬の散歩をしている人や、ジョギングをしている人たちとすれ違った。
// 						</p>
// 						<p>
// 							散歩の後は、お気に入りのカフェに立ち寄った。
// 							いつものコーヒーを注文すると、バリスタさんが笑顔で迎えてくれた。
// 							窓際の席に座り、ゆっくりとコーヒーを味わう時間は、何にも代えがたい贅沢だ。
// 						</p>
// 						<p>
// 							午後は久しぶりに友達と電話で話した。
// 							最近の出来事や、お互いの近況を報告し合い、笑い合った。
// 							離れていても、こうして繋がっていられることに感謝の気持ちでいっぱいになった。
// 						</p>
// 						<p>
// 							夕方、ふと窓の外を見ると、空が美しいオレンジ色に染まっていた。
// 							思わずベランダに出て、その景色をしばらく眺めていた。
// 							こんな穏やかな一日を過ごせたことに、心から感謝している。
// 						</p>
// 					</ScrollArea>
// 				</div>
// 			</Card>
// 		</div>
// 	);
// }
