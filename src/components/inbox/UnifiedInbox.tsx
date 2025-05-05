
import React, { useState, useEffect } from 'react';
import { InboxLayout } from '@/components/inbox/InboxLayout';
import { getConversations, subscribeToConversations } from '@/services/inboxService';
import { toast } from 'sonner';
import InboxHeader from './InboxHeader';
import InboxSearchBar from './InboxSearchBar';
import InboxTabs from './InboxTabs';
import { useInboxFilters } from '@/hooks/useInboxFilters';
import AccountSelector, { ConnectedAccount } from '../channels/AccountSelector';

export const UnifiedInbox: React.FC = () => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
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
  } = useInboxFilters(conversations);
  
  // Load conversations
  useEffect(() => {
    loadConversations();
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToConversations(
      // On Insert
      (newConversation) => {
        setConversations(prev => [newConversation, ...prev]);
      },
      // On Update
      (updatedConversation) => {
        setConversations(prev => 
          prev.map(conv => conv.id === updatedConversation.id ? updatedConversation : conv)
        );
      },
      // On Delete
      (deletedId) => {
        setConversations(prev => prev.filter(conv => conv.id !== deletedId));
      }
    );
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Load conversations
  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const data = await getConversations(activeFilters);
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Erro ao carregar conversas');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Refresh conversations
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const data = await getConversations(activeFilters);
      setConversations(data);
      toast.success('Conversas atualizadas');
    } catch (error) {
      console.error('Error refreshing conversations:', error);
      toast.error('Erro ao atualizar conversas');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle account selection
  const handleAccountSelect = (accountId: string) => {
    handleAccountFilterChange(accountId);
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-vendah-purple/20 space-y-4">
        <InboxHeader 
          title="Inbox Unificado"
          isLoading={isLoading}
          onRefresh={handleRefresh}
          activeFilters={activeFilters}
          onChannelFilterChange={handleChannelFilterChange}
          onStatusFilterChange={handleStatusFilterChange}
          onDateRangeChange={handleDateRangeChange}
          onPriorityChange={handlePriorityChange}
          onClearFilters={handleClearFilters}
          connectedAccounts={connectedAccounts}
          onAccountFilterChange={handleAccountFilterChange}
        />
        
        {connectedAccounts.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-muted mr-1">Conta:</span>
            <div className="w-[240px]">
              <AccountSelector 
                accounts={connectedAccounts.map(acc => ({
                  id: acc.id,
                  name: acc.nome,
                  channelType: acc.canal,
                  status: true
                }))}
                selectedAccountId={activeFilters.accountId || null}
                onAccountSelect={handleAccountSelect}
                channelType="ativa"
              />
            </div>
          </div>
        )}
        
        <InboxSearchBar 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
        
        <InboxTabs 
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          conversations={conversations}
        />
      </div>
      
      <InboxLayout 
        conversations={filteredConversations}
        isLoading={isLoading}
        emptyMessage={
          searchTerm || 
          Object.values(activeFilters).some(f => 
            Array.isArray(f) ? f.length > 0 : f !== undefined
          )
            ? 'Nenhuma conversa corresponde aos filtros aplicados'
            : 'Nenhuma conversa disponível'
        }
      />
    </div>
  );
};
