
import React from 'react';
import { 
  MessageSquare, 
  Users, 
  PipetteIcon,
  ZapIcon, 
  CalendarCheck,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { BlockType } from '@/types/automation';

// Maps block type to human-readable name and icon
export const getBlockInfo = (blockType: BlockType) => {
  const blockInfo: Record<BlockType, { name: string; icon: React.ReactNode }> = {
    new_lead: { name: 'Novo Lead', icon: <Users size={20} /> },
    lead_moved: { name: 'Lead Movido', icon: <ArrowRight size={20} /> },
    message_received: { name: 'Mensagem Recebida', icon: <MessageSquare size={20} /> },
    lead_status: { name: 'Status do Lead', icon: <AlertTriangle size={20} /> },
    lead_source: { name: 'Canal de Origem', icon: <PipetteIcon size={20} /> },
    value_greater: { name: 'Valor Maior Que', icon: <ArrowRight size={20} /> },
    send_message: { name: 'Enviar Mensagem', icon: <MessageSquare size={20} /> },
    create_task: { name: 'Criar Tarefa', icon: <CalendarCheck size={20} /> },
    move_pipeline: { name: 'Mover no Pipeline', icon: <ZapIcon size={20} /> },
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
