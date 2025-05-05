
import { useState, useRef, useCallback } from 'react';
import { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import { Block } from '@/types/automation';

export const useDragHandlers = (
  blocks: Block[],
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>,
  activeBlock: Block | null,
  setActiveBlock: React.Dispatch<React.SetStateAction<Block | null>>,
  snapToGrid: (x: number, y: number) => { x: number; y: number },
  handleConfigureBlock: (blockId: string) => void
) => {
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Handle drag start - either from sidebar or existing block
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setIsDragging(true);
    const { active } = event;
    
    // If dragging from sidebar, create a new block
    if (typeof active.id === 'string' && active.id.startsWith('template-')) {
      // This is handled in the useAutomationEditor which combines all these hooks
    } else {
      // If dragging an existing block, set it as active
      const blockId = active.id.toString();
      const block = blocks.find(b => b.id === blockId);
      if (block) {
        setActiveBlock(block);
      }
    }
  }, [blocks, setActiveBlock]);

  // Handle drag over - may be used for snap lines or grid guidance
  const handleDragOver = useCallback((event: DragOverEvent) => {
    // Implementation for drag over effects if needed
  }, []);

  // Handle drag end - position block appropriately
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setIsDragging(false);
    
    if (activeBlock) {
      // If dragging from sidebar, add new block to canvas
      if (!blocks.some(b => b.id === activeBlock.id)) {
        const canvas = canvasRef.current;
        if (canvas) {
          // Calculate position relative to canvas with grid snapping
          const x = Math.max(0, event.delta.x + 100);
          const y = Math.max(0, event.delta.y + 100);
          
          // Apply grid snapping
          const snappedPosition = snapToGrid(x, y);
          
          // Add new block to canvas
          const newBlock = {
            ...activeBlock,
            position: snappedPosition
          };
          
          setBlocks(prevBlocks => [...prevBlocks, newBlock]);
          
          // Automatically open configuration for new blocks
          setTimeout(() => {
            handleConfigureBlock(newBlock.id);
          }, 100);
        }
      } else {
        // If dragging existing block, update its position
        setBlocks(currentBlocks => 
          currentBlocks.map(block => {
            if (block.id === activeBlock.id) {
              // Get current position and add delta
              const newX = Math.max(0, block.position.x + event.delta.x);
              const newY = Math.max(0, block.position.y + event.delta.y);
              
              // Apply grid snapping
              const snappedPosition = snapToGrid(newX, newY);
              
              return {
                ...block,
                position: snappedPosition
              };
            }
            return block;
          })
        );
      }
    }
    
    setActiveBlock(null);
  }, [activeBlock, blocks, setActiveBlock, setBlocks, snapToGrid, handleConfigureBlock]);

  return {
    isDragging,
    setIsDragging,
    canvasRef,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  };
};
