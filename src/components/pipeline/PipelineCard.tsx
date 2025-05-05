
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lead, EstagioPipeline } from '@/types/lead';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Move } from 'lucide-react';
import LeadTag from '@/components/LeadTag';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import ConversationPreview from './ConversationPreview';
import ConversationFooter from './ConversationFooter';

interface PipelineCardProps {
  lead: Lead;
  onMove: (leadId: string, newStageId: string) => Promise<void>;
  stages: EstagioPipeline[];
  isDragging?: boolean;
  conversation?: {
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
    isViewed: boolean;
  };
}

const PipelineCard: React.FC<PipelineCardProps> = ({ 
  lead, 
  onMove, 
  stages, 
  isDragging = false,
  conversation 
}) => {
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

  const navigateToChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/inbox/${lead.id}`);
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white cursor-pointer transition-all min-w-[260px]",
        isDragging ? "shadow-lg scale-105 border-2 border-blue-400 rotate-1 z-10" : "hover:shadow-md"
      )}
      onClick={handleClick}
      aria-label={`Lead: ${lead.nome}`}
      role="button"
    >
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <h4 className="font-semibold text-base truncate">{lead.nome}</h4>
            {lead.empresa && (
              <span className="text-xs text-gray-500">{lead.empresa}</span>
            )}
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
        
        {/* Tags */}
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
        
        {/* Last message section */}
        {conversation && (
          <ConversationPreview
            message={conversation.lastMessage}
            leadName={lead.nome}
            onClick={navigateToChat}
          />
        )}
        
        {/* Card footer with indicators */}
        <ConversationFooter 
          dateString={lead.criado_em} 
          conversation={conversation && {
            timestamp: conversation.timestamp,
            unreadCount: conversation.unreadCount,
            isViewed: conversation.isViewed
          }}
        />
      </CardContent>
    </Card>
  );
};

export default PipelineCard;
