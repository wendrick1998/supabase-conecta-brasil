
import { supabase } from "@/integrations/supabase/client";
import { Tag, LeadTag } from "@/types/lead";
import { toast } from "@/components/ui/sonner";

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

// Buscar as tags de um lead específico
export const getLeadTags = async (leadId: string): Promise<Tag[]> => {
  try {
    const { data: leadTags, error: leadTagsError } = await supabase
      .from('leads_tags')
      .select('tag_id')
      .eq('lead_id', leadId);
    
    if (leadTagsError) throw leadTagsError;
    
    if (leadTags && leadTags.length > 0) {
      const tagIds = leadTags.map(lt => lt.tag_id);
      const { data: tags, error: tagsError } = await supabase
        .from('tags')
        .select('*')
        .in('id', tagIds);
      
      if (tagsError) throw tagsError;
      
      return tags || [];
    }
    
    return [];
  } catch (error: any) {
    console.error(`Erro ao buscar tags do lead: ${error.message}`);
    return [];
  }
};

// Associar um lead com tags
export const associateLeadWithTags = async (leadId: string, tagIds: string[]): Promise<boolean> => {
  try {
    const tagAssociations = tagIds.map(tagId => ({
      lead_id: leadId,
      tag_id: tagId
    }));
    
    const { error } = await supabase
      .from('leads_tags')
      .insert(tagAssociations);
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error(`Erro ao associar tags ao lead: ${error.message}`);
    return false;
  }
};

// Remover todas as tags de um lead
export const removeLeadTags = async (leadId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('leads_tags')
      .delete()
      .eq('lead_id', leadId);
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error(`Erro ao remover tags do lead: ${error.message}`);
    return false;
  }
};
