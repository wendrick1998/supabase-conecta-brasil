
import { toast } from "@/components/ui/sonner";
import { InternalNote } from '@/types/conversation';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

export const useNoteActions = (conversationId: string | undefined, setNotes: React.Dispatch<React.SetStateAction<InternalNote[]>>) => {
  const { user } = useAuth();

  // Note handling
  const handleSaveNote = async (noteContent: string) => {
    if (!conversationId) {
      toast.error('ID de conversa não encontrado');
      return;
    }
    
    if (!user) {
      toast.error('Você precisa estar logado para adicionar notas');
      return;
    }
    
    try {
      const { data: noteData, error: noteError } = await supabase
        .from('internal_notes')
        .insert({
          conversation_id: conversationId,
          content: noteContent,
          user_id: user.id || 'current-user',
          user_name: user.email || 'Usuário Atual',
        })
        .select()
        .single();
      
      if (noteError) {
        console.error('Note error:', noteError);
        throw noteError;
      }
      
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
