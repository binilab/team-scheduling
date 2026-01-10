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
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
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
