
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

import { Button } from '@/components/ui/button';
import { getEstagios, createEstagio, updateEstagio, deleteEstagio } from '@/services/leadService';
import { EstagioPipeline } from '@/types/lead';
import PipelineStageItem from '@/components/pipeline/PipelineStageItem';
import PipelineStageForm from '@/components/pipeline/PipelineStageForm';
import DeleteStageDialog from '@/components/pipeline/DeleteStageDialog';

const PipelineConfigPage: React.FC = () => {
  const [stages, setStages] = useState<EstagioPipeline[]>([]);
  const [selectedStage, setSelectedStage] = useState<EstagioPipeline | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stageToDelete, setStageToDelete] = useState<EstagioPipeline | null>(null);
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchStages = async () => {
    setIsLoading(true);
    try {
      const stages = await getEstagios();
      setStages(stages.sort((a, b) => a.ordem - b.ordem));
    } catch (error) {
      console.error('Erro ao carregar estágios:', error);
      toast.error('Não foi possível carregar os estágios do pipeline.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStages();
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // Find the index of the dragged item and the drop target
      const oldIndex = stages.findIndex((stage) => stage.id === active.id);
      const newIndex = stages.findIndex((stage) => stage.id === over.id);
      
      // Reorder the stages in state
      const reorderedStages = arrayMove(stages, oldIndex, newIndex);
      
      // Update the order property for each stage
      const updatedStages = reorderedStages.map((stage, index) => ({
        ...stage,
        ordem: index + 1
      }));
      
      setStages(updatedStages);
      
      // Update the order in the database
      try {
        // Update each stage with its new order
        await Promise.all(updatedStages.map(stage => 
          updateEstagio(stage.id, { ...stage })
        ));
        toast.success('Ordem dos estágios atualizada com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar ordem dos estágios:', error);
        toast.error('Não foi possível atualizar a ordem dos estágios.');
        // Revert to the original state if there's an error
        fetchStages();
      }
    }
  };

  const handleSelectStage = (stage: EstagioPipeline) => {
    setSelectedStage(stage);
  };

  const handleCreateStage = async (stage: Partial<EstagioPipeline>) => {
    try {
      // Set the order as the last position
      const newOrder = stages.length > 0 
        ? Math.max(...stages.map(s => s.ordem)) + 1 
        : 1;
      
      const newStage = await createEstagio({
        ...stage,
        ordem: newOrder
      });
      
      if (newStage) {
        setStages([...stages, newStage]);
        setSelectedStage(null);
        toast.success('Estágio criado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao criar estágio:', error);
      toast.error('Não foi possível criar o estágio.');
    }
  };

  const handleUpdateStage = async (stageId: string, stageData: Partial<EstagioPipeline>) => {
    try {
      const updatedStage = await updateEstagio(stageId, stageData);
      
      if (updatedStage) {
        setStages(stages.map(stage => 
          stage.id === stageId ? { ...stage, ...updatedStage } : stage
        ));
        setSelectedStage(null);
        toast.success('Estágio atualizado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao atualizar estágio:', error);
      toast.error('Não foi possível atualizar o estágio.');
    }
  };

  const handleDeleteStage = async (stageId: string) => {
    try {
      const success = await deleteEstagio(stageId);
      
      if (success) {
        setStages(stages.filter(stage => stage.id !== stageId));
        setStageToDelete(null);
        toast.success('Estágio excluído com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao excluir estágio:', error);
      toast.error('Não foi possível excluir o estágio. Verifique se existem leads associados.');
    }
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
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Estágios do Pipeline</h2>
              <Button 
                onClick={handleAddNew}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Novo Estágio
              </Button>
            </div>
            
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-100 rounded-md animate-pulse" />
                ))}
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={stages.map(stage => stage.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {stages.map(stage => (
                      <PipelineStageItem
                        key={stage.id}
                        stage={stage}
                        onSelect={handleSelectStage}
                        onRequestDelete={setStageToDelete}
                      />
                    ))}
                    {stages.length === 0 && (
                      <div className="bg-gray-50 p-4 rounded-md text-center">
                        <p className="text-gray-500">Nenhum estágio configurado</p>
                        <Button 
                          variant="link" 
                          onClick={handleAddNew} 
                          className="mt-2 text-blue-600"
                        >
                          Criar seu primeiro estágio
                        </Button>
                      </div>
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
          
          {/* Formulário à direita */}
          <div>
            {selectedStage && (
              <PipelineStageForm 
                stage={selectedStage} 
                onSave={selectedStage.id ? handleUpdateStage : handleCreateStage}
                onCancel={handleCancel}
              />
            )}
            
            {!selectedStage && !isLoading && (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <h3 className="text-lg font-medium">Gerenciamento do Pipeline</h3>
                <p className="mt-2 text-gray-500">
                  Selecione um estágio para editar ou clique em "Novo Estágio" para adicionar um novo.
                </p>
                <div className="mt-4">
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddNew}>
                    Criar Novo Estágio
                  </Button>
                </div>
              </div>
            )}
          </div>
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
