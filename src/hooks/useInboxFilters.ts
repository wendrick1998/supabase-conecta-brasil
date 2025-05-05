
import { useState, useEffect, useMemo } from 'react';
import { getConnectedAccounts, type InboxFilters, type ConnectedAccount } from '@/services/inbox/conversationQueries';
import { Conversation } from '@/types/conversation';

export const useInboxFilters = (conversations: Conversation[] = []) => {
  const [filters, setFilters] = useState<InboxFilters>({});
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [availableChannels, setAvailableChannels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  // Fetch connected accounts on component mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const accounts = await getConnectedAccounts();
        setConnectedAccounts(accounts);
        
        // Extract unique channels from accounts
        const channels = [...new Set(accounts.map(account => account.canal))];
        setAvailableChannels(channels);
      } catch (error) {
        console.error('Error fetching connected accounts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // Update filters
  const updateFilters = (newFilters: Partial<InboxFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };
  
  // Filter conversations based on current filters
  const filteredConversations = useMemo(() => {
    return conversations.filter(conv => {
      // Filter by search term
      if (searchTerm && !conv.lead_nome?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filter by channel
      if (filters.canais?.length && !filters.canais.includes(conv.canal)) {
        return false;
      }
      
      // Filter by status
      if (filters.status?.length && !filters.status.includes(conv.status)) {
        return false;
      }
      
      // Filter by priority
      if (filters.priority && conv.priority !== filters.priority) {
        return false;
      }
      
      // Filter by account
      if (filters.accountId && conv.account_id !== filters.accountId) {
        return false;
      }
      
      // Filter by date range
      if (filters.dateRange) {
        const convDate = new Date(conv.created_at);
        if (convDate < filters.dateRange.from || convDate > filters.dateRange.to) {
          return false;
        }
      }
      
      // Filter by tab
      if (selectedTab === 'unread' && !conv.unread) {
        return false;
      } else if (selectedTab === 'assigned' && !conv.assigned_to) {
        return false;
      } else if (selectedTab === 'resolved' && conv.status !== 'resolved') {
        return false;
      }
      
      return true;
    });
  }, [conversations, filters, searchTerm, selectedTab]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    
    if (filters.search && filters.search.trim()) count++;
    if (filters.canais && filters.canais.length) count++;
    if (filters.status && filters.status.length) count++;
    if (filters.priority) count++;
    if (filters.dateRange) count++;
    
    return count;
  }, [filters]);
  
  // Handler functions
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    updateFilters({ search: term });
  };
  
  const handleChannelFilterChange = (channels: string[]) => {
    updateFilters({ canais: channels });
  };
  
  const handleStatusFilterChange = (statuses: string[]) => {
    updateFilters({ status: statuses });
  };
  
  const handleDateRangeChange = (dateRange: { from: Date; to: Date } | null) => {
    updateFilters({ dateRange: dateRange || undefined });
  };
  
  const handlePriorityChange = (priority: string | null) => {
    updateFilters({ priority: priority || undefined });
  };
  
  const handleAccountFilterChange = (accountId: string | null) => {
    updateFilters({ accountId: accountId || undefined });
  };
  
  const handleClearFilters = () => {
    clearFilters();
  };

  return {
    filters,
    updateFilters,
    clearFilters,
    connectedAccounts,
    availableChannels,
    loading,
    activeFilterCount,
    filteredConversations,
    searchTerm,
    selectedTab,
    setSelectedTab,
    handleSearchChange,
    handleChannelFilterChange,
    handleStatusFilterChange,
    handleDateRangeChange,
    handlePriorityChange,
    handleAccountFilterChange,
    handleClearFilters,
    activeFilters: filters
  };
};
