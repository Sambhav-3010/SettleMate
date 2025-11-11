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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await apiClient.get("/users/me")
        setUser(userData)
        const roomsData = await apiClient.get("/users/me/rooms")
        setRooms(Array.isArray(roomsData) ? roomsData : [])
      } catch (error) {
        console.error("Failed to fetch data:", error)
        setError("Failed to load data. Please try again.")
        setRooms([])
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
          <div className="w-full mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">My Rooms</h1>
                <p className="text-sm sm:text-base text-slate-400">Manage your shared expenses</p>
              </div>
              <Button
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg"
                size="lg"
              >
                <Plus className="mr-2" size={20} />
                Create Room
              </Button>
            </div>

            {error && (
              <Card className="bg-red-950/50 border-red-500/30 p-4 mb-6">
                <p className="text-red-400">{error}</p>
              </Card>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-slate-800/50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : rooms.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {rooms.map((room) => (
                  <Link key={room.id} href={`/rooms/${room.id}`}>
                    <Card className="bg-gradient-to-br from-slate-900 to-emerald-950 border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-lg transition-all cursor-pointer p-4 sm:p-6 h-full">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h2 className="text-lg sm:text-xl font-bold text-white mb-1 truncate">{room.name}</h2>
                          <p className="text-slate-400 text-xs sm:text-sm line-clamp-2">
                            {room.description || "No description"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-400 text-sm">
                        <Users size={18} />
                        <span className="font-medium">{room.members.length} members</span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-900/50 border-emerald-500/20 p-8 sm:p-12 text-center">
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
