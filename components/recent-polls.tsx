"use client"

import { useState, useEffect } from "react"
import { Clock, ChevronRight, History, Check, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface RecentPoll {
  id: string
  title: string
  deadline: string
  progress: number
  total: number
  hasSubmitted: boolean
}

const mockPolls: RecentPoll[] = [
  { id: "1", title: "마케팅 팀플 회의", deadline: "내일까지", progress: 4, total: 6, hasSubmitted: true },
  { id: "2", title: "동아리 MT 날짜 정하기", deadline: "3일 남음", progress: 8, total: 12, hasSubmitted: false },
  { id: "3", title: "스터디 모임", deadline: "오늘까지", progress: 3, total: 4, hasSubmitted: true },
]

export function RecentPolls() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [polls, setPolls] = useState<RecentPoll[]>([])

  useEffect(() => {
    setPolls(mockPolls)
  }, [])

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <History className="w-4 h-4 text-primary" />
          {isLoggedIn ? "내 일정 투표" : "최근 일정 투표"}
        </h3>
        <button
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {isLoggedIn ? "로그아웃" : "로그인"}
        </button>
      </div>

      {polls.length > 0 ? (
        <div className="space-y-3">
          {polls.map((poll) => (
            <button
              key={poll.id}
              className="w-full text-left p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-medium text-sm text-foreground line-clamp-1">{poll.title}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              </div>
              <div className="flex items-center gap-3">
                <Progress value={(poll.progress / poll.total) * 100} className="flex-1 h-1.5" />
                <span className="text-xs text-muted-foreground shrink-0">
                  {poll.progress}/{poll.total}명
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{poll.deadline}</span>
                </div>
                {poll.hasSubmitted ? (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Check className="w-3 h-3" />
                    <span>입력 완료</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-amber-500">
                    <AlertCircle className="w-3 h-3" />
                    <span>아직 미입력</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">아직 참여한 일정 투표가 없어요</p>
      )}

      {!isLoggedIn && (
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            로그인하면 다른 기기에서도 최근 일정 투표 안 잃어버려요
          </p>
        </div>
      )}
    </div>
  )
}
