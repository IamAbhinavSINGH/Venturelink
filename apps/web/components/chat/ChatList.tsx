
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChatUser } from '@/types/chat'

interface ChatListProps {
  users: ChatUser[]
  selectedUser: ChatUser | null
  onSelectUser: (user: ChatUser) => void
}

export default function ChatList({ users, selectedUser, onSelectUser }: ChatListProps) {
  return (
    <div className="divide-y">
      {users.map((user) => (
        <div
          key={user.id}
          className={`p-4 cursor-pointer hover:bg-muted/50 ${
            selectedUser?.id === user.id ? 'bg-muted' : ''
          }`}
          onClick={() => onSelectUser(user)}
        >
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{user.name}</p>
              {user.lastMessage && (
                <p className="text-sm text-muted-foreground truncate">
                  {user.lastMessage}
                </p>
              )}
            </div>
            {user.lastMessageTime && (
              <div className="text-xs text-muted-foreground">
                {user.lastMessageTime}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}