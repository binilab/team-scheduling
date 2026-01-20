"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
// 1단계에서 만든 supabase 클라이언트 import
import { supabase } from "@/lib/supabase"
// Sonner toast 사용 (package.json에 sonner가 있어서 변경)
import { toast } from "sonner" 
import { useAppSettings } from "@/components/app-providers"
import {
  formatDateTimeInput,
  formatYearMonthDay,
  getTimeZoneForLanguage,
  parseDateTimeInput,
  zonedTimeToUtc,
} from "@/lib/date-format"

// 1. 입력 폼 유효성 검사 규칙 (Zod)
const formSchema = z.object({
  title: z.string().min(2, {
    message: "팀플 이름은 최소 2글자 이상이어야 합니다.",
  }),
  dateRange: z.object({
    from: z.date({ required_error: "시작 날짜를 선택해주세요." }),
    to: z.date({ required_error: "종료 날짜를 선택해주세요." }),
  }),
  duration: z.string(),
  deadline: z.string().optional(),
})

export default function CreatePollPage() {
  const router = useRouter()
  const { language } = useAppSettings()
  const timeZone = getTimeZoneForLanguage(language)
  const [isLoading, setIsLoading] = useState(false)
  const [deadlineTouched, setDeadlineTouched] = useState(false)

  const t =
    language === "en"
      ? {
          back: "Back",
          title: "Create a new poll",
          subtitle: "Create a room so teammates can enter their availability.",
          nameLabel: "Team/project name",
          namePlaceholder: "e.g. Capstone meeting #1",
          dateLabel: "Date range",
          dateHint: "Set the range your team can choose from.",
          deadlineLabel: "Deadline",
          deadlineHint: "Edits are locked after the deadline.",
          durationLabel: "Meeting length",
          durationHint: "Only continuous slots of this length are recommended.",
          create: "Create room",
          creating: "Creating...",
          dateRequired: "Please select a start and end date.",
          createSuccess: "Room created!",
          createError: "Failed to create the room.",
        }
      : {
          back: "뒤로가기",
          title: "새로운 팀플 일정 만들기",
          subtitle: "팀원들이 가능한 시간을 입력할 수 있도록 방을 만들어보세요.",
          nameLabel: "팀플/회의 이름",
          namePlaceholder: "예: 캡스톤 디자인 1차 회의",
          dateLabel: "날짜 범위",
          dateHint: "팀원들이 선택할 날짜 범위를 지정해주세요.",
          deadlineLabel: "마감 시간",
          deadlineHint: "마감 이후에는 시간 입력이 잠깁니다.",
          durationLabel: "예상 회의 시간",
          durationHint: "이 시간을 연속으로 확보할 수 있는 슬롯만 추천됩니다.",
          create: "방 만들기",
          creating: "생성 중...",
          dateRequired: "시작 날짜를 선택해주세요.",
          createSuccess: "방이 생성되었습니다!",
          createError: "방 생성 중 오류가 발생했습니다.",
        }

  // 2. 폼 초기화
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      duration: "60", // 기본 60분
      deadline: "",
    },
  })

  const dateRange = useWatch({ control: form.control, name: "dateRange" })

  useEffect(() => {
    if (!dateRange?.to || deadlineTouched) return
    const parts = {
      year: dateRange.to.getFullYear(),
      month: dateRange.to.getMonth() + 1,
      day: dateRange.to.getDate(),
      hour: 23,
      minute: 59,
      second: 0,
    }
    const deadlineUtc = zonedTimeToUtc(parts, timeZone)
    form.setValue("deadline", formatDateTimeInput(deadlineUtc, timeZone))
  }, [dateRange, deadlineTouched, form, timeZone])

  // 3. 제출 핸들러 (Supabase 저장)
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)

      const startDateUtc = zonedTimeToUtc(
        {
          year: values.dateRange.from.getFullYear(),
          month: values.dateRange.from.getMonth() + 1,
          day: values.dateRange.from.getDate(),
          hour: 0,
          minute: 0,
          second: 0,
        },
        timeZone,
      )
      const endDateUtc = zonedTimeToUtc(
        {
          year: values.dateRange.to.getFullYear(),
          month: values.dateRange.to.getMonth() + 1,
          day: values.dateRange.to.getDate(),
          hour: 0,
          minute: 0,
          second: 0,
        },
        timeZone,
      )
      const deadlineParts = values.deadline ? parseDateTimeInput(values.deadline) : null
      const deadlineUtc = deadlineParts ? zonedTimeToUtc(deadlineParts, timeZone) : null

      const { data, error } = await supabase
        .from("polls")
        .insert([
          {
            title: values.title,
            start_date: startDateUtc.toISOString(), // Date -> ISO String 변환
            end_date: endDateUtc.toISOString(),
            duration: parseInt(values.duration),
            start_time: "00:00", // 하루 전체 선택 가능
            end_time: "24:00",
            slot_minutes: 30,
            deadline: deadlineUtc ? deadlineUtc.toISOString() : null,
            timezone: timeZone,
          },
        ])
        .select()
        .single() // 생성된 방의 ID를 바로 받기 위해
      
      if (error && /deadline|timezone|column/i.test(error.message)) {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("polls")
          .insert([
            {
              title: values.title,
              start_date: startDateUtc.toISOString(),
              end_date: endDateUtc.toISOString(),
              duration: parseInt(values.duration),
              start_time: "00:00",
              end_time: "24:00",
              slot_minutes: 30,
            },
          ])
          .select()
          .single()
        if (fallbackError) throw fallbackError
        if (!fallbackData) throw new Error("방 생성에 실패했습니다.")
        toast.success(t.createSuccess)
        router.push(`/poll/${fallbackData.id}`)
        return
      }

      if (error) throw error

        toast.success(t.createSuccess)
      
      // 생성된 방 페이지로 이동 (아직 페이지는 안 만들었음)
      router.push(`/poll/${data.id}`)
      
    } catch (error) {
      console.error(error)
      toast.error(t.createError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-lg mx-auto py-10 px-4">
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => {
            if (typeof window !== "undefined" && window.history.length > 1) {
              router.back()
            } else {
              router.push("/")
            }
          }}
        >
          ← {t.back}
        </Button>
      </div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* 제목 입력 */}
          <FormField
            control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.nameLabel}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.namePlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          {/* 날짜 범위 선택 */}
          <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t.dateLabel}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value?.from ? (
                          field.value.to ? (
                            <>
                              {formatYearMonthDay(field.value.from, language)} ~{" "}
                              {formatYearMonthDay(field.value.to, language)}
                            </>
                          ) : (
                            formatYearMonthDay(field.value.from, language)
                          )
                        ) : (
                          <span>{t.dateRequired}</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0)) // 오늘 이전 날짜 비활성화
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>{t.dateHint}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 마감 시간 */}
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.deadlineLabel}</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                      setDeadlineTouched(true)
                    }}
                  />
                </FormControl>
                <FormDescription>{t.deadlineHint}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 회의 시간 선택 */}
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.durationLabel}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={language === "en" ? "Select duration" : "회의 시간 선택"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="30">30분</SelectItem>
                    <SelectItem value="60">1시간</SelectItem>
                    <SelectItem value="90">1시간 30분</SelectItem>
                    <SelectItem value="120">2시간</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>{t.durationHint}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? t.creating : t.create}
          </Button>
        </form>
      </Form>
    </div>
  )
}
