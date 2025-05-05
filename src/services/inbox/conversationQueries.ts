
import { supabase } from "@/integrations/supabase/client";
import { Conversation } from "@/types/conversation";

// Define the interface for inbox filters
export interface InboxFilters {
  search?: string;
  canais?: string[];
  status?: string[];
  priority?: string;
  accountId?: string;
  channel?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

// Type for connected accounts
export interface ConnectedAccount {
  id: string;
  nome: string;
  canal: string;
}

// Get conversations with optional filtering
export const getConversations = async (filters?: InboxFilters) => {
  let query = supabase
    .from('conversations')
    .select('*')
    .order('updated_at', { ascending: false });

  // Apply filters if provided
  if (filters) {
    // Filter by search term
    if (filters.search && filters.search.trim()) {
      query = query.ilike('lead_nome', `%${filters.search.trim()}%`);
    }

    // Filter by channels
    if (filters.canais && filters.canais.length > 0) {
      query = query.in('canal', filters.canais);
    }

    // Filter by status
    if (filters.status && filters.status.length > 0) {
      query = query.in('status', filters.status);
    }

    // Filter by priority
    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }

    // Filter by account
    if (filters.accountId) {
      query = query.eq('account_id', filters.accountId);
    }

    // Filter by specific channel
    if (filters.channel) {
      query = query.eq('canal', filters.channel);
    }

    // Filter by date range
    if (filters.dateRange) {
      const { from, to } = filters.dateRange;
      query = query
        .gte('created_at', from.toISOString())
        .lte('created_at', to.toISOString());
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }

  return data as Conversation[];
};

// Get conversation statistics
export const getConversationStats = async () => {
  const { data: total, error: totalError } = await supabase
    .from('conversations')
    .select('id', { count: 'exact', head: true });

  const { data: unread, error: unreadError } = await supabase
    .from('conversations')
    .select('id', { count: 'exact', head: true })
    .eq('unread', true);

  const { data: byChannel, error: channelError } = await supabase
    .from('conversations')
    .select('canal, id');

  if (totalError || unreadError || channelError) {
    console.error('Error fetching conversation stats:', totalError || unreadError || channelError);
    throw totalError || unreadError || channelError;
  }

  // Count by channel
  const channelCount: Record<string, number> = {};
  byChannel?.forEach(item => {
    if (item.canal) {
      channelCount[item.canal] = (channelCount[item.canal] || 0) + 1;
    }
  });

  return {
    total: total?.length || 0,
    unread: unread?.length || 0,
    byChannel: channelCount
  };
};

// Get connected accounts
export const getConnectedAccounts = async () => {
  // Use the direct table name to avoid type issues
  const { data, error } = await supabase
    .from('canais_conectados')
    .select('id, nome, canal');

  if (error) {
    console.error('Error fetching connected accounts:', error);
    throw error;
  }

  return data as ConnectedAccount[] || [];
};
