"use client"

import Link from "next/link"
import { useAppSettings } from "@/components/app-providers"
import { Clock } from "lucide-react"

const footerLinks = {
  ko: {
    product: {
      title: "서비스",
      links: [
        { label: "투표 만들기", href: "/create" },
        { label: "투표 참여하기", href: "/join" },
        { label: "사용 가이드", href: "/guide" },
        { label: "문의하기", href: "/support" },
      ],
    },
    support: {
      title: "지원",
      links: [
        { label: "자주 묻는 질문", href: "/faq" },
        { label: "문의하기", href: "/support" },
      ],
    },
  },
  en: {
    product: {
      title: "Product",
      links: [
        { label: "Create Poll", href: "/create" },
        { label: "Join Poll", href: "/join" },
        { label: "User Guide", href: "/guide" },
        { label: "Support", href: "/support" },
      ],
    },
    support: {
      title: "Support",
      links: [
        { label: "FAQ", href: "/faq" },
        { label: "Contact", href: "/support" },
      ],
    },
  },
}

const features = {
  ko: ["무료", "회원가입 불필요", "실시간", "모바일 최적화"],
  en: ["Free", "No signup", "Real-time", "Mobile-friendly"],
}

export function SiteFooter() {
  const { language } = useAppSettings()
  const isEn = language === "en"
  const links = isEn ? footerLinks.en : footerLinks.ko
  const featureList = isEn ? features.en : features.ko

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
          {/* 브랜드 */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-md">
                <Clock className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <span className="text-lg font-bold">{isEn ? "OurTime" : "우리의시간"}</span>
                <p className="text-xs text-muted-foreground">
                  {isEn ? "Plan faster, meet smarter" : "더 빠르게 모이고, 똑똑하게 시간 맞추기"}
                </p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              {isEn
                ? "The simplest way to collect availability and pick the best meeting time."
                : "팀원들의 가능한 시간을 모아 최적의 미팅 시간을 쉽게 찾으세요."}
            </p>
            <div className="flex flex-wrap gap-2">
              {featureList.map((feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* 링크 */}
          <div className="grid grid-cols-2 gap-6">
            {Object.values(links).map((section) => (
              <div key={section.title} className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} OurTime. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
