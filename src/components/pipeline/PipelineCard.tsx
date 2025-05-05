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
import { formatCurrency } from '@/utils/formatters';
import { Conversation } from '@/types/conversation';
interface PipelineCardProps {
  lead: Lead;
  onMove: (leadId: string, newStageId: string) => Promise<void>;
  stages: EstagioPipeline[];
  isDragging?: boolean;
  conversation?: Conversation;
  leadValue?: number;
}
const PipelineCard: React.FC<PipelineCardProps> = ({
  lead,
  onMove,
  stages,
  isDragging = false,
  conversation,
  leadValue
}) => {
  const navigate = useNavigate();

  // Setup draggable with improved configuration
  const {
    attributes,
    listeners,
    setNodeRef,
    transform
  } = useDraggable({
    id: lead.id,
    data: {
      type: 'lead',
      lead
    }
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    transition: isDragging ? 'none' : 'transform 120ms ease, opacity 120ms ease',
    zIndex: isDragging ? 999 : 'auto'
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
    // Update this path to use the conversations route instead of inbox
    navigate(`/conversations/${lead.id}`);
  };

  // Prepare conversation data for the preview component
  const conversationData = conversation ? {
    lastMessage: conversation.ultima_mensagem,
    timestamp: conversation.horario,
    unreadCount: conversation.nao_lida ? 1 : 0,
    isViewed: !conversation.nao_lida
  } : undefined;
  return <Card ref={setNodeRef} style={style} className={cn("bg-white backdrop-blur-sm cursor-pointer transition-all min-w-[260px]", isDragging ? "shadow-lg scale-[1.02] border border-vendah-neon/40 rotate-1 z-10 shadow-vendah-neon/20" : "hover:shadow-md hover:-translate-y-1 hover:border-vendah-purple/30")} onClick={handleClick} aria-label={`Lead: ${lead.nome}`} role="button">
      <CardContent className="p-3 bg-violet-500">
        {/* Card Header with Name and Actions */}
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <h4 className="font-semibold text-base truncate">{lead.nome}</h4>
            {lead.empresa && <span className="text-xs text-indigo-950">{lead.empresa}</span>}
          </div>
          
          <div className="flex items-center space-x-1">
            {/* Drag handle - mais visível e melhor feedback */}
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 cursor-grab active:cursor-grabbing hover:bg-vendah-purple/10 rounded-full bg-slate-500 hover:bg-slate-400 text-gray-950">
              <Move className="h-3 w-3 text-vendah-blue" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-vendah-purple/10 rounded-full">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-surface/90 backdrop-blur-md border-vendah-purple/20">
                <DropdownMenuItem onClick={e => {
                e.stopPropagation();
                navigate(`/leads/${lead.id}`);
              }}>
                  Ver detalhes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={e => {
                e.stopPropagation();
                navigate(`/leads/${lead.id}/editar`);
              }}>
                  Editar lead
                </DropdownMenuItem>
                {conversation && <DropdownMenuItem onClick={e => {
                e.stopPropagation();
                navigate(`/inbox/${lead.id}`);
              }}>
                    Ver conversas
                  </DropdownMenuItem>}
                <DropdownMenuSeparator />
                
                {/* Menu para mover para outros estágios */}
                <DropdownMenuItem className="font-semibold" disabled>
                  Mover para estágio:
                </DropdownMenuItem>
                
                {stages.filter(stage => stage.id !== lead.estagio_id).map(stage => <DropdownMenuItem key={stage.id} onClick={e => {
                e.stopPropagation();
                onMove(lead.id, stage.id);
              }} className="pl-6">
                      {stage.nome}
                    </DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Show lead value if available */}
        {leadValue !== undefined && <div className="mt-1.5 mb-1 px-2 py-1 bg-green-50 rounded-md inline-block">
            <span className="text-sm text-green-700 font-medium">
              {formatCurrency(leadValue)}
            </span>
          </div>}
        
        {/* Tags */}
        {lead.tags && lead.tags.length > 0 && <div className="flex flex-wrap gap-1 mt-2">
            {lead.tags.slice(0, 2).map(tag => <LeadTag key={tag.id} tag={tag} size="sm" />)}
            {lead.tags.length > 2 && <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                +{lead.tags.length - 2}
              </span>}
          </div>}
        
        {/* Last message section */}
        {conversationData && <ConversationPreview message={conversationData.lastMessage} leadName={lead.nome} onClick={navigateToChat} unreadCount={conversationData.unreadCount} />}
        
        {/* Card footer with indicators */}
        <ConversationFooter dateString={lead.criado_em} conversation={conversationData} />
      </CardContent>
    </Card>;
};
export default PipelineCard;