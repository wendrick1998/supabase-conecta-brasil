import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EstagioPipeline } from '@/types/lead';
interface PipelineStageItemProps {
  stage: EstagioPipeline;
  onSelect: (stage: EstagioPipeline) => void;
  onRequestDelete: (stage: EstagioPipeline) => void;
}
const PipelineStageItem: React.FC<PipelineStageItemProps> = ({
  stage,
  onSelect,
  onRequestDelete
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: stage.id
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  return <Card ref={setNodeRef} style={style} className="bg-white p-3 flex items-center justify-between group">
      <div className="flex items-center space-x-3">
        <div {...attributes} {...listeners} className="cursor-grab p-1 hover:bg-gray-100 rounded touch-none">
          <GripVertical size={18} className="text-gray-400" />
        </div>
        
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-800">{stage.nome}</span>
            <div className="w-3 h-3 rounded-full" style={{
            backgroundColor: stage.cor || '#3b82f6'
          }} />
          </div>
          <div className="text-xs text-gray-500">
            Ordem: {stage.ordem}
          </div>
        </div>
      </div>
      
      <div className="flex space-x-1">
        <Button variant="ghost" size="sm" onClick={() => onSelect(stage)} className="h-8 w-8 p-0">
          <Pencil size={16} />
          <span className="sr-only">Editar estágio</span>
        </Button>
        
        <Button variant="ghost" size="sm" onClick={() => onRequestDelete(stage)} className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50">
          <Trash2 size={16} />
          <span className="sr-only">Excluir estágio</span>
        </Button>
      </div>
    </Card>;
};
export default PipelineStageItem;