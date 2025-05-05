
import { supabase } from "@/integrations/supabase/client";
import { EstagioPipeline } from "@/types/lead";
import { toast } from "@/components/ui/sonner";

// Buscar todos os estágios do pipeline
export const getEstagios = async (): Promise<EstagioPipeline[]> => {
  try {
    const { data, error } = await supabase
      .from('estagios_pipeline')
      .select('*')
      .order('ordem');
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    toast.error(`Erro ao buscar estágios: ${error.message}`);
    return [];
  }
};

// Criar um novo estágio do pipeline
export const createEstagio = async (estagio: any) => {
  try {
    const { data, error } = await supabase
      .from('estagios_pipeline')
      .insert([estagio])
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    toast.error(`Erro ao criar estágio: ${error.message}`);
    return null;
  }
};

// Atualizar um estágio existente
export const updateEstagio = async (id: string, estagio: any) => {
  try {
    const { data, error } = await supabase
      .from('estagios_pipeline')
      .update(estagio)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    toast.error(`Erro ao atualizar estágio: ${error.message}`);
    return null;
  }
};

// Excluir um estágio do pipeline
export const deleteEstagio = async (id: string) => {
  try {
    // Primeiro verificamos se existem leads neste estágio
    const { data: leads, error: checkError } = await supabase
      .from('leads')
      .select('id')
      .eq('estagio_id', id);
    
    if (checkError) throw checkError;
    
    // Se existirem leads neste estágio, não permitimos a exclusão
    if (leads && leads.length > 0) {
      toast.error(`Não é possível excluir este estágio pois existem ${leads.length} leads associados.`);
      return false;
    }
    
    // Se não houverem leads, podemos excluir o estágio
    const { error } = await supabase
      .from('estagios_pipeline')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    toast.error(`Erro ao excluir estágio: ${error.message}`);
    return false;
  }
};
