"use client"

import { useAppSettings } from "@/components/app-providers"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Copy,
  MousePointer2,
  QrCode,
  Share2,
  Sparkles,
  Users,
  Zap,
} from "lucide-react"

const steps = {
  ko: [
    {
      number: "01",
      icon: Sparkles,
      title: "투표 만들기",
      description: "제목, 날짜 범위, 시간대를 설정하고 투표를 생성하세요.",
      details: [
        "투표 제목 입력 (선택사항 - 비워두면 자동 생성)",
        "날짜 범위 선택 (달력에서 시작일~종료일)",
        "시간대 설정 (예: 오전 10시 ~ 오후 10시)",
        "회의 시간 단위 선택 (30분/1시간 등)",
      ],
    },
    {
      number: "02",
      icon: Share2,
      title: "링크 공유하기",
      description: "생성된 링크나 6자리 코드를 팀원들에게 공유하세요.",
      details: [
        "링크 복사 버튼으로 간편하게 복사",
        "카카오톡으로 바로 공유 가능",
        "QR코드로 오프라인에서도 공유",
        "6자리 숫자 코드로 구두 전달",
      ],
    },
    {
      number: "03",
      icon: MousePointer2,
      title: "시간 선택하기",
      description: "팀원들이 각자 가능한 시간대를 드래그로 선택합니다.",
      details: [
        "이름 입력 후 참여 (역할 선택은 선택사항)",
        "드래그로 가능한 시간 블록 선택",
        "다시 드래그하면 선택 해제",
        "마감 전까지 언제든 수정 가능",
      ],
    },
    {
      number: "04",
      icon: CheckCircle2,
      title: "결과 확인하기",
      description: "가장 많이 겹치는 최적의 시간을 자동으로 확인하세요.",
      details: [
        "히트맵으로 겹치는 시간 시각화",
        "베스트 3 시간대 자동 추천",
        "모든 참여자는 동일하게 집계",
        "실시간으로 결과 업데이트",
      ],
    },
  ],
  en: [
    {
      number: "01",
      icon: Sparkles,
      title: "Create a Poll",
      description: "Set up title, date range, and time slots to create your poll.",
      details: [
        "Enter poll title (optional - auto-generated if empty)",
        "Select date range (start to end date on calendar)",
        "Set time range (e.g., 10 AM ~ 10 PM)",
        "Choose time slot unit (30min/1hr etc.)",
      ],
    },
    {
      number: "02",
      icon: Share2,
      title: "Share the Link",
      description: "Share the generated link or 6-digit code with your team.",
      details: [
        "Copy link with one click",
        "Share directly via KakaoTalk",
        "QR code for offline sharing",
        "6-digit code for verbal sharing",
      ],
    },
    {
      number: "03",
      icon: MousePointer2,
      title: "Select Times",
      description: "Team members drag to select their available time slots.",
      details: [
        "Join with your name (role is optional)",
        "Drag to select available time blocks",
        "Drag again to deselect",
        "Modify anytime before deadline",
      ],
    },
    {
      number: "04",
      icon: CheckCircle2,
      title: "View Results",
      description: "Automatically find the best overlapping times.",
      details: [
        "Heatmap visualization of overlaps",
        "Auto-recommended top 3 time slots",
        "Everyone is counted equally",
        "Real-time result updates",
      ],
    },
  ],
}

const tips = {
  ko: [
    { icon: Clock, text: "마감 시간을 설정하면 그 이후에는 수정이 불가능해요" },
    { icon: Users, text: "역할은 표기용이며 결과 계산은 모두 동일하게 반영돼요" },
    { icon: Copy, text: "6자리 코드는 홈 화면에서 바로 입력할 수 있어요" },
    { icon: QrCode, text: "QR코드는 대면 모임에서 빠르게 공유할 때 유용해요" },
  ],
  en: [
    { icon: Clock, text: "After the deadline, modifications are locked" },
    { icon: Users, text: "Roles are just labels — everyone counts the same" },
    { icon: Copy, text: "6-digit code can be entered on the home screen" },
    { icon: QrCode, text: "QR code is useful for quick sharing in person" },
  ],
}

export default function GuidePage() {
  const { language } = useAppSettings()
  const isEn = language === "en"
  const stepList = isEn ? steps.en : steps.ko
  const tipList = isEn ? tips.en : tips.ko

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        {/* 헤더 */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Zap className="h-4 w-4" />
            {isEn ? "Quick Start Guide" : "빠른 시작 가이드"}
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
            {isEn ? "How to Use OurTime" : "우리의시간 사용법"}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isEn
              ? "Create a team schedule in just 4 simple steps. No signup required!"
              : "4단계로 팀 일정을 쉽게 조율하세요. 회원가입 없이 바로 시작!"}
          </p>
        </div>

        {/* 스텝 카드들 */}
        <div className="grid gap-6 lg:gap-8 max-w-4xl mx-auto">
          {stepList.map((step, idx) => (
            <div
              key={step.number}
              className="relative group"
            >
              {/* 연결선 */}
              {idx < stepList.length - 1 && (
                <div className="absolute left-8 top-full h-6 lg:h-8 w-px bg-gradient-to-b from-primary/40 to-transparent hidden sm:block" />
              )}
              
              <div className="flex gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                {/* 번호 뱃지 */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
                    <step.icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                </div>

                {/* 내용 */}
                <div className="flex-1 space-y-3">
                  <div>
                    <span className="text-xs font-bold text-primary/60 tracking-wider">
                      STEP {step.number}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold mt-1">{step.title}</h2>
                    <p className="text-muted-foreground text-sm mt-1">{step.description}</p>
                  </div>
                  
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 팁 섹션 */}
        <div className="mt-12 lg:mt-16 max-w-4xl mx-auto">
          <h2 className="text-xl font-bold mb-6 text-center">
            💡 {isEn ? "Pro Tips" : "알아두면 좋은 팁"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {tipList.map((tip, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30"
              >
                <tip.icon className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <span className="text-sm text-amber-900 dark:text-amber-100">{tip.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button size="lg" className="gap-2" asChild>
            <Link href="/create">
              {isEn ? "Create Poll Now" : "지금 투표 만들기"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
