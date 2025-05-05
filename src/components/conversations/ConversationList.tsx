
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import ConversationFilters from './filters/ConversationFilters';
import ConversationItem from './list/ConversationItem';
import ConversationListHeader from './list/ConversationListHeader';
import EmptyConversationList from './list/EmptyConversationList';
import { useConversationFilter } from '@/hooks/useConversationFilter';
import { Conversation } from '@/types/conversation';

// Mock data for demonstration
const mockConversations: Conversation[] = [
  {
    id: '1',
    lead_id: '101',
    lead_nome: 'Maria Silva',
    canal: 'WhatsApp',
    ultima_mensagem: 'Olá, gostaria de saber mais sobre o serviço de consultoria.',
    horario: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
    nao_lida: true,
    status: 'Aberta',
  },
  {
    id: '2',
    lead_id: '102',
    lead_nome: 'João Pereira',
    canal: 'Instagram',
    ultima_mensagem: 'Qual o prazo de entrega para o Rio de Janeiro?',
    horario: new Date(Date.now() - 40 * 60000).toISOString(), // 40 minutes ago
    nao_lida: false,
    status: 'Aberta',
  },
  {
    id: '3',
    lead_id: '103',
    lead_nome: 'Ana Costa',
    canal: 'Email',
    ultima_mensagem: 'Segue em anexo o documento solicitado',
    horario: new Date(Date.now() - 3 * 3600000).toISOString(), // 3 hours ago
    nao_lida: true,
    status: 'Aberta',
  },
  {
    id: '4',
    lead_id: '104',
    lead_nome: 'Carlos Mendes',
    canal: 'WhatsApp',
    ultima_mensagem: 'Obrigado pelo suporte! Resolveu meu problema.',
    horario: new Date(Date.now() - 1 * 86400000).toISOString(), // 1 day ago
    nao_lida: false,
    status: 'Fechada',
  },
  {
    id: '5',
    lead_id: '105',
    lead_nome: 'Patricia Lopes',
    canal: 'Email',
    ultima_mensagem: 'Recebemos sua solicitação e estamos analisando.',
    horario: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
    nao_lida: false,
    status: 'Fechada',
  },
];

const ConversationList = () => {
  const navigate = useNavigate();
  const { 
    search, 
    setSearch,
    setCanalFilter,
    setStatusFilter,
    filteredConversations 
  } = useConversationFilter(mockConversations);

  const handleConversationClick = (conversationId: string) => {
    navigate(`/conversations/${conversationId}`);
  };

  const handleNewMessage = () => {
    navigate('/conversations/new');
  };

  return (
    <div className="flex flex-col h-full bg-[#121212] text-white">
      <ConversationListHeader title="Inbox de Comunicação" />
      
      <div className="p-4 border-b border-gray-800 sticky top-16 bg-[#121212] z-10">
        <ConversationFilters
          search={search}
          setSearch={setSearch}
          setCanalFilter={setCanalFilter}
          setStatusFilter={setStatusFilter}
        />
      </div>
      
      <ScrollArea className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <EmptyConversationList />
        ) : (
          <div>
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                onClick={() => handleConversationClick(conversation.id)}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      <Button
        onClick={handleNewMessage}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-pink-500 hover:bg-pink-600 p-0 shadow-lg"
        aria-label="Nova Mensagem"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default ConversationList;
