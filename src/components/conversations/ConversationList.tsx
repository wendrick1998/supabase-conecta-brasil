
import { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Conversation } from '@/types/conversation';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

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

// Helper to format the time
const formatMessageTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (60 * 1000));
  
  if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  } else if (diffMinutes < 24 * 60) {
    return `${Math.floor(diffMinutes / 60)}h`;
  } else {
    return `${Math.floor(diffMinutes / (24 * 60))}d`;
  }
};

// Get initials for avatar fallback
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Channel color mapping
const channelColors: Record<Conversation['canal'], string> = {
  'WhatsApp': 'bg-green-500',
  'Instagram': 'bg-purple-500',
  'Email': 'bg-blue-500',
};

const ConversationList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [canalFilter, setCanalFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Filter conversations based on search and filters
  const filteredConversations = mockConversations.filter(conversation => {
    const matchesSearch = search === '' || 
      conversation.lead_nome.toLowerCase().includes(search.toLowerCase()) ||
      conversation.ultima_mensagem.toLowerCase().includes(search.toLowerCase());
    
    const matchesCanal = canalFilter === null || conversation.canal === canalFilter;
    const matchesStatus = statusFilter === null || conversation.status === statusFilter;
    
    return matchesSearch && matchesCanal && matchesStatus;
  });

  const handleConversationClick = (conversationId: string) => {
    navigate(`/conversations/${conversationId}`);
  };

  const handleNewMessage = () => {
    navigate('/conversations/new');
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto bg-white">
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        <h1 className="text-xl font-bold mb-4">Inbox de Comunicação</h1>
        
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <Select onValueChange={(value) => setCanalFilter(value || null)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Canal" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Select onValueChange={(value) => setStatusFilter(value || null)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="Aberta">Aberta</SelectItem>
                <SelectItem value="Fechada">Fechada</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              type="search" 
              placeholder="Buscar por nome ou mensagem..." 
              className="pl-10 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            Nenhuma conversa encontrada.
          </div>
        ) : (
          <div>
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="flex items-center p-4 border-b hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => handleConversationClick(conversation.id)}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.avatar} alt={conversation.lead_nome} />
                    <AvatarFallback>{getInitials(conversation.lead_nome)}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${channelColors[conversation.canal]} text-white text-[8px] font-bold`}>
                    {conversation.canal === 'WhatsApp' ? 'W' : 
                     conversation.canal === 'Instagram' ? 'I' : 'E'}
                  </div>
                </div>
                
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium truncate">{conversation.lead_nome}</h3>
                    <span className="text-xs text-gray-400">{formatMessageTime(conversation.horario)}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conversation.ultima_mensagem}</p>
                </div>
                
                {conversation.nao_lida && (
                  <Badge className="ml-2 bg-pink-500 w-2 h-2 p-0 rounded-full" />
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <Button
        onClick={handleNewMessage}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-pink-500 hover:bg-pink-600 p-0"
        aria-label="Nova Mensagem"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default ConversationList;
