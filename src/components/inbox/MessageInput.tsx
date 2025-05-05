
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, SmilePlus, PlusCircle, Camera, Mic, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ChannelType } from '@/utils/conversationUtils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MessageInputProps {
  onSend: (message: string) => void;
  onSendMedia?: (file: File, caption: string) => Promise<void>;
  isLoading?: boolean;
  channelType?: ChannelType;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  onSendMedia,
  isLoading = false,
  channelType = 'WhatsApp'
}) => {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [channelType]);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && onSendMedia) {
      const file = files[0];
      
      // Validate file type and size
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/webm'];
      const validDocTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      const isImage = validImageTypes.includes(file.type);
      const isVideo = validVideoTypes.includes(file.type);
      const isDocument = validDocTypes.includes(file.type);
      
      // Check file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (file.size > maxSize) {
        alert('Arquivo muito grande. O tamanho máximo é 10MB.');
        return;
      }
      
      // Check if file type is supported by the channel
      if (channelType === 'Email') {
        // Email supports all file types
        onSendMedia(file, message);
        setMessage('');
      } else if (channelType === 'WhatsApp') {
        // WhatsApp supports images, videos, and documents
        if (isImage || isVideo || isDocument) {
          onSendMedia(file, message);
          setMessage('');
        } else {
          alert('Tipo de arquivo não suportado pelo WhatsApp');
        }
      } else if (channelType === 'Instagram' || channelType === 'Facebook') {
        // Instagram and Facebook only support images and videos
        if (isImage || isVideo) {
          onSendMedia(file, message);
          setMessage('');
        } else {
          alert(`Tipo de arquivo não suportado pelo ${channelType}. Apenas imagens e vídeos são permitidos.`);
        }
      }
    }
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSend} className="flex items-center gap-2 p-2 border-t border-vendah-purple/20">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept={
          channelType === 'Email' 
            ? '*/*' 
            : channelType === 'WhatsApp'
              ? 'image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              : 'image/*,video/*'
        }
      />
      
      <div className="flex gap-1">
        {(channelType === 'WhatsApp' || channelType === 'Instagram' || channelType === 'Facebook') && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" size="icon" variant="ghost" className="text-text-muted hover:text-white">
                <PlusCircle className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                <Image className="h-4 w-4 mr-2" />
                Enviar imagem
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                <Camera className="h-4 w-4 mr-2" />
                Enviar vídeo
              </DropdownMenuItem>
              
              {channelType === 'WhatsApp' && (
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                  <Paperclip className="h-4 w-4 mr-2" />
                  Enviar documento
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        {channelType === 'Email' && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                size="icon" 
                variant="ghost" 
                className="text-text-muted hover:text-white"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Anexar arquivo</TooltipContent>
          </Tooltip>
        )}
        
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
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        placeholder={getPlaceholderByChannel(channelType)}
        className="flex-1 bg-surface/40 border-vendah-purple/20"
        disabled={isLoading}
      />
      
      <Button 
        type="submit" 
        size="icon" 
        disabled={(!message.trim() || isLoading || isComposing)}
        className="bg-vendah-purple hover:bg-vendah-purple/80"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default MessageInput;
