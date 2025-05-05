
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';
import { InboxFilters } from '@/services/inboxService';
import AdvancedFilters from './AdvancedFilters';
import AccountSelector from '../channels/AccountSelector';

interface InboxHeaderProps {
  title: string;
  isLoading: boolean;
  onRefresh: () => void;
  activeFilters: InboxFilters;
  onChannelFilterChange: (channel: 'WhatsApp' | 'Instagram' | 'Facebook' | 'Email') => void;
  onStatusFilterChange: (status: 'Aberta' | 'Fechada') => void;
  onDateRangeChange: (range: { from: Date; to: Date } | null) => void;
  onPriorityChange: (priority: string) => void;
  onClearFilters: () => void;
  connectedAccounts?: Array<{id: string, nome: string, canal: string}>;
  onAccountFilterChange?: (accountId: string) => void;
}

const InboxHeader: React.FC<InboxHeaderProps> = ({
  title,
  isLoading,
  onRefresh,
  activeFilters,
  onChannelFilterChange,
  onStatusFilterChange,
  onDateRangeChange,
  onPriorityChange,
  onClearFilters,
  connectedAccounts,
  onAccountFilterChange
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{title}</h1>
        <Button 
          variant="outline" 
          size="icon"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <AdvancedFilters 
          activeFilters={activeFilters}
          onChannelFilterChange={onChannelFilterChange}
          onStatusFilterChange={onStatusFilterChange}
          onDateRangeChange={onDateRangeChange}
          onPriorityChange={onPriorityChange}
          onClearFilters={onClearFilters}
        />
        
        {connectedAccounts && onAccountFilterChange && (
          <div className="w-full sm:w-52">
            <AccountSelector 
              accounts={connectedAccounts.map(account => ({
                id: account.id,
                name: account.nome,
                channelType: account.canal,
                status: true
              }))}
              selectedAccountId={activeFilters.accountId || null}
              onAccountSelect={onAccountFilterChange}
              channelType={activeFilters.channel || "Todos"}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxHeader;
