"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { io, Socket } from "socket.io-client"
import axios from "axios"
import { useParams } from "next/navigation"
import { useAuthGuard } from "@/hooks/useAuthGuard"
import { Loader2, ArrowLeft } from "lucide-react"
import { ChatContainer } from "@/components/chat-container"
import { ChatInput } from "@/components/chat-input"

interface Message {
  id: string
  senderId: string
  content: string
  createdAt: string
  sender?: {
    username?: string
  }
}

interface Room {
  id: string
  name: string
  members: { user: { username: string } }[]
}

export default function ChatRoom() {
  const { loading } = useAuthGuard()
  const params = useParams<{ id: string }>()
  const [messages, setMessages] = useState<Message[]>([])
  const [room, setRoom] = useState<Room | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const roomId = params.id

  useEffect(() => {
    if (!loading) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, { withCredentials: true })
        .then((res) => setCurrentUser(res.data))
        .catch((err) => console.error("Failed to fetch user", err))

      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}`, { withCredentials: true })
        .then((res) => setRoom(res.data))
        .catch((err) => console.error("Failed to fetch room", err))

      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}/messages`, { withCredentials: true })
        .then((res) => setMessages(res.data))
        .catch((err) => console.error("Failed to fetch messages", err))

      const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
        withCredentials: true,
      })
      socketRef.current = socket

      socket.emit("joinRoom", roomId)

      socket.on("newMessage", (message: Message) => {
        setMessages((prev) => [...prev, message])
      })

      return () => {
        socket.disconnect()
      }
    }
  }, [loading, roomId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}/messages`,
        { content: message },
        { withCredentials: true },
      )
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const mappedMessages = messages.map((message) => ({
    id: message.id,
    sender: message.senderId === currentUser?.id ? "You" : message.sender?.username || "Member",
    text: message.content,
    timestamp: new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }))

  return (
    <main className="app-shell min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-4xl space-y-4">
        <section className="line-panel p-6 md:p-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Link href="/dashboard">
                  <Button variant="outline" size="icon">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <p className="muted-label">/// Live Room</p>
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.02em] md:text-4xl">{room?.name || "Loading..."}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{room?.members?.length || 0} members</p>
            </div>
          </div>
        </section>

        <ChatContainer messages={mappedMessages} />
        <ChatInput onSendMessage={handleSendMessage} />
        <div ref={messagesEndRef} />
      </div>
    </main>
  )
}
