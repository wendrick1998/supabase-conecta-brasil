
import React, { useState } from 'react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { InboxFilters } from '@/services/inboxService';

// Import smaller filter components
import ChannelFilter from './filters/ChannelFilter';
import StatusFilter from './filters/StatusFilter';
import PriorityFilter from './filters/PriorityFilter';
import DateRangeFilter from './filters/DateRangeFilter';
import FilterCountBadge from './filters/FilterCountBadge';

interface AdvancedFiltersProps {
  activeFilters: InboxFilters;
  onChannelFilterChange: (channel: 'WhatsApp' | 'Instagram' | 'Facebook' | 'Email') => void;
  onStatusFilterChange: (status: 'Aberta' | 'Fechada') => void;
  onDateRangeChange: (range: { from: Date; to: Date } | null) => void;
  onPriorityChange: (priority: string) => void;
  onClearFilters: () => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  activeFilters,
  onChannelFilterChange,
  onStatusFilterChange,
  onDateRangeChange,
  onPriorityChange,
  onClearFilters
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: activeFilters.dateRange?.from,
    to: activeFilters.dateRange?.to
  });
  
  return (
    <div className="flex items-center">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1 relative">
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
            <FilterCountBadge activeFilters={activeFilters} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">Filtros Avançados</h3>
            {Object.keys(activeFilters).length > 0 && (
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onClearFilters}>
                Limpar filtros
              </Button>
            )}
          </div>
          
          <Separator className="my-2" />
          
          <div className="space-y-4">
            {/* Channel Filter */}
            <ChannelFilter 
              activeChannels={activeFilters.canais || []} 
              onChannelChange={onChannelFilterChange} 
            />
            
            {/* Status Filter */}
            <StatusFilter 
              activeStatuses={activeFilters.status || []} 
              onStatusChange={onStatusFilterChange} 
            />
            
            {/* Priority Filter */}
            <PriorityFilter 
              priority={activeFilters.priority} 
              onPriorityChange={onPriorityChange} 
            />
            
            {/* Date Range Filter */}
            <DateRangeFilter 
              dateRange={dateRange}
              setDateRange={setDateRange}
              onDateRangeChange={onDateRangeChange}
            />
          </div>
          
          <div className="flex justify-end mt-4">
            <Button size="sm" onClick={() => setIsOpen(false)}>
              Fechar
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AdvancedFilters;
