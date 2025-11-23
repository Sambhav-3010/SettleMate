"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { io, Socket } from "socket.io-client"
import axios from "axios"

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

interface ChatModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    roomId: string | null
}

export function ChatModal({ isOpen, onOpenChange, roomId }: ChatModalProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState("")
    const [room, setRoom] = useState<Room | null>(null)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const socketRef = useRef<Socket | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!isOpen || !roomId) return

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
    }, [isOpen, roomId])

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isOpen])

    const handleSendMessage = async () => {
        if (!inputValue.trim() || !roomId) return

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
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 gap-0 border-border bg-card">
                <DialogHeader className="p-4 border-b border-border">
                    <DialogTitle className="flex items-center justify-between pr-8">
                        <span>{room?.name || "Chat"}</span>
                        <span className="text-xs font-normal text-muted-foreground">
                            {room?.members?.length || 0} members
                        </span>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => {
                        const isMe = message.senderId === currentUser?.id
                        return (
                            <div key={message.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[80%] px-3 py-2 rounded-lg shadow-sm ${isMe
                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                        : "bg-white dark:bg-gray-800 text-foreground rounded-tl-none border border-border"
                                        }`}
                                >
                                    {!isMe && (
                                        <p className="text-xs font-bold mb-1 text-orange-600 dark:text-orange-400">
                                            {message.sender.username}
                                        </p>
                                    )}
                                    <p className="text-sm leading-relaxed break-words">{message.content}</p>
                                    <p className={`text-[10px] mt-1 text-right ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                        {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-border bg-background">
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            placeholder="Type your message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                            className="flex-1"
                        />
                        <Button onClick={handleSendMessage} size="icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                            >
                                <path d="m22 2-7 20-4-9-9-4Z" />
                                <path d="M22 2 11 13" />
                            </svg>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
