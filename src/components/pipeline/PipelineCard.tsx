
import React from 'react';
import { format, parseISO, differenceInMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Lead, EstagioPipeline } from '@/types/lead';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, MoreHorizontal, Move, MessageCircle } from 'lucide-react';
import LeadTag from '@/components/LeadTag';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatMessageTime } from '@/utils/conversationUtils';

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

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd MMM yyyy', { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  // Calculate waiting time status and styles
  const getWaitingTimeStatus = () => {
    if (!conversation) return null;
    
    if (conversation.isViewed) {
      return {
        text: "Visualizado",
        className: "bg-gray-200 text-gray-700"
      };
    }

    const minutesWaiting = differenceInMinutes(
      new Date(),
      parseISO(conversation.timestamp)
    );

    if (minutesWaiting < 5) {
      return {
        text: `Esperando há ${minutesWaiting}min`,
        className: "bg-green-100 text-green-700"
      };
    } else if (minutesWaiting < 30) {
      return {
        text: `Esperando há ${minutesWaiting}min`,
        className: "bg-yellow-100 text-yellow-800"
      };
    } else {
      return {
        text: `Esperando há ${minutesWaiting}min`,
        className: "bg-red-100 text-red-800"
      };
    }
  };

  const waitingStatus = getWaitingTimeStatus();

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
        
        {/* Last message section - new */}
        {conversation && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="mt-3 p-2 rounded-md bg-gray-50 hover:bg-gray-100 flex items-center justify-between cursor-pointer transition-colors"
                  onClick={navigateToChat}
                  aria-label={`Ver conversa com ${lead.nome}`}
                >
                  <p className="text-sm text-gray-700 truncate pr-2">{conversation.lastMessage}</p>
                  <MessageCircle className="h-4 w-4 text-gray-500 flex-shrink-0" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ver conversa com {lead.nome}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {/* Card footer with indicators */}
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            {formatDate(lead.criado_em)}
          </span>
          
          {/* Waiting indicators - new */}
          {conversation && (
            <div className="flex items-center space-x-2">
              {/* Unread message count */}
              {conversation.unreadCount > 0 && (
                <div className="w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {conversation.unreadCount}
                </div>
              )}
              
              {/* Waiting time badge */}
              {waitingStatus && (
                <Badge className={cn("px-2 py-0.5 text-xs font-medium", waitingStatus.className)}>
                  {waitingStatus.text}
                </Badge>
              )}
            </div>
          )}

          {!conversation && (
            <ChevronRight className="h-3 w-3 text-gray-400" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PipelineCard;
