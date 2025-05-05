
import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Block, BlockType } from '@/types/automation';
import { useBlockManagement } from './automation/useBlockManagement';
import { useConnectionManagement } from './automation/useConnectionManagement';
import { useDragHandlers } from './automation/useDragHandlers';
import { useAutomationValidation } from './automation/useAutomationValidation';
import { useTemplateManagement } from './automation/useTemplateManagement';
import { toast } from 'sonner';

export const useAutomationEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [automationName, setAutomationName] = useState(id ? 'Editar Automação' : 'Nova Automação');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Import sub-hooks
  const { 
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
  } = useBlockManagement();

  const {
    handleCreateConnection,
    isConnectionValid
  } = useConnectionManagement(blocks, setBlocks);

  const {
    validateAutomation,
    handleTestAutomation
  } = useAutomationValidation(blocks);

  const {
    showTemplates,
    setShowTemplates,
    showPreview,
    setShowPreview,
    handleApplyTemplate
  } = useTemplateManagement(setBlocks);

  const {
    isDragging,
    setIsDragging,
    canvasRef,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  } = useDragHandlers(blocks, setBlocks, activeBlock, setActiveBlock, snapToGrid, handleConfigureBlock);

  // Wrap handleSaveAutomation to use the local navigate
  const handleSaveAutomation = useCallback(() => {
    const { valid, errors } = validateAutomation();
    
    if (!valid) {
      // Exibe toast com erros
      errors.forEach(error => {
        toast.error(error);
      });
      return;
    }
    
    // Se tudo estiver válido, salva e redireciona
    toast.success('Automação salva com sucesso!');
    navigate('/automacoes');
  }, [validateAutomation, navigate]);

  const handleCancelAutomation = useCallback(() => {
    navigate('/automacoes');
  }, [navigate]);

  // Override drag start to include block creation logic
  const enhancedHandleDragStart = useCallback((event: any) => {
    setIsDragging(true);
    const { active } = event;
    
    // If dragging from sidebar, create a new block
    if (typeof active.id === 'string' && active.id.startsWith('template-')) {
      const blockType = active.id.replace('template-', '') as BlockType;
      const category = getBlockCategory(blockType);
      
      const newBlock: Block = {
        id: generateBlockId(),
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
  }, [blocks, setActiveBlock, generateBlockId, getBlockCategory]);

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
    handleDragStart: enhancedHandleDragStart,
    handleDragOver,
    handleDragEnd,
    handleAddBlockByClick,
    handleSaveAutomation,
    handleTestAutomation,
    handleCancelAutomation,
    handleConfigureBlock,
    handleDeleteBlock,
    handleCreateConnection,
    handleApplyTemplate
  };
};

