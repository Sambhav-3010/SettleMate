"use client"

import { useState, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { io, Socket } from "socket.io-client"
import axios from "axios"
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

interface ChatModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  roomId: string | null
}

export function ChatModal({ isOpen, onOpenChange, roomId }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [room, setRoom] = useState<Room | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const socketRef = useRef<Socket | null>(null)
  const scrollAnchorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen || !roomId) return

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
  }, [isOpen, roomId])

  useEffect(() => {
    if (!isOpen) return
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages, isOpen])

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !roomId) return

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

  const mappedMessages = messages.map((message) => {
    const isMe = message.senderId === currentUser?.id
    return {
      id: message.id,
      sender: isMe ? "You" : message.sender?.username || "Member",
      text: message.content,
      timestamp: new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
  })

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] max-w-[95%] flex-col overflow-hidden border border-border bg-card p-0 sm:h-[680px] sm:max-w-2xl">
        <DialogHeader className="shrink-0 border-b border-border p-4">
          <DialogTitle className="flex items-center justify-between pr-14">
            <span>{room?.name || "Chat"}</span>
            <span className="font-mono text-xs text-muted-foreground">{room?.members?.length || 0} members</span>
          </DialogTitle>
          <DialogDescription className="sr-only">Chat conversation for {room?.name || "this group"}</DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
          <ChatContainer messages={mappedMessages} compact scrollAnchorRef={scrollAnchorRef} />
          <ChatInput onSendMessage={handleSendMessage} compact />
        </div>
      </DialogContent>
    </Dialog>
  )
}
