
import React from 'react';
import { 
  MessageSquare, 
  Users, 
  PipetteIcon,
  ZapIcon, 
  CalendarCheck,
  ArrowRight,
  AlertTriangle,
  DollarSign,
  Tag,
  Calendar,
  FormInput,
  Clock,
  User,
  Bell
} from 'lucide-react';
import { BlockType } from '@/types/automation';

// Maps block type to human-readable name and icon
export const getBlockInfo = (blockType: BlockType) => {
  const blockInfo: Record<BlockType, { name: string; icon: React.ReactNode; description?: string }> = {
    // Trigger blocks
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
    form_submitted: {
      name: 'Formulário Enviado',
      icon: React.createElement(FormInput, { size: 20 }),
      description: 'Dispara quando um formulário é preenchido e enviado'
    },
    schedule_triggered: {
      name: 'Agendamento',
      icon: React.createElement(Clock, { size: 20 }),
      description: 'Dispara em um horário programado'
    },
    
    // Condition blocks
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
    has_tag: {
      name: 'Possui Tag',
      icon: React.createElement(Tag, { size: 20 }),
      description: 'Verifica se o lead possui uma tag específica'
    },
    date_condition: {
      name: 'Condição de Data',
      icon: React.createElement(Calendar, { size: 20 }),
      description: 'Verifica condições baseadas em datas'
    },
    
    // Action blocks
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
    add_tag: {
      name: 'Adicionar Tag',
      icon: React.createElement(Tag, { size: 20 }),
      description: 'Adiciona uma tag ao lead'
    },
    assign_user: {
      name: 'Atribuir Usuário',
      icon: React.createElement(User, { size: 20 }),
      description: 'Atribui o lead a um usuário'
    },
    send_notification: {
      name: 'Enviar Notificação',
      icon: React.createElement(Bell, { size: 20 }),
      description: 'Envia uma notificação para usuários específicos'
    }
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

// Helper to get accessibility information for a block type
export const getBlockAccessibility = (blockType: BlockType) => {
  const accessibility = {
    new_lead: {
      ariaLabel: 'Bloco de Gatilho: Novo Lead',
      description: 'Este bloco dispara a automação quando um novo lead é criado',
      shortcutKey: 'Alt+N'
    },
    // Add more accessibility info for other block types
    send_message: {
      ariaLabel: 'Bloco de Ação: Enviar Mensagem',
      description: 'Este bloco envia uma mensagem para o lead',
      shortcutKey: 'Alt+M'
    }
  };
  
  return accessibility[blockType as keyof typeof accessibility] || {
    ariaLabel: `Bloco de ${getBlockInfo(blockType).name}`,
    description: getBlockInfo(blockType).description
  };
};
