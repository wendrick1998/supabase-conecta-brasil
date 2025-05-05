
import { useState, useEffect, useMemo } from 'react';
import { getConnectedAccounts, type InboxFilters, type ConnectedAccount } from '@/services/inbox/conversationQueries';

export const useInboxFilters = () => {
  const [filters, setFilters] = useState<InboxFilters>({});
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [availableChannels, setAvailableChannels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

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
  };

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

  return {
    filters,
    updateFilters,
    clearFilters,
    connectedAccounts,
    availableChannels,
    loading,
    activeFilterCount
  };
};
