import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Lead, EstagioPipeline } from '@/types/lead';
import { Conversation } from '@/types/conversation';
import { getLeads, getEstagios, moveLeadsToStage } from '@/services/leadService';
import { supabase } from '@/integrations/supabase/client';

export function usePipelineData() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [estagios, setEstagios] = useState<EstagioPipeline[]>([]);
  const [conversations, setConversations] = useState<Record<string, Conversation>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isMovingLead, setIsMovingLead] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [leadsData, estagiosData] = await Promise.all([
        getLeads(),
        getEstagios(),
      ]);
      
      setLeads(leadsData);
      // Ordenamos os estágios pela propriedade "ordem"
      setEstagios(estagiosData.sort((a, b) => a.ordem - b.ordem));
      
      // Fetch conversations related to these leads
      await fetchConversations(leadsData.map(lead => lead.id));
    } catch (error) {
      console.error('Erro ao carregar dados do pipeline:', error);
      toast.error('Erro ao carregar dados do pipeline. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch conversations for the leads
  const fetchConversations = async (leadIds: string[]) => {
    if (leadIds.length === 0) return;
    
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .in('lead_id', leadIds)
        .order('horario', { ascending: false });
      
      if (error) throw error;
      
      // Create a mapping of lead_id to conversation
      const conversationsMap: Record<string, Conversation> = {};
      if (data) {
        data.forEach(conversation => {
          // If we already have a conversation for this lead_id, only keep the most recent one
          if (!conversationsMap[conversation.lead_id] || 
              new Date(conversation.horario) > new Date(conversationsMap[conversation.lead_id].horario)) {
            conversationsMap[conversation.lead_id] = conversation as Conversation;
          }
        });
      }
      
      setConversations(conversationsMap);
    } catch (error) {
      console.error('Erro ao carregar conversas dos leads:', error);
    }
  };

  const handleMoveCard = async (leadId: string, newStageId: string) => {
    try {
      setIsMovingLead(true);
      const success = await moveLeadsToStage([leadId], newStageId);
      if (success) {
        // Atualiza o estágio do lead na interface sem precisar recarregar tudo
        setLeads(prevLeads => 
          prevLeads.map(lead => 
            lead.id === leadId ? { ...lead, estagio_id: newStageId } : lead
          )
        );
        toast.success('Lead movido com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao mover lead:', error);
      toast.error('Não foi possível mover o lead para o novo estágio.');
    } finally {
      setIsMovingLead(false);
    }
  };

  const getLeadsByStage = (stageId: string) => {
    return leads.filter(lead => lead.estagio_id === stageId);
  };

  // Setup realtime subscription for conversation updates
  useEffect(() => {
    const channel = supabase
      .channel('public:conversations')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'conversations' 
        }, 
        (payload) => {
          // Update conversations when new data arrives
          const conversation = payload.new as Conversation;
          setConversations(prev => ({
            ...prev,
            [conversation.lead_id]: conversation
          }));
        }
      )
      .subscribe();

    return () => {
      // Cleanup subscription
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return {
    leads,
    estagios,
    conversations,
    isLoading,
    isMovingLead,
    handleMoveCard,
    getLeadsByStage,
    fetchData
  };
}
