
import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { Block, BlockType, BlockCategory } from '@/types/automation';
import { toast } from 'sonner';

export const useAutomationEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [automationName, setAutomationName] = useState(id ? 'Editar Automação' : 'Nova Automação');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [activeBlock, setActiveBlock] = useState<Block | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    const { active } = event;
    
    // If dragging from sidebar, create a new block
    if (typeof active.id === 'string' && active.id.startsWith('template-')) {
      const blockType = active.id.replace('template-', '') as BlockType;
      let category: BlockCategory;
      
      if (['new_lead', 'lead_moved', 'message_received'].includes(blockType)) {
        category = 'trigger';
      } else if (['lead_status', 'lead_source', 'value_greater'].includes(blockType)) {
        category = 'condition';
      } else {
        category = 'action';
      }
      
      const newBlock: Block = {
        id: `block-${Date.now()}`,
        type: blockType,
        category,
        position: { x: 100, y: 100 },
        configured: false,
        config: {},
        connections: []
      };
      
      setActiveBlock(newBlock);
    } else {
      // If dragging an existing block, set it as active
      const blockId = active.id.toString();
      const block = blocks.find(b => b.id === blockId);
      if (block) {
        setActiveBlock(block);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    const { active, over } = event;
    
    if (activeBlock) {
      // If dragging from sidebar, add new block to canvas
      if (!blocks.some(b => b.id === activeBlock.id)) {
        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          // Calculate position relative to canvas
          const x = event.delta.x + 100;
          const y = event.delta.y + 100;
          
          setBlocks([...blocks, {...activeBlock, position: { x, y }}]);
        }
      } else {
        // If dragging existing block, update its position
        setBlocks(blocks.map(block => {
          if (block.id === activeBlock.id) {
            return {
              ...block,
              position: {
                x: block.position.x + event.delta.x,
                y: block.position.y + event.delta.y
              }
            };
          }
          return block;
        }));
      }
    }
    
    setActiveBlock(null);
  };

  const handleSaveAutomation = () => {
    const invalidBlocks = blocks.filter(block => !block.configured);
    
    if (invalidBlocks.length > 0) {
      toast.error('Há blocos não configurados na sua automação.');
      return;
    }
    
    if (blocks.filter(b => b.category === 'trigger').length === 0) {
      toast.error('Sua automação precisa de pelo menos um gatilho.');
      return;
    }
    
    toast.success('Automação salva com sucesso!');
    navigate('/automacoes');
  };

  const handleTestAutomation = () => {
    toast.info('Testando automação...');
    setTimeout(() => {
      toast.success('Teste concluído com sucesso!');
    }, 1500);
  };

  const handleCancelAutomation = () => {
    navigate('/automacoes');
  };

  const handleConfigureBlock = (blockId: string) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        return { ...block, configured: true };
      }
      return block;
    }));
    
    toast.success('Bloco configurado com sucesso!');
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
    toast.success('Bloco removido.');
  };

  const handleCreateConnection = (fromBlockId: string, toBlockId: string) => {
    setBlocks(blocks.map(block => {
      if (block.id === fromBlockId) {
        return {
          ...block,
          connections: [...block.connections, toBlockId]
        };
      }
      return block;
    }));
  };

  const handleApplyTemplate = (templateBlocks: Block[]) => {
    setBlocks(templateBlocks);
    setShowTemplates(false);
    toast.success('Template aplicado com sucesso!');
  };

  return {
    automationName,
    setAutomationName,
    blocks,
    setBlocks,
    activeBlock,
    isDragging,
    showTemplates,
    setShowTemplates,
    showPreview,
    setShowPreview,
    isMobile,
    setIsMobile,
    canvasRef,
    handleDragStart,
    handleDragEnd,
    handleSaveAutomation,
    handleTestAutomation,
    handleCancelAutomation,
    handleConfigureBlock,
    handleDeleteBlock,
    handleCreateConnection,
    handleApplyTemplate
  };
};
