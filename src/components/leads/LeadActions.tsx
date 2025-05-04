
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LeadActionsProps {
  onAdvanceStage: () => void;
  isAdvancing: boolean;
  hasEstagios: boolean;
}

const LeadActions: React.FC<LeadActionsProps> = ({ onAdvanceStage, isAdvancing, hasEstagios }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Ações</h2>
      <div className="space-y-4">
        <Button
          className="w-full"
          onClick={onAdvanceStage}
          disabled={!hasEstagios || isAdvancing}
        >
          {isAdvancing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Avançar para Próximo Estágio
        </Button>
      </div>
    </div>
  );
};

export default LeadActions;
