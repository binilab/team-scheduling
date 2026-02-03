"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAppSettings } from "@/components/app-providers"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Clock, Home, BookOpen, HelpCircle, Menu, Moon, Sparkles, Sun, Link2, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = {
  ko: [
    { label: "홈", href: "/", icon: Home },
    { label: "투표 만들기", href: "/create", icon: Sparkles },
    { label: "투표 참여", href: "/join", icon: Link2 },
    { label: "사용 가이드", href: "/guide", icon: BookOpen },
    { label: "자주 묻는 질문", href: "/faq", icon: HelpCircle },
    { label: "문의하기", href: "/support", icon: MessageSquare },
  ],
  en: [
    { label: "Home", href: "/", icon: Home },
    { label: "Create", href: "/create", icon: Sparkles },
    { label: "Join", href: "/join", icon: Link2 },
    { label: "Guide", href: "/guide", icon: BookOpen },
    { label: "FAQ", href: "/faq", icon: HelpCircle },
    { label: "Support", href: "/support", icon: MessageSquare },
  ],
}

export function SiteHeader() {
  const pathname = usePathname()
  const { theme, setTheme, language, setLanguage } = useAppSettings()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isDark = theme === "dark"
  const isEn = language === "en"

  const navItems = isEn ? NAV_ITEMS.en : NAV_ITEMS.ko

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 shadow-md">
            <Clock className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold">
            {isEn ? "OurTime" : "우리시간"}
          </span>
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive(item.href)
                  ? "bg-amber-100 text-amber-700"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 우측 컨트롤 */}
        <div className="flex items-center gap-2">
          {/* 언어/테마 토글 */}
          <div className="hidden sm:flex items-center gap-0.5 rounded-lg border border-border/50 bg-muted/50 p-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(isEn ? "ko" : "en")}
              className="h-7 rounded-md px-2.5 text-xs font-medium hover:bg-background"
            >
              {isEn ? "한국어" : "EN"}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="h-7 w-7 rounded-md hover:bg-background"
              aria-label={isDark ? "라이트 모드" : "다크 모드"}
            >
              {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </Button>
          </div>

          {/* 모바일 메뉴 */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-8 w-8">
                <Menu className="h-5 w-5" />
                <span className="sr-only">메뉴</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">메뉴</SheetTitle>
              <nav className="flex flex-col gap-3 mt-8">
                <div className="flex items-center justify-between px-2 py-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {isEn ? "Settings" : "설정"}
                  </span>
                  <div className="flex items-center gap-0.5 rounded-lg border border-border/50 bg-muted/50 p-0.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLanguage(isEn ? "ko" : "en")}
                      className="h-7 rounded-md px-2.5 text-xs"
                    >
                      {isEn ? "한국어" : "EN"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setTheme(isDark ? "light" : "dark")}
                      className="h-7 w-7 rounded-md"
                    >
                      {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                </div>

                <div className="h-px bg-border" />

                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                      isActive(item.href)
                        ? "bg-amber-100 text-amber-700"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
