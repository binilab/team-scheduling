"use client"

export const runtime = "edge"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAppSettings } from "@/components/app-providers"

export default function PollCodePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const router = useRouter()
  const { language } = useAppSettings()
  const [isMissing, setIsMissing] = useState(false)
  const t =
    language === "en"
      ? {
          missing: "We couldn't find a poll for that code.",
          helper: "Please check the 6-digit code or ask for the invite link.",
        }
      : {
          missing: "해당 코드의 방을 찾지 못했습니다.",
          helper: "6자리 코드를 확인하거나 초대 링크를 요청해주세요.",
        }

  useEffect(() => {
    let active = true
    async function resolveCode() {
      const normalized = code.trim()
      const { data, error } = await supabase.from("polls").select("id, code").eq("code", normalized).single()
      if (!active) return
      if (error || !data?.id) {
        setIsMissing(true)
        return
      }
      router.replace(`/poll/${data.id}`)
    }
    if (code) resolveCode()
    return () => {
      active = false
    }
  }, [code, router])

  if (isMissing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-2 text-center px-6">
        <p className="text-lg font-semibold">{t.missing}</p>
        <p className="text-sm text-muted-foreground">{t.helper}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}
