
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AutomacoesHeaderProps {
  onAddNew: () => void;
}

const AutomacoesHeader: React.FC<AutomacoesHeaderProps> = ({ onAddNew }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Automações</h1>
        <p className="text-muted-foreground mt-1">
          Configure regras automáticas para otimizar seus processos
        </p>
      </div>
      <Button 
        variant="accent"
        className="hover-glow btn-press"
        onClick={onAddNew}
      >
        <Plus className="mr-2 h-4 w-4" />
        Nova Automação
      </Button>
    </div>
  );
};

export default AutomacoesHeader;
