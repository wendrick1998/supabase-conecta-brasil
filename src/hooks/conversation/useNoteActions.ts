
import { useState } from 'react';
import { toast } from "@/components/ui/sonner";
import { InternalNote } from '@/types/conversation';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

export const useNoteActions = (conversationId: string | undefined, setNotes: React.Dispatch<React.SetStateAction<InternalNote[]>>) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Validação de UUID
  const isValidUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  // Carregar notas com paginação
  const fetchNotes = async (limit: number = 20, startFrom: number = 0) => {
    if (!conversationId || !isValidUUID(conversationId)) {
      toast.error('ID de conversa inválido ou não encontrado');
      return [];
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('internal_notes')
        .select(`
          id,
          conversation_id,
          content,
          timestamp,
          user_id,
          user_name
        `)
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: false })
        .range(startFrom, startFrom + limit - 1);

      if (error) {
        console.error('Erro ao carregar notas:', error);
        throw error;
      }

      const notes = data as InternalNote[];
      
      if (startFrom === 0) {
        setNotes(notes);
      } else {
        setNotes(prevNotes => [...prevNotes, ...notes]);
      }

      return notes;
    } catch (error) {
      console.error('Erro ao buscar notas:', error);
      toast.error('Não foi possível carregar as notas');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Note handling com cache otimizado
  const handleSaveNote = async (noteContent: string) => {
    if (!conversationId) {
      toast.error('ID de conversa não encontrado');
      return;
    }
    
    if (!isValidUUID(conversationId)) {
      toast.error('ID de conversa inválido');
      return;
    }
    
    if (!user) {
      toast.error('Você precisa estar logado para adicionar notas');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Salvar nota no banco de dados
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
      
      // Atualizar estado local imediatamente para melhor UX
      setNotes(prevNotes => [noteData as InternalNote, ...prevNotes]);
      toast.success('Nota adicionada');
    } catch (error) {
      console.error('Erro ao adicionar nota:', error);
      toast.error('Não foi possível adicionar a nota');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    isLoading,
    handleSaveNote,
    fetchNotes
  };
};
