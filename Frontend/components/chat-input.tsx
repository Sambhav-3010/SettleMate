"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  compact?: boolean
}

export function ChatInput({ onSendMessage, compact = false }: ChatInputProps) {
  const [value, setValue] = useState("")

  const handleSend = () => {
    if (!value.trim()) return
    onSendMessage(value)
    setValue("")
  }

  return (
    <div className={`flex gap-2 ${compact ? "" : "line-panel p-3"}`}>
      <Input
        type="text"
        placeholder="Type your message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        className="flex-1"
      />
      <Button onClick={handleSend} className="px-4">Send</Button>
    </div>
  )
}
