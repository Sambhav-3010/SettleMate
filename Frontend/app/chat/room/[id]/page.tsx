"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { io, Socket } from "socket.io-client"
import axios from "axios"
import { useParams } from "next/navigation"

interface Message {
  id: string
  senderId: string
  content: string
  createdAt: string
  sender: {
    username: string
  }
}

interface Room {
  id: string
  name: string
  members: { user: { username: string } }[]
}

interface ChatRoomProps {
  params: Promise<{ id: string }>
}

export default function ChatRoom() {
  const params = useParams<{ id: string }>()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [room, setRoom] = useState<Room | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const roomId = params.id

  useEffect(() => {
    // Fetch current user
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, { withCredentials: true })
      .then(res => setCurrentUser(res.data))
      .catch(err => console.error("Failed to fetch user", err))

    // Fetch room details
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}`, { withCredentials: true })
      .then(res => setRoom(res.data))
      .catch(err => console.error("Failed to fetch room", err))

    // Fetch existing messages
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}/messages`, { withCredentials: true })
      .then(res => setMessages(res.data))
      .catch(err => console.error("Failed to fetch messages", err))

    // Initialize Socket.io
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
      withCredentials: true,
    })

    socketRef.current.emit("joinRoom", roomId)

    socketRef.current.on("newMessage", (message: Message) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [roomId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}/messages`,
        { content: inputValue },
        { withCredentials: true }
      )
      setInputValue("")
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <div>
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold">{room?.name || "Loading..."}</h1>
            <p className="text-sm text-muted-foreground mt-1">{room?.members?.length || 0} members</p>
          </div>
        </div>

        {/* Chat Container */}
        <Card className="border border-border bg-card p-6 mb-4 h-[500px] overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => {
              const isMe = message.senderId === currentUser?.id
              return (
                <div key={message.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs px-4 py-3 rounded-lg ${isMe
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-secondary text-foreground rounded-bl-none border border-border"
                      }`}
                  >
                    {!isMe && <p className="text-xs font-bold mb-1">{message.sender.username}</p>}
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        </Card>

        {/* Message Input */}
        <div className="flex gap-3">
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 bg-card border border-border rounded-lg px-4 py-3"
          />
          <Button onClick={handleSendMessage} className="font-medium">
            Send
          </Button>
        </div>
      </div>
    </main>
  )
}
