
import { supabase } from "@/integrations/supabase/client";
import { Interacao } from "@/types/lead";
import { toast } from "@/components/ui/sonner";

// Buscar todas as interações de um lead
export const getLeadInteractions = async (leadId: string): Promise<Interacao[]> => {
  try {
    const { data, error } = await supabase
      .from('interacoes')
      .select('*')
      .eq('lead_id', leadId)
      .order('criado_em', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    toast.error(`Erro ao buscar interações: ${error.message}`);
    return [];
  }
};

// Adicionar uma interação a um lead
export const addLeadInteraction = async (interacao: Omit<Interacao, 'id' | 'criado_em'>): Promise<Interacao | null> => {
  try {
    const { data, error } = await supabase
      .from('interacoes')
      .insert([interacao])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Interação registrada com sucesso!');
    return data;
  } catch (error: any) {
    toast.error(`Erro ao registrar interação: ${error.message}`);
    return null;
  }
};
