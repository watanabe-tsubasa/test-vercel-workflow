import { Header } from "@/components/header"
import { DiaryInputSidebar } from "@/components/diary-input-sidebar"
import { DiaryContent } from "@/components/diary-content"

export default function DiaryPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <DiaryInputSidebar />
        <main className="flex-1">
          <DiaryContent />
        </main>
      </div>
    </div>
  )
}
