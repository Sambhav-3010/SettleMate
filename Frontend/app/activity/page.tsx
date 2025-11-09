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
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar userName={user?.name} />
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Activity</h1>
              <p className="text-slate-400">Recent updates from your rooms</p>
            </div>

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
                    className="bg-gradient-to-r from-slate-900 to-emerald-950 border-emerald-500/20 hover:border-emerald-500/50 transition-all p-4"
                  >
                    <p className="text-white font-medium">{activity.description}</p>
                    <p className="text-sm text-slate-400 mt-1">{new Date(activity.timestamp).toLocaleString()}</p>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-900/50 border-emerald-500/20 p-12 text-center">
                <p className="text-slate-400">No recent activity</p>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
