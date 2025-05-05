
import React from 'react';
import { Lead, EstagioPipeline } from '@/types/lead';
import PipelineCard from './PipelineCard';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { Conversation } from '@/types/conversation';

interface PipelineColumnProps {
  estagio: EstagioPipeline;
  leads: Lead[];
  onMoveCard: (leadId: string, newStageId: string) => Promise<void>;
  allStages: EstagioPipeline[];
  isMovingLead?: boolean;
  activeId?: string | null;
  isOver?: boolean;
  conversations?: Record<string, Conversation>;
}

const PipelineColumn: React.FC<PipelineColumnProps> = ({ 
  estagio, 
  leads, 
  onMoveCard,
  allStages,
  isMovingLead = false,
  activeId = null,
  isOver = false,
  conversations = {}
}) => {
  // Get column color style - default to blue if not set
  const columnColor = estagio.cor || '#1E40AF';
  
  // Setup droppable
  const { setNodeRef } = useDroppable({
    id: estagio.id,
    data: {
      type: 'estagio',
      estagio
    }
  });
  
  const columnHeaderStyle = {
    borderTop: `3px solid ${columnColor}`
  };

  const isActiveLeadInThisColumn = activeId && leads.some(lead => lead.id === activeId);

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "flex flex-col rounded-lg p-4 min-h-[400px] transition-all duration-200",
        isOver && !isActiveLeadInThisColumn ? 
          "bg-gradient-to-b from-vendah-blue/10 to-vendah-purple/5 border border-vendah-blue/30 shadow-lg" : 
          "bg-surface/30 backdrop-blur-sm border border-vendah-purple/10",
        isActiveLeadInThisColumn ? "opacity-90" : ""
      )}
      aria-label={`Estágio: ${estagio.nome}`}
      role="region"
      style={columnHeaderStyle}
    >
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-sm font-medium" style={{ color: columnColor }}>
            {estagio.nome} <span className="ml-1 text-gray-500">({leads.length})</span>
          </h3>
          {estagio.descricao && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{estagio.descricao}</p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-vendah-purple/10">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-surface/90 backdrop-blur-md border-vendah-purple/20">
            <DropdownMenuItem asChild>
              <Link to="/leads/novo" state={{ initialStageId: estagio.id }} className="flex items-center cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                <span>Adicionar lead</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/pipeline/configuracao" className="flex items-center cursor-pointer">
                Editar estágio
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex flex-col gap-3 flex-grow">
        {isMovingLead ? (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-sm text-gray-400 text-center">
              Movendo lead...
            </p>
          </div>
        ) : leads.length === 0 ? (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-sm text-text-muted text-center">
              Não há leads neste estágio
            </p>
          </div>
        ) : (
          leads.map((lead) => (
            <PipelineCard 
              key={lead.id} 
              lead={lead} 
              onMove={onMoveCard}
              stages={allStages}
              isDragging={activeId === lead.id}
              conversation={conversations[lead.id]}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PipelineColumn;
