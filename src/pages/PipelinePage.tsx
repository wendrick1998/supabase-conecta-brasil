
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

const PipelinePage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [estagios, setEstagios] = useState<EstagioPipeline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMovingLead, setIsMovingLead] = useState(false);
  const navigate = useNavigate();

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
    } catch (error) {
      console.error('Erro ao carregar dados do pipeline:', error);
      toast.error('Erro ao carregar dados do pipeline. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* Kanban Board com scroll horizontal */}
        <div className="mt-6">
          <ScrollArea className="w-full">
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
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default PipelinePage;
