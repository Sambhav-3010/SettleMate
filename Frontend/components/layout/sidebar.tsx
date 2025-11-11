"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, DollarSign, Activity, User, Plus, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

const navigationItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/expenses", icon: DollarSign, label: "Expenses" },
  { href: "/activity", icon: Activity, label: "Activity" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) setIsOpen(false)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 z-50 p-4">
        <button onClick={() => setIsOpen(!isOpen)} className="text-emerald-400 hover:text-emerald-300">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {isOpen && isMobile && <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:static md:flex flex-col h-screen w-64 bg-gradient-to-b from-emerald-950 to-slate-950 border-r border-emerald-900/30 transition-all duration-300 z-40",
          isOpen ? "left-0" : "-left-64 md:left-0",
        )}
      >
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
                onClick={() => setIsOpen(false)}
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
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">New Room</span>
            <span className="sm:hidden">New</span>
          </Link>
        </div>
      </aside>
    </>
  )
}
