import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Calendar, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface DiarySidebarProps {
  diaries?: Array<{
    id: string
    title: string
    date: string
    hasImage: boolean
  }>
}

export function DiarySidebar({ diaries = [] }: DiarySidebarProps) {
  // モックデータ
  const mockDiaries =
    diaries.length > 0
      ? diaries
      : [
          { id: "1", title: "公園でピクニック", date: "2024年1月15日", hasImage: true },
          { id: "2", title: "友達とカフェ巡り", date: "2024年1月14日", hasImage: true },
          { id: "3", title: "新しい本を読んだ", date: "2024年1月13日", hasImage: false },
          { id: "4", title: "料理に挑戦", date: "2024年1月12日", hasImage: true },
          { id: "5", title: "散歩で見つけた景色", date: "2024年1月11日", hasImage: true },
        ]

  return (
    <div className="flex h-full w-80 flex-col border-r border-border bg-sidebar">
      <div className="border-b border-sidebar-border p-4">
        <h2 className="text-lg font-semibold text-sidebar-foreground">これまでの日記</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {mockDiaries.map((diary) => (
            <Button
              key={diary.id}
              variant="ghost"
              className={cn(
                "h-auto w-full justify-start gap-3 px-3 py-3 text-left hover:bg-sidebar-accent",
                diary.id === "1" && "bg-sidebar-accent",
              )}
            >
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sidebar-foreground">{diary.title}</span>
                  {diary.hasImage && <ImageIcon className="h-3.5 w-3.5 text-sidebar-primary" />}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{diary.date}</span>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
