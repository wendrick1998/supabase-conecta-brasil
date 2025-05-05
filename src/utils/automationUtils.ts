
import React from 'react';
import { 
  MessageSquare, 
  Users, 
  PipetteIcon,
  ZapIcon, 
  CalendarCheck,
  ArrowRight,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { BlockType } from '@/types/automation';

// Maps block type to human-readable name and icon
export const getBlockInfo = (blockType: BlockType) => {
  const blockInfo: Record<BlockType, { name: string; icon: React.ReactNode; description?: string }> = {
    new_lead: { 
      name: 'Novo Lead', 
      icon: React.createElement(Users, { size: 20 }),
      description: 'Dispara quando um novo lead é criado no sistema'
    },
    lead_moved: { 
      name: 'Lead Movido', 
      icon: React.createElement(ArrowRight, { size: 20 }),
      description: 'Dispara quando um lead muda de estágio no pipeline'
    },
    message_received: { 
      name: 'Mensagem Recebida', 
      icon: React.createElement(MessageSquare, { size: 20 }),
      description: 'Dispara quando uma nova mensagem é recebida'
    },
    lead_status: { 
      name: 'Status do Lead', 
      icon: React.createElement(AlertTriangle, { size: 20 }),
      description: 'Verifica se o lead está em um determinado status'
    },
    lead_source: { 
      name: 'Canal de Origem', 
      icon: React.createElement(PipetteIcon, { size: 20 }),
      description: 'Verifica o canal de origem do lead'
    },
    value_greater: { 
      name: 'Valor Maior Que', 
      icon: React.createElement(DollarSign, { size: 20 }),
      description: 'Verifica se o valor da oportunidade é maior que um valor específico'
    },
    send_message: { 
      name: 'Enviar Mensagem', 
      icon: React.createElement(MessageSquare, { size: 20 }),
      description: 'Envia uma mensagem automatizada para o lead'
    },
    create_task: { 
      name: 'Criar Tarefa', 
      icon: React.createElement(CalendarCheck, { size: 20 }),
      description: 'Cria uma tarefa relacionada ao lead'
    },
    move_pipeline: { 
      name: 'Mover no Pipeline', 
      icon: React.createElement(ZapIcon, { size: 20 }),
      description: 'Move o lead para um estágio específico do pipeline'
    },
  };
  
  return blockInfo[blockType];
};

// Helper to get block color based on category
export const getBlockColor = (category: 'trigger' | 'condition' | 'action') => {
  switch (category) {
    case 'trigger':
      return 'bg-blue-100 border-blue-300';
    case 'condition':
      return 'bg-yellow-100 border-yellow-300';
    case 'action':
      return 'bg-green-100 border-green-300';
    default:
      return 'bg-gray-100 border-gray-300';
  }
};

// Helper to get category label
export const getCategoryLabel = (category: 'trigger' | 'condition' | 'action') => {
  switch (category) {
    case 'trigger':
      return 'Gatilho';
    case 'condition':
      return 'Condição';
    case 'action':
      return 'Ação';
    default:
      return 'Bloco';
  }
};
