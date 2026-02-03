"use client"

import Link from "next/link"
import { HowItWorks } from "@/components/how-it-works"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"
import { useAppSettings } from "@/components/app-providers"

export default function HomePage() {
  const { language } = useAppSettings()
  const isEn = language === "en"

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-background to-muted/30">
      {/* 배경 그라데이션 효과 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 right-[-120px] h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.16),transparent_60%)]" />
        <div className="absolute top-40 left-[-160px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.12),transparent_60%)]" />
        <div className="absolute bottom-10 right-[-120px] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.1),transparent_60%)]" />
      </div>

      <div className="container relative mx-auto px-4 py-10 lg:py-14">
        <div className="space-y-12 lg:space-y-16">
          <section className="space-y-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/70 bg-amber-100/60 px-3 py-1.5 text-sm font-medium text-amber-700">
              <Sparkles className="h-4 w-4" />
              {isEn ? "Start without signup" : "가입 없이 바로 시작"}
            </div>
            <h1 className="text-3xl lg:text-5xl font-semibold tracking-tight text-foreground text-balance">
              {isEn ? "Tired of finding a time?" : "시간 맞추기 귀찮을 땐"}
              <br />
              {isEn ? "Come here." : "여기로!"}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {isEn ? "From scheduling to sharing in one place." : "시간 조율부터 공유까지 한 번에."}
              <br />
              {isEn ? "Make your team schedule in minutes." : "우리 팀만의 시간표를 가장 빠르게 만들어요."}
            </p>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
              {isEn
                ? "OurTime is a free team scheduling tool for university projects, clubs, and study groups. Create a meeting time poll, share a link, and find the best overlapping time slots without signup."
                : "우리시간은 팀플·동아리·스터디를 위한 무료 일정 조율 서비스입니다. 회의 시간 투표를 만들고 링크를 공유하면 겹치는 시간을 자동으로 추천받을 수 있어요."}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild className="gap-2">
                <Link href="/create">
                  {isEn ? "Create poll" : "일정 만들기"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/join">{isEn ? "Join with code" : "코드로 참여하기"}</Link>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <Link href="/guide" className="hover:text-foreground">
                {isEn ? "Usage guide" : "사용 가이드"}
              </Link>
              <Link href="/faq" className="hover:text-foreground">
                {isEn ? "FAQ" : "자주 묻는 질문"}
              </Link>
              <Link href="/support" className="hover:text-foreground">
                {isEn ? "Support" : "문의하기"}
              </Link>
            </div>
          </section>

          <HowItWorks />
        </div>
      </div>
    </main>
  )
}
