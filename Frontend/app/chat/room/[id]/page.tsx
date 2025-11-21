"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface Message {
  id: string
  sender: string
  text: string
  timestamp: string
}

interface ChatRoomProps {
  params: Promise<{ id: string }>
}

export default function ChatRoom({ params }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "Jack",
      text: "Hey everyone! Let me know when you'll settle the trip expenses",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      sender: "Sarah",
      text: "I can pay by tomorrow",
      timestamp: "10:45 AM",
    },
    {
      id: "3",
      sender: "Mike",
      text: "Same here, no problem",
      timestamp: "11:00 AM",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const id = "1" // From params - would be resolved in real app

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      sender: "You",
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, newMessage])
    setInputValue("")
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
            <h1 className="text-3xl font-bold">Weekend Trip Chat</h1>
            <p className="text-sm text-muted-foreground mt-1">4 members</p>
          </div>
        </div>

        {/* Chat Container */}
        <Card className="border border-border bg-card p-6 mb-4 h-[500px] overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-4 py-3 rounded-lg ${
                    message.sender === "You"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-secondary text-foreground rounded-bl-none border border-border"
                  }`}
                >
                  {message.sender !== "You" && <p className="text-xs font-bold mb-1">{message.sender}</p>}
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                </div>
              </div>
            ))}
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
