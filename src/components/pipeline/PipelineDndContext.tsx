
import React, { useState } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverEvent, 
  DragStartEvent,
  pointerWithin,
  MouseSensor, 
  TouchSensor, 
  useSensor, 
  useSensors,
  MeasuringStrategy,
  defaultDropAnimationSideEffects,
  DropAnimation
} from '@dnd-kit/core';
import PipelineContent from './PipelineContent';

// Configuração da animação de drop para melhorar a UX
const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

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

  // Configure sensors for drag & drop with improved response
  const mouseSensor = useSensor(MouseSensor, {
    // Reduzindo a distância para resposta mais rápida
    activationConstraint: {
      distance: 5,
    },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    // Reduzindo o delay para melhorar a resposta
    activationConstraint: {
      delay: 150,
      tolerance: 5,
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

  // Process children and clone PipelineContent with additional props
  const childrenWithProps = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }
    
    // Use both component reference and displayName for robust type checking
    const isPipelineContent = 
      child.type === PipelineContent || 
      (child.type as any)?.displayName === 'PipelineContent';
    
    if (isPipelineContent) {
      // Use type assertion to help TypeScript understand the component props
      return React.cloneElement(child as React.ReactElement<any>, {
        activeId: activeLeadId,
        overStageId: overStageId
      });
    }
    
    return child;
  });

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      collisionDetection={pointerWithin}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      autoScroll={{
        threshold: {
          x: 0.2,
          y: 0.2
        }
      }}
    >
      {childrenWithProps}
    </DndContext>
  );
};
