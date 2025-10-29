import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">絵日記</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            ログアウト
          </Button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-medium text-secondary-foreground">
            U
          </div>
        </div>
      </div>
    </header>
  )
}
