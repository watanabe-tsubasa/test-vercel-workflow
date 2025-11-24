import {
	CreateDiaryInput,
	CreateDiaryResponse,
} from "./app/api/diary/create/route";
import {
	ReviseDiaryInput,
	ReviseDiaryResponse,
} from "./app/api/diary/revise/route";
import { demoId } from "./lib/utils";

async function firstTest(input: CreateDiaryInput) {
	const res = await fetch("http://127.0.2.2:3000/api/diary/create", {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify(input),
	});

	return (await res.json()) as CreateDiaryResponse;
}

async function secondTest(input: ReviseDiaryInput) {
	const res = await fetch("http://127.0.2.2:3000/api/diary/revise", {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify(input),
	});

	return (await res.json()) as ReviseDiaryResponse;
}

async function main() {
	const date = new Date().toString();
	const workflowId = `${demoId}_${date}`;
	const fisrtRes = await firstTest({
		bullet: "福岡でガンダムを見た",
		token: workflowId,
	});
	// setTimeout(async () => {
	// 	const secondRes = await secondTest({
	// 		revisedBullets: "福岡でガンダムを見て楽しかった",
	// 		workflowId: workflowId,
	// 	});
	// 	console.log(secondRes);
	// }, 10000);
	console.log(fisrtRes);
}

main();
