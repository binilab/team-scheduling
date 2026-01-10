"use client"

import { Link2, MousePointer2, Trophy } from "lucide-react"
import { useAppSettings } from "@/components/app-providers"

export function HowItWorks() {
  const { language } = useAppSettings()
  const steps =
    language === "en"
      ? [
          {
            icon: Link2,
            step: "Step 1",
            title: "Share the link",
            description: "Send the poll link to your team",
          },
          {
            icon: MousePointer2,
            step: "Step 2",
            title: "Mark availability",
            description: "Drag to select your available times",
          },
          {
            icon: Trophy,
            step: "Step 3",
            title: "Best picks",
            description: "Top 3 time slots are suggested automatically",
          },
        ]
      : [
          {
            icon: Link2,
            step: "Step 1",
            title: "링크 공유",
            description: "폴 링크를 팀원들에게 던져요",
          },
          {
            icon: MousePointer2,
            step: "Step 2",
            title: "시간 체크",
            description: "각자 가능한 시간 드래그로 선택",
          },
          {
            icon: Trophy,
            step: "Step 3",
            title: "베스트 추천",
            description: "자동으로 최적 시간 3개 추천",
          },
        ]

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        {language === "en" ? "How it works" : "어떻게 쓰나요?"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="relative p-5 bg-white/80 border border-white/70 rounded-2xl shadow-[0_18px_40px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all dark:bg-slate-900/75 dark:border-slate-700/60"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[linear-gradient(140deg,rgba(49,130,246,0.2),rgba(56,189,248,0.15))] flex items-center justify-center shrink-0">
                <step.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">{step.step}</span>
                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
