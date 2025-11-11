"use client"

import { useState } from "react"
import { LogOut, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"

interface TopbarProps {
  userName?: string
}

export function Topbar({ userName = "User" }: TopbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout", {})
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <header className="h-16 bg-gradient-to-r from-slate-900 to-emerald-900 border-b border-emerald-800/30 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
      <div className="text-sm sm:text-lg font-semibold bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent truncate">
        Welcome, {userName}
      </div>

      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg hover:bg-slate-800/50 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400" />
          <ChevronDown size={18} className="text-slate-400 hidden sm:block" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-emerald-800/30 rounded-lg shadow-lg">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-slate-800/50 transition-colors rounded-lg m-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
