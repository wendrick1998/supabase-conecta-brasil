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
  channel?: string;
}

// Get all conversations
export const getConversations = async (filters?: InboxFilters): Promise<Conversation[]> => {
  try {
    // Create a query builder
    let query = supabase.from('conversations').select('*');
    
    // Apply filters if provided
    if (filters) {
      // Channel filter
      if (filters.canais && filters.canais.length > 0) {
        // Use type assertion to primitive array to avoid deep type instantiation
        const channelFilters = [...filters.canais] as string[];
        query = query.in('canal', channelFilters);
      }
      
      // Status filter
      if (filters.status && filters.status.length > 0) {
        // Use type assertion to primitive array to avoid deep type instantiation
        const statusFilters = [...filters.status] as string[];
        query = query.in('status', statusFilters);
      }
      
      // Priority filter
      if (filters.priority) {
        query = query.eq('prioridade', filters.priority);
      }
      
      // Account filter
      if (filters.accountId) {
        query = query.eq('conexao_id', filters.accountId);
      }
      
      // Search filter
      if (filters.search) {
        const pattern = `%${filters.search}%`;
        // Use direct string concatenation to avoid complex type inference
        query = query.or('lead_nome.ilike.' + pattern + ',ultima_mensagem.ilike.' + pattern);
      }
      
      // Date range filter
      if (filters.dateRange) {
        query = query.gte('horario', filters.dateRange.from.toISOString());
        query = query.lte('horario', filters.dateRange.to.toISOString());
      }
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
