
import React, { useState, CSSProperties } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Settings, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Block } from '@/types/automation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { getBlockInfo, getBlockColor } from '@/utils/automationUtils';
import { AutomationBlockConfig } from './AutomationBlockConfig';
import { BlockConnectionPoints } from './BlockConnectionPoints';

interface AutomationBlockProps {
  block: Block;
  onConfigure: () => void;
  onDelete: () => void;
  onConnect: (fromBlockId: string, toBlockId: string) => void;
}

export const AutomationBlock: React.FC<AutomationBlockProps> = ({
  block,
  onConfigure,
  onDelete,
  onConnect
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: block.id,
  });
  
  const [showConfig, setShowConfig] = useState(false);
  const blockInfo = getBlockInfo(block.type);
  const blockColor = getBlockColor(block.category);

  // Fixed TypeScript type issue with position by properly typing it as CSSProperties
  const style: CSSProperties = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    position: 'absolute',
    top: block.position.y,
    left: block.position.x,
    width: '300px',
    zIndex: 10,
  } : {
    position: 'absolute',
    top: block.position.y,
    left: block.position.x,
    width: '300px',
  };
  
  const handleSaveConfig = () => {
    setShowConfig(false);
    onConfigure();
  };
  
  const handleConnectFrom = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Connection logic would go here
  };
  
  const handleConnectTo = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Connection target logic would go here
  };

  // Determine status class for visual feedback
  const blockStatusClass = !block.configured 
    ? 'border-2 border-dashed border-red-500' 
    : 'border';

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`rounded-md shadow-md ${blockColor} ${blockStatusClass} transition-all`}
        aria-labelledby={`block-title-${block.id}`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              {blockInfo.icon}
              <h3 id={`block-title-${block.id}`} className="font-medium ml-2">
                {blockInfo.name}
              </h3>
            </div>
            
            <div className="flex space-x-1">
              <BlockActions 
                onOpenConfig={() => setShowConfig(true)}
                onDelete={onDelete}
              />
            </div>
          </div>
          
          <div className="text-sm">
            {block.configured ? 
              <p>Bloco configurado</p> : 
              <p className="text-red-500 font-medium">Necessita configuração</p>
            }
          </div>
          
          {/* Connection points */}
          <BlockConnectionPoints
            category={block.category}
            onConnectFrom={handleConnectFrom}
            onConnectTo={handleConnectTo}
          />
        </div>
      </div>
      
      {/* Configuration Dialog */}
      <Dialog open={showConfig} onOpenChange={setShowConfig}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configurar {blockInfo.name}</DialogTitle>
          </DialogHeader>
          
          <AutomationBlockConfig blockType={block.type} />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfig(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveConfig} className="bg-pink-500 hover:bg-pink-600 text-white">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Extracted block action buttons into a separate component
const BlockActions: React.FC<{
  onOpenConfig: () => void;
  onDelete: () => void;
}> = ({ onOpenConfig, onDelete }) => {
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
