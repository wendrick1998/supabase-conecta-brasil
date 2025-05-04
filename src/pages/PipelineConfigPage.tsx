
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { DragEndEvent } from '@dnd-kit/core';

import { Button } from '@/components/ui/button';
import { EstagioPipeline } from '@/types/lead';
import { usePipelineStages } from '@/hooks/usePipelineStages';
import PipelineStagesList from '@/components/pipeline/PipelineStagesList';
import PipelineStagePanel from '@/components/pipeline/PipelineStagePanel';
import DeleteStageDialog from '@/components/pipeline/DeleteStageDialog';

const PipelineConfigPage: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<EstagioPipeline | null>(null);
  const [stageToDelete, setStageToDelete] = useState<EstagioPipeline | null>(null);
  const navigate = useNavigate();
  
  const { 
    stages, 
    isLoading, 
    fetchStages, 
    createStage, 
    updateStage, 
    removeStage, 
    reorderStages 
  } = usePipelineStages();

  useEffect(() => {
    fetchStages();
  }, [fetchStages]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      reorderStages(active.id as string, over.id as string);
    }
  };

  const handleSelectStage = (stage: EstagioPipeline) => {
    setSelectedStage(stage);
  };

  const handleCancel = () => {
    setSelectedStage(null);
  };

  const handleAddNew = () => {
    setSelectedStage({ id: '', nome: '', ordem: 0, criado_em: '' });
  };

  const handleBackToPipeline = () => {
    navigate('/pipeline');
  };

  // Helper function to determine which save function to use
  const handleSaveStage = async (id: string, data: Partial<EstagioPipeline>) => {
    const success = id 
      ? await updateStage(id, data)
      : await createStage(id, data);
    
    if (success) {
      setSelectedStage(null);
    }
  };

  const handleDeleteStage = async (stageId: string) => {
    const success = await removeStage(stageId);
    if (success) {
      setStageToDelete(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Configuração do Pipeline</title>
      </Helmet>
      
      <div className="container py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Configuração do Pipeline</h1>
            <p className="text-muted-foreground">Personalize os estágios do seu funil de vendas</p>
          </div>
          <div className="mt-4 md:mt-0 space-x-2">
            <Button variant="outline" onClick={handleBackToPipeline}>
              Voltar ao Pipeline
            </Button>
          </div>
        </div>
        
        <div className="mt-6 grid lg:grid-cols-2 gap-8">
          {/* Lista de estágios à esquerda */}
          <PipelineStagesList 
            stages={stages}
            isLoading={isLoading}
            onSelectStage={handleSelectStage}
            onRequestDelete={setStageToDelete}
            onDragEnd={handleDragEnd}
            onAddNew={handleAddNew}
          />
          
          {/* Formulário à direita */}
          <PipelineStagePanel
            selectedStage={selectedStage}
            isLoading={isLoading}
            onSave={handleSaveStage}
            onCancel={handleCancel}
            onAddNew={handleAddNew}
          />
        </div>
      </div>

      {/* Dialog para confirmação de exclusão */}
      <DeleteStageDialog
        stage={stageToDelete}
        onConfirm={stageToDelete ? () => handleDeleteStage(stageToDelete.id) : undefined}
        onCancel={() => setStageToDelete(null)}
      />
    </>
  );
};

export default PipelineConfigPage;
