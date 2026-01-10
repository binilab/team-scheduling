"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
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
  const [isLoading, setIsLoading] = useState(false)
  const [deadlineTouched, setDeadlineTouched] = useState(false)

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
    const deadline = new Date(dateRange.to)
    deadline.setHours(23, 59, 0, 0)
    const localValue = new Date(deadline.getTime() - deadline.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
    form.setValue("deadline", localValue)
  }, [dateRange, deadlineTouched, form])

  // 3. 제출 핸들러 (Supabase 저장)
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)

      const { data, error } = await supabase
        .from("polls")
        .insert([
          {
            title: values.title,
            start_date: values.dateRange.from.toISOString(), // Date -> ISO String 변환
            end_date: values.dateRange.to.toISOString(),
            duration: parseInt(values.duration),
            start_time: "09:00", // MVP라 고정 (나중에 입력 받기 가능)
            end_time: "22:00",
            deadline: values.deadline ? new Date(values.deadline).toISOString() : null,
          },
        ])
        .select()
        .single() // 생성된 방의 ID를 바로 받기 위해
      
      if (error && /deadline|column/i.test(error.message)) {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("polls")
          .insert([
            {
              title: values.title,
              start_date: values.dateRange.from.toISOString(),
              end_date: values.dateRange.to.toISOString(),
              duration: parseInt(values.duration),
              start_time: "09:00",
              end_time: "22:00",
            },
          ])
          .select()
          .single()
        if (fallbackError) throw fallbackError
        if (!fallbackData) throw new Error("방 생성에 실패했습니다.")
        toast.success("방이 생성되었습니다!")
        router.push(`/poll/${fallbackData.id}`)
        return
      }

      if (error) throw error

      toast.success("방이 생성되었습니다!")
      
      // 생성된 방 페이지로 이동 (아직 페이지는 안 만들었음)
      router.push(`/poll/${data.id}`)
      
    } catch (error) {
      console.error(error)
      toast.error("방 생성 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-lg mx-auto py-10 px-4">
      <div className="mb-4">
        <Button variant="ghost" onClick={() => router.back()}>
          ← 뒤로가기
        </Button>
      </div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">새로운 팀플 일정 만들기</h1>
        <p className="text-muted-foreground">
          팀원들이 가능한 시간을 입력할 수 있도록 방을 만들어보세요.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* 제목 입력 */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>팀플/회의 이름</FormLabel>
                <FormControl>
                  <Input placeholder="예: 캡스톤 디자인 1차 회의" {...field} />
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
                <FormLabel>날짜 범위</FormLabel>
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
                              {format(field.value.from, "yyyy-MM-dd")} ~{" "}
                              {format(field.value.to, "yyyy-MM-dd")}
                            </>
                          ) : (
                            format(field.value.from, "yyyy-MM-dd")
                          )
                        ) : (
                          <span>날짜를 선택하세요</span>
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
                <FormDescription>
                  팀원들이 선택할 날짜 범위를 지정해주세요.
                </FormDescription>
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
                <FormLabel>마감 시간</FormLabel>
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
                <FormDescription>마감 이후에는 시간 입력이 잠깁니다.</FormDescription>
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
                <FormLabel>예상 회의 시간</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="회의 시간 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="30">30분</SelectItem>
                    <SelectItem value="60">1시간</SelectItem>
                    <SelectItem value="90">1시간 30분</SelectItem>
                    <SelectItem value="120">2시간</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                   이 시간을 연속으로 확보할 수 있는 슬롯만 추천됩니다.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            방 만들기
          </Button>
        </form>
      </Form>
    </div>
  )
}
