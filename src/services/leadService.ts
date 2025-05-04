import { supabase } from "@/integrations/supabase/client";
import { 
  Lead, 
  Canal, 
  EstagioPipeline, 
  Tag, 
  Nota, 
  Interacao,
  Tarefa,
  LeadTag
} from "@/types/lead";
import { toast } from "@/components/ui/sonner";

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
      const { data: leadTags } = await supabase
        .from('leads_tags')
        .select('tag_id')
        .eq('lead_id', lead.id);
      
      if (leadTags && leadTags.length > 0) {
        const tagIds = leadTags.map(lt => lt.tag_id);
        const { data: tags } = await supabase
          .from('tags')
          .select('*')
          .in('id', tagIds);
        
        return { ...lead, tags };
      }
      
      return { ...lead, tags: [] };
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
    const { data: leadTags } = await supabase
      .from('leads_tags')
      .select('tag_id')
      .eq('lead_id', id);
    
    if (leadTags && leadTags.length > 0) {
      const tagIds = leadTags.map(lt => lt.tag_id);
      const { data: tags } = await supabase
        .from('tags')
        .select('*')
        .in('id', tagIds);
      
      return { ...data, tags };
    }
    
    return { ...data, tags: [] };
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
      const tagAssociations = tagIds.map(tagId => ({
        lead_id: data.id,
        tag_id: tagId
      }));
      
      const { error: tagError } = await supabase
        .from('leads_tags')
        .insert(tagAssociations);
      
      if (tagError) throw tagError;
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
      const { error: deleteError } = await supabase
        .from('leads_tags')
        .delete()
        .eq('lead_id', id);
      
      if (deleteError) throw deleteError;
      
      // Adicionar as novas tags
      if (tagIds.length > 0) {
        const tagAssociations = tagIds.map(tagId => ({
          lead_id: id,
          tag_id: tagId
        }));
        
        const { error: insertError } = await supabase
          .from('leads_tags')
          .insert(tagAssociations);
        
        if (insertError) throw insertError;
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
    const { error } = await supabase
      .from('leads')
      .update({ estagio_id: estagioId })
      .in('id', ids);
    
    if (error) throw error;
    
    toast.success(`${ids.length} leads movidos para novo estágio!`);
    return true;
  } catch (error: any) {
    toast.error(`Erro ao mover leads: ${error.message}`);
    return false;
  }
};

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

// Buscar todos os canais
export const getCanais = async (): Promise<Canal[]> => {
  try {
    const { data, error } = await supabase
      .from('canais')
      .select('*')
      .order('nome');
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    toast.error(`Erro ao buscar canais: ${error.message}`);
    return [];
  }
};

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

// Buscar todas as tags
export const getTags = async (): Promise<Tag[]> => {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('nome');
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    toast.error(`Erro ao buscar tags: ${error.message}`);
    return [];
  }
};
