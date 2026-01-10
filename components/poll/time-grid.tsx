"use client"

import { useState, useRef, useEffect, Fragment } from "react"
import { addDays, format, isSameDay, parseISO, startOfDay, addMinutes } from "date-fns"
import { ko } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Loader2, Save } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface TimeGridProps {
  poll: {
    id: string
    start_date: string
    end_date: string
    start_time: string
    end_time: string
  }
  participantId: string
}

export function TimeGrid({ poll, participantId }: TimeGridProps) {
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set())
  const [isSaving, setIsSaving] = useState(false)
  const isDragging = useRef(false)
  const isAdding = useRef(true) // 드래그 시작 시 추가 모드인지 삭제 모드인지
  
  // 날짜 범위 계산
  const startDate = parseISO(poll.start_date)
  const endDate = parseISO(poll.end_date)
  const days = []
  let currDate = startDate
  while (currDate <= endDate) {
    days.push(currDate)
    currDate = addDays(currDate, 1)
  }

  // 시간 슬롯 생성 (30분 단위)
  const timeSlots: string[] = []
  const [startHour, startMin] = poll.start_time.split(':').map(Number)
  const [endHour, endMin] = poll.end_time.split(':').map(Number)
  
  let currentObj = new Date().setHours(startHour, startMin, 0, 0)
  const endObj = new Date().setHours(endHour, endMin, 0, 0) // 종료 시간보다 전까지만 (예: 22:00 종료면 21:30이 마지막 슬롯)

  while (currentObj < endObj) {
    const d = new Date(currentObj)
    const timeString = format(d, 'HH:mm')
    timeSlots.push(timeString)
    currentObj = d.setMinutes(d.getMinutes() + 30) // 30분씩 증가
  }

  // 데이터 불러오기 (이미 저장된 시간)
  useEffect(() => {
    async function fetchAvailability() {
      const { data } = await supabase
        .from('availabilities')
        .select('date, slots')
        .eq('poll_id', poll.id)
        .eq('participant_id', participantId)

      if (data) {
        const newSet = new Set<string>()
        data.forEach((row) => {
          row.slots.forEach((time: string) => {
            newSet.add(`${row.date}_${time}`)
          })
        })
        setSelectedSlots(newSet)
      }
    }
    fetchAvailability()
  }, [poll.id, participantId])

  // 슬롯 ID 생성 유틸
  const getSlotId = (date: Date, time: string) => {
    return `${format(date, 'yyyy-MM-dd')}_${time}`
  }

  // 드래그 핸들러
  const handleMouseDown = (slotId: string) => {
    isDragging.current = true
    const newSet = new Set(selectedSlots)
    
    if (newSet.has(slotId)) {
      newSet.delete(slotId)
      isAdding.current = false
    } else {
      newSet.add(slotId)
      isAdding.current = true
    }
    setSelectedSlots(newSet)
  }

  const handleMouseEnter = (slotId: string) => {
    if (!isDragging.current) return
    
    const newSet = new Set(selectedSlots)
    if (isAdding.current) {
      newSet.add(slotId)
    } else {
      newSet.delete(slotId)
    }
    setSelectedSlots(newSet)
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  // 저장 핸들러
  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      // 데이터를 DB에 저장하기 좋게 변환 (날짜별로 그룹화)
      const dataToSave: Record<string, string[]> = {}
      
      Array.from(selectedSlots).forEach(slotId => {
        const [dateStr, timeStr] = slotId.split('_')
        if (!dataToSave[dateStr]) {
          dataToSave[dateStr] = []
        }
        dataToSave[dateStr].push(timeStr)
      })

      // 1. 기존 데이터 삭제
      await supabase
        .from('availabilities')
        .delete()
        .eq('poll_id', poll.id)
        .eq('participant_id', participantId)

      // 2. 새 데이터 입력
      const insertPayload = Object.entries(dataToSave).map(([date, slots]) => ({
        poll_id: poll.id,
        participant_id: participantId,
        date: date,
        slots: slots
      }))

      if (insertPayload.length > 0) {
        const { error } = await supabase
          .from('availabilities')
          .insert(insertPayload)
        
        if (error) throw error
      }

      toast.success("시간이 저장되었습니다!")
    } catch (error) {
      console.error(error)
      toast.error("저장 실패")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4 select-none" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-background/95 backdrop-blur z-10 py-2">
        <div>
          <h3 className="font-semibold">가능한 시간 선택</h3>
          <p className="text-sm text-muted-foreground">드래그하여 시간을 칠해주세요.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          저장하기
        </Button>
      </div>

      <div className="overflow-x-auto border rounded-md shadow-sm">
        <div className="grid" style={{ gridTemplateColumns: `auto repeat(${days.length}, minmax(80px, 1fr))` }}>
          
          {/* 헤더: 날짜 */}
          <div className="p-2 bg-muted/50 border-b border-r sticky left-0 z-20"></div>
          {days.map((day) => (
            <div key={day.toISOString()} className="p-2 text-center bg-muted/50 border-b border-r min-w-[80px]">
              <div className="text-xs text-muted-foreground">{format(day, 'E', { locale: ko })}</div>
              <div className="font-bold">{format(day, 'M/d')}</div>
            </div>
          ))}

          {/* 바디: 시간 슬롯 */}
          {timeSlots.map((time) => (
            <Fragment key={time}>
              {/* 시간 라벨 (왼쪽 고정) */}
              <div className="py-1 px-2 text-xs text-right text-muted-foreground border-b border-r sticky left-0 bg-background z-10 h-8 flex items-center justify-end">
                {time}
              </div>

              {/* 그리드 셀 */}
              {days.map((day) => {
                const slotId = getSlotId(day, time)
                const isSelected = selectedSlots.has(slotId)
                
                return (
                  <div
                    key={slotId}
                    className={cn(
                      "border-b border-r h-8 cursor-pointer transition-colors relative",
                      isSelected ? "bg-primary/80" : "hover:bg-muted"
                    )}
                    onMouseDown={() => handleMouseDown(slotId)}
                    onMouseEnter={() => handleMouseEnter(slotId)}
                  />
                )
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}