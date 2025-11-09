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
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await apiClient.get("/users/me")
        setUser(userData)
        setUpiId(userData.upiId || "")
      } catch (error) {
        console.error("Failed to fetch user:", error)
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
    } catch (error) {
      console.error("Failed to update profile:", error)
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
    <div className="flex h-screen bg-slate-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar userName={user?.name} />
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
              <p className="text-slate-400">Manage your account settings</p>
            </div>

            {loading ? (
              <div className="space-y-4">
                <div className="h-20 bg-slate-800/50 rounded-2xl animate-pulse" />
                <div className="h-20 bg-slate-800/50 rounded-2xl animate-pulse" />
              </div>
            ) : user ? (
              <div className="space-y-6">
                {/* User Info Card */}
                <Card className="bg-gradient-to-br from-slate-900 to-emerald-950 border-emerald-500/20 p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-slate-400 font-medium">Name</label>
                      <p className="text-lg text-white font-semibold mt-1">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400 font-medium">Email</label>
                      <p className="text-lg text-white font-semibold mt-1">{user.email}</p>
                    </div>
                  </div>
                </Card>

                {/* UPI ID Card */}
                <Card className="bg-gradient-to-br from-slate-900 to-emerald-950 border-emerald-500/20 p-6">
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-sm text-slate-400 font-medium">UPI ID (Optional)</span>
                      <Input
                        type="text"
                        placeholder="user@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="mt-2 bg-slate-900 border-emerald-500/20 text-white placeholder-slate-500"
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
                  className="w-full py-6 rounded-xl font-semibold text-lg"
                >
                  <LogOut size={20} className="mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Card className="bg-slate-900/50 border-emerald-500/20 p-12 text-center">
                <p className="text-slate-400">Failed to load profile</p>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
