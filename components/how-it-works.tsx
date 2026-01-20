"use client"

import { Link2, MousePointer2, Trophy, ArrowRight } from "lucide-react"
import { useAppSettings } from "@/components/app-providers"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HowItWorks() {
  const { language } = useAppSettings()
  const isEn = language === "en"
  
  const steps = isEn
    ? [
        {
          icon: Link2,
          step: "01",
          title: "Share the link",
          description: "Send the invite link or 6-digit code to your team.",
        },
        {
          icon: MousePointer2,
          step: "02",
          title: "Mark availability",
          description: "Drag to paint time blocks. Drag again to erase.",
        },
        {
          icon: Trophy,
          step: "03",
          title: "Get best times",
          description: "We suggest the top 3 overlapping slots automatically.",
        },
      ]
    : [
        {
          icon: Link2,
          step: "01",
          title: "링크 공유",
          description: "초대 링크 또는 6자리 코드를 팀원들에게 공유해요.",
        },
        {
          icon: MousePointer2,
          step: "02",
          title: "시간 체크",
          description: "가능한 시간대를 드래그로 칠하고, 다시 드래그하면 지워요.",
        },
        {
          icon: Trophy,
          step: "03",
          title: "베스트 추천",
          description: "겹치는 시간 중 상위 3개를 자동으로 추천해요.",
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
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
