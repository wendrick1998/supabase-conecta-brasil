
import React from 'react';
import { DndContext, closestCenter, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';

interface AutomationDndContextProps {
  children: React.ReactNode;
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

export const AutomationDndContext: React.FC<AutomationDndContextProps> = ({
  children,
  onDragStart,
  onDragEnd
}) => {
  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      {children}
    </DndContext>
  );
};
