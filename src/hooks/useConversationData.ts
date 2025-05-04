
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";
import { Conversation, Message, InternalNote } from '@/types/conversation';
import { mockConversation, mockMessages, mockNotes } from '@/data/mockConversations';

export const useConversationData = (id: string | undefined) => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notes, setNotes] = useState<InternalNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Load conversation data
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

  // Message handling
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
      
      setMessages(prevMessages => [...prevMessages, newMsg]);
      setSendingMessage(false);
      toast.success('Mensagem enviada');
    }, 500);
  };

  // Note handling
  const handleSaveNote = (noteContent: string) => {
    const newNoteItem: InternalNote = {
      id: `note-${Date.now()}`,
      conversation_id: id || '',
      content: noteContent,
      timestamp: new Date().toISOString(),
      user_id: 'current-user',
      user_name: 'Você',
    };
    
    setNotes(prevNotes => [...prevNotes, newNoteItem]);
    toast.success('Nota adicionada');
  };

  // Media message handling
  const handleSendMediaMessage = (file: File, contentText: string) => {
    setSendingMessage(true);
    
    setTimeout(() => {
      const newMsg: Message = {
        id: `media-${Date.now()}`,
        conversation_id: id || '',
        content: contentText,
        timestamp: new Date().toISOString(),
        sender_type: 'user',
        status: 'sent',
        attachment: {
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type,
        },
      };
      
      setMessages(prevMessages => [...prevMessages, newMsg]);
      setSendingMessage(false);
      toast.success(`${contentText}`);
    }, 500);
  };

  return {
    conversation,
    messages,
    notes,
    loading,
    sendingMessage,
    handleSendMessage,
    handleSaveNote,
    handleSendMediaMessage,
    setSendingMessage,
    setMessages,
  };
};
