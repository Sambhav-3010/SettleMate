import type { RefObject } from "react"
import { Card } from "@/components/ui/card"
import { ChatMessage } from "./chat-message"

interface Message {
  id: string
  sender: string
  text: string
  timestamp: string
}

interface ChatContainerProps {
  messages: Message[]
  compact?: boolean
  scrollAnchorRef?: RefObject<HTMLDivElement | null>
}

export function ChatContainer({ messages, compact = false, scrollAnchorRef }: ChatContainerProps) {
  return (
    <Card
      className={`mb-0 min-h-0 ${compact ? "flex-1 p-3" : "h-[62vh] p-5"} !overflow-y-auto !overflow-x-hidden scrollbar-hidden`}
    >
      <div className="space-y-3 pr-1">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            sender={message.sender}
            text={message.text}
            timestamp={message.timestamp}
            isOwn={message.sender === "You"}
          />
        ))}
        <div ref={scrollAnchorRef} />
      </div>
    </Card>
  )
}
