
import { useState, useEffect } from 'react';
import { Conversation } from '@/types/conversation';
import { InboxFilters, getConnectedAccounts } from '@/services/inboxService';

export const useInboxFilters = (conversations: Conversation[]) => {
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [activeFilters, setActiveFilters] = useState<InboxFilters>({
    canais: [],
    status: ['Aberta']
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [connectedAccounts, setConnectedAccounts] = useState<Array<{id: string, nome: string, canal: string}>>([]);
  
  // Fetch connected accounts on component mount
  useEffect(() => {
    const fetchAccounts = async () => {
      const accounts = await getConnectedAccounts();
      setConnectedAccounts(accounts);
    };
    
    fetchAccounts();
  }, []);

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
        activeFilters.canais?.includes(conv.canal)
      );
    }
    
    // Filter by status
    if (activeFilters.status && activeFilters.status.length > 0) {
      filtered = filtered.filter(conv => 
        activeFilters.status?.includes(conv.status)
      );
    }
    
    // Filter by date range
    if (activeFilters.dateRange) {
      const fromTime = activeFilters.dateRange.from.getTime();
      const toTime = activeFilters.dateRange.to.getTime();
      
      filtered = filtered.filter(conv => {
        const convTime = new Date(conv.horario).getTime();
        return convTime >= fromTime && convTime <= toTime;
      });
    }
    
    // Filter by priority
    if (activeFilters.priority) {
      filtered = filtered.filter(conv => {
        // Check if prioridade property exists before filtering
        return 'prioridade' in conv && conv.prioridade === activeFilters.priority;
      });
    }
    
    // Filter by account
    if (activeFilters.accountId) {
      filtered = filtered.filter(conv => {
        // Check if conexao_id property exists before filtering
        return 'conexao_id' in conv && conv.conexao_id === activeFilters.accountId;
      });
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
  const handleChannelFilterChange = (channel: string) => {
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
  const handleStatusFilterChange = (status: string) => {
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
  
  // Handle date range filter change
  const handleDateRangeChange = (range: { from: Date; to: Date } | null) => {
    setActiveFilters(prev => ({
      ...prev,
      dateRange: range
    }));
  };
  
  // Handle priority filter change
  const handlePriorityChange = (priority: string) => {
    // Use "all" to represent "no filter" but store as undefined in the filter object
    setActiveFilters(prev => ({
      ...prev,
      priority: priority === "all" ? undefined : priority
    }));
  };
  
  // Handle account filter change
  const handleAccountFilterChange = (accountId: string) => {
    setActiveFilters(prev => ({
      ...prev,
      accountId: accountId || undefined
    }));
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setActiveFilters({
      canais: [],
      status: ['Aberta'],
    });
    setSearchTerm('');
  };

  return {
    filteredConversations,
    activeFilters,
    searchTerm,
    selectedTab,
    connectedAccounts,
    setSelectedTab,
    handleSearchChange,
    handleChannelFilterChange,
    handleStatusFilterChange,
    handleDateRangeChange,
    handlePriorityChange,
    handleAccountFilterChange,
    handleClearFilters
  };
};
