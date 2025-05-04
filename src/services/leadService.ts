import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types/lead";
import { toast } from "@/components/ui/sonner";
import { getLeadTags, associateLeadWithTags, removeLeadTags } from "./tagService";

// Buscar todos os leads com relacionamentos
export const getLeads = async (): Promise<Lead[]> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        canal:canais(*),
        estagio:estagios_pipeline(*)
      `)
      .order('criado_em', { ascending: false });
    
    if (error) throw error;
    
    // Para cada lead, buscar suas tags
    const leadsWithTags = await Promise.all(data.map(async (lead) => {
      const tags = await getLeadTags(lead.id);
      return { ...lead, tags };
    }));

    return leadsWithTags;
  } catch (error: any) {
    toast.error(`Erro ao buscar leads: ${error.message}`);
    return [];
  }
};

// Buscar um lead específico com todos os detalhes
export const getLead = async (id: string): Promise<Lead | null> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        canal:canais(*),
        estagio:estagios_pipeline(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Buscar as tags do lead
    const tags = await getLeadTags(id);
    
    return { ...data, tags };
  } catch (error: any) {
    toast.error(`Erro ao buscar lead: ${error.message}`);
    return null;
  }
};

// Criar um novo lead
export const createLead = async (lead: Partial<Lead> & { nome: string }, tagIds: string[] = []): Promise<Lead | null> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([lead])
      .select()
      .single();
    
    if (error) throw error;
    
    // Associar tags ao lead
    if (tagIds.length > 0) {
      await associateLeadWithTags(data.id, tagIds);
    }
    
    toast.success('Lead criado com sucesso!');
    return data;
  } catch (error: any) {
    toast.error(`Erro ao criar lead: ${error.message}`);
    return null;
  }
};

// Atualizar um lead existente
export const updateLead = async (id: string, lead: Partial<Lead>, tagIds?: string[]): Promise<Lead | null> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .update(lead)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Se foram fornecidas tags, atualizar as associações
    if (tagIds !== undefined) {
      // Remover todas as tags existentes
      await removeLeadTags(id);
      
      // Adicionar as novas tags
      if (tagIds.length > 0) {
        await associateLeadWithTags(id, tagIds);
      }
    }
    
    toast.success('Lead atualizado com sucesso!');
    return data;
  } catch (error: any) {
    toast.error(`Erro ao atualizar lead: ${error.message}`);
    return null;
  }
};

// Excluir um lead
export const deleteLead = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Lead excluído com sucesso!');
    return true;
  } catch (error: any) {
    toast.error(`Erro ao excluir lead: ${error.message}`);
    return false;
  }
};

// Excluir múltiplos leads
export const deleteMultipleLeads = async (ids: string[]): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('leads')
      .delete()
      .in('id', ids);
    
    if (error) throw error;
    
    toast.success(`${ids.length} leads excluídos com sucesso!`);
    return true;
  } catch (error: any) {
    toast.error(`Erro ao excluir leads: ${error.message}`);
    return false;
  }
};

// Avançar um lead para o próximo estágio do pipeline
export const advanceLeadStage = async (id: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('avancar_estagio_lead', { lead_id: id });
    
    if (error) throw error;
    
    if (data) {
      toast.success('Lead avançou para o próximo estágio!');
      return true;
    } else {
      toast.info('Lead já está no último estágio.');
      return false;
    }
  } catch (error: any) {
    toast.error(`Erro ao avançar estágio: ${error.message}`);
    return false;
  }
};

// Mover múltiplos leads para um estágio específico
export const moveLeadsToStage = async (ids: string[], estagioId: string): Promise<boolean> => {
  try {
    // First get information about the stage
    const { data: stageData, error: stageError } = await supabase
      .from('estagios_pipeline')
      .select('*')
      .eq('id', estagioId)
      .single();
    
    if (stageError) throw stageError;
    
    // Update the leads
    const { error } = await supabase
      .from('leads')
      .update({ 
        estagio_id: estagioId,
        atualizado_em: new Date().toISOString()
      })
      .in('id', ids);
    
    if (error) throw error;
    
    // Create an interaction for each lead to record the stage change
    const interacoes = ids.map(id => ({
      lead_id: id,
      tipo: 'mudanca_estagio',
      conteudo: `Lead movido para o estágio: ${stageData.nome}`
    }));
    
    if (interacoes.length > 0) {
      const { error: interacaoError } = await supabase
        .from('interacoes')
        .insert(interacoes);
      
      if (interacaoError) {
        console.error('Erro ao registrar interação de mudança de estágio:', interacaoError);
        // We don't throw here since the main operation succeeded
      }
    }
    
    toast.success(`${ids.length === 1 ? 'Lead movido' : ids.length + ' leads movidos'} para ${stageData.nome}!`);
    return true;
  } catch (error: any) {
    toast.error(`Erro ao mover leads: ${error.message}`);
    return false;
  }
};

// Buscar todos os estágios do pipeline
export const getEstagios = async () => {
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

// Re-export functions from other service files
export { 
  getCanais, 
} from './canalService';
export { 
  getTags 
} from './tagService';
export { 
  getLeadNotes, 
  addLeadNote 
} from './notaService';
export { 
  getLeadInteractions, 
  addLeadInteraction 
} from './interacaoService';
export { 
  getLeadTasks, 
  addLeadTask, 
  updateLeadTask 
} from './tarefaService';
