"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

type ThemeMode = "light" | "dark"
type Language = "ko" | "en"

interface AppSettingsContextValue {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  language: Language
  setLanguage: (language: Language) => void
}

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null)

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("light")
  const [language, setLanguage] = useState<Language>("ko")

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme")
    const storedLanguage = localStorage.getItem("language")

    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme)
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
    }

    if (storedLanguage === "ko" || storedLanguage === "en") {
      setLanguage(storedLanguage)
    } else if (navigator.language.toLowerCase().startsWith("en")) {
      setLanguage("en")
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    localStorage.setItem("theme", theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = language
    localStorage.setItem("language", language)
  }, [language])

  const value = useMemo<AppSettingsContextValue>(
    () => ({
      theme,
      setTheme,
      language,
      setLanguage,
    }),
    [theme, language],
  )

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext)
  if (!context) {
    throw new Error("useAppSettings must be used within AppProviders")
  }
  return context
}
