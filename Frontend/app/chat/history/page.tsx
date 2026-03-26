"use client"

import Link from "next/link"
import { useAuthGuard } from "@/hooks/useAuthGuard"
import { Loader2 } from "lucide-react"
import { ChatListItem } from "@/components/chat-list-item"

interface ChatHistory {
  id: string
  groupName: string
  lastMessage: string
  lastSender: string
  lastMessageTime: string
  unreadCount: number
}

export default function ChatHistory() {
  const { loading } = useAuthGuard()
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
    <main className="app-shell min-h-[calc(100vh-4rem)] space-y-4">
      <section className="line-panel p-6 md:p-8">
        <Link href="/dashboard" className="muted-label inline-block hover:text-foreground">
          Back To Dashboard
        </Link>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] md:text-6xl">Chat History</h1>
        <p className="mt-2 text-muted-foreground">All group conversations in one stream.</p>
      </section>

      <section className="space-y-3">
        {chatHistory.map((chat) => (
          <ChatListItem
            key={chat.id}
            id={chat.id}
            groupName={chat.groupName}
            lastMessage={chat.lastMessage}
            lastMessageTime={chat.lastMessageTime}
            unreadCount={chat.unreadCount}
          />
        ))}
      </section>
    </main>
  )
}
