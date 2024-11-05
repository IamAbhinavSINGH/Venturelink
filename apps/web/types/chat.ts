export interface Message {
  id: number;
  content: string;
  SenderId: number;
  SenderType: string;
  createdAt: string;
  chatId: number;
  pending?: boolean;
}

export interface ChatUser {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
}