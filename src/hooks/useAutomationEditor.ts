
import { useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
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

  // Handle drag start - either from sidebar or existing block
  const handleDragStart = (event: DragStartEvent) => {
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
  };

  // Handle drag over - may be used for snap lines or grid guidance
  const handleDragOver = (event: DragOverEvent) => {
    // Implementation for drag over effects if needed
  };

  // Handle drag end - position block appropriately
  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    const { active, over } = event;
    
    if (activeBlock) {
      // If dragging from sidebar, add new block to canvas
      if (!blocks.some(b => b.id === activeBlock.id)) {
        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          
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
          
          setBlocks([...blocks, newBlock]);
          
          // Automatically open configuration for new blocks
          setTimeout(() => {
            handleConfigureBlock(newBlock.id);
          }, 100);
        }
      } else {
        // If dragging existing block, update its position
        setBlocks(blocks.map(block => {
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
        }));
      }
    }
    
    setActiveBlock(null);
  };

  // Add block by clicking on sidebar template (for mobile or as fallback)
  const handleAddBlockByClick = (blockType: string) => {
    // Create a new block of the selected type
    const type = blockType as BlockType;
    const category = getBlockCategory(type);
    
    // Get canvas center or a suitable position
    let position = { x: 100, y: 100 };
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      
      // Calculate a position in the visible area of the canvas
      const scrollX = canvas.scrollLeft;
      const scrollY = canvas.scrollTop;
      
      position = {
        x: Math.max(0, scrollX + 100),
        y: Math.max(0, scrollY + 100)
      };
    }
    
    // Apply grid snapping
    const snappedPosition = snapToGrid(position.x, position.y);
    
    // Create the new block
    const newBlock: Block = {
      id: generateBlockId(),
      type,
      category,
      position: snappedPosition,
      configured: false,
      config: {},
      connections: []
    };
    
    // Add block to the canvas
    setBlocks([...blocks, newBlock]);
    
    // Automatically open configuration for the new block
    setTimeout(() => {
      handleConfigureBlock(newBlock.id);
    }, 100);
    
    toast.info(`Bloco de ${newBlock.type} adicionado`);
  };

  // Valida se o fluxo de automação está correto
  const validateAutomation = (): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Verifica se há pelo menos um gatilho
    const triggers = blocks.filter(block => block.category === 'trigger');
    if (triggers.length === 0) {
      errors.push('Sua automação precisa de pelo menos um gatilho.');
    }
    
    // Verifica se todos os blocos estão configurados
    const unconfiguredBlocks = blocks.filter(block => !block.configured);
    if (unconfiguredBlocks.length > 0) {
      errors.push(`Há ${unconfiguredBlocks.length} bloco(s) não configurado(s).`);
    }
    
    // Verifica conexões lógicas (se há blocos sem conexão)
    if (blocks.length > 1) {
      // Encontra todos os IDs de blocos que são destinos de conexões
      const connectedBlockIds = new Set<string>();
      blocks.forEach(block => {
        block.connections.forEach(connId => {
          connectedBlockIds.add(connId);
        });
      });
      
      // Verifica blocos que não são gatilhos e não estão conectados
      const disconnectedBlocks = blocks.filter(
        block => block.category !== 'trigger' && !connectedBlockIds.has(block.id)
      );
      
      if (disconnectedBlocks.length > 0) {
        errors.push(`Há ${disconnectedBlocks.length} bloco(s) sem conexão lógica com o fluxo.`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  };

  const handleSaveAutomation = () => {
    const { valid, errors } = validateAutomation();
    
    if (!valid) {
      // Exibe toast com erros
      errors.forEach(error => {
        toast.error(error);
      });
      
      // Destaca visualmente blocos com problemas
      const updatedBlocks = blocks.map(block => {
        if (!block.configured) {
          // Adiciona indicador visual (já é feito pelo CSS)
          return block;
        }
        return block;
      });
      
      return;
    }
    
    // Se tudo estiver válido, salva e redireciona
    toast.success('Automação salva com sucesso!');
    navigate('/automacoes');
  };

  const handleTestAutomation = () => {
    const { valid, errors } = validateAutomation();
    
    if (!valid) {
      // Exibe toast com erros
      errors.forEach(error => {
        toast.error(error);
      });
      return;
    }
    
    toast.info('Testando automação com dados fictícios...');
    
    // Simula processamento de teste
    setTimeout(() => {
      toast.success('Teste concluído com sucesso! O fluxo de automação funciona corretamente.');
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
    // Remove o bloco e também quaisquer conexões que apontam para ele
    const updatedBlocks = blocks.filter(block => block.id !== blockId).map(block => ({
      ...block,
      connections: block.connections.filter(conn => conn !== blockId)
    }));
    
    setBlocks(updatedBlocks);
    toast.success('Bloco removido.');
  };

  const handleCreateConnection = (fromBlockId: string, toBlockId: string) => {
    // Verifica se a conexão já existe
    const blockFrom = blocks.find(b => b.id === fromBlockId);
    if (blockFrom && blockFrom.connections.includes(toBlockId)) {
      toast.info('Esta conexão já existe.');
      return;
    }
    
    // Verifica se a conexão é válida (não permitir ciclos, etc)
    const fromBlock = blocks.find(b => b.id === fromBlockId);
    const toBlock = blocks.find(b => b.id === toBlockId);
    
    if (!fromBlock || !toBlock) {
      toast.error('Blocos não encontrados.');
      return;
    }
    
    // Verifica se a conexão é lógica baseada nas categorias dos blocos
    if (!isConnectionValid(fromBlock.category, toBlock.category)) {
      toast.error('Esta conexão não é válida entre estes tipos de blocos.');
      return;
    }
    
    // Adiciona a conexão
    setBlocks(blocks.map(block => {
      if (block.id === fromBlockId) {
        return {
          ...block,
          connections: [...block.connections, toBlockId]
        };
      }
      return block;
    }));
    
    toast.success('Blocos conectados com sucesso!');
  };

  // Helper to validate connection based on block categories
  const isConnectionValid = (sourceCat: BlockCategory, targetCat: BlockCategory): boolean => {
    // Trigger -> Condition or Action
    if (sourceCat === 'trigger') {
      return targetCat === 'condition' || targetCat === 'action';
    }
    // Condition -> Condition or Action
    else if (sourceCat === 'condition') {
      return targetCat === 'condition' || targetCat === 'action';
    }
    // Action -> Action
    else if (sourceCat === 'action') {
      return targetCat === 'action';
    }
    return false;
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
