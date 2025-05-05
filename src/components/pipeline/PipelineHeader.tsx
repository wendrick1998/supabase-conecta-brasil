
import React from 'react';
import { Button } from '@/components/ui/button';

interface PipelineHeaderProps {
  onAddNewLead: () => void;
  onConfigurePipeline: () => void;
}

const PipelineHeader: React.FC<PipelineHeaderProps> = ({
  onAddNewLead,
  onConfigurePipeline
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 px-4 md:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Pipeline de Vendas</h1>
        <p className="text-muted-foreground">Visualize e gerencie seus leads por estágios</p>
      </div>
      <div className="mt-4 md:mt-0 flex space-x-2">
        <Button 
          onClick={onAddNewLead}
          variant="accent"
        >
          Novo Lead
        </Button>
        <Button 
          onClick={onConfigurePipeline}
        >
          Configurar Pipeline
        </Button>
      </div>
    </div>
  );
};

export default PipelineHeader;
