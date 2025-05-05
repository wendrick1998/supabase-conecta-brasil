
import { toast } from "@/components/ui/sonner";

// Helper function to validate UUID
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Helper function to handle common validation
export const validateConversationId = (conversationId: string | undefined): boolean => {
  if (!conversationId) {
    toast.error('ID de conversa não encontrado');
    return false;
  }
  
  if (!isValidUUID(conversationId)) {
    toast.error('ID de conversa inválido');
    return false;
  }
  
  return true;
};

// Helper function to validate user
export const validateUser = (user: any): boolean => {
  if (!user) {
    toast.error('Você precisa estar logado para enviar mensagens');
    return false;
  }
  
  return true;
};
