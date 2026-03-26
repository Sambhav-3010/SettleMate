"use client"

import { useEffect } from "react"
import Link from "next/link"
import { LogOut, User as UserIcon } from "lucide-react"
import { useAuth, User } from "../contexts/authContext"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()

  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  return (
    <ThemeShell user={user} logout={logout}>
      {children}
    </ThemeShell>
  )
}

function ThemeShell({
  user,
  logout,
  children,
}: {
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
          </div>
        </div>
      </header>

      <div>{children}</div>
    </>
  )
}
