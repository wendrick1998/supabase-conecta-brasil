
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Block } from '@/types/automation';

interface BlockSummaryProps {
  block: Block;
}

export const BlockSummary: React.FC<BlockSummaryProps> = ({ block }) => {
  return (
    <div className="text-sm">
      {block.configured ? 
        <p>{getSummaryText(block)}</p> : 
        <div className="flex items-center text-red-500 font-medium">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>Necessita configuração</span>
        </div>
      }
    </div>
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
