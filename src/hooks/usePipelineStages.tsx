
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { EstagioPipeline } from '@/types/lead';
import { getEstagios, createEstagio, updateEstagio, deleteEstagio } from '@/services/leadService';

export function usePipelineStages() {
  const [stages, setStages] = useState<EstagioPipeline[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStages = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedStages = await getEstagios();
      setStages(fetchedStages.sort((a, b) => a.ordem - b.ordem));
    } catch (error) {
      console.error('Erro ao carregar estágios:', error);
      toast.error('Não foi possível carregar os estágios do pipeline.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createStage = async (id: string, stageData: Partial<EstagioPipeline>) => {
    try {
      // Set the order as the last position
      const newOrder = stages.length > 0 
        ? Math.max(...stages.map(s => s.ordem)) + 1 
        : 1;
      
      const newStage = await createEstagio({
        ...stageData,
        ordem: newOrder
      });
      
      if (newStage) {
        setStages([...stages, newStage]);
        toast.success('Estágio criado com sucesso!');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao criar estágio:', error);
      toast.error('Não foi possível criar o estágio.');
      return false;
    }
  };

  const updateStage = async (stageId: string, stageData: Partial<EstagioPipeline>) => {
    try {
      const updatedStage = await updateEstagio(stageId, stageData);
      
      if (updatedStage) {
        setStages(stages.map(stage => 
          stage.id === stageId ? { ...stage, ...updatedStage } : stage
        ));
        toast.success('Estágio atualizado com sucesso!');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao atualizar estágio:', error);
      toast.error('Não foi possível atualizar o estágio.');
      return false;
    }
  };

  const removeStage = async (stageId: string) => {
    try {
      const success = await deleteEstagio(stageId);
      
      if (success) {
        setStages(stages.filter(stage => stage.id !== stageId));
        toast.success('Estágio excluído com sucesso!');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao excluir estágio:', error);
      toast.error('Não foi possível excluir o estágio. Verifique se existem leads associados.');
      return false;
    }
  };

  const reorderStages = async (activeId: string, overId: string) => {
    // Find the index of the dragged item and the drop target
    const oldIndex = stages.findIndex((stage) => stage.id === activeId);
    const newIndex = stages.findIndex((stage) => stage.id === overId);
    
    // If the indices are the same, no need to do anything
    if (oldIndex === newIndex) return;
    
    // Reorder the stages in state using the arrayMove utility
    const reordered = [...stages];
    const [removed] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, removed);
    
    // Update the order property for each stage
    const updatedStages = reordered.map((stage, index) => ({
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
  };

  return {
    stages,
    isLoading,
    fetchStages,
    createStage,
    updateStage,
    removeStage,
    reorderStages
  };
}
