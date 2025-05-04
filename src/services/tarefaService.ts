
import { supabase } from "@/integrations/supabase/client";
import { Tarefa } from "@/types/lead";
import { toast } from "@/components/ui/sonner";

// Buscar todas as tarefas de um lead
export const getLeadTasks = async (leadId: string): Promise<Tarefa[]> => {
  try {
    const { data, error } = await supabase
      .from('tarefas')
      .select('*')
      .eq('lead_id', leadId)
      .order('data_vencimento', { ascending: true });
    
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    toast.error(`Erro ao buscar tarefas: ${error.message}`);
    return [];
  }
};

// Adicionar uma tarefa a um lead
export const addLeadTask = async (tarefa: Omit<Tarefa, 'id' | 'criado_em' | 'atualizado_em'>): Promise<Tarefa | null> => {
  try {
    const { data, error } = await supabase
      .from('tarefas')
      .insert([tarefa])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Tarefa adicionada com sucesso!');
    return data;
  } catch (error: any) {
    toast.error(`Erro ao adicionar tarefa: ${error.message}`);
    return null;
  }
};

// Atualizar uma tarefa
export const updateLeadTask = async (id: string, tarefa: Partial<Tarefa>): Promise<Tarefa | null> => {
  try {
    const { data, error } = await supabase
      .from('tarefas')
      .update(tarefa)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Tarefa atualizada com sucesso!');
    return data;
  } catch (error: any) {
    toast.error(`Erro ao atualizar tarefa: ${error.message}`);
    return null;
  }
};
