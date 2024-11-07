'use client'

import { useState, useEffect, useRef } from 'react'
import { useChat } from '@/hooks/useChat'
import { ChatUser } from '@/types/chat'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { Loader2, Send, Bot } from "lucide-react"
import axios from 'axios'

interface Message {
    chatId: number;
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    SenderId: number | null;
    SenderType: string;
    role?: string;
}

interface ChatBotUIProps {
    users: ChatUser[],
    isFounder: boolean,
    currentId: string
}

const CHATBOT_USER: ChatUser = {
    id: 'chatbot',
    name: 'Venturelink AI Assistant',
}

export default function ChatBotUI({ users, isFounder, currentId }: ChatBotUIProps) {
    const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
    const [inputMessage, setInputMessage] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [chatbotMessages, setChatbotMessages] = useState<Message[]>([]);
    const [isChatbotLoading, setIsChatbotLoading] = useState(false);

    const { messages, sendMessage, isConnected, isLoading } = useChat({
        companyId: isFounder ? currentId : selectedUser?.id || '',
        isFounder,
        investorId: isFounder ? selectedUser?.id || '' : currentId
    });

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages, chatbotMessages])

    useEffect(() => {
        if (selectedUser?.id === CHATBOT_USER.id) {
            fetchChatbotHistory();
        }
    }, [selectedUser])

    const fetchChatbotHistory = async () => {
        try {
            setIsChatbotLoading(true)
            const response = await axios.get(`/api/chatbot?userId=${currentId}&isFounder=${isFounder}`)
            setChatbotMessages(response.data.messages)
        } catch (error) {
            console.error('Failed to fetch chatbot history:', error)
        } finally {
            setIsChatbotLoading(false)
        }
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (inputMessage.trim()) {
            if (selectedUser?.id === CHATBOT_USER.id) {
                setInputMessage('');
                await sendChatbotMessage(inputMessage)
            } else if (selectedUser) {
                try {
                    await sendMessage(inputMessage)
                } catch (error) {
                    console.error('Failed to send message:', error)
                }
            }
            setInputMessage('')
            scrollToBottom();
        }
    }

    const sendChatbotMessage = async (message: string) => {
        try {
            setIsChatbotLoading(true)
            const response = await axios.post('/api/chatbot', {
                message,
                userId: currentId,
                isFounder
            })

            setChatbotMessages(prev => [...prev, response.data.userMessage, response.data.botMessage])
        } catch (error) {
            console.error('Failed to get chatbot response:', error)
        } finally {
            setIsChatbotLoading(false)
        }
    }

    const displayMessages = selectedUser?.id === CHATBOT_USER.id ? chatbotMessages : messages

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-3xl font-semibold">Messages</h1>
            <div className="flex gap-6 h-[calc(100vh-8rem)]">
                <Card className="w-80">
                    <ScrollArea className="h-full">
                        <div className='flex flex-col'>
                            <p className='p-4 text-lg font-semibold text-gray-900'>
                                {isFounder ? "Investors List" : "Companies List"}
                            </p>
                            <Separator />
                        </div>
                        <Button
                            variant="ghost"
                            className={`w-full justify-start p-4 h-auto ${selectedUser?.id === CHATBOT_USER.id ? 'bg-gray-100' : ''}`}
                            onClick={() => setSelectedUser(CHATBOT_USER)}
                        >
                            <Avatar className="h-8 w-8 mr-3">
                                <AvatarFallback className="bg-primary/10">
                                    <Bot className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{CHATBOT_USER.name}</span>
                        </Button>
                        <Separator />
                        {users.map((user: ChatUser) => (
                            <div key={user.id}>
                                <Button
                                    variant="ghost"
                                    className={`w-full justify-start p-4 h-auto ${user.id === selectedUser?.id ? 'bg-gray-100' : ''}`}
                                    onClick={() => setSelectedUser(user)}
                                >
                                    <Avatar className="h-8 w-8 mr-3">
                                        <AvatarFallback className="bg-primary/10">
                                            {user.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{user.name}</span>
                                </Button>
                                <Separator />
                            </div>
                        ))}
                    </ScrollArea>
                </Card>

                <Card className="flex-1 flex flex-col">
                    {selectedUser ? (
                        <>
                            <div className="p-4 border-b">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        {selectedUser.id === CHATBOT_USER.id ? (
                                            <AvatarFallback className="bg-primary/10">
                                                <Bot className="h-6 w-6" />
                                            </AvatarFallback>
                                        ) : (
                                            <AvatarFallback className="bg-primary/10">
                                                {selectedUser.name.charAt(0)}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div className="w-full inline-flex justify-between">
                                        <div className="flex flex-col">
                                            <h2 className="font-semibold">{selectedUser.name}</h2>
                                            <p className={`text-muted-foreground`}>
                                                {selectedUser.id === CHATBOT_USER.id ? 'AI Assistant' : (isConnected ? 'Connected' : 'Disconnected')}
                                            </p>
                                        </div>
                                        {selectedUser.id !== CHATBOT_USER.id && (
                                            <p className="text-muted-foreground text-end flex items-end">
                                                {isFounder ? 'Investor' : 'Founder'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <ScrollArea className="flex-grow p-4" ref={chatContainerRef}>
                                {(isLoading && selectedUser.id !== CHATBOT_USER.id) || (isChatbotLoading && selectedUser.id === CHATBOT_USER.id) ? (
                                    <div className="flex justify-center items-center h-full">
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {displayMessages.map((message: Message) => (
                                            <div
                                                key={message.id}
                                                className={`flex ${message.SenderType.toLowerCase() === (isFounder ? 'founder' : 'investor') || message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[70%] rounded-lg px-4 py-2 ${message.SenderType.toLowerCase() === (isFounder ? 'founder' : 'investor') || message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                                                >
                                                    <p>{message.content}</p>
                                                    <span className="text-xs opacity-70 mt-1 block">
                                                        {new Date(message.createdAt).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>

                            <div className="p-4 border-t">
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        className="flex-grow"
                                    />
                                    <Button 
                                        type="submit" 
                                        size="icon" 
                                        disabled={(selectedUser.id !== CHATBOT_USER.id && (!isConnected || isLoading)) || (selectedUser.id === CHATBOT_USER.id && isChatbotLoading)}
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex justify-center items-center h-full text-muted-foreground">
                            Select a conversation to start messaging
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}