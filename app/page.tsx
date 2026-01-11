import { HeroSection } from "@/components/hero-section"
import { HowItWorks } from "@/components/how-it-works"

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-[-120px] h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(49,130,246,0.2),transparent_60%)]" />
        <div className="absolute top-40 left-[-160px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.18),transparent_60%)]" />
      </div>
      <div className="container relative mx-auto px-4 py-10 lg:py-14">
        <div className="space-y-8 lg:space-y-12">
          <HeroSection />
          <HowItWorks />
        </div>
      </div>
    </main>
  )
}
