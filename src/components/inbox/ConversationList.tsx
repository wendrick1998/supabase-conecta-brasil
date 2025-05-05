
import React from 'react';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Conversation } from '@/types/conversation';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ConversationListProps {
  conversations: Conversation[];
  isLoading?: boolean;
  emptyMessage?: string;
  selectedConversationId?: string;
  onSelectConversation: (conversation: Conversation) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  isLoading = false,
  emptyMessage = "Nenhuma conversa disponível",
  selectedConversationId,
  onSelectConversation
}) => {
  // Helper function to get initials from a name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Helper function to get channel color
  const getChannelColor = (canal: Conversation['canal']) => {
    switch (canal) {
      case 'WhatsApp': return 'bg-[#25D366]';
      case 'Instagram': return 'bg-[#C13584]';
      case 'Facebook': return 'bg-[#1877F2]';
      case 'Email': return 'bg-black';
      default: return 'bg-gray-500';
    }
  };

  const getChannelIndicator = (canal: Conversation['canal']) => {
    switch (canal) {
      case 'WhatsApp': return 'W';
      case 'Instagram': return 'I';
      case 'Facebook': return 'F';
      case 'Email': return 'E';
      default: return '';
    }
  };

  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { 
        addSuffix: true,
        locale: ptBR
      });
    } catch (error) {
      return 'data desconhecida';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* List of conversations */}
      <div className="overflow-y-auto flex-grow">
        {isLoading ? (
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="p-4 border-b border-vendah-purple/10">
              <div className="flex justify-between mb-1">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <Skeleton className="h-4 w-3/4 mt-2" />
            </div>
          ))
        ) : conversations.length === 0 ? (
          <div className="p-8 text-center text-text-muted">
            {emptyMessage}
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b border-vendah-purple/10 cursor-pointer hover:bg-vendah-purple/10 transition-colors ${
                selectedConversationId === conversation.id ? 'bg-vendah-purple/20' : ''
              }`}
              onClick={() => onSelectConversation(conversation)}
            >
              <div className="flex gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.avatar} alt={conversation.lead_nome} />
                    <AvatarFallback className="bg-surface/60">{getInitials(conversation.lead_nome)}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${getChannelColor(conversation.canal)} text-white text-[8px] font-bold`}>
                    {getChannelIndicator(conversation.canal)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <span className="font-medium text-white">{conversation.lead_nome}</span>
                    </div>
                    <span className="text-xs text-text-muted">
                      {formatTime(conversation.horario)}
                    </span>
                  </div>
                  <div className="text-sm text-text-muted truncate flex items-center">
                    {conversation.nao_lida && (
                      <span className="inline-block w-2 h-2 rounded-full bg-vendah-neon mr-2"></span>
                    )}
                    {conversation.ultima_mensagem}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;
