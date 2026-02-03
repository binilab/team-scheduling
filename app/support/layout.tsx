import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "문의하기 | 우리시간",
  description:
    "버그 제보, 기능 요청, 계정/결제 문의를 남겨주세요. Contact support for help and feedback.",
}

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children
}
