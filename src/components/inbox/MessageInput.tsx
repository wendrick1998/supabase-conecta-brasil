
import React, { useState, useRef } from 'react';
import { Send, Paperclip, SmilePlus, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ChannelType } from '@/utils/conversationUtils';

interface MessageInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  channelType?: ChannelType;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  isLoading = false,
  channelType = 'WhatsApp'
}) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const getPlaceholderByChannel = (channel: ChannelType): string => {
    switch(channel) {
      case 'WhatsApp': return 'Digite uma mensagem no WhatsApp...';
      case 'Instagram': return 'Digite uma mensagem no Instagram...';
      case 'Facebook': return 'Digite uma mensagem no Facebook...';
      case 'Email': return 'Digite um email...';
      default: return 'Digite sua mensagem...';
    }
  }

  return (
    <form onSubmit={handleSend} className="flex items-center gap-2 p-2 border-t border-vendah-purple/20">
      <div className="flex gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="button" size="icon" variant="ghost" className="text-text-muted hover:text-white">
              <PlusCircle className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Adicionar ações</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="button" size="icon" variant="ghost" className="text-text-muted hover:text-white">
              <Paperclip className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Anexar arquivo</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="button" size="icon" variant="ghost" className="text-text-muted hover:text-white">
              <SmilePlus className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Adicionar emoji</TooltipContent>
        </Tooltip>
      </div>
      
      <Input
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={getPlaceholderByChannel(channelType)}
        className="flex-1 bg-surface/40 border-vendah-purple/20"
        disabled={isLoading}
      />
      
      <Button 
        type="submit" 
        size="icon" 
        disabled={!message.trim() || isLoading}
        className="bg-vendah-purple hover:bg-vendah-purple/80"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default MessageInput;
