
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AutomacoesHeaderProps {
  onAddNew: () => void;
}

const AutomacoesHeader: React.FC<AutomacoesHeaderProps> = ({ onAddNew }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Automações</h1>
        <p className="text-text-muted mt-1">
          Configure regras automáticas para otimizar seus processos
        </p>
      </div>
      <Button 
        variant="accent"
        className="hover-glow btn-press flex items-center gap-2"
        onClick={onAddNew}
      >
        <Plus className="h-4 w-4" />
        Nova Automação
      </Button>
    </div>
  );
};

export default AutomacoesHeader;
