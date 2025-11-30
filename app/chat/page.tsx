import { ChatInterface } from "@/components/chat-interface";
import { requireCurrentUser } from "@/lib/auth";

export default async function ChatPage() {
	await requireCurrentUser();
	return (
		<div className="flex min-h-headerless flex-col bg-muted/30">
			<main className="flex-1">
				<ChatInterface />
			</main>
		</div>
	);
}
