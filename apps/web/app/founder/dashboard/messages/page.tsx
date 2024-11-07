"use client"

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { ChatUser } from '@/types/chat'
import { redirect, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import ChatBotUI from '@/components/chat/ChatBotUI'

export default function FounderMessagesPage() {
  const { data: session } = useSession()
  const [investors, setInvestors] = useState<ChatUser[]>([])
  const searchParams = useSearchParams()
  const companyId = searchParams.get('company')

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        if (!companyId) {
          throw new Error('Company ID is missing')
        }
        const response = await axios.get(`/api/founder/chat-investors?company=${companyId}`);
        
        if(response.data){
          setInvestors(response.data.investors)
        }
        else throw new Error('Something went wrong')

      } catch (error) {
        console.error('Error fetching investors:', error)
      }
    }

    if (session?.user?.id && companyId) {
      fetchInvestors()
    }
  }, [session, companyId])

  if(!companyId){
    redirect('/founder/dashboard');
  }

  if (!session?.user?.id || !companyId){
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <ChatBotUI
      users={investors}
      isFounder={true}
      currentId={companyId}
    />
  )
}