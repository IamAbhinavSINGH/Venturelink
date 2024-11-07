import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';


interface UseChatProps {
  companyId : string;
  investorId : string;
  isFounder : boolean;
}

interface ChatError {
  type: string;
  message: string;
}

interface Message {
  chatId: number;
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  SenderId: number;
  SenderType: string;
}

export function useChat({ companyId , isFounder , investorId }: UseChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const activeChatId = useRef<number | null>(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_CHAT_SERVER_URL || 'http://localhost:3001', {
      withCredentials: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('investorId int useChat hook : ' , investorId);
        if(Number(investorId) > 0 && Number(companyId) > 0){
            setIsConnected(true);
            setError(null);

            console.log(`trying to connect to chat with data : ` , {
              companyId,
              isFounder,
              investorId
            });

            socket.emit('joinChat', {
              companyId,
              isFounder,
              investorId
            });
        }
    });

    socket.on('chatJoined', ({ chatId, messages }) => {
      activeChatId.current = chatId;
      setMessages(messages);
      setIsLoading(false);
    });

    socket.on('newMessage', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('error', (error: ChatError) => {
      setError(error);
      setIsLoading(false);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      if (activeChatId.current) {
        socket.emit('leaveChat', activeChatId.current);
      }
      socket.disconnect();
    };
  }, [investorId, isFounder, companyId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!socketRef.current || !activeChatId.current) {
      throw new Error('Socket not connected or chat not initialized');
    }

    const senderId = (isFounder) ? companyId : investorId;

    return new Promise((resolve, reject) => {
      socketRef.current!.emit('sendMessage', {
        chatId: activeChatId.current,
        senderId : senderId,
        content,
        senderType: isFounder ? 'founder' : 'investor'
      }, (response: { success: boolean; error?: string; message?: Message }) => {
        if (response.success) {
          resolve(response.message);
        } else {
          reject(new Error(response.error || 'Failed to send message'));
        }
      });
    });
  }, [investorId, isFounder , companyId]);

  return {
    messages,
    sendMessage,
    isConnected,
    error,
    isLoading
  };
}