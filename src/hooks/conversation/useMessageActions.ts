
import { useState } from 'react';
import { toast } from "@/components/ui/sonner";
import { Message } from '@/types/conversation';
import { supabase } from "@/integrations/supabase/client";
import useMediaUpload from '@/hooks/useMediaUpload';
import { useAuth } from '@/contexts/AuthContext';

export const useMessageActions = (conversationId: string | undefined, setMessages: React.Dispatch<React.SetStateAction<Message[]>>) => {
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isLoadingMoreMessages, setIsLoadingMoreMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const { uploadMedia } = useMediaUpload(conversationId);
  const { user } = useAuth();

  // Helper function to validate UUID
  const isValidUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  // Otimização: Carregar mensagens com paginação
  const fetchMessages = async (
    limit: number = 20,
    startFromIndex: number = 0,
    resetMessages: boolean = false
  ) => {
    if (!conversationId || !isValidUUID(conversationId)) {
      toast.error('ID de conversa inválido ou não encontrado');
      return [];
    }

    setIsLoadingMoreMessages(true);

    try {
      // Consulta otimizada: uso de range e ordenação reversa para paginação eficiente
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          sender_type,
          timestamp,
          status,
          attachment
        `)
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: false })
        .range(startFromIndex, startFromIndex + limit - 1);

      if (error) {
        console.error('Erro ao carregar mensagens:', error);
        throw error;
      }

      // Atualizar flag de mais mensagens
      setHasMoreMessages(data.length === limit);

      // Inverter a ordem para exibir mais antigas primeiro
      const messages = data.reverse();

      // Atualizar estado com as mensagens
      if (resetMessages) {
        setMessages(messages as Message[]);
      } else {
        setMessages(prevMessages => [...messages as Message[], ...prevMessages]);
      }

      return messages;
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      toast.error('Não foi possível carregar as mensagens');
      return [];
    } finally {
      setIsLoadingMoreMessages(false);
    }
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

  // Media message handling with retry support
  const handleSendMediaMessage = async (file: File, contentText: string, retryCount: number = 0) => {
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
        // Fetch only the latest message to update the UI (optimized)
        const { data: latestMessage, error: fetchError } = await supabase
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
        
        if (latestMessage) {
          // Add new message to state
          const typedMessage: Message = {
            ...latestMessage as any,
            sender_type: latestMessage.sender_type as "user" | "lead",
            status: latestMessage.status as "sent" | "delivered" | "read",
            attachment: latestMessage.attachment as Message['attachment'] | undefined
          };
          
          setMessages(prevMessages => [...prevMessages, typedMessage]);
        }
      } else if (retryCount < 2) {
        // Implementação de retry para uploads falhos
        console.log(`Tentando novamente o upload (${retryCount + 1}/3)...`);
        setTimeout(() => {
          handleSendMediaMessage(file, contentText, retryCount + 1);
        }, 2000); // Espera 2 segundos antes de tentar novamente
      } else {
        toast.error('Falha no upload após múltiplas tentativas.');
      }
    } catch (error) {
      console.error('Erro ao processar mídia:', error);
      
      if (retryCount < 2) {
        // Tentativa de recuperação automática
        console.log(`Tentando recuperar de erro (${retryCount + 1}/3)...`);
        setTimeout(() => {
          handleSendMediaMessage(file, contentText, retryCount + 1);
        }, 2000);
      } else {
        toast.error('Ocorreu um erro ao processar a mídia após múltiplas tentativas');
      }
    }
  };

  return {
    sendingMessage,
    isLoadingMoreMessages,
    hasMoreMessages,
    handleSendMessage,
    handleSendMediaMessage,
    fetchMessages,
    setSendingMessage
  };
};
