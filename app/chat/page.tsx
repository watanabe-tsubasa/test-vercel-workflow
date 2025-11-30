import { ChatInterface } from "@/components/chat-interface";
import { Header } from "@/components/header";
import { requireCurrentUser } from "@/lib/auth";

export default async function ChatPage() {
	await requireCurrentUser();
	return (
		<div className="flex h-screen flex-col">
			<Header />
			<main className="flex-1">
				<ChatInterface />
			</main>
		</div>
	);
}
