"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Card } from "@/components/ui/card"
import type { User } from "@/lib/types"
import { apiClient } from "@/lib/api"

interface Activity {
  id: string
  type: "expense" | "message" | "invite"
  description: string
  timestamp: string
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await apiClient.get("/users/me")
        setUser(userData)
        // Mock activity data for now
        setActivities([
          {
            id: "1",
            type: "expense",
            description: "Lunch split with friends",
            timestamp: new Date().toISOString(),
          },
          {
            id: "2",
            type: "message",
            description: "New message in Trip to Goa",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          },
        ])
      } catch (err) {
        console.error("Failed to fetch data:", err)
        setError("Failed to load activity. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="flex h-screen bg-slate-950 flex-col md:flex-row overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Topbar userName={user?.name} />
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <div className="w-full max-w-4xl">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Activity</h1>
              <p className="text-sm sm:text-base text-slate-400">Recent updates from your rooms</p>
            </div>

            {error && (
              <Card className="bg-red-950/50 border-red-500/30 p-4 mb-6">
                <p className="text-red-400 text-sm">{error}</p>
              </Card>
            )}

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-slate-800/50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : activities.length > 0 ? (
              <div className="space-y-3">
                {activities.map((activity) => (
                  <Card
                    key={activity.id}
                    className="bg-gradient-to-r from-slate-900 to-emerald-950 border-emerald-500/20 hover:border-emerald-500/50 transition-all p-3 sm:p-4"
                  >
                    <p className="text-white font-medium text-sm sm:text-base">{activity.description}</p>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-900/50 border-emerald-500/20 p-8 sm:p-12 text-center">
                <p className="text-slate-400 text-sm">No recent activity</p>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
