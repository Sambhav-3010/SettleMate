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
      <Card className="p-6 border border-border bg-card hover:border-foreground/20 hover:bg-secondary transition-all duration-300 cursor-pointer group">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-lg group-hover:text-foreground">{groupName}</h3>
              {unreadCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">{lastMessage}</p>
          </div>
          <div className="text-right ml-4 flex-shrink-0">
            <p className="text-xs text-muted-foreground">{lastMessageTime}</p>
          </div>
        </div>
      </Card>
    </Link>
  )
}
