import React from 'react';
import { DndContext } from '@dnd-kit/core';
import { closestCenter } from '@dnd-kit/core';
import {
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type {
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';

const pointerSensor = new PointerSensor({
  activationConstraint: {
    distance: 8,
  },
});

const keyboardSensor = new KeyboardSensor({
  coordinateGetter: () => {
    return {
      x: 0,
      y: 0,
    };
  },
});

const sensors = useSensors(pointerSensor, keyboardSensor);

export interface AutomationDndContextProps {
  children: React.ReactNode;
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onDragOver: (event: DragOverEvent) => void;
  onDragCancel?: () => void;  // Added this property
  activeBlock?: any;          // Added this property
  activeDragType?: string;    // Added this property
  activeDragBlockId?: string; // Added this property
}

export const AutomationDndContext: React.FC<AutomationDndContextProps> = ({
  children,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragCancel = () => {}, // Default implementation
  activeBlock = null,
  activeDragType = '',
  activeDragBlockId = '',
}) => {
  // Use 'always visible' for measuring strategy to avoid type error
  const measuring = {
    droppable: {
      strategy: 'always' as const, // Use 'as const' to specify the exact type
    },
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragCancel={onDragCancel}
      measuring={measuring}
    >
      {children}
    </DndContext>
  );
};

export default AutomationDndContext;
