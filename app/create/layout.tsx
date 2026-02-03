import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "투표 만들기 | 우리시간",
  description:
    "팀플·동아리·스터디 일정 조율을 위한 투표를 만들어보세요. Create a meeting time poll and share the link in minutes.",
}

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return children
}
