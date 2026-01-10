import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import { AppProviders } from "@/components/app-providers"
import { SiteControls } from "@/components/site-controls"
import "./globals.css"


export const metadata: Metadata = {
  title: "타임폴 - 팀플 시간, 1분이면 정리 끝",
  description: "대학생 팀플, 동아리, 스터디를 위한 시간 약속 잡기 서비스. 링크만 공유하면 끝!",
  generator: "v0.app",
  metadataBase: new URL("https://ourstime.com"),
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "타임폴 - 팀플 시간, 1분이면 정리 끝",
    description: "대학생 팀플, 동아리, 스터디를 위한 시간 약속 잡기 서비스. 링크만 공유하면 끝!",
    url: "https://ourstime.com",
    siteName: "타임폴",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "타임폴 - 팀플 시간, 1분이면 정리 끝",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "타임폴 - 팀플 시간, 1분이면 정리 끝",
    description: "대학생 팀플, 동아리, 스터디를 위한 시간 약속 잡기 서비스. 링크만 공유하면 끝!",
    images: ["/og-image.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-MCGP0FSM5L" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6460615081786537"
          crossOrigin="anonymous"
        />
        <Script id="google-tag">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-MCGP0FSM5L');`}
        </Script>
      </head>
      <body className={`font-sans antialiased`}>
        <AppProviders>
          <SiteControls />
          {children}
          <Analytics />
        </AppProviders>
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  )
}
