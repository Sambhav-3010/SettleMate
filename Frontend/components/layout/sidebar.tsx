"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, DollarSign, Activity, User, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/expenses", icon: DollarSign, label: "Expenses" },
  { href: "/activity", icon: Activity, label: "Activity" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gradient-to-b from-emerald-950 to-slate-950 border-r border-emerald-900/30 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-emerald-900/30">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
          Splitwise
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200",
                isActive ? "bg-emerald-500 text-white shadow-lg" : "text-slate-300 hover:bg-slate-800/50",
              )}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Create Room Button */}
      <div className="p-4 border-t border-emerald-900/30">
        <Link
          href="/dashboard?newRoom=true"
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          New Room
        </Link>
      </div>
    </aside>
  )
}
