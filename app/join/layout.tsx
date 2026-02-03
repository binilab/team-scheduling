import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "투표 참여하기 | 우리시간",
  description:
    "초대 링크나 6자리 코드로 바로 참여하세요. Join a poll with an invite link or 6-digit code.",
}

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return children
}
