
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { InboxFilters } from '@/services/inboxService';

interface FilterCountBadgeProps {
  activeFilters: InboxFilters;
}

const FilterCountBadge: React.FC<FilterCountBadgeProps> = ({ activeFilters }) => {
  const getActiveFiltersCount = () => {
    let count = 0;
    if (activeFilters.canais && activeFilters.canais.length > 0) count += activeFilters.canais.length;
    if (activeFilters.status && activeFilters.status.length > 0) count += activeFilters.status.length;
    if (activeFilters.dateRange) count += 1;
    if (activeFilters.priority) count += 1;
    if (activeFilters.accountId) count += 1;
    return count;
  };
  
  const filterCount = getActiveFiltersCount();
  
  if (filterCount === 0) {
    return null;
  }
  
  return (
    <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full ml-1 text-[10px]">
      {filterCount}
    </Badge>
  );
};

export default FilterCountBadge;
