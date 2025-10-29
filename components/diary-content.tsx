"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, ImageIcon, Loader2 } from "lucide-react"

export function DiaryContent() {
  const [approved, setApproved] = useState(false)
  const [generatingImage, setGeneratingImage] = useState(false)
  const [imageGenerated, setImageGenerated] = useState(false)

  const handleApprove = () => {
    setApproved(true)
    setGeneratingImage(true)

    // モック画像生成
    setTimeout(() => {
      setGeneratingImage(false)
      setImageGenerated(true)
    }, 3000)
  }

  return (
    <ScrollArea className="h-full">
      <div className="mx-auto max-w-4xl space-y-6 p-6">
        {/* 画像エリア */}
        <Card className="overflow-hidden">
          {!approved ? (
            <div className="flex h-[400px] items-center justify-center bg-muted">
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">日記の文章を承認すると画像が生成されます</p>
              </div>
            </div>
          ) : generatingImage ? (
            <div className="flex h-[400px] items-center justify-center bg-muted">
              <div className="text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-3 text-sm text-muted-foreground">画像を生成中...</p>
              </div>
            </div>
          ) : imageGenerated ? (
            <img
              src="/peaceful-park-scene-with-coffee-shop-and-sunset.jpg"
              alt="生成された絵日記の画像"
              className="h-[400px] w-full object-cover"
            />
          ) : null}
        </Card>

        {/* 日記の文章 */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">今日の一日</h2>
              <span className="text-sm text-muted-foreground">2024年1月15日</span>
            </div>
            <div className="prose prose-sm max-w-none leading-relaxed text-foreground">
              <p>
                今朝は気持ちの良い天気だったので、近所の公園を散歩することにした。
                朝の澄んだ空気を吸いながら歩くと、心が落ち着いていくのを感じた。
                公園では犬の散歩をしている人や、ジョギングをしている人たちとすれ違った。
              </p>
              <p>
                散歩の後は、お気に入りのカフェに立ち寄った。
                いつものコーヒーを注文すると、バリスタさんが笑顔で迎えてくれた。
                窓際の席に座り、ゆっくりとコーヒーを味わう時間は、何にも代えがたい贅沢だ。
              </p>
              <p>
                午後は久しぶりに友達と電話で話した。 最近の出来事や、お互いの近況を報告し合い、笑い合った。
                離れていても、こうして繋がっていられることに感謝の気持ちでいっぱいになった。
              </p>
              <p>
                夕方、ふと窓の外を見ると、空が美しいオレンジ色に染まっていた。
                思わずベランダに出て、その景色をしばらく眺めていた。
                こんな穏やかな一日を過ごせたことに、心から感謝している。
              </p>
            </div>
            {!approved && (
              <div className="flex justify-end pt-4">
                <Button onClick={handleApprove} size="lg">
                  <Check className="mr-2 h-4 w-4" />
                  この文章で画像を生成
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </ScrollArea>
  )
}
