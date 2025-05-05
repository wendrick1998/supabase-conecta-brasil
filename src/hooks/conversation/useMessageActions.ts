
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
      console.log('Sending media message:', { fileName: file.name, fileType: file.type, fileSize: file.size });
      
      // Generate a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${conversationId}/${fileName}`;
      
      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('media')
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: '3600'
        });
      
      if (uploadError) throw uploadError;
      
      // Get public URL for the uploaded file
      const { data: publicUrlData } = supabase
        .storage
        .from('media')
        .getPublicUrl(filePath);
      
      const fileUrl = publicUrlData.publicUrl;
      
      // Create message attachment object
      const attachment = {
        name: file.name,
        url: fileUrl,
        type: file.type,
      };
      
      // Add message to database with attachment
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
      
      // Update conversation with latest message
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
