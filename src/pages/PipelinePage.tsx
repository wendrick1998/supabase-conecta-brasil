import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getLeads, getEstagios, moveLeadsToStage } from '@/services/leadService';
import { Lead, EstagioPipeline } from '@/types/lead';
import PipelineColumn from '@/components/pipeline/PipelineColumn';
import PipelineSkeleton from '@/components/pipeline/PipelineSkeleton';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '@/types/conversation';

const PipelinePage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [estagios, setEstagios] = useState<EstagioPipeline[]>([]);
  const [conversations, setConversations] = useState<Record<string, Conversation>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isMovingLead, setIsMovingLead] = useState(false);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const [overStageId, setOverStageId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Configure sensors for drag & drop
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    // Press delay helps distinguish between a tap and a drag
    activationConstraint: {
      delay: 200,
      tolerance: 8,
    },
  });
  
  const sensors = useSensors(mouseSensor, touchSensor);

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
      data.forEach(conversation => {
        // If we already have a conversation for this lead_id, only keep the most recent one
        if (!conversationsMap[conversation.lead_id] || 
            new Date(conversation.horario) > new Date(conversationsMap[conversation.lead_id].horario)) {
          conversationsMap[conversation.lead_id] = conversation;
        }
      });
      
      setConversations(conversationsMap);
    } catch (error) {
      console.error('Erro ao carregar conversas dos leads:', error);
    }
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
  
  const handleConfigurePipeline = () => {
    navigate('/pipeline/configuracao');
  };

  const handleAddNewLead = () => {
    navigate('/leads/novo');
  };

  // Drag & Drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveLeadId(active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (over) {
      setOverStageId(over.id as string);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Clear states
    setActiveLeadId(null);
    setOverStageId(null);
    
    // If no over element or same stage, no change needed
    if (!over) return;
    
    const leadId = active.id as string;
    const newStageId = over.id as string;
    
    // Get the current stage of the lead
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    
    // If the lead is already in this stage, no need to move it
    if (lead.estagio_id === newStageId) return;
    
    // Move the lead to the new stage
    await handleMoveCard(leadId, newStageId);
  };

  if (isLoading) {
    return <PipelineSkeleton />;
  }

  return (
    <>
      <Helmet>
        <title>Pipeline de Vendas</title>
      </Helmet>
      
      <div className="container py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pipeline de Vendas</h1>
            <p className="text-muted-foreground">Visualize e gerencie seus leads por estágios</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button 
              onClick={handleAddNewLead}
              variant="default"
            >
              Novo Lead
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleConfigurePipeline}
            >
              Configurar Pipeline
            </Button>
          </div>
        </div>

        {/* Kanban Board com scroll horizontal e drag and drop */}
        <div className="mt-6">
          <ScrollArea className="w-full">
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <div className="grid grid-flow-col auto-cols-[minmax(280px,_1fr)] gap-4 pb-4 pr-4 min-h-[calc(100vh-220px)]">
                {estagios.length === 0 ? (
                  <div className="col-span-full bg-gray-50 rounded-lg p-8 text-center">
                    <h3 className="text-lg font-medium mb-2">Nenhum estágio configurado</h3>
                    <p className="text-muted-foreground mb-4">
                      Configure os estágios do seu funil de vendas para visualizar seus leads no pipeline.
                    </p>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleConfigurePipeline}
                    >
                      Configurar Pipeline
                    </Button>
                  </div>
                ) : (
                  estagios.map((estagio) => (
                    <PipelineColumn 
                      key={estagio.id} 
                      estagio={estagio}
                      leads={getLeadsByStage(estagio.id)}
                      onMoveCard={handleMoveCard}
                      allStages={estagios}
                      isMovingLead={isMovingLead}
                      activeId={activeLeadId}
                      isOver={overStageId === estagio.id}
                      conversations={conversations}
                    />
                  ))
                )}
              </div>
            </DndContext>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default PipelinePage;
