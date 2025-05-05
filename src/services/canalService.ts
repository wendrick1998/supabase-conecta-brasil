
import { supabase } from "@/integrations/supabase/client";
import { Canal } from "@/types/lead";
import { toast } from "@/components/ui/sonner";

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
