
import React from 'react';
import { 
  Eye, 
  ZoomIn, 
  ZoomOut,
  LayoutGrid,
  PlayCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface AutomationCanvasControlsProps {
  onShowPreview: () => void;
  onShowTestResults: () => void;
}

export const AutomationCanvasControls: React.FC<AutomationCanvasControlsProps> = ({ 
  onShowPreview,
  onShowTestResults
}) => {
  return (
    <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            size="icon" 
            variant="secondary" 
            className="bg-vendah-purple/30 hover:bg-vendah-purple/50 text-white border border-vendah-purple/30"
            onClick={onShowPreview}
            aria-label="Pré-visualizar fluxo"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Pré-visualizar fluxo</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            size="icon" 
            variant="secondary" 
            className="bg-green-600/30 hover:bg-green-600/50 text-white border border-green-600/30"
            onClick={onShowTestResults}
            aria-label="Testar automação"
          >
            <PlayCircle className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Testar automação</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            size="icon" 
            variant="secondary" 
            className="bg-vendah-purple/30 hover:bg-vendah-purple/50 text-white border border-vendah-purple/30"
            aria-label="Ampliar visualização"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Ampliar</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            size="icon" 
            variant="secondary" 
            className="bg-vendah-purple/30 hover:bg-vendah-purple/50 text-white border border-vendah-purple/30"
            aria-label="Reduzir visualização"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Reduzir</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            size="icon" 
            variant="secondary" 
            className="bg-vendah-purple/30 hover:bg-vendah-purple/50 text-white border border-vendah-purple/30"
            aria-label="Alinhar à grade"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Alinhar à grade</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
