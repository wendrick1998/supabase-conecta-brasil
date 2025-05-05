
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import { Checkbox } from '@/components/ui/checkbox';

type SortField = 'nome' | 'criado_em' | 'canal' | 'estagio';
type SortDirection = 'asc' | 'desc';

interface LeadsTableHeadProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField) => void;
  onSelectAllChange: () => void;
  allSelected: boolean;
  hasLeads: boolean;
}

const LeadsTableHead: React.FC<LeadsTableHeadProps> = ({
  sortField,
  sortDirection,
  onSortChange,
  onSelectAllChange,
  allSelected,
  hasLeads
}) => {
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="ml-1 h-4 w-4" /> : 
      <ChevronDown className="ml-1 h-4 w-4" />;
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-12">
          <Checkbox 
            checked={allSelected && hasLeads}
            onCheckedChange={onSelectAllChange}
            aria-label="Selecionar todos"
            disabled={!hasLeads}
          />
        </TableHead>
        <TableHead className="cursor-pointer" onClick={() => onSortChange('nome')}>
          <div className="flex items-center">
            Nome
            {renderSortIcon('nome')}
          </div>
        </TableHead>
        <TableHead>Contato</TableHead>
        <TableHead className="cursor-pointer" onClick={() => onSortChange('canal')}>
          <div className="flex items-center">
            Canal
            {renderSortIcon('canal')}
          </div>
        </TableHead>
        <TableHead className="cursor-pointer" onClick={() => onSortChange('estagio')}>
          <div className="flex items-center">
            Estágio
            {renderSortIcon('estagio')}
          </div>
        </TableHead>
        <TableHead>Tags</TableHead>
        <TableHead className="cursor-pointer" onClick={() => onSortChange('criado_em')}>
          <div className="flex items-center">
            Data
            {renderSortIcon('criado_em')}
          </div>
        </TableHead>
        <TableHead className="w-10"></TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default LeadsTableHead;
