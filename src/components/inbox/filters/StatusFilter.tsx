
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface StatusFilterProps {
  activeStatuses: ('Aberta' | 'Fechada')[];
  onStatusChange: (status: 'Aberta' | 'Fechada') => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ 
  activeStatuses, 
  onStatusChange 
}) => {
  return (
    <div>
      <Label className="text-xs font-medium mb-2 block">Status</Label>
      <div className="flex space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="filter-aberta" 
            checked={activeStatuses.includes('Aberta')}
            onCheckedChange={() => onStatusChange('Aberta')}
          />
          <label htmlFor="filter-aberta" className="text-sm">Abertas</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="filter-fechada" 
            checked={activeStatuses.includes('Fechada')}
            onCheckedChange={() => onStatusChange('Fechada')}
          />
          <label htmlFor="filter-fechada" className="text-sm">Fechadas</label>
        </div>
      </div>
    </div>
  );
};

export default StatusFilter;
