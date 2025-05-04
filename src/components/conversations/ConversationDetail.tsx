
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Paperclip, FileText, MessageSquare, Phone, Mail, Instagram, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from "@/components/ui/sonner";
import { Conversation, Message, InternalNote } from '@/types/conversation';

// Mock conversation data
const mockConversation: Conversation = {
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
const mockMessages: Message[] = [
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
const mockNotes: InternalNote[] = [
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

// Helper to format date
const formatMessageTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (60 * 1000));
  
  if (diffMinutes < 60) {
    return `${diffMinutes}m atrás`;
  } else if (diffMinutes < 24 * 60) {
    return `${Math.floor(diffMinutes / 60)}h atrás`;
  } else {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month} ${hours}:${minutes}`;
  }
};

// Get channel icon component
const getChannelIcon = (channel: Conversation['canal']) => {
  switch (channel) {
    case 'WhatsApp':
      return <MessageSquare className="h-4 w-4 text-green-500" />;
    case 'Instagram':
      return <Instagram className="h-4 w-4 text-purple-500" />;
    case 'Email':
      return <Mail className="h-4 w-4 text-blue-500" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
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

const ConversationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notes, setNotes] = useState<InternalNote[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock fetch conversation data
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (id === '1') {
        setConversation(mockConversation);
        setMessages(mockMessages);
        setNotes(mockNotes);
      } else {
        // Just for demo, in real app we would fetch from API
        setConversation({
          ...mockConversation,
          id,
          lead_nome: `Lead ${id}`,
          canal: id === '2' ? 'Instagram' : id === '3' ? 'Email' : 'WhatsApp',
        });
        setMessages([
          {
            id: '1',
            conversation_id: id || '',
            content: `Esta é uma conversa de exemplo para o ID ${id}`,
            timestamp: new Date().toISOString(),
            sender_type: 'lead',
            status: 'read',
          }
        ]);
        setNotes([]);
      }
      
      setLoading(false);
    };
    
    fetchData();
  }, [id]);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    setSendingMessage(true);
    
    // Simulate sending message
    setTimeout(() => {
      const newMsg: Message = {
        id: `new-${Date.now()}`,
        conversation_id: id || '',
        content: newMessage,
        timestamp: new Date().toISOString(),
        sender_type: 'user',
        status: 'sent',
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage('');
      setSendingMessage(false);
      toast.success('Mensagem enviada');
    }, 500);
  };

  const handleSaveNote = () => {
    if (!newNote.trim()) return;
    
    const newNoteItem: InternalNote = {
      id: `note-${Date.now()}`,
      conversation_id: id || '',
      content: newNote,
      timestamp: new Date().toISOString(),
      user_id: 'current-user',
      user_name: 'Você',
    };
    
    setNotes([...notes, newNoteItem]);
    setNewNote('');
    setShowNoteForm(false);
    toast.success('Nota adicionada');
  };

  const handleFileUpload = () => {
    toast.info('Funcionalidade de anexo em desenvolvimento');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full max-w-4xl mx-auto bg-white items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
        <p className="mt-2 text-gray-500">Carregando conversa...</p>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex flex-col h-full max-w-4xl mx-auto bg-white">
        <div className="p-4 border-b flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/conversations')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Detalhes da Conversa</h1>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold mb-2">Conversa não encontrada</h2>
            <p className="text-gray-500 mb-4">
              A conversa solicitada não existe ou foi removida.
            </p>
            <Button onClick={() => navigate('/conversations')}>
              Voltar para o Inbox
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white">
      {/* Header */}
      <div className="p-4 border-b sticky top-0 bg-white z-10 shadow-sm">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/conversations')}
            className="mr-2"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={conversation.avatar} alt={conversation.lead_nome} />
            <AvatarFallback>{getInitials(conversation.lead_nome)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold">{conversation.lead_nome}</h1>
              <div className="flex items-center ml-2">
                {getChannelIcon(conversation.canal)}
                <span className="text-xs text-muted-foreground ml-1">{conversation.canal}</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Badge variant={conversation.status === 'Aberta' ? 'default' : 'secondary'} className="text-xs h-5">
                {conversation.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm 
                  ${message.sender_type === 'user' 
                    ? 'bg-pink-100 text-gray-800' 
                    : 'bg-blue-100 text-gray-800'}`}
              >
                <div className="mb-1">{message.content}</div>
                
                {message.attachment && (
                  <div className="mt-2 flex items-center p-2 bg-white bg-opacity-50 rounded border border-gray-200">
                    <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm truncate">{message.attachment.name}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-end text-xs text-gray-500 mt-1">
                  <span>{formatMessageTime(message.timestamp)}</span>
                  {message.sender_type === 'user' && (
                    <span className="ml-1">• {message.status}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {notes.length > 0 && (
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white text-sm text-gray-500">
                  Notas internas
                </span>
              </div>
            </div>
          )}
          
          {notes.map((note) => (
            <div key={note.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center text-sm font-medium text-gray-600 mb-1">
                <FileText className="h-4 w-4 text-yellow-600 mr-2" />
                <span>{note.user_name}</span>
                <span className="ml-auto text-xs text-gray-500">
                  {formatMessageTime(note.timestamp)}
                </span>
              </div>
              <p className="text-sm text-gray-700">{note.content}</p>
            </div>
          ))}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Note form */}
      {showNoteForm && (
        <div className="p-4 bg-yellow-50 border-t border-yellow-200">
          <div className="flex items-center mb-2">
            <FileText className="h-4 w-4 text-yellow-600 mr-2" />
            <h3 className="text-sm font-medium">Adicionar nota interna</h3>
          </div>
          
          <Textarea
            placeholder="Digite uma nota interna (visível apenas para a equipe)..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[80px] mb-2 bg-white"
          />
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNoteForm(false)}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleSaveNote}
            >
              Salvar nota
            </Button>
          </div>
        </div>
      )}
      
      {/* Message input */}
      <div className="p-4 border-t sticky bottom-0 bg-white">
        {!showNoteForm && (
          <>
            <Textarea
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[80px] mb-2 resize-none"
              autoFocus
            />
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleFileUpload}
                  title="Anexar arquivo"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNoteForm(true)}
                  className="flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Nota interna</span>
                </Button>
              </div>
              
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sendingMessage}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {sendingMessage ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Enviar
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConversationDetail;
