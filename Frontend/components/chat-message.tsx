interface ChatMessageProps {
  sender: string
  text: string
  timestamp: string
  isOwn: boolean
}

export function ChatMessage({ sender, text, timestamp, isOwn }: ChatMessageProps) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs px-4 py-3 rounded-lg ${
          isOwn
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-secondary text-foreground rounded-bl-none border border-border"
        }`}
      >
        {!isOwn && <p className="text-xs font-bold mb-1">{sender}</p>}
        <p className="text-sm">{text}</p>
        <p className="text-xs mt-1 opacity-70">{timestamp}</p>
      </div>
    </div>
  )
}
