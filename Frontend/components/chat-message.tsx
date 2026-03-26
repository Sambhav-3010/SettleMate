interface ChatMessageProps {
  sender: string
  text: string
  timestamp: string
  isOwn: boolean
}

export function ChatMessage({ sender, text, timestamp, isOwn }: ChatMessageProps) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} reveal-up`}>
      <div className={`max-w-[85%] border px-3 py-2 text-sm ${isOwn ? "border-white/40 bg-white text-black" : "border-border bg-card text-foreground"}`}>
        {!isOwn && <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{sender}</p>}
        <p className="leading-relaxed">{text}</p>
        <p className={`mt-1 text-[10px] ${isOwn ? "text-black/60" : "text-muted-foreground"}`}>{timestamp}</p>
      </div>
    </div>
  )
}
