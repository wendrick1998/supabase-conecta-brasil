
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
    if ([
      'new_lead', 
      'lead_moved', 
      'message_received', 
      'form_submitted', 
      'schedule_triggered'
    ].includes(blockType)) {
      return 'trigger';
    } else if ([
      'lead_status', 
      'lead_source', 
      'value_greater', 
      'has_tag', 
      'date_condition'
    ].includes(blockType)) {
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
      config: getDefaultConfig(type),
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

  // Get default configuration based on block type
  const getDefaultConfig = (blockType: BlockType): Record<string, any> => {
    switch (blockType) {
      case 'new_lead':
        return { source: 'none' };
      case 'lead_moved':
        return { fromStage: 'any', toStage: 'none' };
      case 'message_received':
        return { channel: 'any' };
      case 'form_submitted':
        return { formId: 'any', createLead: true };
      case 'schedule_triggered':
        return { frequency: 'daily', time: '08:00' };
      case 'lead_status':
        return { field: 'status', operator: 'equals' };
      case 'lead_source':
        return { operator: 'equals', value: 'none' };
      case 'value_greater':
        return { field: 'valor', operator: 'greater' };
      case 'has_tag':
        return { operator: 'has' };
      case 'date_condition':
        return { field: 'created_at', operator: 'before' };
      case 'send_message':
        return { channel: 'none' };
      case 'create_task':
        return { priority: 'medium', taskType: 'general' };
      case 'move_pipeline':
        return { pipeline: 'default', stage: 'none' };
      case 'add_tag':
        return { action: 'add', createIfMissing: true };
      case 'assign_user':
        return { assignmentType: 'specific', assignedUser: 'none' };
      case 'send_notification':
        return { notificationType: 'info', recipients: 'all' };
      default:
        return {};
    }
  };

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
