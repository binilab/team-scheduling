import { CalendarClock, Timer, Crown } from "lucide-react"

const features = [
  {
    icon: CalendarClock,
    title: "수업시간 템플릿",
    description: "수업 시간대 자동 제외",
  },
  {
    icon: Timer,
    title: "회의 길이 기준 추천",
    description: "필요한 시간만큼 확보",
  },
  {
    icon: Crown,
    title: "필수 인원 가중치",
    description: "팀장/발표자 우선 반영",
  },
]

export function FeatureHighlights() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-foreground">🍯 팀플 꿀기능</h3>
      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <feature.icon className="w-4 h-4 text-accent" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-medium text-foreground">{feature.title}</h4>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
