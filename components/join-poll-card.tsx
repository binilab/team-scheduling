"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Link2, Clipboard } from "lucide-react"
import { useAppSettings } from "@/components/app-providers"
import { cn } from "@/lib/utils"

type PollTarget = { type: "pollId" | "code"; value: string }

function extractPollTarget(input: string): PollTarget | null {
  // Remove whitespace
  const trimmed = input.trim()

  // Check if it's a full URL
  const pollUrlPatterns = [
    /timepoll\.kr\/poll\/([a-zA-Z0-9-]+)/,
    /\/poll\/([a-zA-Z0-9-]+)/,
    /^https?:\/\/.*\/poll\/([a-zA-Z0-9-]+)/,
  ]

  for (const pattern of pollUrlPatterns) {
    const match = trimmed.match(pattern)
    if (match) return { type: "pollId", value: match[1] }
  }

  const codeUrlPatterns = [
    /timepoll\.kr\/p\/([0-9]{6})/,
    /\/p\/([0-9]{6})/,
    /^https?:\/\/.*\/p\/([0-9]{6})/,
  ]

  for (const pattern of codeUrlPatterns) {
    const match = trimmed.match(pattern)
    if (match) return { type: "code", value: match[1] }
  }

  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (uuidPattern.test(trimmed)) {
    return { type: "pollId", value: trimmed }
  }

  // If it's just a code (6 digits), return it
  if (/^[0-9]{6}$/.test(trimmed)) {
    return { type: "code", value: trimmed }
  }

  return null
}

type JoinPollCardProps = {
  compact?: boolean
  className?: string
}

export function JoinPollCard({ compact = false, className }: JoinPollCardProps) {
  const { language } = useAppSettings()
  const t =
    language === "en"
      ? {
          title: "Join by link or code",
          desc: "Paste an invite link or 6-digit code",
          clipboard: "Link found in clipboard.",
          clipboardAction: "Paste",
          placeholder: "Link or code (e.g. 123456)",
          hint: "No login needed — just enter your name",
        }
      : {
          title: "링크/코드로 참여",
          desc: "받은 링크나 6자리 코드를 입력하세요",
          clipboard: "클립보드에 링크가 있어요.",
          clipboardAction: "붙여넣기",
          placeholder: "링크 또는 코드 (예: 123456)",
          hint: "가입 없이 이름만 입력하면 돼요",
        }
  const [pollCode, setPollCode] = useState("")
  const [showClipboardHint, setShowClipboardHint] = useState(false)
  const [clipboardContent, setClipboardContent] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFocus = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const target = extractPollTarget(text)
      if (target?.value && target.value !== pollCode && /timepoll|\/poll\/|\/p\//.test(text)) {
        setClipboardContent(text)
        setShowClipboardHint(true)
      }
    } catch {
      // Clipboard access denied - ignore
    }
  }

  const handlePasteFromClipboard = () => {
    const target = extractPollTarget(clipboardContent)
    if (target) setPollCode(target.value)
    setShowClipboardHint(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPollCode(value)
    setShowClipboardHint(false)
  }

  const handleJoin = () => {
    const target = extractPollTarget(pollCode)
    if (target) {
      if (target.type === "pollId") {
        window.location.href = `/poll/${target.value}`
      } else {
        window.location.href = `/p/${target.value}`
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleJoin()
    }
  }

  return (
    <div
      className={cn(
        "bg-white/85 border border-white/70 rounded-2xl shadow-[0_20px_45px_rgba(15,23,42,0.1)] backdrop-blur dark:bg-slate-900/80 dark:border-slate-700/60",
        compact ? "p-3 space-y-3" : "p-5 space-y-4",
        className,
      )}
    >
      <div className={cn("space-y-1", compact && "space-y-0.5")}>
        <h3 className={cn("font-semibold text-foreground flex items-center gap-2", compact ? "text-sm" : "")}>
          <Link2 className="w-4 h-4 text-primary" />
          {t.title}
        </h3>
        <p className={cn("text-sm text-muted-foreground", compact && "text-xs")}>{t.desc}</p>
      </div>

      {showClipboardHint && (
        <button
          onClick={handlePasteFromClipboard}
          className="w-full flex items-center gap-2 p-2.5 bg-[linear-gradient(120deg,rgba(49,130,246,0.12),rgba(56,189,248,0.1))] hover:bg-primary/15 border border-primary/15 rounded-xl transition-colors text-left dark:border-primary/30"
        >
          <Clipboard className="w-4 h-4 text-primary shrink-0" />
          <span className="text-sm text-foreground">
            {t.clipboard} <span className="text-primary font-medium">{t.clipboardAction}</span>
          </span>
        </button>
      )}

      <div className={cn("flex gap-2", compact && "gap-1.5")}>
        <Input
          ref={inputRef}
          placeholder={t.placeholder}
          value={pollCode}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          className={cn("flex-1", compact && "h-9 text-xs")}
        />
        <Button
          onClick={handleJoin}
          size="icon"
          className={cn("shrink-0", compact && "h-9 w-9")}
          disabled={!pollCode.trim()}
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <p className={cn("text-xs text-muted-foreground", compact && "text-[11px]")}>{t.hint}</p>
    </div>
  )
}
