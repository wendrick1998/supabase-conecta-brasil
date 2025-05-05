
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";
import { Conversation, Message, InternalNote } from '@/types/conversation';
import { mockConversation, mockMessages, mockNotes } from '@/data/mockConversations';
import { supabase } from "@/integrations/supabase/client";

export const useConversationData = (id: string | undefined) => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notes, setNotes] = useState<InternalNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Load conversation data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setLoading(false);
        setError("ID de conversa não fornecido");
        return;
      }
      
      setLoading(true);
      setError(null);

      try {
        // First, check if the ID is a conversation ID
        let { data: conversationData, error: conversationError } = await supabase
          .from('conversations')
          .select('*')
          .eq('id', id)
          .single();

        // If not found as conversation ID, try as lead ID
        if (conversationError || !conversationData) {
          const { data: leadConversation, error: leadError } = await supabase
            .from('conversations')
            .select('*')
            .eq('lead_id', id)
            .order('horario', { ascending: false })
            .limit(1)
            .single();

          if (leadError || !leadConversation) {
            // For demo/development, use mock data if no real data found
            if (id === '1') {
              setConversation(mockConversation);
              setMessages(mockMessages);
              setNotes(mockNotes);
            } else {
              // Create a new placeholder conversation for this lead
              const placeholderConversation: Conversation = {
                id: `new-${id}`,
                lead_id: id,
                lead_nome: `Lead ${id}`,
                canal: 'WhatsApp', // Ensure we use a valid enum value
                ultima_mensagem: 'Este lead ainda não possui histórico de conversa.',
                horario: new Date().toISOString(),
                nao_lida: false,
                status: 'Aberta'
              };
              
              setConversation(placeholderConversation);
              setMessages([]);
              setNotes([]);
            }
          } else {
            // Found a conversation for this lead - cast to correct type
            setConversation({
              ...leadConversation,
              canal: leadConversation.canal as Conversation["canal"]
            });
            
            // Fetch messages for this conversation
            const { data: messagesData } = await supabase
              .from('messages')
              .select('*')
              .eq('conversation_id', leadConversation.id)
              .order('timestamp', { ascending: true });
              
            // Cast message sender_type to correct type
            const typedMessages: Message[] = messagesData?.map(msg => ({
              ...msg,
              sender_type: msg.sender_type as "user" | "lead",
              status: msg.status as "sent" | "delivered" | "read"
            })) || [];
              
            setMessages(typedMessages);
            
            // Fetch internal notes
            const { data: notesData } = await supabase
              .from('internal_notes')
              .select('*')
              .eq('conversation_id', leadConversation.id)
              .order('timestamp', { ascending: true });
              
            setNotes(notesData || []);
            
            // Mark as read if it was unread
            if (leadConversation.nao_lida) {
              await supabase
                .from('conversations')
                .update({ nao_lida: false })
                .eq('id', leadConversation.id);
            }
          }
        } else {
          // Found the conversation directly - cast to correct type
          setConversation({
            ...conversationData,
            canal: conversationData.canal as Conversation["canal"]
          });
          
          // Fetch messages
          const { data: messagesData } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', id)
            .order('timestamp', { ascending: true });
          
          // Cast message sender_type to correct type
          const typedMessages: Message[] = messagesData?.map(msg => ({
            ...msg,
            sender_type: msg.sender_type as "user" | "lead",
            status: msg.status as "sent" | "delivered" | "read"
          })) || [];
            
          setMessages(typedMessages);
          
          // Fetch internal notes
          const { data: notesData } = await supabase
            .from('internal_notes')
            .select('*')
            .eq('conversation_id', id)
            .order('timestamp', { ascending: true });
            
          setNotes(notesData || []);
          
          // Mark as read if it was unread
          if (conversationData.nao_lida) {
            await supabase
              .from('conversations')
              .update({ nao_lida: false })
              .eq('id', conversationData.id);
          }
        }
      } catch (err) {
        console.error('Error fetching conversation data:', err);
        setError('Erro ao carregar dados da conversa');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Message handling
  const handleSendMessage = async (newMessage: string) => {
    if (!conversation) return;
    
    setSendingMessage(true);
    
    try {
      // Add message to database
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          content: newMessage,
          sender_type: 'user',
          status: 'sent',
        })
        .select()
        .single();
      
      if (messageError) throw messageError;
      
      // Update conversation with latest message
      await supabase
        .from('conversations')
        .update({
          ultima_mensagem: newMessage,
          horario: new Date().toISOString(),
          nao_lida: false,
        })
        .eq('id', conversation.id);
      
      // Add new message to state - ensure proper typing
      const typedMessage = {
        ...messageData,
        sender_type: messageData.sender_type as "user" | "lead",
        status: messageData.status as "sent" | "delivered" | "read"
      };
      
      setMessages(prevMessages => [...prevMessages, typedMessage as Message]);
      toast.success('Mensagem enviada');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Não foi possível enviar a mensagem');
    } finally {
      setSendingMessage(false);
    }
  };

  // Note handling
  const handleSaveNote = async (noteContent: string) => {
    if (!conversation) return;
    
    try {
      const { data: noteData, error: noteError } = await supabase
        .from('internal_notes')
        .insert({
          conversation_id: conversation.id,
          content: noteContent,
          user_id: 'current-user',
          user_name: 'Você',
        })
        .select()
        .single();
      
      if (noteError) throw noteError;
      
      setNotes(prevNotes => [...prevNotes, noteData as InternalNote]);
      toast.success('Nota adicionada');
    } catch (error) {
      console.error('Erro ao adicionar nota:', error);
      toast.error('Não foi possível adicionar a nota');
    }
  };

  // Media message handling
  const handleSendMediaMessage = async (file: File, contentText: string) => {
    if (!conversation) return;
    
    setSendingMessage(true);
    
    try {
      // For real implementation, upload file to Supabase storage first
      // For now, create a temporary URL
      const fileUrl = URL.createObjectURL(file);
      
      const attachment = {
        name: file.name,
        url: fileUrl,
        type: file.type,
      };
      
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          content: contentText,
          sender_type: 'user',
          status: 'sent',
          attachment,
        })
        .select()
        .single();
      
      if (messageError) throw messageError;
      
      await supabase
        .from('conversations')
        .update({
          ultima_mensagem: contentText,
          horario: new Date().toISOString(),
          nao_lida: false,
        })
        .eq('id', conversation.id);
      
      // Add new message to state - ensure proper typing
      const typedMessage = {
        ...messageData,
        sender_type: messageData.sender_type as "user" | "lead",
        status: messageData.status as "sent" | "delivered" | "read"
      };
      
      setMessages(prevMessages => [...prevMessages, typedMessage as Message]);
      toast.success(`${contentText}`);
    } catch (error) {
      console.error('Erro ao enviar mídia:', error);
      toast.error('Não foi possível enviar a mídia');
    } finally {
      setSendingMessage(false);
    }
  };

  return {
    conversation,
    messages,
    notes,
    loading,
    error,
    sendingMessage,
    handleSendMessage,
    handleSaveNote,
    handleSendMediaMessage,
    setSendingMessage,
    setMessages,
  };
};
