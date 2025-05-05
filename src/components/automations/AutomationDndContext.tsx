
import React, { useState } from 'react';
import { DndContext, closestCenter, DragStartEvent, DragEndEvent, DragOverEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';

interface AutomationDndContextProps {
  children: React.ReactNode;
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onDragOver?: (event: DragOverEvent) => void;
}

export const AutomationDndContext: React.FC<AutomationDndContextProps> = ({
  children,
  onDragStart,
  onDragEnd,
  onDragOver,
}) => {
  // Configure sensors for better drag & drop experience
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 5 pixels before activating
    activationConstraint: {
      distance: 5,
    },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    // Press delay helps distinguish between a tap and a drag
    activationConstraint: {
      delay: 150,
      tolerance: 8,
    },
  });
  
  const sensors = useSensors(mouseSensor, touchSensor);

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      sensors={sensors}
      modifiers={[restrictToWindowEdges]}
    >
      {children}
    </DndContext>
  );
};
