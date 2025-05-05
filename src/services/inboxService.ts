
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Conversation } from "@/types/conversation";

// Interface for filters
export interface InboxFilters {
  search?: string;
  canais?: string[];
  status?: string[];
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
        // Use explicit type parameter to avoid deep inference
        query = query.in('canal', filters.canais as unknown as string[]);
      }
      
      // Status filter
      if (filters.status && filters.status.length > 0) {
        // Use explicit type parameter to avoid deep inference
        query = query.in('status', filters.status as unknown as string[]);
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
        // Use a more direct approach for the OR condition
        query = query.or(`lead_nome.ilike.${pattern},ultima_mensagem.ilike.${pattern}`);
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
    
    // Store the data in localStorage for offline usage
    if (data && data.length > 0) {
      try {
        localStorage.setItem('conversations-cache', JSON.stringify(data));
        localStorage.setItem('conversations-cache-timestamp', Date.now().toString());
      } catch (e) {
        console.warn('Failed to cache conversations in localStorage:', e);
      }
    }
    
    return (data || []) as Conversation[];
  } catch (error: any) {
    toast.error(`Erro ao buscar conversas: ${error.message}`);
    
    // Try to load from cache when offline
    try {
      const cachedData = localStorage.getItem('conversations-cache');
      if (cachedData) {
        return JSON.parse(cachedData) as Conversation[];
      }
    } catch (e) {
      console.warn('Failed to load cached conversations:', e);
    }
    
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
    
    // Cache stats for offline usage
    try {
      localStorage.setItem('conversation-stats-cache', JSON.stringify({
        total: total || 0,
        unread: unread || 0,
        byChannel
      }));
      localStorage.setItem('conversation-stats-timestamp', Date.now().toString());
    } catch (e) {
      console.warn('Failed to cache conversation stats:', e);
    }
    
    return {
      total: total || 0,
      unread: unread || 0,
      byChannel
    };
  } catch (error: any) {
    console.error('Error fetching conversation stats:', error);
    
    // Try to load from cache when offline
    try {
      const cachedStats = localStorage.getItem('conversation-stats-cache');
      if (cachedStats) {
        return JSON.parse(cachedStats);
      }
    } catch (e) {
      console.warn('Failed to load cached conversation stats:', e);
    }
    
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
    
    // Cache accounts for offline usage
    if (data) {
      try {
        localStorage.setItem('connected-accounts-cache', JSON.stringify(data));
        localStorage.setItem('connected-accounts-timestamp', Date.now().toString());
      } catch (e) {
        console.warn('Failed to cache connected accounts:', e);
      }
    }
    
    return data || [];
  } catch (error: any) {
    console.error('Error fetching connected accounts:', error);
    
    // Try to load from cache when offline
    try {
      const cachedAccounts = localStorage.getItem('connected-accounts-cache');
      if (cachedAccounts) {
        return JSON.parse(cachedAccounts);
      }
    } catch (e) {
      console.warn('Failed to load cached connected accounts:', e);
    }
    
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
          
          // Show notification when app is in background
          if (document.visibilityState === 'hidden' && Notification.permission === 'granted') {
            const notificationTitle = 'Nova conversa';
            const notificationOptions = {
              body: `Nova mensagem de ${conversation.lead_nome}`,
              icon: '/lovable-uploads/5cd87705-c40b-4d5a-9a43-57cff2564fbf.png',
              badge: '/lovable-uploads/5cd87705-c40b-4d5a-9a43-57cff2564fbf.png',
              vibrate: [100, 50, 100],
              data: {
                url: `/inbox`
              }
            };
            
            try {
              navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(notificationTitle, notificationOptions);
              });
            } catch (error) {
              console.error('Failed to show notification:', error);
            }
          }
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
