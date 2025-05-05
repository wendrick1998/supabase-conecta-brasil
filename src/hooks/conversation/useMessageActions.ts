
import { useState } from 'react';
import { toast } from "@/components/ui/sonner";
import { Message } from '@/types/conversation';
import { supabase } from "@/integrations/supabase/client";

export const useMessageActions = (conversationId: string | undefined, setMessages: React.Dispatch<React.SetStateAction<Message[]>>) => {
  const [sendingMessage, setSendingMessage] = useState(false);

  // Message handling
  const handleSendMessage = async (newMessage: string) => {
    if (!conversationId) return;
    
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
      
      if (messageError) throw messageError;
      
      // Update conversation with latest message
      await supabase
        .from('conversations')
        .update({
          ultima_mensagem: newMessage,
          horario: new Date().toISOString(),
          nao_lida: false,
        })
        .eq('id', conversationId);
      
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
    if (!conversationId) return;
    
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
          conversation_id: conversationId,
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
        .eq('id', conversationId);
      
      // Add new message to state - ensure proper typing
      const typedMessage: Message = {
        ...messageData as any,
        sender_type: messageData.sender_type as "user" | "lead",
        status: messageData.status as "sent" | "delivered" | "read",
        attachment: messageData.attachment as Message['attachment'] | undefined
      };
      
      setMessages(prevMessages => [...prevMessages, typedMessage]);
      toast.success(`${contentText}`);
    } catch (error) {
      console.error('Erro ao enviar mídia:', error);
      toast.error('Não foi possível enviar a mídia');
    } finally {
      setSendingMessage(false);
    }
  };

  return {
    sendingMessage,
    handleSendMessage,
    handleSendMediaMessage,
    setSendingMessage
  };
};
