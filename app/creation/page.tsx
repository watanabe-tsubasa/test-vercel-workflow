import { Header } from "@/components/header";
import { DiaryInputSidebar } from "@/components/diary-input-sidebar";
import { CurrentDiaryContent } from "./current-diary-content";

export default function FixedDiaryPage() {
	return (
		<div className="flex h-screen flex-col">
			<Header />
			<div className="flex flex-1 overflow-hidden">
				<DiaryInputSidebar />
				<main className="flex-1">
					<CurrentDiaryContent />
				</main>
			</div>
		</div>
	);
}
