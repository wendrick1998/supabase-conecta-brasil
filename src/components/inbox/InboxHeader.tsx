
import React from 'react';
import { Button } from "@/components/ui/button";
import { Filter, RefreshCw } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { InboxFilters } from '@/services/inboxService';

interface InboxHeaderProps {
  title: string;
  isLoading: boolean;
  onRefresh: () => void;
  activeFilters: InboxFilters;
  onChannelFilterChange: (channel: 'WhatsApp' | 'Instagram' | 'Facebook' | 'Email') => void;
  onStatusFilterChange: (status: 'Aberta' | 'Fechada') => void;
}

const InboxHeader: React.FC<InboxHeaderProps> = ({
  title,
  isLoading,
  onRefresh,
  activeFilters,
  onChannelFilterChange,
  onStatusFilterChange
}) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="p-2">
              <h4 className="font-medium mb-2">Canais</h4>
              <div className="space-y-2">
                <DropdownMenuCheckboxItem
                  checked={activeFilters.canais?.includes('WhatsApp')}
                  onCheckedChange={() => onChannelFilterChange('WhatsApp')}
                >
                  WhatsApp
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={activeFilters.canais?.includes('Instagram')}
                  onCheckedChange={() => onChannelFilterChange('Instagram')}
                >
                  Instagram
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={activeFilters.canais?.includes('Facebook')}
                  onCheckedChange={() => onChannelFilterChange('Facebook')}
                >
                  Facebook
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={activeFilters.canais?.includes('Email')}
                  onCheckedChange={() => onChannelFilterChange('Email')}
                >
                  Email
                </DropdownMenuCheckboxItem>
              </div>
              
              <h4 className="font-medium mt-4 mb-2">Status</h4>
              <div className="space-y-2">
                <DropdownMenuCheckboxItem
                  checked={activeFilters.status?.includes('Aberta')}
                  onCheckedChange={() => onStatusFilterChange('Aberta')}
                >
                  Aberta
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={activeFilters.status?.includes('Fechada')}
                  onCheckedChange={() => onStatusFilterChange('Fechada')}
                >
                  Fechada
                </DropdownMenuCheckboxItem>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default InboxHeader;
