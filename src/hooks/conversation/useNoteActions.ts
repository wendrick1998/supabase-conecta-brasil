
import { toast } from "@/components/ui/sonner";
import { InternalNote } from '@/types/conversation';
import { supabase } from "@/integrations/supabase/client";

export const useNoteActions = (conversationId: string | undefined, setNotes: React.Dispatch<React.SetStateAction<InternalNote[]>>) => {
  // Note handling
  const handleSaveNote = async (noteContent: string) => {
    if (!conversationId) return;
    
    try {
      const { data: noteData, error: noteError } = await supabase
        .from('internal_notes')
        .insert({
          conversation_id: conversationId,
          content: noteContent,
          user_id: 'current-user',
          user_name: 'Você',
        })
        .select()
        .single();
      
      if (noteError) throw noteError;
      
      setNotes(prevNotes => [...prevNotes, noteData as InternalNote]);
      toast.success('Nota adicionada');
    } catch (error) {
      console.error('Erro ao adicionar nota:', error);
      toast.error('Não foi possível adicionar a nota');
    }
  };

  return {
    handleSaveNote
  };
};
