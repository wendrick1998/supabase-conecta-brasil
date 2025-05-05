
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface WhatsAppSession {
  id: string;
  usuario_id: string | null;
  canal_id: string | null;
  qr_code: string | null;
  status: 'conectado' | 'conectando' | 'desconectado' | 'erro';
  instance_name: string;
  last_activity: string;
  criado_em: string;
  atualizado_em: string;
}

export interface SessionEvent {
  id: string;
  session_id: string | null;
  event_type: string;
  payload: any | null;
  criado_em: string;
}

// Create a new WhatsApp session
export const createWhatsAppSession = async (
  userId: string,
  channelId: string,
  instanceName: string
): Promise<WhatsAppSession | null> => {
  try {
    const { data, error } = await supabase
      .from('sessions_whatsapp')
      .insert({
        usuario_id: userId,
        canal_id: channelId,
        instance_name: instanceName,
        status: 'desconectado'
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data as WhatsAppSession;
  } catch (error: any) {
    toast.error(`Erro ao criar sessão do WhatsApp: ${error.message}`);
    return null;
  }
};

// Get a WhatsApp session by ID
export const getWhatsAppSession = async (sessionId: string): Promise<WhatsAppSession | null> => {
  try {
    const { data, error } = await supabase
      .from('sessions_whatsapp')
      .select('*')
      .eq('id', sessionId)
      .single();
    
    if (error) throw error;
    
    return data as WhatsAppSession;
  } catch (error: any) {
    console.error(`Erro ao buscar sessão do WhatsApp: ${error.message}`);
    return null;
  }
};

// Get WhatsApp sessions for a channel
export const getWhatsAppSessionsByChannel = async (channelId: string): Promise<WhatsAppSession[]> => {
  try {
    const { data, error } = await supabase
      .from('sessions_whatsapp')
      .select('*')
      .eq('canal_id', channelId)
      .order('criado_em', { ascending: false });
    
    if (error) throw error;
    
    return data as WhatsAppSession[];
  } catch (error: any) {
    console.error(`Erro ao buscar sessões do WhatsApp: ${error.message}`);
    return [];
  }
};

// Update a WhatsApp session
export const updateWhatsAppSession = async (
  sessionId: string,
  sessionData: Partial<WhatsAppSession>
): Promise<WhatsAppSession | null> => {
  try {
    const { data, error } = await supabase
      .from('sessions_whatsapp')
      .update(sessionData)
      .eq('id', sessionId)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as WhatsAppSession;
  } catch (error: any) {
    console.error(`Erro ao atualizar sessão do WhatsApp: ${error.message}`);
    return null;
  }
};

// Delete a WhatsApp session
export const deleteWhatsAppSession = async (sessionId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('sessions_whatsapp')
      .delete()
      .eq('id', sessionId);
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error(`Erro ao deletar sessão do WhatsApp: ${error.message}`);
    return false;
  }
};

// Subscribe to session events
export const subscribeToSessionEvents = (
  sessionId: string,
  onEvent: (event: SessionEvent) => void
) => {
  const channel = supabase
    .channel(`session_events_${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT', 
        schema: 'public',
        table: 'session_events',
        filter: `session_id=eq.${sessionId}`
      },
      (payload) => {
        onEvent(payload.new as SessionEvent);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// Register a session event
export const registerSessionEvent = async (
  sessionId: string,
  eventType: string,
  payload?: any
): Promise<SessionEvent | null> => {
  try {
    const { data, error } = await supabase
      .from('session_events')
      .insert({
        session_id: sessionId,
        event_type: eventType,
        payload
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data as SessionEvent;
  } catch (error: any) {
    console.error(`Erro ao registrar evento de sessão: ${error.message}`);
    return null;
  }
};
