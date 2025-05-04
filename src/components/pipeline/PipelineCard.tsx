
import React from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Lead, EstagioPipeline } from '@/types/lead';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronRight, MoreHorizontal, Move } from 'lucide-react';
import LeadTag from '@/components/LeadTag';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface PipelineCardProps {
  lead: Lead;
  onMove: (leadId: string, newStageId: string) => Promise<void>;
  stages: EstagioPipeline[];
  isDragging?: boolean;
}

const PipelineCard: React.FC<PipelineCardProps> = ({ lead, onMove, stages, isDragging = false }) => {
  const navigate = useNavigate();
  
  // Setup draggable
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: lead.id,
    data: {
      type: 'lead',
      lead
    }
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;
  
  const handleClick = (e: React.MouseEvent) => {
    // Prevent navigation when dragging
    if (isDragging) {
      e.preventDefault();
      return;
    }
    navigate(`/leads/${lead.id}`);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd MMM yyyy', { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white cursor-pointer transition-all",
        isDragging ? "shadow-lg scale-105 border-2 border-blue-400 rotate-1 z-10" : "hover:shadow-md"
      )}
      onClick={handleClick}
      aria-label={`Lead: ${lead.nome}`}
      role="button"
    >
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <h4 className="font-semibold text-sm truncate">{lead.nome}</h4>
          </div>
          
          <div className="flex items-center space-x-1">
            {/* Drag handle */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 cursor-grab active:cursor-grabbing hover:bg-blue-50" 
              {...attributes} 
              {...listeners}
            >
              <Move className="h-3 w-3 text-gray-400" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/leads/${lead.id}`);
                }}>
                  Ver detalhes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/leads/${lead.id}/editar`);
                }}>
                  Editar lead
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                {/* Menu para mover para outros estágios */}
                <DropdownMenuItem 
                  className="font-semibold"
                  disabled
                >
                  Mover para estágio:
                </DropdownMenuItem>
                
                {stages
                  .filter(stage => stage.id !== lead.estagio_id)
                  .map(stage => (
                    <DropdownMenuItem 
                      key={stage.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMove(lead.id, stage.id);
                      }}
                      className="pl-6"
                    >
                      {stage.nome}
                    </DropdownMenuItem>
                  ))
                }
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="mt-1 text-xs text-gray-500">
          {lead.empresa && <p className="truncate">{lead.empresa}</p>}
        </div>
        
        {lead.tags && lead.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {lead.tags.slice(0, 2).map((tag) => (
              <LeadTag key={tag.id} tag={tag} size="sm" />
            ))}
            {lead.tags.length > 2 && (
              <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                +{lead.tags.length - 2}
              </span>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            {formatDate(lead.criado_em)}
          </span>
          
          <ChevronRight className="h-3 w-3 text-gray-400" />
        </div>
      </CardContent>
    </Card>
  );
};

export default PipelineCard;
