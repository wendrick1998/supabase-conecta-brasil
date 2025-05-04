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
      // Using a custom query without strongly typed table name since the table might not exist yet
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .in('lead_id', leadIds)
        .order('horario', { ascending: false });
      
      if (error) {
        // If the table doesn't exist, log the error but don't crash
        console.error('Erro ao carregar conversas dos leads:', error);
        return;
      }
      
      // Create a mapping of lead_id to conversation
      const conversationsMap: Record<string, Conversation> = {};
      if (data) {
        data.forEach((conversation: any) => {
          // Type assertion since we don't know the exact shape coming from DB
          const typedConversation = conversation as Conversation;
          
          // If we already have a conversation for this lead_id, only keep the most recent one
          if (!conversationsMap[typedConversation.lead_id] || 
              new Date(typedConversation.horario) > new Date(conversationsMap[typedConversation.lead_id].horario)) {
            conversationsMap[typedConversation.lead_id] = typedConversation;
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
    // We wrap this in try/catch to prevent errors if the table doesn't exist
    try {
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
        .subscribe((status) => {
          if (status === 'SUBSCRIPTION_ERROR') {
            console.log('Subscription error: conversations table might not exist yet');
          }
        });

      return () => {
        // Cleanup subscription
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error('Error setting up realtime subscription:', error);
    }
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
