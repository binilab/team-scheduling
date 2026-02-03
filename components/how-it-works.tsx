"use client"

import { Sparkles, Share2, MousePointer2, CheckCircle2, ArrowRight } from "lucide-react"
import { useAppSettings } from "@/components/app-providers"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HowItWorks() {
  const { language } = useAppSettings()
  const isEn = language === "en"
  
  const steps = isEn
    ? [
        {
          icon: Sparkles,
          step: "01",
          title: "Create a poll",
          description: "Set the title, date range, and time slots.",
        },
        {
          icon: Share2,
          step: "02",
          title: "Share the link",
          description: "Send the invite link or 6-digit code to your team.",
        },
        {
          icon: MousePointer2,
          step: "03",
          title: "Select times",
          description: "Team members drag to mark availability.",
        },
        {
          icon: CheckCircle2,
          step: "04",
          title: "View results",
          description: "We suggest the top overlapping time slots.",
        },
      ]
    : [
        {
          icon: Sparkles,
          step: "01",
          title: "투표 만들기",
          description: "제목, 날짜 범위, 시간대를 설정해요.",
        },
        {
          icon: Share2,
          step: "02",
          title: "링크 공유하기",
          description: "초대 링크 또는 6자리 코드를 공유해요.",
        },
        {
          icon: MousePointer2,
          step: "03",
          title: "시간 선택하기",
          description: "팀원들이 가능한 시간을 드래그로 선택해요.",
        },
        {
          icon: CheckCircle2,
          step: "04",
          title: "결과 확인하기",
          description: "겹치는 시간 중 베스트를 추천해요.",
        },
      ]

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">
          {isEn ? "How it works" : "어떻게 쓰나요?"}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground gap-1 hover:text-amber-700 hover:bg-amber-50"
          asChild
        >
          <Link href="/guide">
            {isEn ? "View guide" : "자세히 보기"}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="group relative p-5 bg-card border border-border/50 rounded-xl hover:border-amber-300/80 hover:shadow-md transition-all"
          >
            {/* 스텝 번호 */}
            <div className="absolute -top-2 -left-2 w-7 h-7 rounded-lg bg-amber-500 text-white text-xs font-bold flex items-center justify-center shadow-sm">
              {step.step}
            </div>
            
            <div className="flex flex-col items-center text-center pt-2">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-3 group-hover:bg-amber-200 transition-colors">
                <step.icon className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
