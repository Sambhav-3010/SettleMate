import Link from "next/link"
import { Card } from "@/components/ui/card"

interface ChatListItemProps {
  id: string
  groupName: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

export function ChatListItem({ id, groupName, lastMessage, lastMessageTime, unreadCount }: ChatListItemProps) {
  return (
    <Link href={`/chat/room/${id}`}>
      <Card className="line-panel p-5 transition-colors hover:border-white/30">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="text-lg font-semibold tracking-[-0.01em]">{groupName}</h3>
              {unreadCount > 0 && <span className="border border-border px-2 py-0.5 text-xs">{unreadCount}</span>}
            </div>
            <p className="truncate text-sm text-muted-foreground">{lastMessage}</p>
          </div>
          <p className="font-mono text-xs text-muted-foreground">{lastMessageTime}</p>
        </div>
      </Card>
    </Link>
  )
}
