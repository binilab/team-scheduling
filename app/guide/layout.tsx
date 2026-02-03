import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "사용 가이드 | 우리시간",
  description:
    "투표 만들기부터 공유, 결과 확인까지 한눈에 알아보는 우리시간 사용법. Learn how to create and share meeting time polls.",
}

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return children
}
