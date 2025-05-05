
import { useState } from 'react';
import { toast } from "@/components/ui/sonner";
import { Message } from '@/types/conversation';
import { supabase } from "@/integrations/supabase/client";
import { validateConversationId, validateUser } from './utils/messageUtils';

export const useSendMessage = (
  conversationId: string | undefined, 
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const [sendingMessage, setSendingMessage] = useState(false);

  // Message handling
  const handleSendMessage = async (newMessage: string, user: any) => {
    if (!validateConversationId(conversationId) || !validateUser(user)) {
      return;
    }
    
    setSendingMessage(true);
    
    try {
      // Otimização: Realizar as duas operações em paralelo
      const [messageResult, conversationResult] = await Promise.all([
        // Add message to database
        supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            content: newMessage,
            sender_type: 'user',
            status: 'sent',
          })
          .select()
          .single(),
          
        // Update conversation with latest message
        supabase
          .from('conversations')
          .update({
            ultima_mensagem: newMessage,
            horario: new Date().toISOString(),
            nao_lida: false,
          })
          .eq('id', conversationId)
      ]);
      
      if (messageResult.error) {
        console.error('Message error:', messageResult.error);
        throw messageResult.error;
      }
      
      if (conversationResult.error) {
        console.error('Conversation update error:', conversationResult.error);
        // Continue even if conversation update fails - the message was already saved
      }
      
      // Add new message to state - ensure proper typing
      const typedMessage: Message = {
        ...messageResult.data as any,
        sender_type: messageResult.data.sender_type as "user" | "lead",
        status: messageResult.data.status as "sent" | "delivered" | "read",
        attachment: messageResult.data.attachment as Message['attachment'] | undefined
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

  return {
    sendingMessage,
    setSendingMessage,
    handleSendMessage
  };
};
