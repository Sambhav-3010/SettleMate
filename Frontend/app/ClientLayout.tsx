"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { LogOut, User as UserIcon, Moon, Sun } from "lucide-react"
import { useAuth, User } from "../contexts/authContext"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initialDark = savedTheme ? savedTheme === "dark" : prefersDark
    setIsDark(initialDark)
    updateTheme(initialDark)
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
    const next = !isDark
    setIsDark(next)
    updateTheme(next)
  }

  return (
    <>
      {mounted && (
        <ThemeProvider isDark={isDark} toggleTheme={toggleTheme} user={user} logout={logout}>
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
  user,
  logout,
  children,
}: {
  isDark: boolean
  toggleTheme: () => void
  children: React.ReactNode
  user: User | null
  logout: () => Promise<void>
}) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="section-wrap flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-xs font-bold">
              S
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/90">SettleMate</span>
          </Link>

          <div className="flex items-center gap-2 md:gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar className="cursor-pointer border border-border bg-card">
                    <AvatarFallback className="bg-transparent font-semibold uppercase text-foreground">
                      {user.username ? user.username[0] : <UserIcon className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="min-w-[170px] border-border bg-popover">
                  <DropdownMenuItem disabled className="opacity-70">
                    {user.username}
                  </DropdownMenuItem>
                  <Link href="/settings">
                    <DropdownMenuItem className="cursor-pointer">
                      <UserIcon className="mr-2 h-4 w-4" /> Settings
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="cursor-pointer text-red-500" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <span className="hidden text-xs uppercase tracking-[0.16em] text-muted-foreground sm:inline">Guest Mode</span>
            )}

            <Button
              size="icon"
              variant="outline"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <div>{children}</div>
    </>
  )
}
