
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface StatusFilterProps {
  activeStatuses: string[];
  onStatusChange: (status: string) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ 
  activeStatuses, 
  onStatusChange 
}) => {
  const statuses = [
    { id: 'Aberta', label: 'Aberta' },
    { id: 'Fechada', label: 'Fechada' }
  ];
  
  return (
    <div>
      <Label className="text-xs font-medium mb-2 block">Status</Label>
      <div className="flex flex-col space-y-2">
        {statuses.map(status => (
          <div key={status.id} className="flex items-center space-x-2">
            <Checkbox
              id={`status-${status.id}`}
              checked={activeStatuses.includes(status.id)}
              onCheckedChange={() => onStatusChange(status.id)}
            />
            <label
              htmlFor={`status-${status.id}`}
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {status.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusFilter;
