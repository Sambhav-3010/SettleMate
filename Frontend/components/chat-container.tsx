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
}

export function ChatContainer({ messages }: ChatContainerProps) {
  return (
    <Card className="border border-border bg-card p-6 mb-4 h-[500px] overflow-y-auto">
      <div className="space-y-4">
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
