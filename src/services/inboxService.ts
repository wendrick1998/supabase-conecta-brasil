
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Conversation } from "@/types/conversation";

// Interface for filters
export interface InboxFilters {
  search?: string;
  canais?: ('WhatsApp' | 'Instagram' | 'Facebook' | 'Email')[];
  status?: ('Aberta' | 'Fechada')[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  priority?: string;
  accountId?: string;
  channel?: string; // Add the missing channel property
}

// Get all conversations
export const getConversations = async (filters?: InboxFilters): Promise<Conversation[]> => {
  try {
    // Build query conditions first instead of chaining
    const conditions: Record<string, any> = {};
    let searchFilter = '';
    
    // Apply filters to our conditions object
    if (filters) {
      // Filter by channels
      if (filters.canais && filters.canais.length > 0) {
        conditions.canal = filters.canais;
      }
      
      // Filter by status
      if (filters.status && filters.status.length > 0) {
        conditions.status = filters.status;
      }
      
      // Filter by priority
      if (filters.priority) {
        conditions.prioridade = filters.priority;
      }
      
      // Filter by connected account
      if (filters.accountId) {
        conditions.conexao_id = filters.accountId;
      }
      
      // Filter by search term - handled separately
      if (filters.search) {
        searchFilter = `lead_nome.ilike.%${filters.search}%,ultima_mensagem.ilike.%${filters.search}%`;
      }
    }
    
    // Start with the base query
    let query = supabase
      .from('conversations')
      .select('*');
    
    // Apply the condition filters
    if (Object.keys(conditions).length > 0) {
      // Apply each filter condition
      for (const [key, value] of Object.entries(conditions)) {
        if (Array.isArray(value)) {
          query = query.in(key, value);
        } else {
          query = query.eq(key, value);
        }
      }
    }
    
    // Apply search filter if it exists
    if (searchFilter) {
      query = query.or(searchFilter);
    }
    
    // Apply date range filter separately
    if (filters?.dateRange) {
      const fromDate = filters.dateRange.from.toISOString();
      const toDate = filters.dateRange.to.toISOString();
      query = query.gte('horario', fromDate).lte('horario', toDate);
    }
    
    // Add ordering at the end
    query = query.order('horario', { ascending: false });
    
    // Execute the query
    const { data, error } = await query;
    
    if (error) throw error;
    
    return (data || []) as Conversation[];
  } catch (error: any) {
    toast.error(`Erro ao buscar conversas: ${error.message}`);
    return [];
  }
};

// Get conversation statistics
export const getConversationStats = async (): Promise<{
  total: number;
  unread: number;
  byChannel: Record<string, number>;
}> => {
  try {
    // Get total conversations
    const { count: total, error: totalError } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true });
    
    if (totalError) throw totalError;
    
    // Get unread conversations
    const { count: unread, error: unreadError } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('nao_lida', true);
    
    if (unreadError) throw unreadError;
    
    // Get conversations by channel
    const { data: channelData, error: channelError } = await supabase
      .from('conversations')
      .select('canal')
      .is('nao_lida', true);
    
    if (channelError) throw channelError;
    
    // Count conversations by channel
    const byChannel: Record<string, number> = {};
    channelData?.forEach(conversation => {
      const channel = conversation.canal;
      byChannel[channel] = (byChannel[channel] || 0) + 1;
    });
    
    return {
      total: total || 0,
      unread: unread || 0,
      byChannel
    };
  } catch (error: any) {
    console.error('Error fetching conversation stats:', error);
    return {
      total: 0,
      unread: 0,
      byChannel: {}
    };
  }
};

// Get connected accounts for filter
export const getConnectedAccounts = async (): Promise<Array<{id: string, nome: string, canal: string}>> => {
  try {
    const { data, error } = await supabase
      .from('canais_conectados')
      .select('id, nome, canal')
      .eq('status', true);
      
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error('Error fetching connected accounts:', error);
    return [];
  }
};

// Subscribe to conversation changes
export const subscribeToConversations = (
  onInsert?: (conversation: Conversation) => void,
  onUpdate?: (conversation: Conversation) => void,
  onDelete?: (id: string) => void
) => {
  const channel = supabase
    .channel('conversation-changes')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'conversations' },
      (payload) => {
        if (onInsert) {
          const conversation = payload.new as Conversation;
          onInsert(conversation);
        }
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'conversations' },
      (payload) => {
        if (onUpdate) {
          const conversation = payload.new as Conversation;
          onUpdate(conversation);
        }
      }
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'conversations' },
      (payload) => {
        if (onDelete) {
          const id = payload.old.id;
          onDelete(id);
        }
      }
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
};
