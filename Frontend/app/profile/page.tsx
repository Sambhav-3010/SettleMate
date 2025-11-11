"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { User } from "@/lib/types"
import { apiClient } from "@/lib/api"
import { LogOut, Save } from "lucide-react"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [upiId, setUpiId] = useState("")
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await apiClient.get("/users/me")
        setUser(userData)
        setUpiId(userData.upiId || "")
      } catch (err) {
        console.error("Failed to fetch user:", err)
        setError("Failed to load profile. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleSaveProfile = async () => {
    if (!user) return
    setIsSaving(true)
    try {
      const updatedUser = await apiClient.put("/users/me", { upiId })
      setUser(updatedUser)
      setError(null)
    } catch (err) {
      console.error("Failed to update profile:", err)
      setError("Failed to save profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout", {})
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <div className="flex h-screen bg-slate-950 flex-col md:flex-row overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Topbar userName={user?.name} />
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <div className="w-full max-w-2xl">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Profile</h1>
              <p className="text-sm sm:text-base text-slate-400">Manage your account settings</p>
            </div>

            {error && (
              <Card className="bg-red-950/50 border-red-500/30 p-4 mb-6">
                <p className="text-red-400 text-sm">{error}</p>
              </Card>
            )}

            {loading ? (
              <div className="space-y-4">
                <div className="h-20 bg-slate-800/50 rounded-2xl animate-pulse" />
                <div className="h-20 bg-slate-800/50 rounded-2xl animate-pulse" />
              </div>
            ) : user ? (
              <div className="space-y-4 sm:space-y-6">
                {/* User Info Card */}
                <Card className="bg-gradient-to-br from-slate-900 to-emerald-950 border-emerald-500/20 p-4 sm:p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs sm:text-sm text-slate-400 font-medium">Name</label>
                      <p className="text-base sm:text-lg text-white font-semibold mt-1">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm text-slate-400 font-medium">Email</label>
                      <p className="text-base sm:text-lg text-white font-semibold mt-1 break-all">{user.email}</p>
                    </div>
                  </div>
                </Card>

                {/* UPI ID Card */}
                <Card className="bg-gradient-to-br from-slate-900 to-emerald-950 border-emerald-500/20 p-4 sm:p-6">
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-xs sm:text-sm text-slate-400 font-medium">UPI ID (Optional)</span>
                      <Input
                        type="text"
                        placeholder="user@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="mt-2 bg-slate-900 border-emerald-500/20 text-white placeholder-slate-500 text-sm"
                      />
                    </label>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold"
                    >
                      <Save size={18} className="mr-2" />
                      {isSaving ? "Saving..." : "Save Profile"}
                    </Button>
                  </div>
                </Card>

                {/* Logout Button */}
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full py-4 sm:py-6 rounded-xl font-semibold text-base sm:text-lg"
                >
                  <LogOut size={20} className="mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Card className="bg-slate-900/50 border-emerald-500/20 p-8 sm:p-12 text-center">
                <p className="text-slate-400 text-sm">Failed to load profile</p>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
