import { getInProgressDiaries } from "@/app/actions";
import { Header } from "@/components/header";
import { requireCurrentUser } from "@/lib/auth";
import { CreationFlow } from "./creation-flow";

export default async function FixedDiaryPage() {
	await requireCurrentUser();
	const inProgress = await getInProgressDiaries();
	return (
		<div className="flex h-screen flex-col">
			<Header />
			<CreationFlow inProgressDiaries={inProgress} />
		</div>
	);
}
