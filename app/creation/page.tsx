import { Header } from "@/components/header";
import { requireCurrentUser } from "@/lib/auth";
import { CreationFlow } from "./creation-flow";

export default async function FixedDiaryPage() {
	await requireCurrentUser();
	return (
		<div className="flex h-screen flex-col">
			<Header />
			<CreationFlow />
		</div>
	);
}
