
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Conversation } from '@/types/conversation';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

interface ConversationListProps {
  selectedConversationId?: string;
  onSelectConversation: (conversation: Conversation) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  selectedConversationId,
  onSelectConversation
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .order('horario', { ascending: false });

        if (error) {
          console.error('Error fetching conversations:', error);
          throw error;
        }

        // Properly cast the data to the Conversation type
        const typedConversations = data?.map(conv => ({
          ...conv,
          canal: conv.canal as "WhatsApp" | "Instagram" | "Email",
          status: conv.status as "Aberta" | "Fechada",
          nao_lida: Boolean(conv.nao_lida),
          avatar: conv.avatar || undefined
        })) || [];

        setConversations(typedConversations);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();

    // Set up realtime subscription
    const channel = supabase
      .channel('conversations-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'conversations' 
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newConv = payload.new;
            // Ensure the new conversation is properly typed
            const typedConversation: Conversation = {
              ...newConv,
              canal: newConv.canal as "WhatsApp" | "Instagram" | "Email",
              status: newConv.status as "Aberta" | "Fechada",
              nao_lida: Boolean(newConv.nao_lida),
              avatar: newConv.avatar || undefined
            };
            setConversations(prev => [typedConversation, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedConv = payload.new;
            // Ensure the updated conversation is properly typed
            const typedConversation: Conversation = {
              ...updatedConv,
              canal: updatedConv.canal as "WhatsApp" | "Instagram" | "Email",
              status: updatedConv.status as "Aberta" | "Fechada",
              nao_lida: Boolean(updatedConv.nao_lida),
              avatar: updatedConv.avatar || undefined
            };
            setConversations(prev => 
              prev.map(conv => 
                conv.id === typedConversation.id ? typedConversation : conv
              ).sort((a, b) => new Date(b.horario).getTime() - new Date(a.horario).getTime())
            );
          } else if (payload.eventType === 'DELETE') {
            setConversations(prev => 
              prev.filter(conv => conv.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredConversations = conversations.filter(conv => 
    conv.lead_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.ultima_mensagem.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getChannelColor = (canal: Conversation['canal']) => {
    switch (canal.toLowerCase() as string) {
      case 'whatsapp': return 'bg-green-500';
      case 'instagram': return 'bg-pink-500';
      case 'email': return 'bg-blue-500';
      default: return 'bg-gray-500';
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
      {/* Search bar */}
      <div className="p-4 border-b border-vendah-purple/20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
          <Input
            placeholder="Buscar conversas..."
            className="pl-10 bg-surface/40 border-vendah-purple/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

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
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-text-muted">
            {searchTerm ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa disponível'}
          </div>
        ) : (
          filteredConversations.map(conversation => (
            <div
              key={conversation.id}
              className={`p-4 border-b border-vendah-purple/10 cursor-pointer hover:bg-vendah-purple/10 transition-colors ${
                selectedConversationId === conversation.id ? 'bg-vendah-purple/20' : ''
              }`}
              onClick={() => onSelectConversation(conversation)}
            >
              <div className="flex justify-between mb-1">
                <div className="flex items-center">
                  <span className="font-medium text-white">{conversation.lead_nome}</span>
                  <Badge 
                    variant="outline" 
                    className={`ml-2 text-white ${getChannelColor(conversation.canal)}`}
                  >
                    {conversation.canal}
                  </Badge>
                </div>
                <span className="text-xs text-text-muted">
                  {formatTime(conversation.horario)}
                </span>
              </div>
              <div className="text-sm text-text-muted truncate">
                {conversation.nao_lida && (
                  <span className="inline-block w-2 h-2 rounded-full bg-vendah-neon mr-2"></span>
                )}
                {conversation.ultima_mensagem}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
