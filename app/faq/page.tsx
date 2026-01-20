"use client"

import { useAppSettings } from "@/components/app-providers"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ArrowRight, HelpCircle, MessageCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useMemo } from "react"

const faqCategories = {
  ko: [
    {
      category: "기본 사용법",
      items: [
        {
          q: "타임폴은 무료인가요?",
          a: "네, 타임폴은 완전 무료입니다. 광고도 없고, 숨겨진 비용도 없어요. 마음껏 사용하세요!",
        },
        {
          q: "회원가입이 필요한가요?",
          a: "아니요! 회원가입 없이 바로 사용할 수 있습니다. 투표 참여 시 이름만 입력하면 됩니다.",
        },
        {
          q: "투표는 어떻게 만드나요?",
          a: "홈 화면에서 날짜와 시간 범위를 선택하고 '링크 생성' 버튼을 누르면 끝! 제목은 입력하지 않아도 자동으로 생성됩니다.",
        },
        {
          q: "6자리 코드는 뭔가요?",
          a: "링크 대신 사용할 수 있는 간단한 숫자 코드예요. 전화 통화 중이거나 구두로 전달할 때 유용합니다. 홈 화면에서 코드를 입력하면 바로 참여할 수 있어요.",
        },
      ],
    },
    {
      category: "투표 참여",
      items: [
        {
          q: "시간은 어떻게 선택하나요?",
          a: "시간표에서 가능한 시간대를 드래그하면 선택됩니다. 이미 선택된 시간을 다시 드래그하면 선택이 해제돼요.",
        },
        {
          q: "선택한 시간을 수정할 수 있나요?",
          a: "네, 마감 전까지는 언제든 수정할 수 있습니다. 같은 이름으로 다시 접속하면 이전 선택이 유지돼요.",
        },
        {
          q: "리더와 멤버의 차이는 뭔가요?",
          a: "현재 역할은 표기용이며 결과는 모두 동일 가중치로 계산됩니다. 편한 이름과 역할로 참여하세요.",
        },
        {
          q: "최대 몇 명까지 참여할 수 있나요?",
          a: "인원 제한은 없습니다! 소규모 팀부터 대규모 동아리까지 자유롭게 사용하세요.",
        },
      ],
    },
    {
      category: "결과 확인",
      items: [
        {
          q: "결과는 어떻게 확인하나요?",
          a: "투표 페이지에서 '결과 보기' 버튼을 누르면 히트맵과 베스트 시간대를 확인할 수 있어요.",
        },
        {
          q: "결과는 어떻게 계산되나요?",
          a: "참여자들이 선택한 시간을 모두 취합해 겹치는 시간을 찾습니다. 모든 참여자는 동일하게 반영돼요.",
        },
        {
          q: "실시간으로 업데이트되나요?",
          a: "네! 새로운 참여자가 시간을 선택할 때마다 결과가 실시간으로 반영됩니다.",
        },
      ],
    },
    {
      category: "공유 & 기타",
      items: [
        {
          q: "카카오톡으로 공유할 수 있나요?",
          a: "네! 투표 생성 후 카카오톡 공유 버튼을 누르면 미리보기 카드와 함께 공유됩니다.",
        },
        {
          q: "QR코드는 어떻게 사용하나요?",
          a: "투표 생성 후 QR 버튼을 누르면 QR코드가 생성됩니다. 대면 모임에서 스캔해서 참여할 수 있어요.",
        },
        {
          q: "마감 시간은 어떻게 설정하나요?",
          a: "투표 생성 시 '마감 시간' 필드에서 설정할 수 있어요. 마감 후에는 시간 선택 수정이 불가능합니다.",
        },
        {
          q: "모바일에서도 잘 작동하나요?",
          a: "네, 모바일에 최적화되어 있어요. 터치로 시간대를 드래그하여 편리하게 선택할 수 있습니다.",
        },
      ],
    },
  ],
  en: [
    {
      category: "Getting Started",
      items: [
        {
          q: "Is TimePoll free?",
          a: "Yes, TimePoll is completely free. No ads, no hidden costs. Use it as much as you want!",
        },
        {
          q: "Do I need to sign up?",
          a: "No! You can use it right away without registration. Just enter your name when joining a poll.",
        },
        {
          q: "How do I create a poll?",
          a: "Select date and time range on the home screen and click 'Create link'. Title is auto-generated if left empty.",
        },
        {
          q: "What is the 6-digit code?",
          a: "A simple number code that can be used instead of a link. Useful for phone calls or verbal sharing. Enter the code on the home screen to join.",
        },
      ],
    },
    {
      category: "Participating",
      items: [
        {
          q: "How do I select times?",
          a: "Drag on the time grid to select available slots. Drag again on selected slots to deselect.",
        },
        {
          q: "Can I edit my selection?",
          a: "Yes, you can modify anytime before the deadline. Reconnect with the same name to keep your previous choices.",
        },
        {
          q: "What's the difference between Leader and Member?",
          a: "Roles are just labels for clarity. All participants are counted equally in results.",
        },
        {
          q: "How many people can participate?",
          a: "There's no limit! Use it for small teams or large groups freely.",
        },
      ],
    },
    {
      category: "Results",
      items: [
        {
          q: "How do I view results?",
          a: "Click 'View results' on the poll page to see the heatmap and best time slots.",
        },
        {
          q: "How are results calculated?",
          a: "We aggregate all selected times and find the best overlapping slots. Everyone counts the same.",
        },
        {
          q: "Are results updated in real-time?",
          a: "Yes! Results update instantly as new participants select their times.",
        },
      ],
    },
    {
      category: "Sharing & More",
      items: [
        {
          q: "Can I share via KakaoTalk?",
          a: "Yes! Click the KakaoTalk button after creating a poll to share with a preview card.",
        },
        {
          q: "How do I use QR codes?",
          a: "Click the QR button after creating a poll. Participants can scan to join instantly.",
        },
        {
          q: "How do I set a deadline?",
          a: "Set it in the 'Deadline' field when creating a poll. Modifications are locked after the deadline.",
        },
        {
          q: "Does it work on mobile?",
          a: "Yes, it's optimized for mobile. Touch-drag to select time slots easily.",
        },
      ],
    },
  ],
}

export default function FAQPage() {
  const { language } = useAppSettings()
  const isEn = language === "en"
  const categories = isEn ? faqCategories.en : faqCategories.ko
  const [search, setSearch] = useState("")

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories
    const term = search.toLowerCase()
    return categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.q.toLowerCase().includes(term) || item.a.toLowerCase().includes(term)
        ),
      }))
      .filter((cat) => cat.items.length > 0)
  }, [categories, search])

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        {/* 헤더 */}
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <HelpCircle className="h-4 w-4" />
            {isEn ? "Help Center" : "도움말 센터"}
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
            {isEn ? "Frequently Asked Questions" : "자주 묻는 질문"}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isEn
              ? "Find answers to common questions about TimePoll"
              : "타임폴에 대해 궁금한 점을 찾아보세요"}
          </p>
        </div>

        {/* 검색 */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isEn ? "Search questions..." : "질문 검색..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 rounded-xl"
            />
          </div>
        </div>

        {/* FAQ 리스트 */}
        <div className="max-w-3xl mx-auto space-y-8">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>{isEn ? "No results found" : "검색 결과가 없습니다"}</p>
            </div>
          ) : (
            filteredCategories.map((cat, catIdx) => (
              <div key={catIdx}>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  {cat.category}
                </h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {cat.items.map((item, idx) => (
                    <AccordionItem
                      key={idx}
                      value={`${catIdx}-${idx}`}
                      className="rounded-xl border bg-card px-4 data-[state=open]:bg-accent/30 data-[state=open]:border-primary/20"
                    >
                      <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-4">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground pb-4">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center space-y-4">
          <p className="text-muted-foreground">
            {isEn ? "Still have questions?" : "아직 궁금한 점이 있으신가요?"}
          </p>
          <Button size="lg" className="gap-2" asChild>
            <Link href="/create">
              {isEn ? "Try TimePoll Now" : "타임폴 바로 사용해보기"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
