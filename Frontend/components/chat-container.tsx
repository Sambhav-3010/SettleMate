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
}

export function ChatContainer({ messages, compact = false }: ChatContainerProps) {
  return (
    <Card className={`line-panel mb-0 overflow-y-auto ${compact ? "h-full p-3" : "h-[62vh] p-5"}`}>
      <div className="space-y-3">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            sender={message.sender}
            text={message.text}
            timestamp={message.timestamp}
            isOwn={message.sender === "You"}
          />
        ))}
      </div>
    </Card>
  )
}
