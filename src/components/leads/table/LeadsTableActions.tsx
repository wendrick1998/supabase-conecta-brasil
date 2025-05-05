
import React from 'react';
import { ArrowRight, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface LeadsTableActionsProps {
  selectedLeads: string[];
  onMoveClick: () => void;
  onDeleteClick: () => void;
}

const LeadsTableActions: React.FC<LeadsTableActionsProps> = ({ 
  selectedLeads, 
  onMoveClick, 
  onDeleteClick 
}) => {
  if (selectedLeads.length === 0) return null;

  return (
    <div className="flex items-center space-x-2">
      <Badge variant="secondary" className="mr-2">
        {selectedLeads.length} selecionado(s)
      </Badge>
      <Button
        variant="outline"
        size="sm"
        onClick={onMoveClick}
      >
        <ArrowRight className="h-4 w-4 mr-2" />
        Mover
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={onDeleteClick}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Excluir
      </Button>
    </div>
  );
};

export default LeadsTableActions;
