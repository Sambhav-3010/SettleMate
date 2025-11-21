"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ChatInputProps {
  onSendMessage: (message: string) => void
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [value, setValue] = useState("")

  const handleSend = () => {
    if (!value.trim()) return
    onSendMessage(value)
    setValue("")
  }

  return (
    <div className="flex gap-3">
      <Input
        type="text"
        placeholder="Type your message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSend()}
        className="flex-1 bg-card border border-border rounded-lg px-4 py-3"
      />
      <Button onClick={handleSend} className="font-medium">
        Send
      </Button>
    </div>
  )
}
