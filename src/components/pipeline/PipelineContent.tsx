
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EstagioPipeline, Lead } from '@/types/lead';
import PipelineColumn from './PipelineColumn';
import { Button } from '@/components/ui/button';
import { Conversation } from '@/types/conversation';

interface PipelineContentProps {
  estagios: EstagioPipeline[];
  getLeadsByStage: (stageId: string) => Lead[];
  onMoveCard: (leadId: string, newStageId: string) => Promise<void>;
  onConfigurePipeline: () => void;
  isMovingLead: boolean;
  conversations: Record<string, Conversation>;
  activeId?: string | null;
  overStageId?: string | null;
}

const PipelineContent: React.FC<PipelineContentProps> = ({
  estagios,
  getLeadsByStage,
  onMoveCard,
  onConfigurePipeline,
  isMovingLead,
  conversations,
  activeId = null,
  overStageId = null
}) => {
  if (estagios.length === 0) {
    return (
      <div className="col-span-full bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="text-lg font-medium mb-2">Nenhum estágio configurado</h3>
        <p className="text-muted-foreground mb-4">
          Configure os estágios do seu funil de vendas para visualizar seus leads no pipeline.
        </p>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={onConfigurePipeline}
        >
          Configurar Pipeline
        </Button>
      </div>
    );
  }

  return (
    <ScrollArea className="w-full">
      <div className="grid grid-flow-col auto-cols-[minmax(280px,_1fr)] gap-4 pb-4 pr-4 min-h-[calc(100vh-220px)]">
        {estagios.map((estagio) => (
          <PipelineColumn 
            key={estagio.id} 
            estagio={estagio}
            leads={getLeadsByStage(estagio.id)}
            onMoveCard={onMoveCard}
            allStages={estagios}
            isMovingLead={isMovingLead}
            activeId={activeId}
            isOver={overStageId === estagio.id}
            conversations={conversations}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default PipelineContent;
