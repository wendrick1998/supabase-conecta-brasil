
import { Conversation, Message, InternalNote } from '@/types/conversation';

// Mock conversation data
export const mockConversation: Conversation = {
  id: '1',
  lead_id: '101',
  lead_nome: 'Maria Silva',
  canal: 'WhatsApp',
  ultima_mensagem: 'Olá, gostaria de saber mais sobre o serviço de consultoria.',
  horario: new Date(Date.now() - 15 * 60000).toISOString(),
  nao_lida: false,
  status: 'Aberta',
};

// Mock messages data
export const mockMessages: Message[] = [
  {
    id: '1',
    conversation_id: '1',
    content: 'Olá, gostaria de saber mais sobre o serviço de consultoria.',
    timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
    sender_type: 'lead',
    status: 'read',
  },
  {
    id: '2',
    conversation_id: '1',
    content: 'Olá Maria! Claro, temos diversos serviços de consultoria. Em qual área você tem interesse?',
    timestamp: new Date(Date.now() - 50 * 60000).toISOString(),
    sender_type: 'user',
    status: 'read',
  },
  {
    id: '3',
    conversation_id: '1',
    content: 'Estou interessada na consultoria financeira.',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    sender_type: 'lead',
    status: 'read',
  },
  {
    id: '4',
    conversation_id: '1',
    content: 'Perfeito! Temos pacotes a partir de R$ 1.500,00 para consultoria financeira. Poderia me informar se é para pessoa física ou jurídica?',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    sender_type: 'user',
    status: 'read',
  },
  {
    id: '5',
    conversation_id: '1',
    content: 'É para minha empresa, uma startup de tecnologia com 15 funcionários.',
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    sender_type: 'lead',
    status: 'read',
  },
  {
    id: '6',
    conversation_id: '1',
    content: 'Estou anexando nossa proposta completa para seu caso específico.',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    sender_type: 'user',
    status: 'delivered',
    attachment: {
      name: 'Proposta_Consultoria_Financeira.pdf',
      url: '#',
      type: 'pdf',
    },
  },
];

// Mock internal notes
export const mockNotes: InternalNote[] = [
  {
    id: '1',
    conversation_id: '1',
    content: 'Cliente potencial para o pacote premium',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    user_id: '1',
    user_name: 'João Analista',
  },
  {
    id: '2',
    conversation_id: '1',
    content: 'Já conversou com a equipe comercial anteriormente',
    timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
    user_id: '2',
    user_name: 'Ana Gerente',
  },
];
