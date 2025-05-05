
import { useState } from 'react';
import { toast } from "@/components/ui/sonner";
import { Message } from '@/types/conversation';
import { supabase } from "@/integrations/supabase/client";
import { validateConversationId } from './utils/messageUtils';

export const useFetchMessages = (conversationId: string | undefined) => {
  const [isLoadingMoreMessages, setIsLoadingMoreMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  // Otimização: Carregar mensagens com paginação
  const fetchMessages = async (
    limit: number = 20,
    startFromIndex: number = 0,
    resetMessages: boolean = false
  ): Promise<Message[]> => {
    if (!validateConversationId(conversationId)) {
      return [];
    }

    setIsLoadingMoreMessages(true);

    try {
      // Consulta otimizada: uso de range e ordenação reversa para paginação eficiente
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          sender_type,
          timestamp,
          status,
          attachment
        `)
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: false })
        .range(startFromIndex, startFromIndex + limit - 1);

      if (error) {
        console.error('Erro ao carregar mensagens:', error);
        throw error;
      }

      // Atualizar flag de mais mensagens
      setHasMoreMessages(data.length === limit);

      // Inverter a ordem para exibir mais antigas primeiro
      const messages = data.reverse();
      
      return messages as Message[];
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      toast.error('Não foi possível carregar as mensagens');
      return [];
    } finally {
      setIsLoadingMoreMessages(false);
    }
  };

  return {
    isLoadingMoreMessages,
    hasMoreMessages,
    fetchMessages
  };
};
