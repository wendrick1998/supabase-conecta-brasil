
import React from 'react';
import { 
  DndContext, 
  DragOverlay, 
  MouseSensor, 
  TouchSensor,
  useSensor, 
  useSensors,
  DragStartEvent,
  DragEndEvent,
  MeasuringConfiguration,
} from '@dnd-kit/core';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { Block, BlockCategory } from '@/types/automation';
import { getBlockInfo } from '@/utils/automationUtils';
import { AutomationBlock } from './AutomationBlock';

interface AutomationDndContextProps {
  children: React.ReactNode;
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onDragCancel: () => void;
  activeBlock: Block | null;
  activeDragType: 'block' | 'connection' | null;
  activeDragBlockId: string | null;
}

export const AutomationDndContext: React.FC<AutomationDndContextProps> = ({
  children,
  onDragStart,
  onDragEnd,
  onDragCancel,
  activeBlock,
  activeDragType,
  activeDragBlockId,
}) => {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  const measuring: MeasuringConfiguration = {
    droppable: {
      strategy: 'always',
    },
  };

  // Show drag overlay only when dragging blocks, not connections
  const renderDragOverlay = () => {
    if (!activeBlock || activeDragType !== 'block') return null;
    
    const blockInfo = getBlockInfo(activeBlock.type);
    
    return (
      <DragOverlay modifiers={[snapCenterToCursor]} dropAnimation={null}>
        <div className="opacity-80">
          <AutomationBlock
            block={activeBlock}
            onDelete={() => {}}
            onConfigure={() => {}}
          />
        </div>
      </DragOverlay>
    );
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
      measuring={measuring}
    >
      {children}
      {renderDragOverlay()}
    </DndContext>
  );
};
