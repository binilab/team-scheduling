"use client"

export const runtime = "edge"

import { use, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Heatmap } from "@/components/poll/heatmap"
import { Button } from "@/components/ui/button"
import { Loader2, Share2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: pollId } = use(params)
  
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{
    poll: any, 
    participants: any[], 
    availabilities: any[]
  } | null>(null)
  
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      // 1. 방 정보
      const { data: poll } = await supabase.from('polls').select('*').eq('id', pollId).single()
      // 2. 참여자 목록
      const { data: participants } = await supabase.from('participants').select('*').eq('poll_id', pollId)
      // 3. 가능 시간 데이터
      const { data: availabilities } = await supabase.from('availabilities').select('*').eq('poll_id', pollId)

      if (poll && participants && availabilities) {
        setData({ poll, participants, availabilities })
      }
      setLoading(false)
    }
    fetchData()
  }, [pollId])

  const copyLink = () => {
    const url = `${window.location.origin}/poll/${pollId}`
    navigator.clipboard.writeText(url)
    toast.success("초대 링크가 복사되었습니다!")
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>
  if (!data) return <div>데이터를 불러올 수 없습니다.</div>

  return (
    <div className="container max-w-5xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">{data.poll.title} 결과</h1>
          <p className="text-muted-foreground">
            현재까지 {data.participants.length}명이 참여했습니다.
          </p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" onClick={() => router.push(`/poll/${pollId}`)}>
             내 시간 수정하기
           </Button>
           <Button onClick={copyLink}>
             <Share2 className="mr-2 h-4 w-4" />
             초대 링크 복사
           </Button>
        </div>
      </div>

      <Heatmap 
        poll={data.poll} 
        participants={data.participants} 
        availabilities={data.availabilities} 
      />
    </div>
  )
}
