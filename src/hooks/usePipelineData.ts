
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Lead, EstagioPipeline } from '@/types/lead';
import { Conversation } from '@/types/conversation';
import { getLeads, getEstagios, moveLeadsToStage } from '@/services/leadService';
import { getConversationsForLeads } from '@/services/conversationService';
import { supabase } from '@/integrations/supabase/client';
import { mockConversation } from '@/data/mockConversations';

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

  // Fetch conversations for the leads using our service
  const fetchConversations = async (leadIds: string[]) => {
    if (leadIds.length === 0) return;
    
    try {
      const conversationsMap = await getConversationsForLeads(leadIds);
      
      // Use mock data for any leads without real conversations (for demonstration)
      leadIds.forEach(leadId => {
        if (!conversationsMap[leadId]) {
          const lead = leads.find(l => l.id === leadId);
          if (lead) {
            // Create a mock conversation for this lead
            conversationsMap[leadId] = {
              ...mockConversation,
              id: `mock-${leadId}`,
              lead_id: leadId,
              lead_nome: lead.nome,
              ultima_mensagem: 'Este lead ainda não tem conversas.',
              horario: lead.criado_em,
              nao_lida: false
            };
          }
        }
      });
      
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
    try {
      const channel = supabase
        .channel('public:conversations')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'conversations' 
          }, 
          (payload: any) => {
            // Update conversations when new data arrives
            const conversation = payload.new as Conversation;
            if (conversation && conversation.lead_id) {
              setConversations(prev => ({
                ...prev,
                [conversation.lead_id]: conversation
              }));
            }
          }
        )
        .subscribe((status) => {
          if (status === 'CHANNEL_ERROR') {
            console.error('Error subscribing to conversations channel:', status);
          }
        });

      // Also subscribe to messages table for real-time updates
      const messagesChannel = supabase
        .channel('public:messages')
        .on('postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages'
          },
          async (payload: any) => {
            // When a new message is added, fetch the updated conversation
            if (payload.new && payload.new.conversation_id) {
              try {
                const { data, error } = await supabase
                  .from('conversations')
                  .select('*')
                  .eq('id', payload.new.conversation_id)
                  .single();
                
                if (error) {
                  console.error('Error fetching conversation:', error);
                  return;
                }
                
                if (data && data.lead_id) {
                  setConversations(prev => ({
                    ...prev,
                    [data.lead_id]: data as Conversation
                  }));
                }
              } catch (err) {
                console.error('Error processing message update:', err);
              }
            }
          }
        )
        .subscribe((status) => {
          if (status === 'CHANNEL_ERROR') {
            console.error('Error subscribing to messages channel:', status);
          }
        });

      return () => {
        // Cleanup subscriptions
        supabase.removeChannel(channel);
        supabase.removeChannel(messagesChannel);
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
