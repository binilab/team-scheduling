import { HeroSection } from "@/components/hero-section"
import { HowItWorks } from "@/components/how-it-works"

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-background to-muted/30">
      {/* 배경 그라데이션 효과 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 right-[-120px] h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.16),transparent_60%)]" />
        <div className="absolute top-40 left-[-160px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.12),transparent_60%)]" />
        <div className="absolute bottom-10 right-[-120px] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.1),transparent_60%)]" />
      </div>

      <div className="container relative mx-auto px-4 py-8 lg:py-12">
        <div className="space-y-12 lg:space-y-16">
          {/* 히어로 섹션 */}
          <HeroSection />

          {/* 사용 방법 섹션 */}
          <HowItWorks />
        </div>
      </div>
    </main>
  )
}
