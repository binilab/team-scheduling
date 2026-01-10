import { HeroSection } from "@/components/hero-section"
import { HowItWorks } from "@/components/how-it-works"
import { LivePreview } from "@/components/live-preview"
import { JoinPollCard } from "@/components/join-poll-card"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Desktop: 2-column layout, Mobile: single column */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">
          {/* Left Column - Main Content */}
          <div className="space-y-8 lg:space-y-12">
            <HeroSection />
            <HowItWorks />
            <LivePreview />
          </div>

          {/* Right Column - Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start">
            <JoinPollCard />
          </aside>
        </div>
      </div>
    </main>
  )
}
