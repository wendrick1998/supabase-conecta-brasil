
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
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pipeline de Vendas</h1>
        <p className="text-muted-foreground">Visualize e gerencie seus leads por estágios</p>
      </div>
      <div className="mt-4 md:mt-0 flex space-x-2">
        <Button 
          onClick={onAddNewLead}
          variant="accent"
          className="hover-glow btn-press"
        >
          Novo Lead
        </Button>
        <Button 
          className="bg-vendah-purple hover:bg-vendah-purple/90 hover-glow-purple btn-press"
          onClick={onConfigurePipeline}
        >
          Configurar Pipeline
        </Button>
      </div>
    </div>
  );
};

export default PipelineHeader;
