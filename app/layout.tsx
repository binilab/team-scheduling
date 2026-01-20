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
    default: "타임폴 - 팀플 시간, 1분이면 정리 끝 | 무료 일정 조율 서비스",
    template: "%s | 타임폴",
  },
  description:
    "대학생 팀플, 동아리, 스터디를 위한 무료 시간 조율 서비스. 회원가입 없이 링크 공유만으로 팀원들의 가능한 시간을 쉽게 모으고 최적의 미팅 시간을 찾아보세요.",
  keywords: [
    "팀플",
    "시간 조율",
    "일정 조율",
    "스터디 모임",
    "동아리",
    "회의 시간",
    "when2meet",
    "투표",
    "무료",
    "대학생",
    "team scheduling",
    "meeting scheduler",
  ],
  authors: [{ name: "TimePoll Team" }],
  creator: "TimePoll",
  publisher: "TimePoll",
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
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: "en_US",
    url: normalizedSiteUrl,
    siteName: "타임폴",
    title: "타임폴 - 팀플 시간, 1분이면 정리 끝",
    description:
      "대학생 팀플, 동아리, 스터디를 위한 무료 시간 조율 서비스. 회원가입 없이 링크만 공유하면 끝!",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "타임폴 - 팀플 시간 조율 서비스",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "타임폴 - 팀플 시간, 1분이면 정리 끝",
    description:
      "대학생 팀플, 동아리, 스터디를 위한 무료 시간 조율 서비스. 링크만 공유하면 끝!",
    images: ["/og-image.png"],
    creator: "@timepoll",
    site: "@timepoll",
  },
  verification: {
    google: googleSiteVerification || undefined,
    other: {
      "naver-site-verification": "naver32e1d9c52c1fa3855a10721e245e6de2",
    },
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
                "@type": "WebApplication",
                name: "타임폴",
                alternateName: "TimePoll",
                description:
                  "대학생 팀플, 동아리, 스터디를 위한 무료 시간 조율 서비스",
                url: normalizedSiteUrl,
                applicationCategory: "SchedulingApplication",
                operatingSystem: "All",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "KRW",
                },
                featureList: [
                  "무료 사용",
                  "회원가입 불필요",
                  "실시간 결과 확인",
                  "모바일 최적화",
                  "카카오톡 공유",
                  "QR코드 지원",
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "타임폴",
                alternateName: "TimePoll",
                url: normalizedSiteUrl,
                logo: `${normalizedSiteUrl}/icon.svg`,
              },
            ]),
          }}
        />
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
