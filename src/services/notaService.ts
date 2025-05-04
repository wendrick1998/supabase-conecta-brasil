
import { supabase } from "@/integrations/supabase/client";
import { Nota } from "@/types/lead";
import { toast } from "@/components/ui/sonner";

// Buscar todas as notas de um lead
export const getLeadNotes = async (leadId: string): Promise<Nota[]> => {
  try {
    const { data, error } = await supabase
      .from('notas')
      .select('*')
      .eq('lead_id', leadId)
      .order('criado_em', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    toast.error(`Erro ao buscar notas: ${error.message}`);
    return [];
  }
};

// Adicionar uma nota a um lead
export const addLeadNote = async (nota: Omit<Nota, 'id' | 'criado_em' | 'atualizado_em'>): Promise<Nota | null> => {
  try {
    const { data, error } = await supabase
      .from('notas')
      .insert([nota])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Nota adicionada com sucesso!');
    return data;
  } catch (error: any) {
    toast.error(`Erro ao adicionar nota: ${error.message}`);
    return null;
  }
};
