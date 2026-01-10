"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Clock,
  Link2,
  Copy,
  Check,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  QrCode,
  ArrowRight,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

const DAYS = ["일", "월", "화", "수", "목", "금", "토"]
const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function formatDate(date: Date | null) {
  if (!date) return ""
  return `${date.getMonth() + 1}/${date.getDate()}`
}

function isSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function isInRange(date: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false
  return date > start && date < end
}

export function HeroSection() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isCreated, setIsCreated] = useState(false)
  const [copied, setCopied] = useState(false)
  const [pollLink, setPollLink] = useState("")
  const [pollId, setPollId] = useState("")
  const [pollTitle, setPollTitle] = useState("")

  const today = new Date()
  const initialStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const initialEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2)
  const [startDate, setStartDate] = useState<Date | null>(initialStart)
  const [endDate, setEndDate] = useState<Date | null>(initialEnd)
  const [selectingStart, setSelectingStart] = useState(true)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(initialStart)
  const [showQR, setShowQR] = useState(false)
  const [timeRange, setTimeRange] = useState("10-22")
  const [slotMinutes, setSlotMinutes] = useState("30")
  const [meetingMinutes, setMeetingMinutes] = useState("60")
  const [deadlineLocal, setDeadlineLocal] = useState("")
  const [deadlineTouched, setDeadlineTouched] = useState(false)

  useEffect(() => {
    if (!endDate || deadlineTouched) return
    const deadline = new Date(endDate)
    deadline.setHours(23, 59, 0, 0)
    const localValue = new Date(deadline.getTime() - deadline.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
    setDeadlineLocal(localValue)
  }, [endDate, deadlineTouched])

  const handleQuickSelect = (type: "thisWeek" | "nextWeek" | "next3days" | "weekend") => {
    const base = new Date()
    const dayOfWeek = base.getDay()

    switch (type) {
      case "thisWeek": {
        const monday = new Date(base)
        monday.setDate(base.getDate() - dayOfWeek + 1)
        const friday = new Date(monday)
        friday.setDate(monday.getDate() + 4)
        setStartDate(monday)
        setEndDate(friday)
        break
      }
      case "nextWeek": {
        const nextMonday = new Date(base)
        nextMonday.setDate(base.getDate() - dayOfWeek + 8)
        const nextFriday = new Date(nextMonday)
        nextFriday.setDate(nextMonday.getDate() + 4)
        setStartDate(nextMonday)
        setEndDate(nextFriday)
        break
      }
      case "next3days": {
        const start = new Date(base)
        start.setDate(base.getDate() + 1)
        const end = new Date(base)
        end.setDate(base.getDate() + 3)
        setStartDate(start)
        setEndDate(end)
        break
      }
      case "weekend": {
        const saturday = new Date(base)
        saturday.setDate(saturday.getDate() + (6 - dayOfWeek))
        const sunday = new Date(saturday)
        sunday.setDate(saturday.getDate() + 1)
        setStartDate(saturday)
        setEndDate(sunday)
        break
      }
    }
    setCalendarOpen(false)
  }

  const handleDateClick = (date: Date) => {
    if (selectingStart) {
      setStartDate(date)
      setEndDate(null)
      setSelectingStart(false)
    } else {
      if (date < startDate!) {
        setStartDate(date)
        setEndDate(startDate)
      } else {
        setEndDate(date)
      }
      setSelectingStart(true)
      setCalendarOpen(false)
    }
  }

  const parseTimeRange = (range: string) => {
    const [start, end] = range.split("-").map((value) => value.trim())
    const startHour = start.padStart(2, "0")
    const endHour = end.padStart(2, "0")
    return {
      startTime: `${startHour}:00`,
      endTime: `${endHour}:00`,
    }
  }

  const handleCreate = async () => {
    if (!startDate || !endDate) {
      toast.error("날짜 범위를 선택해주세요.")
      return
    }

    try {
      setIsLoading(true)
      const title = pollTitle.trim() || getAutoTitle()
      const { startTime, endTime } = parseTimeRange(timeRange)
      const payload = {
        title,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        duration: parseInt(meetingMinutes, 10),
        start_time: startTime,
        end_time: endTime,
        deadline: deadlineLocal ? new Date(deadlineLocal).toISOString() : null,
      }

      let { data, error } = await supabase
        .from("polls")
        .insert([{ ...payload, slot_minutes: parseInt(slotMinutes, 10) }])
        .select()
        .single()

      if (error && /slot_minutes|deadline|column/i.test(error.message)) {
        const fallbackPayload = {
          ...payload,
        }
        delete (fallbackPayload as { deadline?: string | null }).deadline
        ;({ data, error } = await supabase.from("polls").insert([fallbackPayload]).select().single())
      }

      if (error) throw error
      if (!data?.id) throw new Error("방 생성에 실패했습니다.")

      const link = `${window.location.origin}/poll/${data.id}`
      setPollId(data.id)
      setPollLink(link)
      localStorage.setItem(`poll:${data.id}:slotMinutes`, slotMinutes)
      setIsCreated(true)
      toast.success("링크가 생성되었습니다!")
    } catch (error) {
      console.error(error)
      toast.error("방 생성 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(pollLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleKakaoShare = () => {
    // 실제 구현 시 Kakao SDK 사용
    window.open(`https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(pollLink)}`, "_blank")
  }

  const handleReset = () => {
    setIsCreated(false)
    setPollLink("")
    setPollTitle("")
    setPollId("")
    setShowQR(false)
    setDeadlineTouched(false)
  }

  const getAutoTitle = () => {
    if (startDate) {
      return `팀플 회의 (${startDate.getMonth() + 1}/${startDate.getDate()})`
    }
    return "팀플 회의 일정"
  }

  const renderCalendarMonth = (monthDate: Date) => {
    const year = monthDate.getFullYear()
    const month = monthDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)
    const days: (Date | null)[] = []

    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i))

    return (
      <div className="space-y-2">
        <div className="text-center font-medium text-sm">
          {year}년 {MONTHS[month]}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
          {DAYS.map((d) => (
            <div key={d} className="h-6 flex items-center justify-center">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, idx) => (
            <button
              key={idx}
              disabled={!date}
              onClick={() => date && handleDateClick(date)}
              className={cn(
                "h-8 w-8 text-sm rounded-md flex items-center justify-center transition-colors",
                !date && "invisible",
                date && "hover:bg-primary/20",
                date && isSameDay(date, startDate) && "bg-primary text-primary-foreground",
                date && isSameDay(date, endDate) && "bg-primary text-primary-foreground",
                date && isInRange(date, startDate, endDate) && "bg-primary/20",
              )}
            >
              {date?.getDate()}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const nextMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)

  return (
    <section className="space-y-6">
      {/* Hero Text */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          <span>가입 없이 바로 시작</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance">
          팀플 시간,
          <br />
          <span className="text-primary">1분이면</span> 정리 끝
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg">
          링크 공유 → 각자 가능한 시간 체크 → 자동으로 베스트 시간 추천.
          <br />더 이상 카톡으로 시간 물어보지 마세요
        </p>
      </div>

      {/* Poll Creation Form */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        {!isCreated ? (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="poll-title" className="text-sm font-medium">
                일정 제목 <span className="text-muted-foreground font-normal">(선택)</span>
              </Label>
              <Input
                id="poll-title"
                placeholder={`비워두면 "${getAutoTitle()}"로 자동 생성`}
                className="h-11"
                value={pollTitle}
                onChange={(e) => setPollTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                날짜 선택
              </Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-11 justify-start text-left font-normal bg-transparent">
                    {startDate && endDate ? (
                      <span>
                        {startDate.getMonth() + 1}/{startDate.getDate()} ~ {endDate.getMonth() + 1}/{endDate.getDate()}
                        <span className="text-muted-foreground ml-2">
                          ({Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1}일간)
                        </span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground">시작일 ~ 종료일을 선택하세요</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4" align="start">
                  {/* 퀵 버튼 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickSelect("thisWeek")}
                      className="text-xs bg-transparent"
                    >
                      이번 주
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickSelect("nextWeek")}
                      className="text-xs bg-transparent"
                    >
                      다음 주
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickSelect("next3days")}
                      className="text-xs bg-transparent"
                    >
                      다음 3일
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickSelect("weekend")}
                      className="text-xs bg-transparent"
                    >
                      주말만
                    </Button>
                  </div>

                  {/* 선택 상태 표시 */}
                  <div className="text-xs text-muted-foreground mb-3 text-center">
                    {selectingStart ? "시작일을 선택하세요" : "종료일을 선택하세요"}
                  </div>

                  {/* 2개월 뷰 캘린더 */}
                  <div className="flex gap-4">
                    <div className="relative">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute -left-2 top-0 h-6 w-6"
                        onClick={() =>
                          setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
                        }
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      {renderCalendarMonth(currentMonth)}
                    </div>
                    <div className="relative">
                      {renderCalendarMonth(nextMonthDate)}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute -right-2 top-0 h-6 w-6"
                        onClick={() =>
                          setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
                        }
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  시간대
                </Label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9-18">09:00 - 18:00</SelectItem>
                    <SelectItem value="10-22">10:00 - 22:00</SelectItem>
                    <SelectItem value="12-24">12:00 - 24:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">슬롯 단위</Label>
                <Select value={slotMinutes} onValueChange={setSlotMinutes}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30분</SelectItem>
                    <SelectItem value="60">60분</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">마감 시간</Label>
              <Input
                type="datetime-local"
                className="h-11"
                value={deadlineLocal}
                onChange={(e) => {
                  setDeadlineLocal(e.target.value)
                  setDeadlineTouched(true)
                }}
              />
              <p className="text-xs text-muted-foreground">입력 마감 이후에는 수정이 잠깁니다.</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">회의 길이</Label>
              <Select value={meetingMinutes} onValueChange={setMeetingMinutes}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30분</SelectItem>
                  <SelectItem value="60">60분</SelectItem>
                  <SelectItem value="90">90분</SelectItem>
                  <SelectItem value="120">2시간</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleCreate} className="flex-1 h-12 text-base font-semibold" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    생성 중...
                  </span>
                ) : (
                  "링크 만들기"
                )}
              </Button>
              <Button variant="outline" className="h-12 px-6 bg-transparent">
                샘플 보기
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 py-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center shrink-0">
                <Check className="w-6 h-6 text-accent" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold">링크 생성 완료!</h3>
                <p className="text-sm text-muted-foreground">팀원들에게 공유하세요</p>
              </div>
            </div>

            {/* 링크 복사 영역 */}
            <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
              <Link2 className="w-5 h-5 text-muted-foreground shrink-0" />
              <span className="text-sm font-mono truncate flex-1">{pollLink}</span>
              <Button size="sm" variant="ghost" onClick={handleCopy} className="shrink-0">
                {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            {/* 토스트 스타일 복사 확인 */}
            {copied && (
              <div className="text-sm text-accent text-center font-medium animate-in fade-in slide-in-from-bottom-2">
                링크 복사됨!
              </div>
            )}

            {/* 공유 버튼들 */}
            <div className="grid grid-cols-3 gap-2">
              <Button onClick={handleCopy} variant="outline" className="h-11 bg-transparent">
                <Copy className="w-4 h-4 mr-2" />
                복사
              </Button>
              <Button onClick={handleKakaoShare} className="h-11 bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#391B1B]">
                <MessageCircle className="w-4 h-4 mr-2" />
                카톡
              </Button>
              <Button onClick={() => setShowQR(!showQR)} variant="outline" className="h-11 bg-transparent">
                <QrCode className="w-4 h-4 mr-2" />
                QR
              </Button>
            </div>

            {/* QR 코드 (토글) */}
            {showQR && (
              <div className="flex justify-center p-4 bg-white rounded-lg">
                <div className="w-32 h-32 bg-foreground/10 rounded flex items-center justify-center text-xs text-muted-foreground">
                  [QR Code]
                </div>
              </div>
            )}

            {/* 내 시간 입력하기 CTA */}
            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground text-center mb-3">
                팀원에게 던지고, 본인도 가능 시간 체크하러 가요
              </p>
              <Button className="w-full h-11" variant="secondary" onClick={() => router.push(`/poll/${pollId}`)}>
                내 시간 입력하기
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <Button variant="ghost" onClick={handleReset} className="w-full text-muted-foreground">
              새 일정 투표 만들기
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
