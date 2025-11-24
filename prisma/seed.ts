import { DiaryState, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	// まず既存データを削除（開発用）
	await prisma.diary.deleteMany();
	await prisma.user.deleteMany();

	// ユーザーを作成
	const user = await prisma.user.create({
		data: {
			name: "Alice",
			email: "alice@example.com",
			image: "https://example.com/avatar/alice.png",
		},
	});

	// 絵日記データを作成
	const diariesData = [
		{
			title: "春の公園でピクニック",
			date: new Date("2025-03-21"),
			content:
				"今朝は気持ちの良い天気だったので、近所の公園を散歩することにした。\n" +
				"朝の澄んだ空気を吸いながら歩くと、心が落ち着いていくのを感じた。\n" +
				"公園では犬の散歩をしている人や、ジョギングをしている人たちとすれ違った。\n\n" +
				"散歩の後は、お気に入りのカフェに立ち寄った。\n" +
				"いつものコーヒーを注文すると、バリスタさんが笑顔で迎えてくれた。\n" +
				"窓際の席に座り、ゆっくりとコーヒーを味わう時間は、何にも代えがたい贅沢だ。\n\n" +
				"午後は久しぶりに友達と電話で話した。\n" +
				"最近の出来事や、お互いの近況を報告し合い、笑い合った。\n" +
				"離れていても、こうして繋がっていられることに感謝の気持ちでいっぱいになった。\n\n" +
				"夕方、ふと窓の外を見ると、空が美しいオレンジ色に染まっていた。\n" +
				"思わずベランダに出て、その景色をしばらく眺めていた。\n" +
				"こんな穏やかな一日を過ごせたことに、心から感謝している。",
			imageUrl: "https://example.com/images/picnic.jpg",
			hasImage: true,
			state: DiaryState.COMPLETED,
			workflowId: "wf_001",
		},
		{
			title: "雨の日の読書",
			date: new Date("2025-04-02"),
			content:
				"外は雨だったので、一日中お気に入りの小説を読んで過ごしました。心が落ち着く時間でした。",
			imageUrl: "https://example.com/images/rainy-reading.jpg",
			hasImage: true,
			state: DiaryState.COMPLETED,
			workflowId: "wf_002",
		},
		{
			title: "友達と映画館へ",
			date: new Date("2025-05-12"),
			content:
				"今日は友達と映画館に行きました。アクション映画で、とてもスリル満点でした！",
			imageUrl: "https://example.com/images/movie.jpg",
			hasImage: true,
			state: DiaryState.COMPLETED,
			workflowId: "wf_003",
		},
	];

	// DiaryデータをUserに紐づけて作成
	await Promise.all(
		diariesData.map((diary) =>
			prisma.diary.create({
				data: {
					...diary,
					userId: user.id,
				},
			}),
		),
	);

	console.log("✅ Seed data inserted successfully!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
