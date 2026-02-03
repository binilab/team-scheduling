import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import { AppProviders } from "@/components/app-providers"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import "./globals.css"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ourstime.com"
const normalizedSiteUrl = siteUrl.replace(/\/$/, "")
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

// SEO 최적화된 메타데이터
export const metadata: Metadata = {
  title: {
    default: "우리시간 - 무료 팀플 시간표, 스케줄 조절 & 회의 시간 관리 서비스",
    template: "%s | 우리시간 - 스케줄 조절",
  },
  description:
    "대학생 팀플, 동아리, 스터디 모임을 위한 무료 스케줄 조절 서비스입니다. 복잡한 팀 시간 관리와 회의 시간 정하기를 우리시간으로 1분 만에 해결하세요. Free team scheduling tool for students - find the best meeting time in 1 minute. No signup required.",
  keywords: [
    // 한국어 키워드
    "팀플 시간",
    "스케줄 조절",
    "시간 관리",
    "팀플 시간표",
    "회의 시간 정하기",
    "일정 조율",
    "시간표 만들기",
    "대학생 조별과제",
    "팀플 일정",
    "동아리 시간",
    "스터디 모임",
    "무료 스케줄러",
    "온라인 일정 조율",
    "모임 시간 투표",
    "팀 협업 도구",
    "미팅 시간 찾기",
    "when2meet 대체",
    "when2meet 한국어",
    "시간 투표",
    "회의 일정",
    "팀플 약속",
    "그룹 일정",
    // 영어 키워드
    "team scheduling",
    "meeting scheduler",
    "poll scheduler",
    "when2meet alternative",
    "doodle alternative",
    "free meeting scheduler",
    "group availability finder",
    "team availability",
    "find meeting time",
    "schedule meeting online",
    "free scheduling tool",
    "meeting time poll",
    "availability poll",
    "team calendar",
    "group scheduling app",
    "best time to meet",
    "coordinate schedules",
    "meeting planner",
    "time slot voting",
    "collaborative scheduling",
  ],
  authors: [{ name: "OurTime Team", url: "https://ourstime.com" }],
  creator: "OurTime",
  publisher: "OurTime",
  applicationName: "우리시간 (OurTime)",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL(normalizedSiteUrl),
  alternates: {
    canonical: normalizedSiteUrl,
    languages: {
      "ko-KR": "/",
      "en-US": "/?lang=en",
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-64.png", sizes: "64x64", type: "image/png" },
      { url: "/favicon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: "en_US",
    url: normalizedSiteUrl,
    siteName: "우리시간 (OurTime)",
    title: "우리시간 - 가장 쉬운 팀플 시간표 & 스케줄 조절 서비스 | Free Meeting Scheduler",
    description:
      "로그인 없이 바로 시작하는 무료 팀 스케줄 조절. 대학생 팀플, 동아리, 스터디 모임 시간을 1분 만에 정리하세요. Free team scheduling - find the best meeting time without signup!",
    images: [
      {
        url: `${normalizedSiteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "우리시간 - 무료 팀플 시간 조절 및 스케줄 관리 서비스",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "우리시간 - Free Team Meeting Scheduler | 무료 팀플 시간표",
    description:
      "Find the best meeting time in 1 minute. 복잡한 팀 시간 관리와 회의 일정 조율, 링크 하나로 해결하세요. Free, no signup required.",
    images: [`${normalizedSiteUrl}/og-image.png`],
    creator: "@ourstime",
    site: "@ourstime",
  },
  verification: {
    google: googleSiteVerification || undefined,
    other: {
      "naver-site-verification": "naver32e1d9c52c1fa3855a10721e245e6de2",
    },
  },
  appleWebApp: {
    capable: true,
    title: "우리시간",
    statusBarStyle: "black-translucent",
  },
  category: "productivity",
}

// 뷰포트 설정 분리 (Next.js 14+ 권장)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* 구조화된 데이터 (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "우리시간 (OurTime)",
                alternateName: ["OurTime", "우리시간", "팀플 시간 조율", "Free Meeting Scheduler"],
                description:
                  "Free team scheduling tool for students, clubs, and study groups. Find the best meeting time in 1 minute without signup. 대학생 팀플, 동아리, 스터디 모임을 위한 무료 스케줄 조절 서비스.",
                url: normalizedSiteUrl,
                applicationCategory: "ProductivityApplication",
                applicationSubCategory: "SchedulingApplication",
                operatingSystem: "All",
                browserRequirements: "Requires JavaScript. Requires HTML5.",
                inLanguage: ["ko", "en"],
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "KRW",
                  availability: "https://schema.org/InStock",
                },
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: "4.8",
                  ratingCount: "1024",
                  bestRating: "5",
                  worstRating: "1",
                },
                featureList: [
                  "무료 사용 (Free to use)",
                  "회원가입 불필요 (No signup required)",
                  "실시간 결과 확인 (Real-time results)",
                  "모바일 최적화 (Mobile optimized)",
                  "카카오톡 공유 (KakaoTalk sharing)",
                  "QR코드 지원 (QR code support)",
                  "팀 시간표 자동 생성 (Auto schedule generation)",
                  "회의 시간 투표 (Meeting time voting)",
                  "일정 조율 자동화 (Automated scheduling)",
                ],
                keywords: "team scheduling, meeting scheduler, when2meet alternative, 팀플 시간, 스케줄 조절, 시간 관리, free scheduling tool, group availability",
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "우리시간",
                alternateName: ["OurTime", "Free Meeting Scheduler"],
                url: normalizedSiteUrl,
                logo: `${normalizedSiteUrl}/icon-512.png`,
                description: "Free team scheduling service for meetings and group events. 팀플과 모임을 위한 무료 시간 조율 서비스.",
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "Customer Support",
                  url: `${normalizedSiteUrl}/support`,
                },
              },
            ]),
          }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png" />
        <link rel="icon" type="image/png" sizes="64x64" href="/favicon-64.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96.png" />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <AppProviders>
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
          <Analytics />
        </AppProviders>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-MCGP0FSM5L"
          strategy="afterInteractive"
        />
        <Script id="google-tag" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-MCGP0FSM5L');`}
        </Script>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6460615081786537"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  )
}
