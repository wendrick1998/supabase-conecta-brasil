
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Block } from '@/types/automation';
import { ArrowRight } from 'lucide-react';

interface AutomationFlowPreviewProps {
  blocks: Block[];
}

export const AutomationFlowPreview: React.FC<AutomationFlowPreviewProps> = ({
  blocks
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
        return 'Enviar uma mensagem';
      case 'create_task':
        return 'Criar uma tarefa';
      case 'move_pipeline':
        return 'Mover lead no pipeline';
      default:
        return block.type;
    }
  };

  // Find trigger blocks (starting points)
  const triggerBlocks = blocks.filter(block => block.category === 'trigger');
  
  if (triggerBlocks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prévia do Fluxo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Adicione um gatilho para iniciar sua automação.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prévia do Fluxo</CardTitle>
      </CardHeader>
      <CardContent>
        {triggerBlocks.map((trigger, index) => (
          <div key={trigger.id} className="mb-4">
            <div className="font-medium text-sm text-blue-700">
              Quando: {getBlockDescription(trigger)}
            </div>
            {renderConnectedBlocks(trigger, blocks)}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Recursively render connected blocks
const renderConnectedBlocks = (block: Block, allBlocks: Block[], depth: number = 0): React.ReactNode => {
  if (block.connections.length === 0) {
    return null;
  }
  
  return (
    <div className="ml-4 mt-1">
      {block.connections.map(connId => {
        const connectedBlock = allBlocks.find(b => b.id === connId);
        if (!connectedBlock) return null;
        
        return (
          <div key={connId} className="mt-1">
            <div className="flex items-center">
              <ArrowRight size={14} className="mr-1 text-gray-500" />
              {connectedBlock.category === 'condition' ? (
                <span className="text-sm font-medium text-amber-700">Se:</span>
              ) : (
                <span className="text-sm font-medium text-green-700">Então:</span>
              )}
              <span className="ml-1 text-sm">{getBlockDescription(connectedBlock)}</span>
            </div>
            {renderConnectedBlocks(connectedBlock, allBlocks, depth + 1)}
          </div>
        );
      })}
    </div>
  );
};
