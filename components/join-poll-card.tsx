"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Link2, Clipboard } from "lucide-react"

function extractPollCode(input: string): string {
  // Remove whitespace
  const trimmed = input.trim()

  // Check if it's a full URL
  const urlPatterns = [/timepoll\.kr\/p\/([a-zA-Z0-9]+)/, /\/p\/([a-zA-Z0-9]+)/, /^https?:\/\/.*\/p\/([a-zA-Z0-9]+)/]

  for (const pattern of urlPatterns) {
    const match = trimmed.match(pattern)
    if (match) return match[1]
  }

  // If it's just a code (alphanumeric only), return it
  if (/^[a-zA-Z0-9]+$/.test(trimmed)) {
    return trimmed
  }

  return trimmed
}

export function JoinPollCard() {
  const [pollCode, setPollCode] = useState("")
  const [showClipboardHint, setShowClipboardHint] = useState(false)
  const [clipboardContent, setClipboardContent] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFocus = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const code = extractPollCode(text)
      if (code && code !== pollCode && /timepoll|\/p\//.test(text)) {
        setClipboardContent(text)
        setShowClipboardHint(true)
      }
    } catch {
      // Clipboard access denied - ignore
    }
  }

  const handlePasteFromClipboard = () => {
    const code = extractPollCode(clipboardContent)
    setPollCode(code)
    setShowClipboardHint(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPollCode(value)
    setShowClipboardHint(false)
  }

  const handleJoin = () => {
    const code = extractPollCode(pollCode)
    if (code) {
      // Navigate to /p/{code}
      window.location.href = `/p/${code}`
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleJoin()
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="space-y-1">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Link2 className="w-4 h-4 text-primary" />
          링크로 바로 참여
        </h3>
        <p className="text-sm text-muted-foreground">받은 링크나 코드를 입력하세요</p>
      </div>

      {showClipboardHint && (
        <button
          onClick={handlePasteFromClipboard}
          className="w-full flex items-center gap-2 p-2.5 bg-primary/10 hover:bg-primary/15 border border-primary/20 rounded-lg transition-colors text-left"
        >
          <Clipboard className="w-4 h-4 text-primary shrink-0" />
          <span className="text-sm text-foreground">
            클립보드에 링크가 있어요. <span className="text-primary font-medium">붙여넣기</span>
          </span>
        </button>
      )}

      <div className="flex gap-2">
        <Input
          ref={inputRef}
          placeholder="링크 또는 코드 (예: abc123)"
          value={pollCode}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button onClick={handleJoin} size="icon" className="shrink-0" disabled={!pollCode.trim()}>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">가입 없이 이름만 입력하면 돼요</p>
    </div>
  )
}
