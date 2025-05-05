
import React from 'react';
import { Settings, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BlockActionsProps {
  onOpenConfig: () => void;
  onDelete: () => void;
}

export const BlockActions: React.FC<BlockActionsProps> = ({ 
  onOpenConfig, 
  onDelete 
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={(e) => {
              e.stopPropagation();
              onOpenConfig();
            }}
            aria-label="Configurar bloco"
          >
            <Settings size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Configurar</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-red-500 hover:text-red-700" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            aria-label="Excluir bloco"
          >
            <Trash2 size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Excluir</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
