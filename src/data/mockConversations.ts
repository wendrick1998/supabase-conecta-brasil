
import { Conversation, Message, InternalNote } from '@/types/conversation';

export const mockConversation: Conversation = {
  id: '1',
  lead_id: '1',
  lead_nome: 'João Silva',
  canal: 'WhatsApp',
  ultima_mensagem: 'Olá, gostaria de informações sobre o produto X',
  horario: new Date(Date.now() - 15 * 60000).toISOString(), // 15 min ago
  nao_lida: true,
  status: 'Aberta'
};

export const mockMessages: Message[] = [
  {
    id: 'm1',
    conversation_id: '1',
    content: 'Olá, tudo bem? Gostaria de informações sobre o produto X',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 min ago
    sender_type: 'lead',
    status: 'read'
  },
  {
    id: 'm2',
    conversation_id: '1',
    content: 'Olá João! Com certeza, o produto X está disponível por R$199,90. Gostaria de mais detalhes?',
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(), // 25 min ago
    sender_type: 'user',
    status: 'read'
  },
  {
    id: 'm3',
    conversation_id: '1',
    content: 'Sim, por favor. Qual a forma de pagamento e prazo de entrega?',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(), // 15 min ago
    sender_type: 'lead',
    status: 'read'
  },
];

export const mockNotes: InternalNote[] = [
  {
    id: 'n1',
    conversation_id: '1',
    content: 'Cliente interessado em comprar à vista com desconto.',
    timestamp: new Date(Date.now() - 20 * 60000).toISOString(), // 20 min ago
    user_id: 'user1',
    user_name: 'Atendente Silva'
  }
];
