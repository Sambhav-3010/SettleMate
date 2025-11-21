"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const isDarkMode =
      localStorage.getItem("theme") === "dark" || window.matchMedia("(prefers-color-scheme: dark)").matches
    setIsDark(isDarkMode)
    updateTheme(isDarkMode)
  }, [])

  const updateTheme = (dark: boolean) => {
    const html = document.documentElement
    if (dark) {
      html.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      html.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const toggleTheme = () => {
    const newDark = !isDark
    setIsDark(newDark)
    updateTheme(newDark)
  }

  return (
    <>
      {mounted && (
        <ThemeProvider isDark={isDark} toggleTheme={toggleTheme}>
          {children}
        </ThemeProvider>
      )}
      {!mounted && <>{children}</>}
    </>
  )
}

function ThemeProvider({
  isDark,
  toggleTheme,
  children,
}: { isDark: boolean; toggleTheme: () => void; children: React.ReactNode }) {
  return (
    <>
      {/* Modern Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto w-full">
          <Link href="/dashboard" className="text-xl font-bold text-foreground">
            Splitter
          </Link>
          <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded-lg border border-border bg-secondary hover:bg-muted transition-colors text-foreground text-sm font-medium"
            aria-label="Toggle theme"
          >
            {isDark ? "Light" : "Dark"}
          </button>
        </div>
      </header>
      <div className="pt-20">{children}</div>
    </>
  )
}
