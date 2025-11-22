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
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, logout } = useAuth()

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
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto w-full">
          <Link
            href="/"
            className="text-2xl font-bold text-primary hover:opacity-85 transition flex items-center space-x-2"
          >
            <span>Splitter</span>
          </Link>

          <div className="flex items-center space-x-3">

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar className="cursor-pointer">
                    <AvatarFallback className="bg-primary text-white font-semibold uppercase">
                      {user.username ? user.username[0] : <UserIcon className="w-4 h-4" />}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="min-w-[150px]">
                  <DropdownMenuItem disabled className="opacity-70">
                    {user.username}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={logout}>
                    <LogOut className="mr-2 w-4 h-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <span className="text-sm text-muted-foreground">Guest Mode</span>
            )}

            <Button
              size="icon"
              variant="outline"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="pt-20">{children}</div>
    </>
  )
}
