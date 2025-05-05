
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
  MeasuringConfiguration,
} from '@dnd-kit/core';

// Create sensors using proper configuration
const sensors = (dragStartDelay = 500) => {
  const pointerSensor = useSensor(PointerSensor, {
    // Small delay to differentiate between click and drag
    activationConstraint: {
      delay: dragStartDelay,
      tolerance: 8,
    }
  });

  const keyboardSensor = useSensor(KeyboardSensor, {});

  return useSensors(pointerSensor, keyboardSensor);
};

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
  // Configure sensors with a shorter delay for better UX
  const configuredSensors = sensors(200);
  
  // Define measuring configuration with correct types
  const measuring: MeasuringConfiguration = {
    droppable: {
      strategy: "always" as const, // Use a const assertion to fix the type error
    },
  };

  return (
    <DndContext
      sensors={configuredSensors}
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
