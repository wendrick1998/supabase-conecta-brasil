
import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Block, BlockType } from '@/types/automation';
import { useBlockManagement } from './automation/useBlockManagement';
import { useConnectionManagement } from './automation/useConnectionManagement';
import { useDragHandlers } from './automation/useDragHandlers';
import { useAutomationValidation } from './automation/useAutomationValidation';
import { useTemplateManagement } from './automation/useTemplateManagement';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useAutomationEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [automationName, setAutomationName] = useState(id ? 'Editar Automação' : 'Nova Automação');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoading, setIsLoading] = useState(false);

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

  // Fetch existing automation data if in edit mode
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      const fetchAutomation = async () => {
        try {
          // Carregar dados da automação
          const { data: automationData, error: automationError } = await supabase
            .from('automacoes')
            .select('*')
            .eq('id', id)
            .single();

          if (automationError) throw automationError;

          if (automationData) {
            setAutomationName(automationData.nome);
            
            // Carregar os blocos da automação
            const { data: blocksData, error: blocksError } = await supabase
              .from('blocos_automacao')
              .select('*')
              .eq('automacao_id', id);

            if (blocksError) throw blocksError;

            // Carregar as conexões entre os blocos
            const { data: connectionsData, error: connectionsError } = await supabase
              .from('conexoes_blocos')
              .select('*')
              .eq('id_origem', blocksData.map(block => block.id));

            if (connectionsError) throw connectionsError;

            // Mapear dados do banco para o formato usado pelo editor
            const mappedBlocks = blocksData.map(block => ({
              id: block.id,
              type: block.tipo as BlockType,
              category: getBlockCategory(block.tipo as BlockType),
              position: { x: block.x, y: block.y },
              configured: true,
              config: block.conteudo_config,
              connections: connectionsData
                .filter(conn => conn.id_origem === block.id)
                .map(conn => conn.id_destino)
            }));

            setBlocks(mappedBlocks);
          }
        } catch (error) {
          console.error('Erro ao carregar automação:', error);
          toast.error('Não foi possível carregar a automação');
        } finally {
          setIsLoading(false);
        }
      };

      fetchAutomation();
    }
  }, [id, setBlocks, getBlockCategory]);

  // Wrap handleSaveAutomation to use the local navigate
  const handleSaveAutomation = useCallback(async () => {
    const { valid, errors } = validateAutomation();
    
    if (!valid) {
      // Exibe toast com erros
      errors.forEach(error => {
        toast.error(error);
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Mapear o estado dos blocos para o formato do banco
      const mappedBlocks = blocks.map(block => ({
        tipo: block.category,
        conteudo_config: block.config,
        ordem: 0, // TODO: Implementar ordem de execução se necessário
        x: block.position.x,
        y: block.position.y
      }));
      
      // Se for edição, atualizar a automação existente
      if (id) {
        // Atualizar a automação
        const { error: updateError } = await supabase
          .from('automacoes')
          .update({ 
            nome: automationName,
            atualizado_em: new Date().toISOString()
          })
          .eq('id', id);
          
        if (updateError) throw updateError;
        
        // Deletar todos os blocos e conexões existentes
        const { error: deleteBlocksError } = await supabase
          .from('blocos_automacao')
          .delete()
          .eq('automacao_id', id);
          
        if (deleteBlocksError) throw deleteBlocksError;
        
        // Criar novos blocos
        const { data: insertedBlocks, error: insertBlocksError } = await supabase
          .from('blocos_automacao')
          .insert(mappedBlocks.map(block => ({
            ...block,
            automacao_id: id
          })))
          .select();
          
        if (insertBlocksError) throw insertBlocksError;
        
        // Criar conexões entre os blocos
        const connections = [];
        blocks.forEach(block => {
          const fromBlockId = insertedBlocks.find(b => b.x === block.position.x && b.y === block.position.y)?.id;
          
          block.connections.forEach(toBlockId => {
            const targetBlock = blocks.find(b => b.id === toBlockId);
            if (targetBlock) {
              const targetBlockId = insertedBlocks.find(
                b => b.x === targetBlock.position.x && b.y === targetBlock.position.y
              )?.id;
              
              if (fromBlockId && targetBlockId) {
                connections.push({
                  id_origem: fromBlockId,
                  id_destino: targetBlockId
                });
              }
            }
          });
        });
        
        if (connections.length > 0) {
          const { error: insertConnectionsError } = await supabase
            .from('conexoes_blocos')
            .insert(connections);
            
          if (insertConnectionsError) throw insertConnectionsError;
        }
      } 
      // Se for criação, criar uma nova automação
      else {
        // Criar a automação
        const { data: newAutomation, error: createError } = await supabase
          .from('automacoes')
          .insert({ 
            nome: automationName,
            status: 'inativa',
            usuario_id: (await supabase.auth.getUser()).data.user?.id
          })
          .select()
          .single();
          
        if (createError) throw createError;
        
        // Criar blocos
        const { data: insertedBlocks, error: insertBlocksError } = await supabase
          .from('blocos_automacao')
          .insert(mappedBlocks.map(block => ({
            ...block,
            automacao_id: newAutomation.id
          })))
          .select();
          
        if (insertBlocksError) throw insertBlocksError;
        
        // Criar conexões
        const connections = [];
        blocks.forEach(block => {
          const fromBlockId = insertedBlocks.find(b => b.x === block.position.x && b.y === block.position.y)?.id;
          
          block.connections.forEach(toBlockId => {
            const targetBlock = blocks.find(b => b.id === toBlockId);
            if (targetBlock) {
              const targetBlockId = insertedBlocks.find(
                b => b.x === targetBlock.position.x && b.y === targetBlock.position.y
              )?.id;
              
              if (fromBlockId && targetBlockId) {
                connections.push({
                  id_origem: fromBlockId,
                  id_destino: targetBlockId
                });
              }
            }
          });
        });
        
        if (connections.length > 0) {
          const { error: insertConnectionsError } = await supabase
            .from('conexoes_blocos')
            .insert(connections);
            
          if (insertConnectionsError) throw insertConnectionsError;
        }
      }
      
      toast.success('Automação salva com sucesso!');
      navigate('/automacoes');
    } catch (error) {
      console.error('Erro ao salvar automação:', error);
      toast.error('Não foi possível salvar a automação');
    } finally {
      setIsLoading(false);
    }
  }, [validateAutomation, navigate, blocks, automationName, id]);

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
    isLoading,
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
