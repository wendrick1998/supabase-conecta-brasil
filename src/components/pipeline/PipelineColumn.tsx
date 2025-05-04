
import React from 'react';
import { Lead, EstagioPipeline } from '@/types/lead';
import PipelineCard from './PipelineCard';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PipelineColumnProps {
  estagio: EstagioPipeline;
  leads: Lead[];
  onMoveCard: (leadId: string, newStageId: string) => Promise<void>;
  allStages: EstagioPipeline[];
}

const PipelineColumn: React.FC<PipelineColumnProps> = ({ 
  estagio, 
  leads, 
  onMoveCard,
  allStages 
}) => {
  return (
    <div 
      className="flex flex-col bg-gray-50 rounded-lg p-4 min-h-[400px]"
      aria-label={`Estágio: ${estagio.nome}`}
      role="region"
    >
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-sm font-medium text-blue-700">
            {estagio.nome} <span className="ml-1 text-gray-500">({leads.length})</span>
          </h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/leads/novo" className="flex items-center cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                <span>Adicionar lead</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Editar estágio</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex flex-col gap-2 flex-grow">
        {leads.map((lead) => (
          <PipelineCard 
            key={lead.id} 
            lead={lead} 
            onMove={onMoveCard}
            stages={allStages}
          />
        ))}
        {leads.length === 0 && (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-sm text-gray-400 text-center">
              Não há leads neste estágio
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineColumn;
