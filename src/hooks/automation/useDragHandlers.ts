
import { useState, useRef, useCallback } from 'react';
import { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import { Block } from '@/types/automation';
import { toast } from 'sonner';

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
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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
        const offsetX = event.initial.x - (rect.left - canvasRect.left);
        const offsetY = event.initial.y - (rect.top - canvasRect.top);
        setDragOffset({ x: offsetX, y: offsetY });
      }
    }
    
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
  }, [blocks, setActiveBlock, canvasRef]);

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
      
      const canvasRect = canvas.getBoundingClientRect();
      const canvasScrollLeft = canvas.scrollLeft;
      const canvasScrollTop = canvas.scrollTop;
      
      // If dragging from sidebar, add new block to canvas
      if (!blocks.some(b => b.id === activeBlock.id)) {
        // Calculate position relative to canvas with grid snapping
        // For new blocks, position where dropped, accounting for canvas scroll and position
        const x = Math.max(0, event.over ? 
          event.over.rect.left - canvasRect.left + canvasScrollLeft + 20 : 
          event.delta.x + 100);
          
        const y = Math.max(0, event.over ? 
          event.over.rect.top - canvasRect.top + canvasScrollTop + 20 : 
          event.delta.y + 100);
        
        // Apply grid snapping
        const snappedPosition = snapToGrid(x, y);
        
        // Add new block to canvas
        const newBlock = {
          ...activeBlock,
          position: snappedPosition
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
  }, [activeBlock, blocks, setActiveBlock, setBlocks, snapToGrid, handleConfigureBlock]);

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
