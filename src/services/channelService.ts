
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ChannelConnection {
  id: string;
  canal: 'whatsapp' | 'instagram' | 'facebook' | 'email';
  nome: string;
  status: boolean;
  acesso_token?: string;
  refresh_token?: string;
  token_expira_em?: string;
  qr_code?: string;
  configuracao?: Record<string, any>;
  webhook_token?: string;
  criado_em: string;
  atualizado_em: string;
}

// Get all channel connections
export const getChannelConnections = async (): Promise<ChannelConnection[]> => {
  try {
    const { data, error } = await supabase
      .from('canais_conectados')
      .select('*')
      .order('criado_em', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    toast.error(`Erro ao buscar canais conectados: ${error.message}`);
    return [];
  }
};

// Get channel connections by type
export const getChannelConnectionsByType = async (channelType: string): Promise<ChannelConnection[]> => {
  try {
    const { data, error } = await supabase
      .from('canais_conectados')
      .select('*')
      .eq('canal', channelType)
      .order('criado_em', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    toast.error(`Erro ao buscar canais do tipo ${channelType}: ${error.message}`);
    return [];
  }
};

// Get a specific channel connection
export const getChannelConnection = async (channelId: string): Promise<ChannelConnection | null> => {
  try {
    const { data, error } = await supabase
      .from('canais_conectados')
      .select('*')
      .eq('id', channelId)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    toast.error(`Erro ao buscar canal: ${error.message}`);
    return null;
  }
};

// Create a new channel connection
export const createChannelConnection = async (channelData: Partial<ChannelConnection>): Promise<ChannelConnection | null> => {
  try {
    const { data, error } = await supabase
      .from('canais_conectados')
      .insert(channelData)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success(`Canal de ${channelData.canal} conectado com sucesso!`);
    return data;
  } catch (error: any) {
    toast.error(`Erro ao conectar canal: ${error.message}`);
    return null;
  }
};

// Update an existing channel connection
export const updateChannelConnection = async (channelId: string, channelData: Partial<ChannelConnection>): Promise<ChannelConnection | null> => {
  try {
    const { data, error } = await supabase
      .from('canais_conectados')
      .update(channelData)
      .eq('id', channelId)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("Canal atualizado com sucesso!");
    return data;
  } catch (error: any) {
    toast.error(`Erro ao atualizar canal: ${error.message}`);
    return null;
  }
};

// Disconnect a channel (set status to false)
export const disconnectChannel = async (channelId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('canais_conectados')
      .update({ status: false })
      .eq('id', channelId);
    
    if (error) throw error;
    
    toast.success("Canal desconectado com sucesso!");
    return true;
  } catch (error: any) {
    toast.error(`Erro ao desconectar canal: ${error.message}`);
    return false;
  }
};

// Delete a channel connection
export const deleteChannelConnection = async (channelId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('canais_conectados')
      .delete()
      .eq('id', channelId);
    
    if (error) throw error;
    
    toast.success("Canal removido com sucesso!");
    return true;
  } catch (error: any) {
    toast.error(`Erro ao remover canal: ${error.message}`);
    return false;
  }
};
