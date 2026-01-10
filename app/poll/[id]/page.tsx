"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
// 3-2에서 만든 컴포넌트 import
import { AuthDialog } from "@/components/poll/auth-dialog"
import { Loader2 } from "lucide-react"
import { TimeGrid } from "@/components/poll/time-grid"
import { Button } from "@/components/ui/button"

// Types
type PollData = {
  id: string
  title: string
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  duration: number
}

// Next.js 15+ 에서는 params가 Promise입니다.
export default function PollPage({ params }: { params: Promise<{ id: string }> }) {
  // params unwrap
  const { id: pollId } = use(params)
  
  const router = useRouter() // router 선언 추가
  const [poll, setPoll] = useState<PollData | null>(null)
  const [loading, setLoading] = useState(true)
  const [participantId, setParticipantId] = useState<string | null>(null)

  // 1. 방 정보 가져오기
  useEffect(() => {
    async function fetchPoll() {
      const { data, error } = await supabase
        .from("polls")
        .select("*")
        .eq("id", pollId)
        .single()

      if (error) {
        console.error("Error fetching poll:", error)
      } else {
        setPoll(data)
      }
      setLoading(false)
    }

    if (pollId) fetchPoll()
  }, [pollId])

  // 2. 로그인 성공 핸들러
  const handleAuthSuccess = (id: string) => {
    setParticipantId(id)
    // 여기서 나중에 로컬 스토리지에 저장하여 새로고침 유지 가능
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!poll) {
    return <div className="p-8 text-center">존재하지 않는 방입니다.</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 아직 로그인 안했으면 다이얼로그 띄우기 */}
      <AuthDialog 
        isOpen={!participantId} 
        onSuccess={handleAuthSuccess} 
      />

      {/* 헤더 */}
      <header className="border-b px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{poll.title}</h1>
          <p className="text-sm text-muted-foreground">
            {poll.start_date} ~ {poll.end_date} | {poll.duration}분 회의
          </p>
        </div>
        <Button onClick={() => router.push(`/poll/${pollId}/result`)}>
          결과 보기 →
        </Button>
      </header>

      {/* 메인 컨텐츠 영역 (그리드 들어갈 곳) */}
      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        {participantId ? (
          <TimeGrid poll={poll} participantId={participantId} />
        ) : (
          <div className="py-20 text-center">로그인이 필요합니다.</div>
        )}
      </main>
    </div>
  )
}