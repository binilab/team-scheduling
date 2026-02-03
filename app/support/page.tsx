"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Link2, Mail, MessageSquare, Loader2 } from "lucide-react"
import { useAppSettings } from "@/components/app-providers"

function extractPollTarget(input: string) {
  const trimmed = input.trim()
  if (!trimmed) return { pollId: null, pollCode: null }

  const pollUrlPatterns = [
    /timepoll\.kr\/poll\/([a-zA-Z0-9-]+)/,
    /\/poll\/([a-zA-Z0-9-]+)/,
    /^https?:\/\/.*\/poll\/([a-zA-Z0-9-]+)/,
  ]

  for (const pattern of pollUrlPatterns) {
    const match = trimmed.match(pattern)
    if (match) return { pollId: match[1], pollCode: null }
  }

  const codeUrlPatterns = [
    /timepoll\.kr\/p\/([0-9]{6})/,
    /\/p\/([0-9]{6})/,
    /^https?:\/\/.*\/p\/([0-9]{6})/,
  ]

  for (const pattern of codeUrlPatterns) {
    const match = trimmed.match(pattern)
    if (match) return { pollId: null, pollCode: match[1] }
  }

  if (/^[0-9]{6}$/.test(trimmed)) {
    return { pollId: null, pollCode: trimmed }
  }

  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed)) {
    return { pollId: trimmed, pollCode: null }
  }

  return { pollId: null, pollCode: null }
}

export default function SupportPage() {
  const router = useRouter()
  const { language } = useAppSettings()
  const isEn = language === "en"
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [pollInput, setPollInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const t = isEn
    ? {
        badge: "Support",
        title: "Tell us anything",
        description:
          "Report bugs, request features, or ask about billing/account issues. We'll get back to you quickly.",
        cardTitle: "Contact form",
        submitted: "Your request was received. We'll reply to your email.",
        name: "Name",
        email: "Email",
        pollLabel: "Related poll link or code (optional)",
        pollPlaceholder: "e.g. https://timepoll.kr/poll/1234 or 6-digit code",
        pollHint: "If provided, we can check the poll with your request.",
        message: "Message",
        messagePlaceholder: "Tell us what happened or what feature you need.",
        responseTime: "We usually respond within 1 business day.",
        send: "Send message",
        sending: "Sending...",
        requiredError: "Please enter your name, email, and message.",
        submitError: "Failed to submit your request.",
        submitSuccess: "Your request has been sent. We'll reply soon.",
      }
    : {
        badge: "문의하기",
        title: "무엇이든 편하게 알려주세요",
        description: "버그 제보, 기능 요청, 결제/계정 관련 문의 등 무엇이든 남겨주시면 빠르게 답변드릴게요.",
        cardTitle: "문의 내용",
        submitted: "문의가 정상 접수되었습니다. 입력하신 이메일로 답변드릴게요.",
        name: "이름",
        email: "이메일",
        pollLabel: "관련 방 링크 또는 코드 (선택)",
        pollPlaceholder: "예: https://timepoll.kr/poll/1234 혹은 6자리 코드",
        pollHint: "입력하면 문의를 해당 방과 함께 확인할 수 있어요.",
        message: "문의 내용",
        messagePlaceholder: "어떤 점이 불편했는지, 어떤 기능이 필요하신지 자세히 적어주세요.",
        responseTime: "응답까지 최대 1영업일이 소요될 수 있습니다.",
        send: "문의 보내기",
        sending: "보내는 중...",
        requiredError: "이름, 이메일, 문의 내용을 입력해주세요.",
        submitError: "문의 접수에 실패했습니다.",
        submitSuccess: "문의가 접수되었습니다. 최대한 빨리 답변드릴게요.",
      }

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error(t.requiredError)
      return
    }

    const { pollId, pollCode } = extractPollTarget(pollInput)

    try {
      setLoading(true)
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, pollId, pollCode }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || t.submitError)
      }

      toast.success(t.submitSuccess)
      setSubmitted(true)
      setMessage("")
      setPollInput("")
    } catch (error: any) {
      toast.error(error?.message || t.submitError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12 lg:py-16 max-w-4xl">
        <div className="space-y-3 mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <MessageSquare className="h-4 w-4" />
            {t.badge}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
          <p className="text-muted-foreground">{t.description}</p>
        </div>

        <Card className="border-border/60 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle>{t.cardTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {submitted && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                {t.submitted}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.name}</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={isEn ? "Jane Doe" : "홍길동"} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.email}</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Link2 className="h-4 w-4 text-muted-foreground" />
                {t.pollLabel}
              </label>
              <Input
                value={pollInput}
                onChange={(e) => setPollInput(e.target.value)}
                placeholder={t.pollPlaceholder}
              />
              <p className="text-xs text-muted-foreground">{t.pollHint}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {t.message}
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder={t.messagePlaceholder}
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
              <p className="text-xs text-muted-foreground">{t.responseTime}</p>
              <Button onClick={handleSubmit} disabled={loading} className={cn("min-w-[140px]")}> 
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t.sending}
                  </span>
                ) : (
                  t.send
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
