"use client"

import { useEffect, useState } from 'react'
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import ChatList from './ChatList'
import ChatWindow from './ChatWindow'
import { ChatUser } from '@/types/chat'

interface ChatLayoutProps {
  users: ChatUser[]
  currentUserId: string
  userType: 'FOUNDER' | 'INVESTOR'
  companyId?: string
}

export default function ChatLayout({ users, currentUserId, userType, companyId }: ChatLayoutProps) {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  const [newCompanyId , setNewCompanyId] = useState<string>("");

  useEffect(() => {
    if(selectedUser)
      setNewCompanyId(selectedUser?.id);
  }, [selectedUser]);

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
        <div className="col-span-4">
          <Card className="h-full">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Messages</h2>
            </div>
            <ScrollArea className="h-[calc(100%-4rem)]">
              <ChatList
                users={users}
                selectedUser={selectedUser}
                onSelectUser={setSelectedUser}
              />
            </ScrollArea>
          </Card>
        </div>
        <div className="col-span-8">
          <Card className="h-full">
            {selectedUser ? (
              <ChatWindow
                companyId={(userType === 'FOUNDER') ? companyId! : newCompanyId}
                isFounder={(userType === 'FOUNDER')}
                investorId={(userType === 'FOUNDER') ? selectedUser.id : currentUserId}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a conversation to start messaging
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}