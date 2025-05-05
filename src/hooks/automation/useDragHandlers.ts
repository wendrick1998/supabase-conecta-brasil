
import { useCallback } from 'react';
import { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import { Block } from '@/types/automation';
import { toast } from 'sonner';
import { useDragState } from './dragHandlers/useDragState';
import { usePositionCalculation } from './dragHandlers/usePositionCalculation';

export const useDragHandlers = (
  blocks: Block[],
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>,
  activeBlock: Block | null,
  setActiveBlock: React.Dispatch<React.SetStateAction<Block | null>>,
  snapToGrid: (x: number, y: number) => { x: number; y: number },
  handleConfigureBlock: (blockId: string) => void
) => {
  // Use smaller, focused hooks
  const { isDragging, setIsDragging, dragOffset, setDragOffset, canvasRef } = useDragState();
  const { calculateCanvasPosition } = usePositionCalculation(canvasRef);

  // Handle drag start - either from sidebar or existing block
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setIsDragging(true);
    const { active } = event;
    
    // Calculate initial position offset for better drag positioning
    if (typeof active.id === 'string' && !active.id.startsWith('template-') && canvasRef.current) {
      const activeNode = document.getElementById(active.id.toString());
      if (activeNode) {
        const rect = activeNode.getBoundingClientRect();
        const canvasRect = canvasRef.current.getBoundingClientRect();
        
        // TypeScript fix: access left/top properties from the rect object safely
        const offsetX = active.rect.current.translated 
            ? active.rect.current.translated.left - (rect.left - canvasRect.left) 
            : 0;
        const offsetY = active.rect.current.translated 
            ? active.rect.current.translated.top - (rect.top - canvasRect.top) 
            : 0;
            
        setDragOffset({ x: offsetX, y: offsetY });
      }
    }
    
    // If dragging an existing block, set it as active
    const blockId = active.id.toString();
    const block = blocks.find(b => b.id === blockId);
    if (block) {
      setActiveBlock(block);
    }
  }, [blocks, setActiveBlock, canvasRef, setDragOffset, setIsDragging]);

  // Handle drag over - provide visual feedback
  const handleDragOver = useCallback((event: DragOverEvent) => {
    // Implementation for drag over visual feedback
    // Could add visual indicators for snap points
  }, []);

  // Handle drag end - position block appropriately
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setIsDragging(false);
    
    if (activeBlock) {
      const canvas = canvasRef.current;
      if (!canvas) {
        setActiveBlock(null);
        return;
      }
      
      // If dragging from sidebar, add new block to canvas
      if (!blocks.some(b => b.id === activeBlock.id)) {
        // For new blocks, position where dropped
        let position;
        
        if (event.over) {
          // When dropped over a valid target
          position = calculateCanvasPosition(
            event.over.rect.left,
            event.over.rect.top,
            snapToGrid
          );
        } else {
          // When dropped elsewhere, use delta position
          position = snapToGrid(100 + event.delta.x, 100 + event.delta.y);
        }
        
        // Add new block to canvas with calculated position
        const newBlock = {
          ...activeBlock,
          position
        };
        
        setBlocks(prevBlocks => [...prevBlocks, newBlock]);
        
        // Show success feedback
        toast.success(`Bloco de ${activeBlock.type} adicionado`);
        
        // Automatically open configuration for new blocks
        setTimeout(() => {
          handleConfigureBlock(newBlock.id);
        }, 100);
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
    setDragOffset({ x: 0, y: 0 });
  }, [activeBlock, blocks, setActiveBlock, setBlocks, snapToGrid, handleConfigureBlock, canvasRef, calculateCanvasPosition, setIsDragging, setDragOffset]);

  return {
    isDragging,
    setIsDragging,
    canvasRef,
    dragOffset,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  };
};
