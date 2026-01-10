"use client"

import { useState, useRef, Fragment } from "react"
import { Users, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const mockDays = ["월 13일", "화 14일", "수 15일"]
const mockTimeSlots = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00"]

const mockHeatmap = [
  [3, 2, 4, 1, 2, 3],
  [2, 5, 5, 4, 3, 2],
  [4, 4, 3, 2, 1, 2],
]

const mockParticipants = [
  [
    "김민수, 이영희, 박철수",
    "김민수, 이영희",
    "김민수, 이영희, 박철수, 최지우",
    "김민수",
    "김민수, 이영희",
    "김민수, 이영희, 박철수",
  ],
  [
    "김민수, 이영희",
    "전원 가능",
    "전원 가능",
    "김민수, 이영희, 박철수, 최지우",
    "김민수, 이영희, 박철수",
    "김민수, 이영희",
  ],
  [
    "김민수, 이영희, 박철수, 최지우",
    "김민수, 이영희, 박철수, 최지우",
    "김민수, 이영희, 박철수",
    "김민수, 이영희",
    "김민수",
    "김민수, 이영희",
  ],
]

const bestTimes = [
  { day: "화 14일", time: "11:00", dayIndex: 1, timeIndex: 1, score: 5 },
  { day: "화 14일", time: "12:00", dayIndex: 1, timeIndex: 2, score: 5 },
  { day: "수 15일", time: "10:00", dayIndex: 2, timeIndex: 0, score: 4 },
]

function getHeatColor(value: number) {
  if (value >= 5) return "bg-primary"
  if (value >= 4) return "bg-primary/80"
  if (value >= 3) return "bg-primary/60"
  if (value >= 2) return "bg-primary/40"
  if (value >= 1) return "bg-primary/20"
  return "bg-muted"
}

export function LivePreview() {
  const [highlightedCell, setHighlightedCell] = useState<{ dayIndex: number; timeIndex: number } | null>(null)
  const cellRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const gridRef = useRef<HTMLDivElement>(null)

  const handleBestTimeClick = (dayIndex: number, timeIndex: number) => {
    setHighlightedCell({ dayIndex, timeIndex })

    const cellKey = `${dayIndex}-${timeIndex}`
    const cell = cellRefs.current.get(cellKey)
    if (cell && gridRef.current) {
      cell.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
    }

    setTimeout(() => {
      setHighlightedCell(null)
    }, 800)
  }

  const isHighlighted = (dayIndex: number, timeIndex: number) => {
    return highlightedCell?.dayIndex === dayIndex && highlightedCell?.timeIndex === timeIndex
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">라이브 미리보기</h2>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>2/6명 입력 완료</span>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-5">
        <TooltipProvider delayDuration={100}>
          <div className="overflow-x-auto" ref={gridRef}>
            <div className="min-w-[300px]">
              <div className="grid grid-cols-[60px_repeat(3,1fr)] gap-1">
                {/* Header */}
                <div className="h-8" />
                {mockDays.map((day) => (
                  <div
                    key={day}
                    className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}

                {/* Time slots */}
                {mockTimeSlots.map((time, timeIndex) => (
                  <Fragment key={time}>
                    <div className="h-8 flex items-center text-xs text-muted-foreground pr-2">
                      {time}
                    </div>
                    {mockDays.map((day, dayIndex) => {
                      const count = mockHeatmap[dayIndex][timeIndex]
                      return (
                        <Tooltip key={`${day}-${time}`}>
                          <TooltipTrigger asChild>
                            <div
                              ref={(el) => {
                                if (el) cellRefs.current.set(`${dayIndex}-${timeIndex}`, el)
                              }}
                              className={`h-8 rounded transition-all duration-300 cursor-pointer ${getHeatColor(count)} ${
                                isHighlighted(dayIndex, timeIndex)
                                  ? "ring-2 ring-accent ring-offset-2 ring-offset-card animate-pulse"
                                  : ""
                              }`}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            <div className="font-medium">가능 {count}명</div>
                            <div className="text-muted-foreground text-[10px] max-w-[150px] truncate">
                              {mockParticipants[dayIndex][timeIndex]}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )
                    })}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </TooltipProvider>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="text-foreground font-medium">가능 인원 수:</span>
            <div className="flex items-center gap-1">
              <span>0명</span>
              <div className="flex gap-0.5">
                <div className="w-4 h-4 rounded bg-primary/20" />
                <div className="w-4 h-4 rounded bg-primary/40" />
                <div className="w-4 h-4 rounded bg-primary/60" />
                <div className="w-4 h-4 rounded bg-primary/80" />
                <div className="w-4 h-4 rounded bg-primary" />
              </div>
              <span>5명</span>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground/70 text-center">
            색이 진할수록 그 시간에 가능한 인원이 많아요
          </p>
        </div>

        {/* Best Time Candidates */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-1.5">
            <Star className="w-4 h-4 text-accent" />
            베스트 후보 3개
          </h3>
          <div className="flex flex-wrap gap-2">
            {bestTimes.map((item, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-3 py-1.5 text-sm font-normal cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={() => handleBestTimeClick(item.dayIndex, item.timeIndex)}
              >
                {item.day} {item.time}
                <span className="ml-1.5 text-xs text-muted-foreground">({item.score}명)</span>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
