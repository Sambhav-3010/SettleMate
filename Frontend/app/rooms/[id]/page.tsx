"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Users, MessageSquare, DollarSign, Send } from "lucide-react"
import { apiClient } from "@/lib/api"
import type { Room, Expense, Message, User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function RoomPage() {
  const params = useParams()
  const roomId = params.id as string
  const [room, setRoom] = useState<Room | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await apiClient.get("/users/me")
        setUser(userData)
        const roomData = await apiClient.get(`/rooms/${roomId}`)
        setRoom(roomData)
        const expensesData = await apiClient.get(`/rooms/${roomId}/expenses`)
        setExpenses(Array.isArray(expensesData) ? expensesData : [])
        const messagesData = await apiClient.get(`/rooms/${roomId}/messages`)
        setMessages(Array.isArray(messagesData) ? messagesData : [])
      } catch (err) {
        console.error("Failed to fetch data:", err)
        setError("Failed to load room data. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [roomId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || !user) return

    try {
      const newMessage = await apiClient.post(`/rooms/${roomId}/messages`, {
        content: messageInput,
      })
      setMessages([...messages, newMessage])
      setMessageInput("")
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  return (
    <div className="flex h-screen bg-slate-950 flex-col md:flex-row overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Topbar userName={user?.name} />
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <div className="w-full">
            {error && (
              <Card className="bg-red-950/50 border-red-500/30 p-4 mb-6">
                <p className="text-red-400">{error}</p>
              </Card>
            )}

            {loading ? (
              <div className="space-y-4">
                <div className="h-20 bg-slate-800/50 rounded-2xl animate-pulse" />
                <div className="h-96 bg-slate-800/50 rounded-2xl animate-pulse" />
              </div>
            ) : room ? (
              <>
                {/* Room Header */}
                <div className="mb-6 sm:mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{room.name}</h1>
                  <div className="flex items-center gap-2 sm:gap-4 text-slate-400 text-sm sm:text-base overflow-x-auto">
                    <Users size={18} />
                    <span className="truncate">{room.members.map((m) => m.name).join(", ")}</span>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="chat" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-900/50 border border-emerald-500/20 rounded-xl p-1 mb-6">
                    <TabsTrigger
                      value="chat"
                      className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-emerald-600"
                    >
                      <MessageSquare size={16} />
                      <span className="hidden sm:inline">Chat</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="expenses"
                      className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-emerald-600"
                    >
                      <DollarSign size={16} />
                      <span className="hidden sm:inline">Expenses</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Chat Tab */}
                  <TabsContent value="chat" className="space-y-4">
                    <Card className="bg-slate-900/50 border-emerald-500/20 p-3 sm:p-4 h-80 sm:h-96 overflow-y-auto">
                      {messages.length > 0 ? (
                        <div className="space-y-3 sm:space-y-4">
                          {messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex ${msg.sender.id === user?.id ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-xs px-3 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm ${
                                  msg.sender.id === user?.id
                                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                                    : "bg-slate-800 text-slate-100"
                                }`}
                              >
                                <p className="font-medium text-xs">{msg.sender.name}</p>
                                <p className="mt-1">{msg.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 text-center py-8 text-sm">No messages yet</p>
                      )}
                    </Card>
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        className="bg-slate-900 border-emerald-500/20 text-white placeholder-slate-500 text-sm"
                      />
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-3 sm:px-4"
                      >
                        <Send size={18} />
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Expenses Tab */}
                  <TabsContent value="expenses" className="space-y-4">
                    {expenses.length > 0 ? (
                      <div className="space-y-3">
                        {expenses.map((expense) => (
                          <Card
                            key={expense.id}
                            className="bg-slate-900/50 border-emerald-500/20 p-3 sm:p-4 hover:border-emerald-500/50 transition-all"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex-1">
                                <p className="font-semibold text-white text-sm sm:text-base truncate">
                                  {expense.description}
                                </p>
                                <p className="text-xs sm:text-sm text-slate-400">Paid by {expense.paidBy.name}</p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-lg sm:text-xl font-bold text-emerald-400">₹{expense.amount}</p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="bg-slate-900/50 border-emerald-500/20 p-8 text-center">
                        <p className="text-slate-400 text-sm">No expenses yet</p>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <Card className="bg-slate-900/50 border-emerald-500/20 p-8 text-center">
                <p className="text-slate-400">Room not found</p>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
