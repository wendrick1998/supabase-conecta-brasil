
import { useState, useCallback } from 'react';
import { Block, BlockType, BlockCategory } from '@/types/automation';
import { toast } from 'sonner';

export const useBlockManagement = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [activeBlock, setActiveBlock] = useState<Block | null>(null);

  // Helper to generate a unique block ID
  const generateBlockId = () => `block-${Date.now()}-${Math.round(Math.random() * 1000)}`;

  // Helper to determine block category based on type
  const getBlockCategory = (blockType: BlockType): BlockCategory => {
    if (['new_lead', 'lead_moved', 'message_received'].includes(blockType)) {
      return 'trigger';
    } else if (['lead_status', 'lead_source', 'value_greater'].includes(blockType)) {
      return 'condition';
    } else {
      return 'action';
    }
  };

  // Helper to snap position to grid
  const snapToGrid = (x: number, y: number) => {
    const gridSize = 20;
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize
    };
  };

  // Add block by clicking on sidebar template (for mobile or as fallback)
  const handleAddBlockByClick = useCallback((blockType: string) => {
    // Create a new block of the selected type
    const type = blockType as BlockType;
    const category = getBlockCategory(type);
    
    // Get canvas center or a suitable position
    let position = { x: 100, y: 100 };
    
    // Create the new block
    const newBlock: Block = {
      id: generateBlockId(),
      type,
      category,
      position,
      configured: false,
      config: {},
      connections: []
    };
    
    // Add block to the canvas
    setBlocks(prevBlocks => [...prevBlocks, newBlock]);
    
    // Automatically open configuration for the new block
    setTimeout(() => {
      handleConfigureBlock(newBlock.id);
    }, 100);
    
    toast.info(`Bloco de ${newBlock.type} adicionado`);
  }, []);

  const handleConfigureBlock = useCallback((blockId: string) => {
    setBlocks(currentBlocks => 
      currentBlocks.map(block => {
        if (block.id === blockId) {
          return { ...block, configured: true };
        }
        return block;
      })
    );
    
    toast.success('Bloco configurado com sucesso!');
  }, []);

  const handleDeleteBlock = useCallback((blockId: string) => {
    // Remove o bloco e também quaisquer conexões que apontam para ele
    setBlocks(currentBlocks => {
      const updatedBlocks = currentBlocks
        .filter(block => block.id !== blockId)
        .map(block => ({
          ...block,
          connections: block.connections.filter(conn => conn !== blockId)
        }));
      
      return updatedBlocks;
    });
    
    toast.success('Bloco removido.');
  }, []);

  return {
    blocks,
    setBlocks,
    activeBlock,
    setActiveBlock,
    generateBlockId,
    getBlockCategory,
    snapToGrid,
    handleAddBlockByClick,
    handleConfigureBlock,
    handleDeleteBlock
  };
};
