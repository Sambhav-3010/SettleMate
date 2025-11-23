"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { useAuthGuard } from "@/hooks/useAuthGuard"
import { Loader2 } from "lucide-react"

interface ChatHistory {
  id: string
  groupName: string
  lastMessage: string
  lastSender: string
  lastMessageTime: string
  unreadCount: number
}

export default function ChatHistory() {
  const { user, loading } = useAuthGuard()
  const chatHistory: ChatHistory[] = [
    {
      id: "1",
      groupName: "Weekend Trip",
      lastMessage: "Mike: Same here, no problem",
      lastSender: "Mike",
      lastMessageTime: "2 hours ago",
      unreadCount: 0,
    },
    {
      id: "2",
      groupName: "Apartment",
      lastMessage: "You: Thanks for splitting the rent!",
      lastSender: "You",
      lastMessageTime: "5 hours ago",
      unreadCount: 0,
    },
    {
      id: "3",
      groupName: "Game Night",
      lastMessage: "Casey: See you tonight!",
      lastSender: "Casey",
      lastMessageTime: "1 day ago",
      unreadCount: 2,
    },
  ]

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Chat History</h1>
          <p className="text-muted-foreground">View all your group conversations</p>
        </div>

        {/* Chat List */}
        <div className="space-y-3">
          {chatHistory.map((chat) => (
            <Link key={chat.id} href={`/chat/room/${chat.id}`}>
              <Card className="p-6 border border-border bg-card hover:border-foreground/20 hover:bg-secondary transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg group-hover:text-foreground">{chat.groupName}</h3>
                      {chat.unreadCount > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className="text-xs text-muted-foreground">{chat.lastMessageTime}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
