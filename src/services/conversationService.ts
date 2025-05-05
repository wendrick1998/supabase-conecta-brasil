import { supabase } from "@/integrations/supabase/client";
import { Message, Conversation } from "@/types/conversation";
import { toast } from "@/components/ui/sonner";

// Buscar mensagens de um lead
export const getLeadMessages = async (leadId: string): Promise<Message[]> => {
  try {
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
      .eq('lead_id', leadId)
      .order('timestamp', { ascending: false });

    if (error) {
      throw error;
    }

    return data as Message[];
  } catch (error) {
    console.error('Erro ao buscar mensagens do lead:', error);
    toast.error('Não foi possível carregar as mensagens');
    return [];
  }
};

// Buscar conversa por ID
export const getConversationById = async (conversationId: string) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar conversa:', error);
    return null;
  }
};

// Enviar nova mensagem
export const sendMessage = async (
  conversationId: string, 
  content: string, 
  senderType: 'user' | 'lead' = 'user',
  attachment = null
) => {
  try {
    // Primeiro obter a conversa para pegar o lead_id e outros detalhes
    const conversation = await getConversationById(conversationId);
    
    if (!conversation) {
      throw new Error('Conversa não encontrada');
    }
    
    // Criar a mensagem
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        lead_id: conversation.lead_id,
        content,
        sender_type: senderType,
        attachment,
        status: 'sent'
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Atualizar a conversa com a última mensagem
    await supabase
      .from('conversations')
      .update({
        ultima_mensagem: content,
        horario: new Date().toISOString()
      })
      .eq('id', conversationId);
    
    return data;
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    throw error;
  }
};

// Marcar conversa como lida
export const markConversationAsRead = async (conversationId: string) => {
  try {
    const { error } = await supabase
      .from('conversations')
      .update({ nao_lida: false })
      .eq('id', conversationId);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao marcar conversa como lida:', error);
    return false;
  }
};

// Buscar mensagens de uma conversa com paginação
export const getConversationMessages = async (
  conversationId: string,
  limit: number = 20,
  startFromIndex: number = 0
): Promise<Message[]> => {
  try {
    if (!conversationId) {
      return [];
    }

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
      throw error;
    }

    return (data?.reverse() || []) as Message[];
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    toast.error('Não foi possível carregar as mensagens');
    return [];
  }
};

// Get conversations for multiple leads
export const getConversationsForLeads = async (leadIds: string[]): Promise<Record<string, Conversation>> => {
  try {
    if (leadIds.length === 0) return {};

    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .in('lead_id', leadIds);

    if (error) {
      console.error('Error fetching conversations for leads:', error);
      return {};
    }

    // Map the conversations by lead_id for easy access
    const conversationsMap: Record<string, Conversation> = {};
    
    (data as Conversation[]).forEach(conversation => {
      if (conversation.lead_id) {
        conversationsMap[conversation.lead_id] = conversation;
      }
    });

    return conversationsMap;
  } catch (error) {
    console.error('Error in getConversationsForLeads:', error);
    return {};
  }
};
