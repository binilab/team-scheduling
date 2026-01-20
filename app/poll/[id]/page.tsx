"use client"

export const runtime = "edge"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
// 3-2에서 만든 컴포넌트 import
import { AuthDialog } from "@/components/poll/auth-dialog"
import { Loader2 } from "lucide-react"
import { TimeGrid } from "@/components/poll/time-grid"
import { Button } from "@/components/ui/button"
import { useAppSettings } from "@/components/app-providers"
import { formatDate, formatDateTime, getTimeZoneForLanguage } from "@/lib/date-format"

// Types
type PollData = {
  id: string
  title: string
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  duration: number
  slot_minutes?: number | null
  deadline?: string | null
  timezone?: string | null
}

// Next.js 15+ 에서는 params가 Promise입니다.
export default function PollPage({ params }: { params: Promise<{ id: string }> }) {
  // params unwrap
  const { id: pollId } = use(params)
  
  const router = useRouter() // router 선언 추가
  const { language } = useAppSettings()
  const t =
    language === "en"
      ? {
          back: "Back",
          missing: "This poll does not exist.",
          viewResult: "View results →",
          meeting: "min meeting",
          deadline: "Deadline:",
          closed: "(closed)",
          needName: "Please enter your name.",
        }
      : {
          back: "뒤로가기",
          missing: "존재하지 않는 방입니다.",
          viewResult: "결과 보기 →",
          meeting: "분 회의",
          deadline: "마감:",
          closed: "(마감됨)",
          needName: "이름 입력이 필요합니다.",
        }
  const safeBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }
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
        // 레거시 기본값(09:00~22:00)으로 저장된 경우 전체 구간으로 보정
        const normalizedStart = data.start_time === "09:00" && data.end_time === "22:00" ? "00:00" : data.start_time || "00:00"
        const normalizedEnd = data.start_time === "09:00" && data.end_time === "22:00" ? "24:00" : data.end_time || "24:00"
        setPoll({ ...data, start_time: normalizedStart, end_time: normalizedEnd })
      }
      setLoading(false)
    }

    if (pollId) fetchPoll()
  }, [pollId])

  useEffect(() => {
    if (!pollId) return
    const storedId = localStorage.getItem(`poll:${pollId}:participantId`)
    if (storedId) setParticipantId(storedId)
  }, [pollId])

  // 2. 로그인 성공 핸들러
  const handleAuthSuccess = (id: string, name: string) => {
    setParticipantId(id)
    localStorage.setItem(`poll:${pollId}:participantId`, id)
    localStorage.setItem(`poll:${pollId}:participantName`, name)
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!poll) {
    return <div className="p-8 text-center">{t.missing}</div>
  }

  const deadline = poll.deadline ? new Date(poll.deadline) : null
  const timeZone = poll.timezone ?? getTimeZoneForLanguage(language)
  const isClosed = deadline ? Date.now() > deadline.getTime() : false

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
          <Button variant="ghost" size="sm" onClick={safeBack} className="mb-2 w-fit">
            ← {t.back}
          </Button>
          <h1 className="text-2xl font-bold">{poll.title}</h1>
          <p className="text-sm text-muted-foreground">
            {formatDate(poll.start_date, language, timeZone)} ~{" "}
            {formatDate(poll.end_date, language, timeZone)} | {poll.duration}
            {t.meeting}
          </p>
          {deadline && (
            <p className="text-xs text-muted-foreground mt-1">
              {t.deadline} {formatDateTime(deadline, language, timeZone)} {isClosed ? t.closed : ""}
            </p>
          )}
        </div>
        <Button onClick={() => router.push(`/poll/${pollId}/result`)}>{t.viewResult}</Button>
      </header>

      {/* 메인 컨텐츠 영역 (그리드 들어갈 곳) */}
      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        {participantId ? (
          <TimeGrid poll={poll} participantId={participantId} isClosed={isClosed} />
        ) : (
          <div className="py-20 text-center">{t.needName}</div>
        )}
      </main>
    </div>
  )
}
