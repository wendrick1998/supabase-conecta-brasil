
import { useState } from 'react';
import { toast } from "@/components/ui/sonner";
import { Message } from '@/types/conversation';
import { supabase } from "@/integrations/supabase/client";
import useMediaUpload from '@/hooks/useMediaUpload';
import { useAuth } from '@/contexts/AuthContext';

export const useMessageActions = (conversationId: string | undefined, setMessages: React.Dispatch<React.SetStateAction<Message[]>>) => {
  const [sendingMessage, setSendingMessage] = useState(false);
  const { uploadMedia } = useMediaUpload(conversationId);
  const { user } = useAuth();

  // Helper function to validate UUID
  const isValidUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  // Message handling
  const handleSendMessage = async (newMessage: string) => {
    if (!conversationId) {
      toast.error('ID de conversa não encontrado');
      return;
    }
    
    if (!isValidUUID(conversationId)) {
      toast.error('ID de conversa inválido');
      return;
    }
    
    if (!user) {
      toast.error('Você precisa estar logado para enviar mensagens');
      return;
    }
    
    setSendingMessage(true);
    
    try {
      // Add message to database
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          content: newMessage,
          sender_type: 'user',
          status: 'sent',
        })
        .select()
        .single();
      
      if (messageError) {
        console.error('Message error:', messageError);
        throw messageError;
      }
      
      // Update conversation with latest message
      const { error: conversationError } = await supabase
        .from('conversations')
        .update({
          ultima_mensagem: newMessage,
          horario: new Date().toISOString(),
          nao_lida: false,
        })
        .eq('id', conversationId);
      
      if (conversationError) {
        console.error('Conversation update error:', conversationError);
        // Continue even if conversation update fails - the message was already saved
      }
      
      // Add new message to state - ensure proper typing
      const typedMessage: Message = {
        ...messageData as any,
        sender_type: messageData.sender_type as "user" | "lead",
        status: messageData.status as "sent" | "delivered" | "read",
        attachment: messageData.attachment as Message['attachment'] | undefined
      };
      
      setMessages(prevMessages => [...prevMessages, typedMessage]);
      toast.success('Mensagem enviada');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Não foi possível enviar a mensagem');
    } finally {
      setSendingMessage(false);
    }
  };

  // Media message handling
  const handleSendMediaMessage = async (file: File, contentText: string) => {
    if (!conversationId) {
      toast.error('ID de conversa não encontrado');
      return;
    }
    
    if (!user) {
      toast.error('Você precisa estar logado para enviar mídia');
      return;
    }
    
    try {
      const success = await uploadMedia(file, contentText);
      
      if (success) {
        // The message is already added to the database in uploadMedia
        // We need to fetch the latest messages to update the UI
        const { data: latestMessages, error: fetchError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('timestamp', { ascending: false })
          .limit(1)
          .single();
          
        if (fetchError) {
          console.error('Error fetching latest message:', fetchError);
          return;
        }
        
        if (latestMessages) {
          // Add new message to state
          const typedMessage: Message = {
            ...latestMessages as any,
            sender_type: latestMessages.sender_type as "user" | "lead",
            status: latestMessages.status as "sent" | "delivered" | "read",
            attachment: latestMessages.attachment as Message['attachment'] | undefined
          };
          
          setMessages(prevMessages => [...prevMessages, typedMessage]);
        }
      }
    } catch (error) {
      console.error('Erro ao processar mídia:', error);
      toast.error('Ocorreu um erro ao processar a mídia');
    }
  };

  return {
    sendingMessage,
    handleSendMessage,
    handleSendMediaMessage,
    setSendingMessage
  };
};
