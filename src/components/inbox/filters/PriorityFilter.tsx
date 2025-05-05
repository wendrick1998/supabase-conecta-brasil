
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PriorityFilterProps {
  priority: string | undefined;
  onPriorityChange: (priority: string) => void;
}

const PriorityFilter: React.FC<PriorityFilterProps> = ({ 
  priority, 
  onPriorityChange 
}) => {
  return (
    <div>
      <Label className="text-xs font-medium mb-2 block">Prioridade</Label>
      <Select
        value={priority || ""}
        onValueChange={onPriorityChange}
      >
        <SelectTrigger className="h-8">
          <SelectValue placeholder="Todas as prioridades" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todas as prioridades</SelectItem>
          <SelectItem value="alta">Alta</SelectItem>
          <SelectItem value="media">Média</SelectItem>
          <SelectItem value="baixa">Baixa</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PriorityFilter;
