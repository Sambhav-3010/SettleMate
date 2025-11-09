"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users } from "lucide-react"
import { apiClient } from "@/lib/api"
import type { Room, User } from "@/lib/types"
import Link from "next/link"

export default function DashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await apiClient.get("/users/me")
        setUser(userData)
        const roomsData = await apiClient.get("/users/me/rooms")
        setRooms(roomsData)
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
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">My Rooms</h1>
                <p className="text-slate-400">Manage your shared expenses</p>
              </div>
              <Button
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg"
                size="lg"
              >
                <Plus className="mr-2" size={20} />
                Create Room
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-slate-800/50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : rooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <Link key={room.id} href={`/rooms/${room.id}`}>
                    <Card className="bg-gradient-to-br from-slate-900 to-emerald-950 border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-lg transition-all cursor-pointer p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-xl font-bold text-white mb-1">{room.name}</h2>
                          <p className="text-slate-400 text-sm">{room.description || "No description"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-400">
                        <Users size={18} />
                        <span className="text-sm font-medium">{room.members.length} members</span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-900/50 border-emerald-500/20 p-12 text-center">
                <p className="text-slate-400 mb-4">No rooms yet. Create one to get started!</p>
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-500">
                  <Plus className="mr-2" size={20} />
                  Create Your First Room
                </Button>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
