
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
  onStartConnection?: (blockId: string) => void;
  onEndConnection?: (blockId: string) => void;
  isConnecting?: boolean;
  isConnectionSource?: boolean;
}

export const AutomationBlock: React.FC<AutomationBlockProps> = ({
  block,
  onConfigure,
  onDelete,
  onStartConnection,
  onEndConnection,
  isConnecting = false,
  isConnectionSource = false
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: block.id,
  });
  
  const [showConfig, setShowConfig] = useState(false);
  const [blockConfig, setBlockConfig] = useState<Record<string, any>>(block.config);
  const blockInfo = getBlockInfo(block.type);
  const blockColor = getBlockColor(block.category);

  // Fixed TypeScript type issue with position by properly typing it as CSSProperties
  const style: CSSProperties = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    position: 'absolute',
    top: block.position.y,
    left: block.position.x,
    width: '300px',
    zIndex: isConnecting ? (isConnectionSource ? 30 : 20) : 10,
  } : {
    position: 'absolute',
    top: block.position.y,
    left: block.position.x,
    width: '300px',
    zIndex: isConnecting ? (isConnectionSource ? 30 : 20) : 10,
  };
  
  const handleSaveConfig = () => {
    setShowConfig(false);
    onConfigure();
  };
  
  const handleConnectFrom = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStartConnection) {
      onStartConnection(block.id);
    }
  };
  
  const handleConnectTo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEndConnection) {
      onEndConnection(block.id);
    }
  };

  const handleUpdateBlockConfig = (newConfig: Record<string, any>) => {
    setBlockConfig(newConfig);
  };

  // Determine status class for visual feedback
  const blockStatusClass = !block.configured 
    ? 'border-2 border-dashed border-red-500' 
    : 'border';

  // Add visual feedback for connecting state
  const connectionClass = isConnecting
    ? (isConnectionSource ? 'ring-2 ring-pink-500 shadow-lg' : 'ring-1 ring-blue-300')
    : '';

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`rounded-md shadow-md ${blockColor} ${blockStatusClass} ${connectionClass} transition-all hover:shadow-lg`}
        aria-labelledby={`block-title-${block.id}`}
        onClick={() => !isConnecting && setShowConfig(true)}
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
              <p>{getSummaryText(block)}</p> : 
              <p className="text-red-500 font-medium">Necessita configuração</p>
            }
          </div>
          
          {/* Connection points */}
          <BlockConnectionPoints
            category={block.category}
            onConnectFrom={handleConnectFrom}
            onConnectTo={handleConnectTo}
            isConnecting={isConnecting}
            isConnectionSource={isConnectionSource}
          />
        </div>
      </div>
      
      {/* Configuration Dialog */}
      <Dialog open={showConfig} onOpenChange={setShowConfig}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configurar {blockInfo.name}</DialogTitle>
          </DialogHeader>
          
          <AutomationBlockConfig 
            blockType={block.type} 
            blockCategory={block.category}
            initialConfig={blockConfig}
            onUpdateConfig={handleUpdateBlockConfig}
          />
          
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

// Helper function to generate a summary text based on block configuration
const getSummaryText = (block: Block): string => {
  if (!block.config || Object.keys(block.config).length === 0) {
    return "Configurado";
  }

  switch (block.type) {
    case 'new_lead':
      return block.config.source ? `Novo lead de ${block.config.source}` : "Quando um novo lead for criado";
    case 'lead_moved':
      return block.config.toStage ? `Lead movido para ${block.config.toStage}` : "Quando um lead for movido";
    case 'message_received':
      return block.config.channel ? `Mensagem recebida via ${block.config.channel}` : "Quando uma mensagem for recebida";
    case 'lead_status':
      return `Status ${block.config.operator || '='} ${block.config.value || ''}`;
    case 'send_message':
      return block.config.channel ? `Enviar via ${block.config.channel}` : "Enviar mensagem";
    case 'create_task':
      return block.config.description ? `Tarefa: ${block.config.description.substring(0, 20)}...` : "Criar tarefa";
    case 'move_pipeline':
      return block.config.stage ? `Mover para ${block.config.stage}` : "Mover no pipeline";
    default:
      return "Configurado";
  }
};
