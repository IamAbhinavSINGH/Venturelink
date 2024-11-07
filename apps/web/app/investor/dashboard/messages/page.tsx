"use client"

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { ChatUser } from '@/types/chat'
import { Loader2 } from 'lucide-react'
import ChatBotUI from '@/components/chat/ChatBotUI'

export default function InvestorMessagesPage() {
  const { data: session } = useSession()
  const [companies, setCompanies] = useState<ChatUser[]>([])

  useEffect(() => {
    const fetchFounders = async () => {
      try {
        const response = await axios.get('/api/investor/chat-founders')
        
        if(response.data){
          setCompanies(response.data.companies)
        }
        else throw new Error('Something went wrong')

      } catch (error) {
        console.error('Error fetching founders:', error)
      }
    }

    if (session?.user?.id) {
      fetchFounders()
    }
  }, [session])

  if (!session?.user?.id){
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <ChatBotUI 
      users={companies}
      isFounder={false}
      currentId={session.user.id}
    />
  )
}