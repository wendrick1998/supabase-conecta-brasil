
import { useState, useCallback } from 'react';
import { Conversation } from '@/types/conversation';

// Define types for filters
export interface InboxFilters {
  searchTerm: string;
  channels: string[];
  statuses: string[];
  priorities: string[];
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  assignmentFilter: string;
  unreadOnly: boolean;
}

// Default filter values
const defaultFilters: InboxFilters = {
  searchTerm: '',
  channels: [],
  statuses: [],
  priorities: [],
  dateRange: {
    from: null,
    to: null,
  },
  assignmentFilter: 'all',
  unreadOnly: false,
};

// Hook for managing inbox filters
export const useInboxFilters = (initialConversations: Conversation[] = []) => {
  const [filters, setFilters] = useState<InboxFilters>(defaultFilters);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>(initialConversations);

  // Handlers for each filter type
  const setSearchTerm = useCallback((term: string) => {
    setFilters(prev => ({ ...prev, searchTerm: term }));
  }, []);

  const setChannelFilter = useCallback((channels: string[]) => {
    setFilters(prev => ({ ...prev, channels }));
  }, []);

  const setStatusFilter = useCallback((statuses: string[]) => {
    setFilters(prev => ({ ...prev, statuses }));
  }, []);

  const setPriorityFilter = useCallback((priorities: string[]) => {
    setFilters(prev => ({ ...prev, priorities }));
  }, []);

  const setDateRangeFilter = useCallback((from: Date | null, to: Date | null) => {
    setFilters(prev => ({ ...prev, dateRange: { from, to } }));
  }, []);

  const setAssignmentFilter = useCallback((assignmentFilter: string) => {
    setFilters(prev => ({ ...prev, assignmentFilter }));
  }, []);

  const setUnreadFilter = useCallback((unreadOnly: boolean) => {
    setFilters(prev => ({ ...prev, unreadOnly }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Apply filters to conversations
  const applyFilters = useCallback((conversations: Conversation[]) => {
    let result = [...conversations];

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(conv => 
        conv.customer_name?.toLowerCase().includes(searchLower) || 
        conv.last_message?.toLowerCase().includes(searchLower)
      );
    }

    // Channel filter
    if (filters.channels.length > 0) {
      result = result.filter(conv => filters.channels.includes(conv.channel));
    }

    // Status filter
    if (filters.statuses.length > 0) {
      result = result.filter(conv => filters.statuses.includes(conv.status));
    }

    // Priority filter (if implemented in the Conversation type)
    if (filters.priorities.length > 0 && 'priority' in result[0]) {
      result = result.filter(conv => 
        filters.priorities.includes((conv as any).priority)
      );
    }

    // Account filter (if implemented)
    if (filters.channels.includes('whatsapp') && 'account_id' in result[0]) {
      result = result.filter(conv => 
        (conv as any).account_id
      );
    }

    // Date range filter
    if (filters.dateRange.from || filters.dateRange.to) {
      result = result.filter(conv => {
        const createdAt = 'created_at' in conv ? 
          new Date((conv as any).created_at) : 
          null;
          
        if (!createdAt) return true;
        
        if (filters.dateRange.from && filters.dateRange.to) {
          return createdAt >= filters.dateRange.from && createdAt <= filters.dateRange.to;
        } else if (filters.dateRange.from) {
          return createdAt >= filters.dateRange.from;
        } else if (filters.dateRange.to) {
          return createdAt <= filters.dateRange.to;
        }
        
        return true;
      });
    }

    // Unread filter
    if (filters.unreadOnly) {
      result = result.filter(conv => 'unread' in conv && (conv as any).unread);
    }

    // Assignment filter
    if (filters.assignmentFilter === 'assigned' && 'assigned_to' in result[0]) {
      result = result.filter(conv => (conv as any).assigned_to);
    } else if (filters.assignmentFilter === 'unassigned' && 'assigned_to' in result[0]) {
      result = result.filter(conv => !(conv as any).assigned_to);
    }

    return result;
  }, [filters]);

  // Update filtered conversations when filters or conversations change
  const updateFilteredConversations = useCallback((conversations: Conversation[]) => {
    const filtered = applyFilters(conversations);
    setFilteredConversations(filtered);
    return filtered;
  }, [applyFilters]);

  return {
    filters,
    filteredConversations,
    setSearchTerm,
    setChannelFilter, 
    setStatusFilter,
    setPriorityFilter,
    setDateRangeFilter,
    setAssignmentFilter,
    setUnreadFilter,
    resetFilters,
    updateFilteredConversations,
    applyFilters
  };
};
