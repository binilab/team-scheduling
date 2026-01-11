"use client"

export const runtime = "edge"

import { use, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Heatmap } from "@/components/poll/heatmap"
import { Button } from "@/components/ui/button"
import { Loader2, Share2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useAppSettings } from "@/components/app-providers"
import { formatDateTime, getTimeZoneForLanguage } from "@/lib/date-format"

export default function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: pollId } = use(params)
  
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{
    poll: any, 
    participants: any[], 
    availabilities: any[]
  } | null>(null)
  
  const router = useRouter()
  const { language } = useAppSettings()
  const t =
    language === "en"
      ? {
          back: "Back",
          loadingFail: "Unable to load data.",
          participants: "responses so far",
          deadline: "Deadline:",
          closed: "(closed)",
          edit: "Edit my availability",
          copy: "Copy invite link",
          linkCopied: "Invite link copied!",
          copyIcon: "Copy invite link",
          subtitle: "Live availability view",
          legend: "Availability count:",
          legendHelp: "Darker means more people are available.",
          people: "people",
        }
      : {
          back: "뒤로가기",
          loadingFail: "데이터를 불러올 수 없습니다.",
          participants: "명이 참여했습니다.",
          deadline: "마감:",
          closed: "(마감됨)",
          edit: "내 시간 수정하기",
          copy: "초대 링크 복사",
          linkCopied: "초대 링크가 복사되었습니다!",
          copyIcon: "초대 링크 복사",
          subtitle: "실시간 가능 시간 결과",
          legend: "가능 인원 수:",
          legendHelp: "색이 진할수록 그 시간에 가능한 인원이 많아요",
          people: "명",
        }
  const safeBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
    } else {
      router.push(`/poll/${pollId}`)
    }
  }

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
    toast.success(t.linkCopied)
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>
  if (!data) return <div>{t.loadingFail}</div>

  const deadline = data.poll?.deadline ? new Date(data.poll.deadline) : null
  const timeZone = data.poll?.timezone ?? getTimeZoneForLanguage(language)
  const isClosed = deadline ? Date.now() > deadline.getTime() : false

  return (
    <div className="container max-w-5xl mx-auto py-10 px-4">
      <div className="mb-6">
        <Button variant="ghost" onClick={safeBack}>
          ← {t.back}
        </Button>
      </div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            {language === "en" ? `${data.poll.title} Results` : `${data.poll.title} 결과`}
          </h1>
          <p className="text-muted-foreground">
            {language === "en"
              ? `${data.participants.length} ${t.participants}`
              : `현재까지 ${data.participants.length}${t.participants}`}
          </p>
          {deadline && (
            <p className="text-xs text-muted-foreground mt-1">
              {t.deadline} {formatDateTime(deadline, language, timeZone)} {isClosed ? t.closed : ""}
            </p>
          )}
        </div>
        <div className="flex gap-2">
           <Button variant="outline" onClick={() => router.push(`/poll/${pollId}`)} disabled={isClosed}>
             {t.edit}
           </Button>
           <Button onClick={copyLink}>
             <Share2 className="mr-2 h-4 w-4" />
             {t.copy}
           </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">
            {language === "en" ? "Results" : "결과 보기"}
          </h2>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        </div>
        <div className="bg-white/85 border border-white/70 rounded-2xl p-5 space-y-5 shadow-[0_20px_45px_rgba(15,23,42,0.1)] backdrop-blur dark:bg-slate-900/80 dark:border-slate-700/60">
          <Heatmap 
            poll={data.poll} 
            participants={data.participants} 
            availabilities={data.availabilities} 
          />
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="text-foreground font-medium">{t.legend}</span>
              <div className="flex items-center gap-1">
                <span>0{t.people}</span>
                <div className="flex gap-0.5">
                  <div className="w-4 h-4 rounded bg-primary/20" />
                  <div className="w-4 h-4 rounded bg-primary/40" />
                  <div className="w-4 h-4 rounded bg-primary/60" />
                  <div className="w-4 h-4 rounded bg-primary/80" />
                  <div className="w-4 h-4 rounded bg-primary" />
                </div>
                <span>
                  {data.participants.length}
                  {t.people}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground/70 text-center">{t.legendHelp}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
