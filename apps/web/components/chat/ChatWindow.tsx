import { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ChatWindowProps {
  companyId : string,
  isFounder : boolean,
  investorId : string,
  className?: string;
}

export default function ChatWindow({
  companyId,
  isFounder,
  investorId,
  className
}: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const {
    messages,
    sendMessage,
    isConnected,
    error,
    isLoading
  } = useChat({ companyId , isFounder , investorId });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(inputValue.trim());
      setInputValue('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-destructive">Error: {error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              `flex flex-col max-w-[70%] space-y-1 
              ${
                (
                  message.SenderId ===  (isFounder ? parseInt(companyId) : parseInt(investorId)) &&
                  message.SenderType === (isFounder ? "founder" : "investor")
                )
              ? "ml-auto items-end" : "items-start" } ` 
            )}
          >
            <div
              className={cn(
                `rounded-lg px-4 py-2 
                ${
                  (
                    message.SenderId ===  (isFounder ? parseInt(companyId) : parseInt(investorId)) &&
                    message.SenderType === (isFounder ? "founder" : "investor")
                  )
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted" } `
              )}
            >
              {message.content}
            </div>
            <span className="text-xs text-muted-foreground">
              {format(new Date(message.createdAt), 'HH:mm')}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            disabled={!isConnected || isSending}
          />
          <Button type="submit" disabled={!isConnected || isSending}>
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}