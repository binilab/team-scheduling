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
  Loader2,
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
import { useAppSettings } from "@/components/app-providers"
import {
  formatDateTimeInput,
  formatMonthDay,
  getTimeZoneForLanguage,
  parseDateTimeInput,
  zonedTimeToUtc,
} from "@/lib/date-format"

const DAYS = ["일", "월", "화", "수", "목", "금", "토"]
const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
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
  const { language } = useAppSettings()
  const timeZone = getTimeZoneForLanguage(language)
  const formatDateLabel = (date: Date | null) => (date ? formatMonthDay(date, language, timeZone) : "")
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
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [qrLoading, setQrLoading] = useState(false)
  const [qrError, setQrError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("10-22")
  const [slotMinutes, setSlotMinutes] = useState("30")
  const [meetingMinutes, setMeetingMinutes] = useState("60")
  const [deadlineLocal, setDeadlineLocal] = useState("")
  const [deadlineTouched, setDeadlineTouched] = useState(false)

  const t =
    language === "en"
      ? {
          badge: "Start without signup",
          headlineTop: "Team schedules,",
          headlineHighlight: "done in 1 minute",
          headlineBottom: "",
          subcopy: "Share a link → everyone checks availability → best time is auto-picked.",
          subcopyLine2: "No more back-and-forth in chat.",
          titleLabel: "Schedule title",
          titleOptional: "(optional)",
          titlePlaceholderPrefix: 'Auto title if empty: "',
          dateLabel: "Date range",
          datePlaceholder: "Select start and end dates",
          dateDays: "days",
          quickThisWeek: "This week",
          quickNextWeek: "Next week",
          quickNext3: "Next 3 days",
          quickWeekend: "Weekend only",
          pickStart: "Select a start date",
          pickEnd: "Select an end date",
          timeRangeLabel: "Time range",
          slotLabel: "Slot size",
          deadlineLabel: "Deadline",
          deadlineHint: "Edits are locked after the deadline.",
          durationLabel: "Meeting length",
          create: "Create link",
          creating: "Creating...",
          createdTitle: "Link is ready!",
          createdDesc: "Share it with your team",
          copied: "Link copied!",
          copy: "Copy",
          kakao: "Kakao",
          qr: "QR",
          qrError: "Failed to generate QR code.",
          kakaoError: "Kakao share is not ready. Check the Kakao JS key.",
          ctaHint: "Share it and fill in your own availability too",
          cta: "Enter my availability",
          reset: "Create another poll",
          backToEdit: "Back to edit",
          weekCountSuffix: "days",
          dateError: "Please select a date range.",
          createSuccess: "Link created!",
          createError: "Failed to create the poll.",
        }
      : {
          badge: "가입 없이 바로 시작",
          headlineTop: "팀플 시간,",
          headlineHighlight: "1분이면",
          headlineBottom: "정리 끝",
          subcopy: "링크 공유 → 각자 가능한 시간 체크 → 자동으로 베스트 시간 추천.",
          subcopyLine2: "더 이상 카톡으로 시간 물어보지 마세요",
          titleLabel: "일정 제목",
          titleOptional: "(선택)",
          titlePlaceholderPrefix: '비워두면 "',
          dateLabel: "날짜 선택",
          datePlaceholder: "시작일 ~ 종료일을 선택하세요",
          dateDays: "일간",
          quickThisWeek: "이번 주",
          quickNextWeek: "다음 주",
          quickNext3: "다음 3일",
          quickWeekend: "주말만",
          pickStart: "시작일을 선택하세요",
          pickEnd: "종료일을 선택하세요",
          timeRangeLabel: "시간대",
          slotLabel: "슬롯 단위",
          deadlineLabel: "마감 시간",
          deadlineHint: "입력 마감 이후에는 수정이 잠깁니다.",
          durationLabel: "회의 길이",
          create: "링크 만들기",
          creating: "생성 중...",
          createdTitle: "링크 생성 완료!",
          createdDesc: "팀원들에게 공유하세요",
          copied: "링크 복사됨!",
          copy: "복사",
          kakao: "카톡",
          qr: "QR",
          qrError: "QR 생성에 실패했습니다.",
          kakaoError: "카카오 공유가 준비되지 않았습니다. Kakao JS 키를 확인해주세요.",
          ctaHint: "팀원에게 던지고, 본인도 가능 시간 체크하러 가요",
          cta: "내 시간 입력하기",
          reset: "새 일정 투표 만들기",
          backToEdit: "뒤로가기",
          weekCountSuffix: "일간",
          dateError: "날짜 범위를 선택해주세요.",
          createSuccess: "링크가 생성되었습니다!",
          createError: "방 생성 중 오류가 발생했습니다.",
        }

  useEffect(() => {
    if (!endDate || deadlineTouched) return
    const parts = {
      year: endDate.getFullYear(),
      month: endDate.getMonth() + 1,
      day: endDate.getDate(),
      hour: 23,
      minute: 59,
      second: 0,
    }
    const deadlineUtc = zonedTimeToUtc(parts, timeZone)
    setDeadlineLocal(formatDateTimeInput(deadlineUtc, timeZone))
  }, [endDate, deadlineTouched, timeZone])

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
      toast.error(t.dateError)
      return
    }

    try {
      setIsLoading(true)
      const title = pollTitle.trim() || getAutoTitle()
      const { startTime, endTime } = parseTimeRange(timeRange)
      const startDateUtc = zonedTimeToUtc(
        {
          year: startDate.getFullYear(),
          month: startDate.getMonth() + 1,
          day: startDate.getDate(),
          hour: 0,
          minute: 0,
          second: 0,
        },
        timeZone,
      )
      const endDateUtc = zonedTimeToUtc(
        {
          year: endDate.getFullYear(),
          month: endDate.getMonth() + 1,
          day: endDate.getDate(),
          hour: 0,
          minute: 0,
          second: 0,
        },
        timeZone,
      )
      const deadlineParts = deadlineLocal ? parseDateTimeInput(deadlineLocal) : null
      const deadlineUtc = deadlineParts ? zonedTimeToUtc(deadlineParts, timeZone) : null

      const payload = {
        title,
        start_date: startDateUtc.toISOString(),
        end_date: endDateUtc.toISOString(),
        duration: parseInt(meetingMinutes, 10),
        start_time: startTime,
        end_time: endTime,
        deadline: deadlineUtc ? deadlineUtc.toISOString() : null,
        timezone: timeZone,
      }

      let { data, error } = await supabase
        .from("polls")
        .insert([{ ...payload, slot_minutes: parseInt(slotMinutes, 10) }])
        .select()
        .single()

      if (error && /slot_minutes|deadline|timezone|column/i.test(error.message)) {
        const fallbackPayload = {
          ...payload,
        }
        delete (fallbackPayload as { deadline?: string | null }).deadline
        delete (fallbackPayload as { timezone?: string }).timezone
        ;({ data, error } = await supabase.from("polls").insert([fallbackPayload]).select().single())
      }

      if (error) throw error
      if (!data?.id) throw new Error("방 생성에 실패했습니다.")

      const link = `${window.location.origin}/poll/${data.id}`
      setPollId(data.id)
      setPollLink(link)
      localStorage.setItem(`poll:${data.id}:slotMinutes`, slotMinutes)
      setIsCreated(true)
      toast.success(t.createSuccess)
    } catch (error) {
      console.error(error)
      toast.error(t.createError)
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
    if (!pollLink) return
    const shareFallback = `https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(pollLink)}`
    const kakaoJsKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY
    if (!kakaoJsKey) {
      toast.error(t.kakaoError)
      window.open(shareFallback, "_blank")
      return
    }

    const Kakao = (window as typeof window & { Kakao?: any }).Kakao
    if (!Kakao) {
      toast.error(t.kakaoError)
      window.open(shareFallback, "_blank")
      return
    }

    if (!Kakao.isInitialized()) {
      Kakao.init(kakaoJsKey)
    }

    try {
      Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: language === "en" ? "Timepoll invite" : "타임폴 초대",
          description:
            language === "en"
              ? "Pick your availability and find the best time."
              : "가능한 시간을 선택하고 최적의 시간을 찾아요.",
          imageUrl: `${window.location.origin}/placeholder.jpg`,
          link: {
            mobileWebUrl: pollLink,
            webUrl: pollLink,
          },
        },
        buttons: [
          {
            title: language === "en" ? "Open poll" : "투표 열기",
            link: {
              mobileWebUrl: pollLink,
              webUrl: pollLink,
            },
          },
        ],
      })
    } catch (error) {
      console.error(error)
      toast.error(t.kakaoError)
      window.open(shareFallback, "_blank")
    }
  }

  const handleReset = () => {
    setIsCreated(false)
    setPollLink("")
    setPollTitle("")
    setPollId("")
    setShowQR(false)
    setDeadlineTouched(false)
  }

  useEffect(() => {
    if (!isCreated || typeof window === "undefined") return
    window.history.pushState({ stage: "created" }, "")
    const handlePopState = () => {
      handleReset()
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [isCreated])

  useEffect(() => {
    if (!showQR || !pollLink) return
    let active = true
    setQrLoading(true)
    setQrError(null)
    import("qrcode")
      .then(({ toDataURL }) =>
        toDataURL(pollLink, {
          width: 240,
          margin: 1,
          color: {
            dark: "#0f172a",
            light: "#ffffff",
          },
        }),
      )
      .then((url) => {
        if (!active) return
        setQrDataUrl(url)
      })
      .catch((error) => {
        console.error(error)
        if (!active) return
        setQrError(t.qrError)
      })
      .finally(() => {
        if (!active) return
        setQrLoading(false)
      })

    return () => {
      active = false
    }
  }, [showQR, pollLink])

  const getAutoTitle = () => {
    if (startDate) {
      return language === "en"
        ? `Team meeting (${startDate.getMonth() + 1}/${startDate.getDate()})`
        : `팀플 회의 (${startDate.getMonth() + 1}/${startDate.getDate()})`
    }
    return language === "en" ? "Team meeting schedule" : "팀플 회의 일정"
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
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[linear-gradient(120deg,rgba(49,130,246,0.16),rgba(56,189,248,0.12))] text-primary rounded-full text-sm font-medium border border-primary/10">
          <Sparkles className="w-4 h-4" />
          <span>{t.badge}</span>
        </div>
        <h1 className="text-4xl lg:text-6xl font-semibold tracking-tight text-foreground text-balance">
          {t.headlineTop}
          <br />
          <span className="text-primary">{t.headlineHighlight}</span> {t.headlineBottom}
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg">
          {t.subcopy}
          <br />
          {t.subcopyLine2}
        </p>
      </div>

      {/* Poll Creation Form */}
      <div className="bg-white/85 border border-white/70 rounded-3xl p-6 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur dark:bg-slate-900/80 dark:border-slate-700/60">
        {!isCreated ? (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="poll-title" className="text-sm font-medium">
                {t.titleLabel} <span className="text-muted-foreground font-normal">{t.titleOptional}</span>
              </Label>
              <Input
                id="poll-title"
                placeholder={`${t.titlePlaceholderPrefix}${getAutoTitle()}"`}
                className="h-11"
                value={pollTitle}
                onChange={(e) => setPollTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {t.dateLabel}
              </Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-11 justify-start text-left font-normal bg-transparent">
                    {startDate && endDate ? (
                      <span>
                        {formatDateLabel(startDate)} ~ {formatDateLabel(endDate)}
                        <span className="text-muted-foreground ml-2">
                          ({Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1}
                          {t.weekCountSuffix})
                        </span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground">{t.datePlaceholder}</span>
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
                      {t.quickThisWeek}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickSelect("nextWeek")}
                      className="text-xs bg-transparent"
                    >
                      {t.quickNextWeek}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickSelect("next3days")}
                      className="text-xs bg-transparent"
                    >
                      {t.quickNext3}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickSelect("weekend")}
                      className="text-xs bg-transparent"
                    >
                      {t.quickWeekend}
                    </Button>
                  </div>

                  {/* 선택 상태 표시 */}
                  <div className="text-xs text-muted-foreground mb-3 text-center">
                    {selectingStart ? t.pickStart : t.pickEnd}
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
                  {t.timeRangeLabel}
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
                <Label className="text-sm font-medium">{t.slotLabel}</Label>
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
              <Label className="text-sm font-medium">{t.deadlineLabel}</Label>
              <Input
                type="datetime-local"
                className="h-11"
                value={deadlineLocal}
                onChange={(e) => {
                  setDeadlineLocal(e.target.value)
                  setDeadlineTouched(true)
                }}
              />
              <p className="text-xs text-muted-foreground">{t.deadlineHint}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">{t.durationLabel}</Label>
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
                    {t.creating}
                  </span>
                ) : (
                  t.create
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 py-2">
            <Button variant="ghost" onClick={handleReset} className="w-fit px-0 text-muted-foreground">
              ← {t.backToEdit}
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center shrink-0">
                <Check className="w-6 h-6 text-accent" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold">{t.createdTitle}</h3>
                <p className="text-sm text-muted-foreground">{t.createdDesc}</p>
              </div>
            </div>

            {/* 링크 복사 영역 */}
            <div className="flex items-center gap-2 p-3 bg-white/70 border border-white/70 rounded-xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] dark:bg-slate-900/70 dark:border-slate-700/60">
              <Link2 className="w-5 h-5 text-muted-foreground shrink-0" />
              <span className="text-sm font-mono truncate flex-1">{pollLink}</span>
              <Button size="sm" variant="ghost" onClick={handleCopy} className="shrink-0">
                {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            {/* 토스트 스타일 복사 확인 */}
            {copied && (
              <div className="text-sm text-accent text-center font-medium animate-in fade-in slide-in-from-bottom-2">
                {t.copied}
              </div>
            )}

            {/* 공유 버튼들 */}
            <div className="grid grid-cols-3 gap-2">
              <Button onClick={handleCopy} variant="outline" className="h-11 bg-transparent">
                <Copy className="w-4 h-4 mr-2" />
                {t.copy}
              </Button>
              <Button onClick={handleKakaoShare} className="h-11 bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#391B1B]">
                <MessageCircle className="w-4 h-4 mr-2" />
                {t.kakao}
              </Button>
              <Button
                onClick={() => setShowQR(!showQR)}
                variant="outline"
                className="h-11 bg-white/70 dark:bg-slate-900/60"
                aria-expanded={showQR}
              >
                <QrCode className="w-4 h-4 mr-2" />
                {t.qr}
              </Button>
            </div>

            {/* QR 코드 (토글) */}
            {showQR && (
              <div className="flex justify-center p-4 bg-white/80 border border-white/70 rounded-xl dark:bg-slate-900/70 dark:border-slate-700/60">
                {qrLoading ? (
                  <div className="h-40 w-40 flex items-center justify-center text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : qrError ? (
                  <div className="text-xs text-destructive">{qrError}</div>
                ) : (
                  qrDataUrl && (
                    <img
                      src={qrDataUrl}
                      alt="QR code"
                      className="h-40 w-40 rounded-lg border border-white/80"
                    />
                  )
                )}
              </div>
            )}

            {/* 내 시간 입력하기 CTA */}
            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground text-center mb-3">{t.ctaHint}</p>
              <Button className="w-full h-11" variant="secondary" onClick={() => router.push(`/poll/${pollId}`)}>
                {t.cta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <Button variant="ghost" onClick={handleReset} className="w-full text-muted-foreground">
              {t.reset}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
