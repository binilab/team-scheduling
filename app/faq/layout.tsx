import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "자주 묻는 질문 | 우리시간",
  description:
    "우리시간 서비스, 투표 생성, 참여 방법에 대한 질문을 모았습니다. FAQs about polls, sharing, and scheduling.",
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children
}
