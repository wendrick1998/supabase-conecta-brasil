
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Block } from '@/types/automation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowRight } from 'lucide-react';
interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blocks: Block[];
  children?: React.ReactNode; // Added children prop as optional
}
export const PreviewDialog: React.FC<PreviewDialogProps> = ({
  open,
  onOpenChange,
  blocks,
  children // Accept children prop
}) => {
  // Maps block type to human-readable description
  const getBlockDescription = (block: Block): string => {
    switch (block.type) {
      case 'new_lead':
        return 'Novo lead é criado';
      case 'lead_moved':
        return 'Lead é movido no pipeline';
      case 'message_received':
        return 'Uma mensagem é recebida';
      case 'lead_status':
        return 'Status do lead é específico';
      case 'lead_source':
        return 'Canal de origem do lead é específico';
      case 'value_greater':
        return 'Valor é maior que X';
      case 'send_message':
        return block.config && block.config.message
          ? `Enviar mensagem: "${block.config.message.substring(0, 30)}${block.config.message.length > 30 ? '...' : ''}"`
          : 'Enviar uma mensagem';
      case 'create_task':
        return 'Criar uma tarefa';
      case 'move_pipeline':
        return 'Mover lead no pipeline';
      default:
        return block.type;
    }
  };

  // Generate a text-based representation of the flow
  const generateTextFlow = (): React.ReactNode => {
    // Find trigger blocks (starting points)
    const triggerBlocks = blocks.filter(block => block.category === 'trigger');
    if (triggerBlocks.length === 0) {
      return <p className="text-muted-foreground">Nenhum gatilho encontrado na automação.</p>;
    }
    return triggerBlocks.map((trigger, index) => <div key={trigger.id} className="mb-6">
        <div className="font-medium">Fluxo {index + 1}:</div>
        <div className="mt-2 pl-4 border-l-2 border-blue-300 bg-slate-900">
          <div className="mb-2">
            <span className="font-medium text-blue-700">Quando:</span> {getBlockDescription(trigger)}
          </div>
          {renderConnectedBlocks(trigger)}
        </div>
      </div>);
  };

  // Recursively render connected blocks
  const renderConnectedBlocks = (block: Block, depth: number = 0): React.ReactNode => {
    if (block.connections.length === 0) {
      return null;
    }
    return <div className="ml-4">
        {block.connections.map(connId => {
        const connectedBlock = blocks.find(b => b.id === connId);
        if (!connectedBlock) return null;
        return <div key={connId} className="mt-2">
              <div className="flex items-center mb-1">
                <ArrowRight size={16} className="mr-1 text-gray-500" />
                {connectedBlock.category === 'condition' ? <span className="font-medium text-amber-700">Se:</span> : <span className="font-medium text-green-700">Então:</span>}
                <span className="ml-1">{getBlockDescription(connectedBlock)}</span>
              </div>
              {renderConnectedBlocks(connectedBlock, depth + 1)}
            </div>;
      })}
      </div>;
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Visualização do Fluxo</DialogTitle>
        </DialogHeader>
        
        {/* Add children here, before the ScrollArea */}
        {children}
        
        <ScrollArea className="h-[400px] mt-4 p-4 border rounded-md bg-purple-900">
          {generateTextFlow()}
        </ScrollArea>
      </DialogContent>
    </Dialog>;
};
