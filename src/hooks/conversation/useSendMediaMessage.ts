
import { supabase } from "@/integrations/supabase/client";
import { Message } from '@/types/conversation';
import { toast } from "@/components/ui/sonner";
import { validateConversationId, validateUser } from './utils/messageUtils';

export const useSendMediaMessage = (
  conversationId: string | undefined,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  uploadMedia: (file: File, contentText: string) => Promise<boolean>
) => {
  // Media message handling with retry support
  const handleSendMediaMessage = async (
    file: File, 
    contentText: string, 
    user: any,
    retryCount: number = 0
  ) => {
    if (!validateConversationId(conversationId) || !validateUser(user)) {
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
          handleSendMediaMessage(file, contentText, user, retryCount + 1);
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
          handleSendMediaMessage(file, contentText, user, retryCount + 1);
        }, 2000);
      } else {
        toast.error('Ocorreu um erro ao processar a mídia após múltiplas tentativas');
      }
    }
  };

  return {
    handleSendMediaMessage
  };
};
