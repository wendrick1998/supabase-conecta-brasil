
import React from 'react';
import { Button } from '@/components/ui/button';
import { EstagioPipeline } from '@/types/lead';
import PipelineStageForm from './PipelineStageForm';

interface PipelineStagePanelProps {
  selectedStage: EstagioPipeline | null;
  isLoading: boolean;
  onSave: (id: string, data: Partial<EstagioPipeline>) => Promise<void>;
  onCancel: () => void;
  onAddNew: () => void;
}

const PipelineStagePanel: React.FC<PipelineStagePanelProps> = ({
  selectedStage,
  isLoading,
  onSave,
  onCancel,
  onAddNew
}) => {
  return (
    <div>
      {selectedStage && (
        <PipelineStageForm 
          stage={selectedStage} 
          onSave={onSave}
          onCancel={onCancel}
        />
      )}
      
      {!selectedStage && !isLoading && (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <h3 className="text-lg font-medium">Gerenciamento do Pipeline</h3>
          <p className="mt-2 text-gray-500">
            Selecione um estágio para editar ou clique em "Novo Estágio" para adicionar um novo.
          </p>
          <div className="mt-4">
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={onAddNew}>
              Criar Novo Estágio
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PipelineStagePanel;
