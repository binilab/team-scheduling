"use client"

import { useMemo, Fragment } from "react"
import { format, addDays, parseISO, addMinutes } from "date-fns"
import { ko } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users } from "lucide-react"

interface HeatmapProps {
  poll: {
    id: string
    start_date: string
    end_date: string
    start_time: string
    end_time: string
    duration: number
    slot_minutes?: number | null
  }
  participants: {
    id: string
    name: string
    role: string // 'leader' | 'member'
    weight?: number | null
  }[]
  availabilities: {
    participant_id: string
    date: string
    slots: string[]
  }[]
}

export function Heatmap({ poll, participants, availabilities }: HeatmapProps) {
  
  // 1. 데이터 가공 및 점수 계산 로직
  const { timeSlots, days, scoreMap, maxScore, bestSlots } = useMemo(() => {
    // 날짜/시간 축 생성
    const startDate = parseISO(poll.start_date)
    const endDate = parseISO(poll.end_date)
    const days = []
    let curr = startDate
    while (curr <= endDate) {
      days.push(curr)
      curr = addDays(curr, 1)
    }

    const storedSlotMinutes =
      typeof window === "undefined" ? NaN : Number(localStorage.getItem(`poll:${poll.id}:slotMinutes`) || "")
    const slotMinutes =
      poll.slot_minutes ?? (Number.isFinite(storedSlotMinutes) && storedSlotMinutes > 0 ? storedSlotMinutes : 30)
    const timeSlots: string[] = []
    const [startH, startM] = poll.start_time.split(':').map(Number)
    const [endH, endM] = poll.end_time.split(':').map(Number)
    let t = new Date().setHours(startH, startM, 0, 0)
    const e = new Date().setHours(endH, endM, 0, 0)
    while (t < e) {
      timeSlots.push(format(new Date(t), 'HH:mm'))
      t = new Date(t).setMinutes(new Date(t).getMinutes() + slotMinutes)
    }

    // 점수 계산 (히트맵용)
    const scoreMap: Record<string, number> = {} // "2024-01-01_10:00" -> score
    const countMap: Record<string, number> = {} // 단순 인원수
    let maxScore = 0

    availabilities.forEach(av => {
      const participant = participants.find(p => p.id === av.participant_id)
      const weight = participant?.weight ?? (participant?.role === 'leader' ? 2 : 1)

      av.slots.forEach((time: string) => {
        const key = `${av.date}_${time}`
        scoreMap[key] = (scoreMap[key] || 0) + weight
        countMap[key] = (countMap[key] || 0) + 1
        if (scoreMap[key] > maxScore) maxScore = scoreMap[key]
      })
    })

    // 베스트 시간 추천 알고리즘 (연속된 시간 찾기)
    const requiredSlots = Math.ceil(poll.duration / slotMinutes)
    const candidates: { start: string; score: number; count: number }[] = []

    days.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd')
      for (let i = 0; i <= timeSlots.length - requiredSlots; i++) {
        let currentIntervalScore = 0
        let minCount = 999
        let valid = true

        // 연속된 구간 검사
        for (let j = 0; j < requiredSlots; j++) {
          const key = `${dateStr}_${timeSlots[i + j]}`
          const s = scoreMap[key] || 0
          const c = countMap[key] || 0
          
          if (s === 0) { valid = false; break; } // 중간에 빈 시간이 있으면 탈락
          currentIntervalScore += s
          if (c < minCount) minCount = c
        }

        if (valid) {
          candidates.push({
            start: `${dateStr} ${timeSlots[i]}`, // 시작 시간
            score: currentIntervalScore,
            count: minCount
          })
        }
      }
    })

    // 점수 높은 순 정렬 후 상위 3개
    candidates.sort((a, b) => b.score - a.score)
    const bestSlots = candidates.slice(0, 3)

    return { timeSlots, days, scoreMap, maxScore, bestSlots }
  }, [poll, participants, availabilities])

  // 색상 농도 유틸
  const getOpacity = (score: number) => {
    if (!score) return 0.05 // 기본값
    // maxScore가 0일 때 (아무 데이터 없을 때) division by zero 방지
    if (maxScore === 0) return 0.05
    return 0.2 + (0.8 * (score / maxScore)) // 최소 0.2 ~ 최대 1.0
  }

  return (
    <div className="space-y-8">
      
      {/* 베스트 추천 섹션 */}
      {bestSlots.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {bestSlots.map((slot, index) => (
            <Card key={index} className={cn("border-2", index === 0 ? "border-primary" : "")}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                  {index + 1}순위 추천
                  {index === 0 && <Star className="h-4 w-4 fill-primary text-primary" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {format(new Date(slot.start), 'M/d (E) HH:mm', { locale: ko })}
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  최소 {slot.count}명 참여 가능
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 히트맵 그리드 */}
      <div className="rounded-md border p-4 bg-white/50 overflow-x-auto">
        <h3 className="font-semibold mb-4">전체 가능 시간 현황</h3>
        <div className="grid" style={{ gridTemplateColumns: `auto repeat(${days.length}, minmax(80px, 1fr))` }}>
           {/* 헤더 */}
           <div className="p-2"></div>
           {days.map(d => (
             <div key={d.toString()} className="text-center p-2 text-sm font-medium border-b">
               {format(d, 'M/d (E)', { locale: ko })}
             </div>
           ))}

           {/* 바디 */}
           {timeSlots.map(time => (
             <Fragment key={time}>
                <div className="text-xs text-right p-2 text-muted-foreground">{time}</div>
                {days.map(d => {
                  const key = `${format(d, 'yyyy-MM-dd')}_${time}`
                  const score = scoreMap[key] || 0
                  return (
                    <div 
                      key={key} 
                      className="m-0.5 rounded-sm h-8 transition-all hover:ring-2 ring-primary/50 relative group"
                      style={{ backgroundColor: `hsl(var(--primary) / ${getOpacity(score)})` }}
                    >
                      {score > 0 && (
                         <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none">
                           {score}점
                         </div>
                      )}
                    </div>
                  )
                })}
             </Fragment>
           ))}
        </div>
      </div>
    </div>
  )
}
