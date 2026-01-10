"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppSettings } from "@/components/app-providers"

export function SiteControls() {
  const { theme, setTheme, language, setLanguage } = useAppSettings()
  const isDark = theme === "dark"
  const isEnglish = language === "en"

  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-2 py-2 shadow-[0_18px_40px_rgba(15,23,42,0.15)] backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage(isEnglish ? "ko" : "en")}
        className="h-8 rounded-full px-3 text-xs font-semibold"
      >
        {isEnglish ? "한국어" : "EN"}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="h-8 w-8 rounded-full"
        aria-label={isDark ? "라이트 모드" : "다크 모드"}
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
    </div>
  )
}
