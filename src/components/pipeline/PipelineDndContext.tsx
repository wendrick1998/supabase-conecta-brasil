
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import PipelineContent from './PipelineContent';

interface PipelineDndContextProps {
  onMoveCard: (leadId: string, newStageId: string) => Promise<void>;
  children: React.ReactNode;
}

export const PipelineDndContext: React.FC<PipelineDndContextProps> = ({ 
  onMoveCard, 
  children 
}) => {
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const [overStageId, setOverStageId] = useState<string | null>(null);

  // Configure sensors for drag & drop
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    // Press delay helps distinguish between a tap and a drag
    activationConstraint: {
      delay: 200,
      tolerance: 8,
    },
  });
  
  const sensors = useSensors(mouseSensor, touchSensor);

  // Drag & Drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveLeadId(active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (over) {
      setOverStageId(over.id as string);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Clear states
    setActiveLeadId(null);
    setOverStageId(null);
    
    // If no over element or same stage, no change needed
    if (!over) return;
    
    const leadId = active.id as string;
    const newStageId = over.id as string;
    
    // Move the lead to the new stage
    await onMoveCard(leadId, newStageId);
  };

  // Check children and pass props to PipelineContent
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      // Check if this is a PipelineContent component
      if (child.type === PipelineContent) {
        // Pass these props to PipelineContent
        return React.cloneElement(child, {
          activeId: activeLeadId,
          overStageId: overStageId
        });
      }
    }
    return child;
  });

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {childrenWithProps}
    </DndContext>
  );
};
