
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from "@/components/ui/sonner";
import { Conversation, Message, InternalNote } from '@/types/conversation';
import { mockConversation, mockMessages, mockNotes } from '@/data/mockConversations';
import ConversationHeader from './ConversationHeader';
import MessageTimeline from './MessageTimeline';
import MessageInput from './MessageInput';
import NoteForm from './NoteForm';

const ConversationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notes, setNotes] = useState<InternalNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

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

  const handleSendMessage = (newMessage: string) => {
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
      setSendingMessage(false);
      toast.success('Mensagem enviada');
    }, 500);
  };

  const handleSaveNote = (noteContent: string) => {
    const newNoteItem: InternalNote = {
      id: `note-${Date.now()}`,
      conversation_id: id || '',
      content: noteContent,
      timestamp: new Date().toISOString(),
      user_id: 'current-user',
      user_name: 'Você',
    };
    
    setNotes([...notes, newNoteItem]);
    setShowNoteForm(false);
    toast.success('Nota adicionada');
  };

  const handleFileUpload = () => {
    toast.info('Funcionalidade de anexo em desenvolvimento');
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
          <button
            className="mr-2 p-2 rounded-md hover:bg-gray-100"
            onClick={() => navigate('/conversations')}
          >
            Voltar
          </button>
          <h1 className="text-xl font-bold">Detalhes da Conversa</h1>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold mb-2">Conversa não encontrada</h2>
            <p className="text-gray-500 mb-4">
              A conversa solicitada não existe ou foi removida.
            </p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
              onClick={() => navigate('/conversations')}
            >
              Voltar para o Inbox
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white">
      {/* Header */}
      <ConversationHeader conversation={conversation} />
      
      {/* Messages */}
      <MessageTimeline messages={messages} notes={notes} />
      
      {/* Note form */}
      {showNoteForm ? (
        <NoteForm 
          onSave={handleSaveNote} 
          onCancel={() => setShowNoteForm(false)} 
        />
      ) : (
        <MessageInput 
          onSend={handleSendMessage}
          onFileUpload={handleFileUpload}
          onAddNote={() => setShowNoteForm(true)}
          isLoading={sendingMessage}
        />
      )}
    </div>
  );
};

export default ConversationDetail;
