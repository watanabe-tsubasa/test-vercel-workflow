import { getInProgressDiaries } from "@/app/actions";
import { requireCurrentUser } from "@/lib/auth";
import { CreationFlow } from "./creation-flow";

export default async function FixedDiaryPage() {
	await requireCurrentUser();
	const inProgress = await getInProgressDiaries();
	return (
		<div className="flex h-headerless flex-col bg-muted/30">
			<CreationFlow inProgressDiaries={inProgress} />
		</div>
	);
}
