import { JoinPollCard } from "@/components/join-poll-card"

export default function JoinPage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-amber-50 via-background to-white dark:from-[#1f1b14] dark:via-background dark:to-[#111]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 right-[-120px] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.18),transparent_60%)]" />
        <div className="absolute bottom-[-120px] left-[-80px] h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.12),transparent_60%)]" />
      </div>

      <div className="container relative mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-full max-w-xl space-y-6">
          <div className="space-y-2 text-center">
            <p className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              링크/코드로 바로 참여
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">투표 참여하기</h1>
            <p className="text-muted-foreground text-sm">
              받은 링크나 6자리 코드를 입력하면 바로 참여할 수 있어요.
            </p>
          </div>

          <JoinPollCard className="w-full" />
        </div>
      </div>
    </main>
  )
}
