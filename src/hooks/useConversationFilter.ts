
import { useState, useMemo } from 'react';
import { Conversation } from '@/types/conversation';

export const useConversationFilter = (conversations: Conversation[]) => {
  const [search, setSearch] = useState('');
  const [canalFilter, setCanalFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Filter conversations based on search and filters
  const filteredConversations = useMemo(() => {
    return conversations.filter(conversation => {
      const matchesSearch = search === '' || 
        conversation.lead_nome.toLowerCase().includes(search.toLowerCase()) ||
        conversation.ultima_mensagem.toLowerCase().includes(search.toLowerCase());
      
      const matchesCanal = canalFilter === null || conversation.canal === canalFilter;
      const matchesStatus = statusFilter === null || conversation.status === statusFilter;
      
      return matchesSearch && matchesCanal && matchesStatus;
    });
  }, [conversations, search, canalFilter, statusFilter]);

  return {
    search,
    setSearch,
    canalFilter,
    setCanalFilter,
    statusFilter,
    setStatusFilter,
    filteredConversations
  };
};
