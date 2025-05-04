
import React from 'react';
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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

import { Button } from '@/components/ui/button';
import { EstagioPipeline } from '@/types/lead';
import PipelineStageItem from './PipelineStageItem';

interface PipelineStagesListProps {
  stages: EstagioPipeline[];
  isLoading: boolean;
  onSelectStage: (stage: EstagioPipeline) => void;
  onRequestDelete: (stage: EstagioPipeline) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onAddNew: () => void;
}

const PipelineStagesList: React.FC<PipelineStagesListProps> = ({
  stages,
  isLoading,
  onSelectStage,
  onRequestDelete,
  onDragEnd,
  onAddNew
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Estágios do Pipeline</h2>
        <Button 
          onClick={onAddNew}
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
          onDragEnd={onDragEnd}
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
                  onSelect={onSelectStage}
                  onRequestDelete={onRequestDelete}
                />
              ))}
              
              {stages.length === 0 && (
                <div className="bg-gray-50 p-4 rounded-md text-center">
                  <p className="text-gray-500">Nenhum estágio configurado</p>
                  <Button 
                    variant="link" 
                    onClick={onAddNew} 
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
  );
};

export default PipelineStagesList;
