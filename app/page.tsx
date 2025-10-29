import { Header } from "@/components/header"
import { DiarySidebar } from "@/components/diary-sidebar"
import { ChatInterface } from "@/components/chat-interface"

export default function HomePage() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <DiarySidebar />
        <main className="flex-1">
          <ChatInterface />
        </main>
      </div>
    </div>
  )
}
