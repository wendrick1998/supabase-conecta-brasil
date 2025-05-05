
import { useState, useEffect } from 'react';
import { Conversation } from '@/types/conversation';
import { InboxFilters } from '@/services/inboxService';

export const useInboxFilters = (conversations: Conversation[]) => {
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [activeFilters, setActiveFilters] = useState<InboxFilters>({
    canais: [],
    status: ['Aberta']
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  // Apply filters whenever they change
  useEffect(() => {
    applyFilters();
  }, [activeFilters, searchTerm, selectedTab, conversations]);

  // Apply filters to the conversations
  const applyFilters = () => {
    let filtered = [...conversations];
    
    // Apply tab filters
    if (selectedTab === 'unread') {
      filtered = filtered.filter(conv => conv.nao_lida);
    } else if (selectedTab !== 'all') {
      filtered = filtered.filter(conv => conv.canal.toLowerCase() === selectedTab);
    }
    
    // Apply channel filters
    if (activeFilters.canais && activeFilters.canais.length > 0) {
      filtered = filtered.filter(conv => 
        activeFilters.canais?.includes(conv.canal as 'WhatsApp' | 'Instagram' | 'Facebook' | 'Email')
      );
    }
    
    // Filter by status
    if (activeFilters.status && activeFilters.status.length > 0) {
      filtered = filtered.filter(conv => 
        activeFilters.status?.includes(conv.status as 'Aberta' | 'Fechada')
      );
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(conv => 
        conv.lead_nome.toLowerCase().includes(searchLower) || 
        conv.ultima_mensagem.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredConversations(filtered);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle channel filter change
  const handleChannelFilterChange = (channel: 'WhatsApp' | 'Instagram' | 'Facebook' | 'Email') => {
    setActiveFilters(prev => {
      const channelFilters = prev.canais || [];
      const newChannelFilters = channelFilters.includes(channel)
        ? channelFilters.filter(c => c !== channel)
        : [...channelFilters, channel];
      
      return {
        ...prev,
        canais: newChannelFilters
      };
    });
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (status: 'Aberta' | 'Fechada') => {
    setActiveFilters(prev => {
      const statusFilters = prev.status || [];
      const newStatusFilters = statusFilters.includes(status)
        ? statusFilters.filter(s => s !== status)
        : [...statusFilters, status];
      
      return {
        ...prev,
        status: newStatusFilters
      };
    });
  };

  return {
    filteredConversations,
    activeFilters,
    searchTerm,
    selectedTab,
    setSelectedTab,
    handleSearchChange,
    handleChannelFilterChange,
    handleStatusFilterChange
  };
};
