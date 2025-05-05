
import { useState, useCallback, useEffect, useRef } from 'react';
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
  const [showTestResults, setShowTestResults] = useState(false);

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
    handleTestAutomation,
    testResults,
    isTestRunning,
    testSummary,
    resetTest
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

            // FIX: Collecting all block IDs to query connections
            const blockIds = blocksData?.map(block => block.id) || [];
            
            // Carregar as conexões entre os blocos - Only if we have blocks
            let connectionsData = [];
            if (blockIds.length > 0) {
              const { data: connections, error: connectionsError } = await supabase
                .from('conexoes_blocos')
                .select('*')
                .in('id_origem', blockIds);

              if (connectionsError) throw connectionsError;
              connectionsData = connections || [];
            }

            // Mapear dados do banco para o formato usado pelo editor
            const mappedBlocks = blocksData.map(block => ({
              id: block.id,
              type: block.tipo as BlockType,
              category: getBlockCategory(block.tipo as BlockType),
              position: { x: block.x, y: block.y },
              configured: true,
              config: typeof block.conteudo_config === 'string' 
                ? JSON.parse(block.conteudo_config) as Record<string, any>
                : block.conteudo_config as Record<string, any>,
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
      return null;
    }
    
    try {
      setIsLoading(true);
      
      // Mapear o estado dos blocos para o formato do banco
      const mappedBlocks = blocks.map(block => ({
        tipo: block.type,
        conteudo_config: block.config,
        ordem: 0, // TODO: Implementar ordem de execução se necessário
        x: block.position.x,
        y: block.position.y
      }));
      
      let automationId = id;
      
      // Se for edição, atualizar a automação existente
      if (id) {
        // Obter a versão atual para incrementar
        const { data: versionData, error: versionError } = await supabase
          .from('automacoes')
          .select('versao')
          .eq('id', id)
          .single();
          
        if (versionError) throw versionError;
        
        const nextVersion = (versionData?.versao || 1) + 1;
        
        // Atualizar a automação
        const { error: updateError } = await supabase
          .from('automacoes')
          .update({ 
            nome: automationName,
            atualizado_em: new Date().toISOString(),
            versao: nextVersion
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
                  id_destino: targetBlockId,
                  automacao_id: id
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
        
        // Create version snapshot (we'll just store the version ID in the automacoes_versoes table,
        // actual blocks are stored in automacoes_versoes_blocos)
        const { data: versionInsertData, error: versionInsertError } = await supabase
          .from('automacoes_versoes')
          .insert({
            automacao_id: id,
            version: nextVersion,
            user_name: (await supabase.auth.getUser()).data.user?.email || 'Usuário'
          })
          .select('id')
          .single();
          
        if (versionInsertError) throw versionInsertError;
        
        // Store version blocks data
        if (versionInsertData?.id) {
          const versionBlocks = insertedBlocks.map((block: any) => ({
            versao_id: versionInsertData.id,
            bloco_id: block.id,
            tipo: block.tipo,
            conteudo_config: block.conteudo_config,
            x: block.x,
            y: block.y
          }));
          
          const { error: versionBlocksError } = await supabase
            .from('automacoes_versoes_blocos')
            .insert(versionBlocks);
            
          if (versionBlocksError) throw versionBlocksError;
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
            versao: 1,
            usuario_id: (await supabase.auth.getUser()).data.user?.id
          })
          .select()
          .single();
          
        if (createError) throw createError;
        
        automationId = newAutomation.id;
        
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
                  id_destino: targetBlockId,
                  automacao_id: newAutomation.id
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
        
        // Create initial version snapshot
        const { data: versionInsertData, error: versionInsertError } = await supabase
          .from('automacoes_versoes')
          .insert({
            automacao_id: newAutomation.id,
            version: 1,
            user_name: (await supabase.auth.getUser()).data.user?.email || 'Usuário',
            description: 'Versão inicial'
          })
          .select('id')
          .single();
          
        if (versionInsertError) throw versionInsertError;
        
        // Store version blocks data
        if (versionInsertData?.id && insertedBlocks) {
          const versionBlocks = insertedBlocks.map((block: any) => ({
            versao_id: versionInsertData.id,
            bloco_id: block.id,
            tipo: block.tipo,
            conteudo_config: block.conteudo_config,
            x: block.x,
            y: block.y
          }));
          
          const { error: versionBlocksError } = await supabase
            .from('automacoes_versoes_blocos')
            .insert(versionBlocks);
            
          if (versionBlocksError) throw versionBlocksError;
        }
      }
      
      toast.success('Automação salva com sucesso!');
      
      // If creating a new automation, redirect to edit mode
      if (!id) {
        navigate(`/automacoes/${automationId}/editar`);
      }
      
      return automationId;
    } catch (error) {
      console.error('Erro ao salvar automação:', error);
      toast.error('Não foi possível salvar a automação');
      return null;
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

  // Wrapper for test automation to show results dialog
  const handleRunTest = useCallback(() => {
    resetTest();
    setShowTestResults(true);
    handleTestAutomation();
  }, [handleTestAutomation, resetTest]);

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
    showTestResults,
    setShowTestResults,
    isMobile,
    setIsMobile,
    isLoading,
    isTestRunning,
    testResults,
    testSummary,
    canvasRef,
    handleDragStart: enhancedHandleDragStart,
    handleDragOver,
    handleDragEnd,
    handleAddBlockByClick,
    handleSaveAutomation,
    handleTestAutomation: handleRunTest,
    handleCancelAutomation,
    handleConfigureBlock,
    handleDeleteBlock,
    handleCreateConnection,
    handleApplyTemplate
  };
};
